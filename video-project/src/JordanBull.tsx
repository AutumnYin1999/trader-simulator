import { useCurrentFrame, useVideoConfig } from "remotion";
import { theme } from "./theme";
import type { Sentence } from "./Subtitles";

// Jordan Bull: an ORIGINAL cartoon broker character (no real-person likeness).
// Dark slicked-back hair, navy pinstripe suit, red suspenders, bold striped tie,
// confident grin. Animated with useCurrentFrame only (deterministic):
//   - idle bob: 2s sine
//   - blink: every ~3s
//   - talk cycle: mouth opens/closes at ~8Hz while narration is playing
//     (first sentence start to last sentence end, from the captions).

type Mode = "pip" | "feature";

const SKIN = "#e8b88a";
const SKIN_SHADE = "#c99767";
const HAIR = "#1a1208";
const HAIR_SHINE = "#4a3a22";
const SUIT = "#1b2a4a";
const SUIT_DARK = "#142038";
const PIN = "#33486f";
const SHIRT = "#f7f9fc";
const TIE = "#b8252f";
const TIE_STRIPE = "#e3b341";
const SUSPENDER = "#8f1d27";
const BROW = "#241a10";

const Figure: React.FC<{ t: number; talking: boolean; seed: number; idSuffix: string }> = ({
  t,
  talking,
  seed,
  idSuffix,
}) => {
  // talk cycle ~8Hz with a slower 1.7Hz envelope so it reads as speech
  const envelope = 0.6 + 0.4 * Math.sin(2 * Math.PI * 1.7 * t + seed * 2);
  const cycle = 0.5 + 0.5 * Math.sin(2 * Math.PI * 8 * t + seed);
  const openAmt = talking ? Math.max(0.08, envelope * (0.2 + 0.8 * cycle)) : 0;

  // blink every ~3.1s, 0.14s closure
  const bphase = (t + seed * 0.37) % 3.1;
  const blinkF = bphase < 0.14 ? Math.max(0.06, 1 - Math.sin((Math.PI * bphase) / 0.14)) : 1;

  const eyeRy = 10 * blinkF;
  const pupilVisible = blinkF > 0.3;
  const mouthRy = 3 + 21 * openAmt;
  const pat = `pin-${idSuffix}`;
  const clip = `mouth-${idSuffix}`;

  return (
    <g>
      <defs>
        <pattern id={pat} patternUnits="userSpaceOnUse" width="16" height="16">
          <rect width="16" height="16" fill={SUIT} />
          <line x1="8" y1="0" x2="8" y2="16" stroke={PIN} strokeWidth="1.6" />
        </pattern>
        <clipPath id={clip}>
          <ellipse cx="202" cy="313" rx="30" ry={mouthRy} />
        </clipPath>
      </defs>

      {/* ===== body ===== */}
      {/* suit shoulders, pinstriped */}
      <path
        d="M 56 540 L 56 472 Q 66 392 150 370 L 202 386 L 254 370 Q 338 392 348 472 L 348 540 Z"
        fill={`url(#${pat})`}
        stroke={SUIT_DARK}
        strokeWidth="4"
      />
      {/* shirt V */}
      <path d="M 164 364 L 202 472 L 240 364 Q 222 380 202 382 Q 182 380 164 364 Z" fill={SHIRT} />
      {/* suspenders over the shirt, hugging the tie */}
      <path d="M 178 366 L 190 370 L 196 452 L 186 454 Z" fill={SUSPENDER} />
      <path d="M 226 366 L 214 370 L 208 452 L 218 454 Z" fill={SUSPENDER} />
      <rect x="185" y="446" width="12" height="9" rx="2" fill={TIE_STRIPE} />
      <rect x="207" y="446" width="12" height="9" rx="2" fill={TIE_STRIPE} />
      {/* collar */}
      <path d="M 178 356 L 202 368 L 188 384 Z" fill={SHIRT} stroke="#d8dee9" strokeWidth="2" />
      <path d="M 226 356 L 202 368 L 216 384 Z" fill={SHIRT} stroke="#d8dee9" strokeWidth="2" />
      {/* bold tie: knot + blade with gold stripes */}
      <path d="M 190 368 L 202 360 L 214 368 L 202 384 Z" fill={TIE} />
      <path d="M 192 382 L 202 486 L 212 382 Z" fill={TIE} />
      <g stroke={TIE_STRIPE} strokeWidth="5">
        <line x1="193" y1="402" x2="211" y2="394" />
        <line x1="195" y1="428" x2="209" y2="420" />
        <line x1="198" y1="454" x2="207" y2="447" />
      </g>
      {/* lapels */}
      <path d="M 150 370 L 180 360 L 204 372 L 170 442 L 150 370 Z" fill={SUIT_DARK} />
      <path d="M 254 370 L 224 360 L 200 372 L 234 442 L 254 370 Z" fill={SUIT_DARK} />
      {/* pocket square */}
      <path d="M 116 452 L 144 446 L 138 470 Z" fill={TIE_STRIPE} />

      {/* ===== head ===== */}
      {/* neck */}
      <rect x="182" y="318" width="40" height="52" rx="10" fill={SKIN_SHADE} />
      {/* slicked-back hair dome behind the face */}
      <ellipse cx="202" cy="178" rx="88" ry="62" fill={HAIR} />
      {/* ears */}
      <ellipse cx="123" cy="252" rx="12" ry="18" fill={SKIN} />
      <ellipse cx="281" cy="252" rx="12" ry="18" fill={SKIN} />
      {/* face */}
      <path
        d="M 124 240 Q 124 152 202 150 Q 280 152 280 240 Q 280 304 244 326 Q 222 338 202 338 Q 182 338 160 326 Q 124 304 124 240 Z"
        fill={SKIN}
      />
      {/* slick comb-back shine streaks */}
      <path d="M 140 152 Q 200 122 264 152" stroke={HAIR_SHINE} strokeWidth="6" fill="none" strokeLinecap="round" opacity="0.8" />
      <path d="M 152 138 Q 202 114 252 138" stroke={HAIR_SHINE} strokeWidth="4" fill="none" strokeLinecap="round" opacity="0.55" />
      {/* sideburns */}
      <path d="M 126 226 Q 122 250 130 264 L 138 258 L 134 226 Z" fill={HAIR} />
      <path d="M 278 226 Q 282 250 274 264 L 266 258 L 270 226 Z" fill={HAIR} />
      {/* eyebrows: bold, right one cocked */}
      <path d="M 148 210 Q 168 200 190 208" stroke={BROW} strokeWidth="8" fill="none" strokeLinecap="round" />
      <path d="M 214 206 Q 236 194 256 204" stroke={BROW} strokeWidth="8" fill="none" strokeLinecap="round" />
      {/* eyes */}
      <ellipse cx="170" cy="230" rx="14" ry={eyeRy} fill="#ffffff" />
      <ellipse cx="234" cy="230" rx="14" ry={eyeRy} fill="#ffffff" />
      {pupilVisible && (
        <g>
          <circle cx="173" cy="231" r="5.5" fill="#2b1d12" />
          <circle cx="237" cy="231" r="5.5" fill="#2b1d12" />
          <circle cx="175" cy="229" r="1.8" fill="#ffffff" />
          <circle cx="239" cy="229" r="1.8" fill="#ffffff" />
        </g>
      )}
      {!pupilVisible && (
        <g stroke={SKIN_SHADE} strokeWidth="3.5" strokeLinecap="round">
          <line x1="157" y1="230" x2="183" y2="230" />
          <line x1="221" y1="230" x2="247" y2="230" />
        </g>
      )}
      {/* nose */}
      <path d="M 202 234 Q 209 254 201 264 Q 196 268 192 263" stroke={SKIN_SHADE} strokeWidth="5" fill="none" strokeLinecap="round" />
      {/* mouth: open talk ellipse with teeth, or confident grin */}
      {openAmt > 0.1 ? (
        <g>
          <ellipse cx="202" cy="313" rx="30" ry={mouthRy} fill="#5a2330" />
          <rect x="172" y={313 - mouthRy} width="60" height={Math.max(5, mouthRy * 0.55)} fill="#ffffff" clipPath={`url(#${clip})`} />
        </g>
      ) : (
        <g>
          <path d="M 162 308 Q 202 336 246 302" stroke="#7a3b2e" strokeWidth="7" fill="none" strokeLinecap="round" />
          <path d="M 238 300 Q 246 304 246 312" stroke="#7a3b2e" strokeWidth="5" fill="none" strokeLinecap="round" />
        </g>
      )}
      {/* chin dimple */}
      <path d="M 194 330 Q 202 334 210 330" stroke={SKIN_SHADE} strokeWidth="3" fill="none" strokeLinecap="round" opacity="0.7" />
    </g>
  );
};

