"""TTS adapter contract + built-in adapters."""
from __future__ import annotations
from dataclasses import dataclass, field
from pathlib import Path
from typing import Protocol, runtime_checkable
import os
import re
import subprocess


@dataclass
class CaptionWord:
    text: str
    start: float
    end: float


@dataclass
class CaptionSentence:
    text: str
    start: float
    end: float
    words: list[CaptionWord] = field(default_factory=list)


@runtime_checkable
class TTSAdapter(Protocol):
    supports_word_captions: bool

    def synthesize(self, text: str, voice_id: str, output_path: Path) -> tuple[Path, list[CaptionSentence]]:
        ...


SENTENCE_SPLIT = re.compile(r"(?<=[.!?])\s+")


class EdgeAdapter:
    supports_word_captions = False

    def __init__(self, voice: str = "en-US-AndrewMultilingualNeural"):
        self.voice = voice

    def synthesize(self, text: str, voice_id: str, output_path: Path) -> tuple[Path, list[CaptionSentence]]:
        voice = voice_id or self.voice
        output_path.parent.mkdir(parents=True, exist_ok=True)
        srt_path = output_path.with_suffix(".srt")
        cmd = ["edge-tts", "--voice", voice, "--text", text,
               "--write-media", str(output_path), "--write-subtitles", str(srt_path)]
        subprocess.run(cmd, check=True)
        captions = self._merge_srt_to_sentences(srt_path.read_text(), text)
        return output_path, captions

    @staticmethod
    def _merge_srt_to_sentences(srt: str, text: str) -> list[CaptionSentence]:
        from pysubs2 import SSAFile
        subs = SSAFile.from_string(srt, format_="srt")
        sentences_text = [s.strip() for s in SENTENCE_SPLIT.split(text.strip()) if s.strip()]
        # Flatten events into a per-word timeline. One SRT event may span several
        # short sentences (edge-tts groups them), so apportion each event's time
        # evenly across its words instead of consuming whole events per sentence.
        timeline: list[tuple[float, float]] = []
        for ev in subs:
            ev_words = ev.plaintext.split()
            if not ev_words:
                continue
            ev_start, ev_end = ev.start / 1000.0, ev.end / 1000.0
            span = (ev_end - ev_start) / len(ev_words)
            timeline.extend(
                (ev_start + i * span, ev_start + (i + 1) * span) for i in range(len(ev_words))
            )
        out: list[CaptionSentence] = []
        cursor = 0
        for s in sentences_text:
            chunk = timeline[cursor:cursor + len(s.split())]
            cursor += len(s.split())
            if chunk:
                start, end = chunk[0][0], chunk[-1][1]
            else:
                start = end = out[-1].end if out else 0.0
            out.append(CaptionSentence(text=s, start=start, end=end))
        return out


class ElevenLabsAdapter:
    supports_word_captions = True

    def __init__(self, api_key: str | None = None, voice: str = "dXtC3XhB9GtPusIpNtQx"):
        self.api_key = api_key or os.environ.get("ELEVENLABS_API_KEY")
        self.voice = voice

    def synthesize(self, text: str, voice_id: str, output_path: Path) -> tuple[Path, list[CaptionSentence]]:
        from elevenlabs.client import ElevenLabs
        client = ElevenLabs(api_key=self.api_key)
        voice = voice_id or self.voice
        output_path.parent.mkdir(parents=True, exist_ok=True)
        result = client.text_to_speech.convert_with_timestamps(
            voice_id=voice, text=text, model_id="eleven_multilingual_v2"
        )
        with open(output_path, "wb") as f:
            for chunk in result.audio_iterator:
                f.write(chunk)
        words = self._aggregate_chars_to_words(result.alignment, text)
        sentences = self._aggregate_words_to_sentences(words, text)
        return output_path, sentences

    @staticmethod
    def _aggregate_chars_to_words(alignment, text: str) -> list[CaptionWord]:
        words: list[CaptionWord] = []
        buf, w_start, w_end = "", None, None
        for ch, start, end in zip(alignment.characters, alignment.character_start_times_seconds,
                                  alignment.character_end_times_seconds):
            if ch.isspace():
                if buf:
                    words.append(CaptionWord(buf, w_start, w_end))
                    buf, w_start, w_end = "", None, None
            else:
                if w_start is None:
                    w_start = start
                w_end = end
                buf += ch
        if buf:
            words.append(CaptionWord(buf, w_start, w_end))
        return words

    @staticmethod
    def _aggregate_words_to_sentences(words: list[CaptionWord], text: str) -> list[CaptionSentence]:
        sentences_text = [s.strip() for s in SENTENCE_SPLIT.split(text.strip()) if s.strip()]
        out: list[CaptionSentence] = []
        idx = 0
        for s in sentences_text:
            n = len(s.split())
            chunk = words[idx:idx + n]
            if not chunk:
                break
            out.append(CaptionSentence(text=s, start=chunk[0].start, end=chunk[-1].end, words=chunk))
            idx += n
        return out


_REGISTRY: dict[str, type] = {"edge": EdgeAdapter, "elevenlabs": ElevenLabsAdapter}


def get_adapter(name: str, **kwargs) -> TTSAdapter:
    if name not in _REGISTRY:
        raise KeyError(f"unknown TTS provider: {name}")
    return _REGISTRY[name](**kwargs)
