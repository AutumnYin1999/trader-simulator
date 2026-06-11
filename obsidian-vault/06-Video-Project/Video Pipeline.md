---
tags: [video, pipeline, tts, remotion, playwright]
---

The narration-driven production pipeline for the Investfair video: manifest, TTS, browser recording, Remotion render.

# Video Pipeline

The video for the [[Investfair Assignment]] is produced with a narration-driven workflow: narration is the timeline, visuals serve the narration ("show what you say, say what you show").

## Pipeline shape

```
narration-manifest.json        (single source of truth: every sentence, scene type, timing)
  -> TTS (edge-tts, optionally ElevenLabs)   -> voiceover mp3s + captions
  -> voice-led Playwright recording          -> screen captures of the live game
  -> Remotion composition                    -> final MP4 (12:00, five clips)
```

1. Manifest first: every narration sentence is written into a JSON manifest with the visual beat it motivates. If a visual cannot name its sentence, it gets cut.
2. TTS: `uvx edge-tts` generates neural voiceover (e.g. `en-US-ChristopherNeural` for the Jordan Bull persona) plus word-level subtitles; rate/pitch tunable per segment.
3. Voice-led recording: a Playwright script drives the deployed game (see [[Deployment]]) while audio timing leads, so demo pacing matches narration instead of the other way round. Scenes walk the actual [[Game Flow]]: title screen, calculator, knock-out moment, Day 4 scorecard.
4. Remotion: a React-based composition assembles animation intros/outros, the recorded segments, captions, zoom punches on key numbers (186, 934, 1184, see [[Theoretical Price Anchors]]), and the host cutout overlay.
5. ffmpeg handles conversions (webm to mp4, audio extraction) where needed.

## Reference skills

The reusable skill folders live in the repo at `References from another project/Video Sample/skills/`:

- `narration-driven-video/`, the orchestrator skill: manifest schema, scaffold script, `generate-voiceover.py`, `record-demo.template.ts`, segment model, voice-led recording references
- `edge-tts/`, TTS via `uvx edge-tts` with voices, rate, pitch, subtitles
- `playwright-recording/`, browser capture patterns
- `remotion-best-practices/`, composition guidance
- `text-to-speech/` and `ffmpeg/`, supporting utilities

`Video Sample/` also contains a finished `Pitch_Video.mp4` and `Presentation_Deck.pptx` from another project as quality references.

## Why this fits the rubric

The pipeline makes the booth itself ([[Project Overview]]) the star: real recorded gameplay proves the innovation claim, and the manifest discipline keeps all 12 minutes on-script. Clip content lives in [[Script]].