export const JordanBull: React.FC<{
  mode: Mode;
  sentences: Sentence[];
  seed?: number;
}> = ({ mode, sentences, seed = 0 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;

  const talkStart = sentences.length ? sentences[0].start : 0;
  const talkEnd = sentences.length ? sentences[sentences.length - 1].end : 0;
  const talking = t >= talkStart && t <= talkEnd;

  if (mode === "pip") {
    const bob = 4 * Math.sin((2 * Math.PI * t) / 2);
    return (
      <div
        style={{
          position: "absolute",
          right: 44,
          bottom: 180,
          width: 300,
          height: 300,
          borderRadius: "50%",
          overflow: "hidden",
          border: `6px solid ${theme.colors.accent}`,
          boxShadow: "0 12px 36px rgba(0,0,0,0.55), 0 0 0 3px rgba(11,15,26,0.85)",
          background: "radial-gradient(circle at 50% 30%, #1d2c4d 0%, #0b0f1a 78%)",
        }}
      >
        <svg
          viewBox="72 86 260 260"
          width={300}
          height={300}
          style={{ transform: `translateY(${bob}px)` }}
        >
          <Figure t={t} talking={talking} seed={seed} idSuffix={`pip-${seed}`} />
        </svg>
      </div>
    );
  }

  // feature: left half-frame, larger
  const bob = 8 * Math.sin((2 * Math.PI * t) / 2);
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        top: 0,
        width: "50%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div style={{ position: "relative" }}>
        <div
          style={{
            position: "absolute",
            left: "50%",
            bottom: -26,
            transform: "translateX(-50%)",
            width: 460,
            height: 56,
            borderRadius: "50%",
            background: "rgba(0,0,0,0.45)",
            filter: "blur(14px)",
          }}
        />
        <svg
          viewBox="0 60 400 480"
          width={640}
          height={768}
          style={{ transform: `translateY(${bob}px)` }}
        >
          <Figure t={t} talking={talking} seed={seed} idSuffix={`feat-${seed}`} />
        </svg>
      </div>
    </div>
  );
};
