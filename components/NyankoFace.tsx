"use client";

export type Expression =
  | "welcome"
  | "happy"
  | "surprised"
  | "serious"
  | "thinking"
  | "encouraging"
  | "worried"
  | "relieved";

export type CharacterVersion =
  | "doctor"
  | "pink"
  | "gray"
  | "calico"
  | "tabby"
  | "brown"
  | "cream";

type Props = {
  expression: Expression;
  size?: number;
  version?: CharacterVersion;
  animate?: boolean;
  speaking?: boolean;
};

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
  worried: {
    leftEye: "M 28,40 Q 32,36 36,40",
    rightEye: "M 52,40 Q 56,36 60,40",
    mouth: "M 36,56 Q 44,50 52,56",
    eyebrows: "M 28,31 L 36,34 M 52,34 L 60,31",
  },
  relieved: {
    leftEye: "M 28,38 Q 32,42 36,38",
    rightEye: "M 52,38 Q 56,42 60,38",
    mouth: "M 34,52 Q 44,59 54,52",
  },
};

const VERSIONS: Record<
  CharacterVersion,
  {
    fur: string;
    stroke: string;
    innerEar: string;
    coat: string;
    accent: string;
    accessory?: "badge" | "bow" | "glasses" | "spots" | "stripes" | "house" | "star";
  }
> = {
  doctor: {
    fur: "#ffffff",
    stroke: "#e8d5c4",
    innerEar: "#ffb7c5",
    coat: "#e8f4f8",
    accent: "#5fb3d9",
    accessory: "badge",
  },
  pink: {
    fur: "#fff3f8",
    stroke: "#f4a9c4",
    innerEar: "#ff9ebc",
    coat: "#ffe4f0",
    accent: "#f472b6",
    accessory: "bow",
  },
  gray: {
    fur: "#f3f4f6",
    stroke: "#c7cdd4",
    innerEar: "#f7c8d8",
    coat: "#edf2f7",
    accent: "#64748b",
    accessory: "glasses",
  },
  calico: {
    fur: "#fffaf0",
    stroke: "#e6c8a8",
    innerEar: "#ffc4d0",
    coat: "#fff1d6",
    accent: "#f59e0b",
    accessory: "spots",
  },
  tabby: {
    fur: "#ffe8c2",
    stroke: "#d19a54",
    innerEar: "#ffc3b8",
    coat: "#e6f7ef",
    accent: "#16a34a",
    accessory: "stripes",
  },
  brown: {
    fur: "#f6dfc8",
    stroke: "#b7835d",
    innerEar: "#f8b8ad",
    coat: "#e9f5ff",
    accent: "#0ea5e9",
    accessory: "house",
  },
  cream: {
    fur: "#fff7d6",
    stroke: "#e4c96f",
    innerEar: "#ffc6d0",
    coat: "#fff5f5",
    accent: "#facc15",
    accessory: "star",
  },
};

export default function NyankoFace({
  expression,
  size = 80,
  version = "doctor",
  animate = true,
  speaking = false,
}: Props) {
  const face = FACES[expression];
  const style = VERSIONS[version];
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
      aria-label={`にゃんこ先生 ${expression}`}
      className={animate ? "nyanko-face" : undefined}
    >
      {/* 白衣の体 */}
      <rect x="22" y="68" width="44" height="16" rx="8" fill="white" stroke="#ddd" strokeWidth="1.5" />
      <rect x="30" y="70" width="28" height="14" rx="4" fill={style.coat} />
      {/* 聴診器 */}
      <path d="M 38,72 Q 44,80 50,72" stroke={style.accent} strokeWidth="1.5" fill="none" />
      <circle cx="44" cy="80" r="2" fill={style.accent} />
      {/* 顔（白丸） */}
      <ellipse cx="44" cy="44" rx="28" ry="26" fill={style.fur} stroke={style.stroke} strokeWidth="1.5" />
      {/* 耳 */}
      <polygon points="16,26 22,14 30,24" fill={style.fur} stroke={style.stroke} strokeWidth="1.5" />
      <polygon points="18,25 22,17 28,23" fill={style.innerEar} />
      <polygon points="58,24 66,14 72,26" fill={style.fur} stroke={style.stroke} strokeWidth="1.5" />
      <polygon points="60,23 66,17 70,25" fill={style.innerEar} />
      {style.accessory === "badge" && (
        <circle cx="56" cy="74" r="3" fill={style.accent} />
      )}
      {style.accessory === "bow" && (
        <>
          <polygon points="34,19 44,24 34,29" fill={style.accent} />
          <polygon points="54,19 44,24 54,29" fill={style.accent} />
          <circle cx="44" cy="24" r="2.5" fill="#fdf2f8" />
        </>
      )}
      {style.accessory === "glasses" && (
        <>
          <circle cx="34" cy="40" r="8" fill="none" stroke={style.accent} strokeWidth="1.8" />
          <circle cx="54" cy="40" r="8" fill="none" stroke={style.accent} strokeWidth="1.8" />
          <line x1="42" y1="40" x2="46" y2="40" stroke={style.accent} strokeWidth="1.8" />
        </>
      )}
      {style.accessory === "spots" && (
        <>
          <path d="M 26,29 Q 35,21 42,30 Q 34,35 26,29" fill="#d97706" opacity="0.75" />
          <path d="M 54,24 Q 64,26 62,36 Q 53,34 54,24" fill="#334155" opacity="0.7" />
        </>
      )}
      {style.accessory === "stripes" && (
        <>
          <path d="M 38,22 L 41,32" stroke="#b45309" strokeWidth="2" strokeLinecap="round" />
          <path d="M 44,21 L 44,32" stroke="#b45309" strokeWidth="2" strokeLinecap="round" />
          <path d="M 50,22 L 47,32" stroke="#b45309" strokeWidth="2" strokeLinecap="round" />
        </>
      )}
      {style.accessory === "house" && (
        <>
          <path d="M 33,25 L 44,16 L 55,25" fill="none" stroke={style.accent} strokeWidth="2" strokeLinecap="round" />
          <rect x="37" y="25" width="14" height="9" rx="2" fill={style.accent} opacity="0.22" />
        </>
      )}
      {style.accessory === "star" && (
        <path
          d="M 44,14 L 47,21 L 54,21 L 48,25 L 51,32 L 44,28 L 37,32 L 40,25 L 34,21 L 41,21 Z"
          fill={style.accent}
          opacity="0.85"
        />
      )}
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
      <path
        className={animate ? "nyanko-eye nyanko-eye-left" : undefined}
        d={face.leftEye}
        {...strokeProps}
      />
      <path
        className={animate ? "nyanko-eye nyanko-eye-right" : undefined}
        d={face.rightEye}
        {...strokeProps}
      />
      <path
        className={speaking ? "nyanko-mouth nyanko-mouth-speaking" : "nyanko-mouth"}
        d={face.mouth}
        {...strokeProps}
      />
      {/* thinking: 考え中の点点点 */}
      {expression === "thinking" && (
        <>
          <circle cx="36" cy="64" r="2" fill="#aaa" />
          <circle cx="44" cy="66" r="2" fill="#aaa" />
          <circle cx="52" cy="64" r="2" fill="#aaa" />
        </>
      )}
      {expression === "worried" && (
        <path d="M 62,58 Q 68,64 62,70 Q 56,64 62,58" fill="#93c5fd" opacity="0.9" />
      )}
    </svg>
  );
}
