import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { theme } from "./theme";

export type Word = { text: string; start: number; end: number };
export type Sentence = { text: string; start: number; end: number; words?: Word[] };

const MAX_WORDS_PER_CHUNK = 14;
const RANK = { ".": 5, ";": 4, ",": 3, " and ": 2, " but ": 2, " or ": 2 } as const;

type Chunk = { text: string; start: number; end: number; words?: Word[] };

export function buildChunks(sentence: Sentence): Chunk[] {
  const tokens = sentence.text.split(/\s+/);
  if (tokens.length <= MAX_WORDS_PER_CHUNK) return [sentence];

  if (sentence.words && sentence.words.length === tokens.length) {
    const splitWordIdx = bestWordSplit(sentence.words);
    const head = sentence.words.slice(0, splitWordIdx);
    const tail = sentence.words.slice(splitWordIdx);
    return [
      { text: head.map((w) => w.text).join(" "), start: head[0].start, end: head[head.length - 1].end, words: head },
      { text: tail.map((w) => w.text).join(" "), start: tail[0].start, end: tail[tail.length - 1].end, words: tail },
    ].flatMap((c) => buildChunks(c as Sentence));
  }

  const splitIdx = splitAtBestPoint(sentence.text);
  const head = sentence.text.slice(0, splitIdx).trim();
  const tail = sentence.text.slice(splitIdx).trim();
  const total = sentence.end - sentence.start;
  const ratio = head.length / sentence.text.length;
  const mid = sentence.start + total * ratio;
  return [
    { text: head, start: sentence.start, end: mid },
    { text: tail, start: mid, end: sentence.end },
  ];
}

function bestWordSplit(words: Word[]): number {
  const lo = Math.floor(words.length * 0.3);
  const hi = Math.ceil(words.length * 0.7);
  let best = Math.floor(words.length / 2);
  let bestScore = -1;
  for (let i = lo; i <= hi; i++) {
    const prev = words[i - 1]?.text ?? "";
    const last = prev[prev.length - 1];
    let score = 0;
    if (last === ".") score = 5;
    else if (last === ";") score = 4;
    else if (last === ",") score = 3;
    else if (/^(and|but|or)$/i.test(prev)) score = 2;
    if (score > bestScore) {
      best = i;
      bestScore = score;
    }
  }
  return best;
}

export function splitAtBestPoint(text: string): number {
  let best = Math.floor(text.length / 2);
  let bestScore = -1;
  for (const [tok, score] of Object.entries(RANK)) {
    const idx = text.indexOf(tok, Math.floor(text.length * 0.3));
    if (idx > -1 && idx < Math.floor(text.length * 0.7) && score > bestScore) {
      best = idx + tok.length;
      bestScore = score;
    }
  }
  return best;
}

export const Subtitles: React.FC<{ sentences: Sentence[] }> = ({ sentences }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const chunks = sentences.flatMap(buildChunks);
  const active = chunks.find((c) => t >= c.start && t <= c.end);
  if (!active) return null;

  return (
    <AbsoluteFill style={{ justifyContent: "flex-end", alignItems: "center", paddingBottom: 80 }}>
      <div
        style={{
          background: "rgba(0,0,0,0.6)",
          color: theme.colors.fg,
          padding: "12px 24px",
          borderRadius: 8,
          font: `28px ${theme.fonts.body}`,
          maxWidth: 1400,
          textAlign: "center",
        }}
      >
        {active.words ? (
          active.words.map((w, i) => {
            const isActive = t >= w.start && t <= w.end;
            const isPast = t > w.end;
            return (
              <span
                key={i}
                style={{
                  fontWeight: isActive ? 700 : 400,
                  opacity: isPast ? 1 : isActive ? 1 : 0.55,
                  marginRight: 8,
                }}
              >
                {w.text}
              </span>
            );
          })
        ) : (
          <span>{active.text}</span>
        )}
      </div>
    </AbsoluteFill>
  );
};
