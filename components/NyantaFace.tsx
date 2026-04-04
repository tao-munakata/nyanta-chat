"use client";

export type Expression =
  | "welcome"
  | "happy"
  | "surprised"
  | "serious"
  | "thinking"
  | "encouraging";

type Props = { expression: Expression; size?: number };

// 各表情の目・口パーツ定義
const FACES: Record<
  Expression,
  { leftEye: string; rightEye: string; mouth: string; eyebrows?: string }
> = {
  welcome: {
    leftEye: "M 28,38 Q 32,34 36,38",
    rightEye: "M 52,38 Q 56,34 60,38",
    mouth: "M 36,52 Q 44,58 52,52",
  },
  happy: {
    leftEye: "M 28,36 Q 32,30 36,36",
    rightEye: "M 52,36 Q 56,30 60,36",
    mouth: "M 32,50 Q 44,62 56,50",
  },
  surprised: {
    leftEye: "M 30,40 A 6,6 0 1,0 42,40 A 6,6 0 1,0 30,40",
    rightEye: "M 46,40 A 6,6 0 1,0 58,40 A 6,6 0 1,0 46,40",
    mouth: "M 40,54 A 4,4 0 1,0 48,54 A 4,4 0 1,0 40,54",
  },
  serious: {
    leftEye: "M 28,40 Q 32,37 36,40",
    rightEye: "M 52,40 Q 56,37 60,40",
    mouth: "M 36,54 L 52,54",
    eyebrows: "M 28,33 L 36,31 M 52,31 L 60,33",
  },
  thinking: {
    leftEye: "M 28,40 Q 32,37 36,40",
    rightEye: "M 52,37 Q 56,34 60,37",
    mouth: "M 38,54 Q 44,56 50,54",
  },
  encouraging: {
    leftEye: "M 27,36 Q 32,28 37,36",
    rightEye: "M 51,36 Q 56,28 61,36",
    mouth: "M 32,50 Q 44,64 56,50",
  },
};

export default function NyantaFace({ expression, size = 80 }: Props) {
  const face = FACES[expression];
  const strokeProps = {
    stroke: "#4a3728",
    strokeWidth: 2.5,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    fill: "none",
  };

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 88 88"
      xmlns="http://www.w3.org/2000/svg"
      aria-label={`にゃん太先生 ${expression}`}
    >
      {/* 白衣の体 */}
      <rect x="22" y="68" width="44" height="16" rx="8" fill="white" stroke="#ddd" strokeWidth="1.5" />
      <rect x="30" y="70" width="28" height="14" rx="4" fill="#e8f4f8" />
      {/* 聴診器 */}
      <path d="M 38,72 Q 44,80 50,72" stroke="#666" strokeWidth="1.5" fill="none" />
      <circle cx="44" cy="80" r="2" fill="#666" />
      {/* 顔（白丸） */}
      <ellipse cx="44" cy="44" rx="28" ry="26" fill="white" stroke="#e8d5c4" strokeWidth="1.5" />
      {/* 耳 */}
      <polygon points="16,26 22,14 30,24" fill="white" stroke="#e8d5c4" strokeWidth="1.5" />
      <polygon points="18,25 22,17 28,23" fill="#ffb7c5" />
      <polygon points="58,24 66,14 72,26" fill="white" stroke="#e8d5c4" strokeWidth="1.5" />
      <polygon points="60,23 66,17 70,25" fill="#ffb7c5" />
      {/* ひげ */}
      <line x1="12" y1="46" x2="30" y2="48" stroke="#ccc" strokeWidth="1" />
      <line x1="12" y1="50" x2="30" y2="50" stroke="#ccc" strokeWidth="1" />
      <line x1="58" y1="48" x2="76" y2="46" stroke="#ccc" strokeWidth="1" />
      <line x1="58" y1="50" x2="76" y2="50" stroke="#ccc" strokeWidth="1" />
      {/* 鼻 */}
      <ellipse cx="44" cy="48" rx="3" ry="2" fill="#ffb7c5" />
      {/* 表情パーツ */}
      {face.eyebrows && (
        <path d={face.eyebrows} {...strokeProps} strokeWidth={2} />
      )}
      <path d={face.leftEye} {...strokeProps} />
      <path d={face.rightEye} {...strokeProps} />
      <path d={face.mouth} {...strokeProps} />
      {/* thinking: 考え中の点点点 */}
      {expression === "thinking" && (
        <>
          <circle cx="36" cy="64" r="2" fill="#aaa" />
          <circle cx="44" cy="66" r="2" fill="#aaa" />
          <circle cx="52" cy="64" r="2" fill="#aaa" />
        </>
      )}
    </svg>
  );
}
