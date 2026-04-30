export type EmotionLabel =
  | "pain"
  | "anxiety"
  | "confusion"
  | "relief"
  | "positive"
  | "important"
  | "neutral";

export type EmotionExpression =
  | "welcome"
  | "happy"
  | "surprised"
  | "serious"
  | "thinking"
  | "encouraging"
  | "worried"
  | "relieved";

export type EmotionResult = {
  label: EmotionLabel;
  expression: EmotionExpression;
};

const normalizeText = (text: string): string =>
  text
    .replace(/[Ａ-Ｚａ-ｚ０-９]/g, (char) =>
      String.fromCharCode(char.charCodeAt(0) - 0xfee0)
    )
    .toLowerCase()
    .trim();

const includesAny = (text: string, words: string[]): boolean =>
  words.some((word) => text.includes(word));

export function detectAnswerEmotion(
  questionText: string,
  userAnswer: string
): EmotionResult {
  const answer = normalizeText(userAnswer);
  const question = normalizeText(questionText);
  const combined = `${question} ${answer}`;

  if (!answer) {
    return { label: "neutral", expression: "welcome" };
  }

  if (
    includesAny(answer, [
      "我慢できない",
      "激痛",
      "強い痛",
      "かなり痛",
      "痛い",
      "苦しい",
      "息苦しい",
      "つらい",
      "辛い",
      "しんどい",
      "動けない",
      "食べられない",
      "眠れない",
    ])
  ) {
    return { label: "pain", expression: "serious" };
  }

  if (
    includesAny(answer, [
      "不安",
      "心配",
      "こわい",
      "怖い",
      "緊張",
      "困って",
      "困る",
      "急ぎ",
      "早く",
    ])
  ) {
    return { label: "anxiety", expression: "worried" };
  }

  if (
    includesAny(answer, [
      "わからない",
      "分からない",
      "不明",
      "覚えてない",
      "忘れた",
      "迷って",
      "迷う",
    ])
  ) {
    return { label: "confusion", expression: "thinking" };
  }

  if (
    includesAny(combined, ["手術", "入院", "病気", "アレルギー", "副作用"]) &&
    !includesAny(answer, ["ない", "ありません", "なし"])
  ) {
    return { label: "important", expression: "surprised" };
  }

  if (
    includesAny(answer, [
      "大丈夫",
      "問題ない",
      "痛みはない",
      "ない",
      "ありません",
      "なし",
      "できる",
      "食べられる",
      "歩ける",
    ])
  ) {
    return { label: "relief", expression: "relieved" };
  }

  if (
    includesAny(answer, [
      "ありがとう",
      "助かる",
      "楽しみ",
      "希望",
      "お願いします",
      "よろしく",
    ])
  ) {
    return { label: "positive", expression: "happy" };
  }

  return { label: "neutral", expression: "happy" };
}

export function chooseStrongerExpression(
  aiExpression: EmotionExpression,
  detectedExpression: EmotionExpression
): EmotionExpression {
  const priority: Record<EmotionExpression, number> = {
    welcome: 0,
    happy: 1,
    relieved: 1,
    encouraging: 2,
    thinking: 2,
    worried: 3,
    surprised: 3,
    serious: 4,
  };

  return priority[detectedExpression] > priority[aiExpression]
    ? detectedExpression
    : aiExpression;
}

export function createEmotionAwareReaction(
  detected: EmotionResult,
  aiReaction: string
): string {
  const reactionByEmotion: Record<EmotionLabel, string> = {
    pain:
      "つらいことを教えてくれてありがとうにゃ。大事な情報だから、先生に伝わるようにしっかり記録しておくにゃ♡",
    anxiety:
      "不安な気持ちも教えてくれてありがとうにゃ。にゃんこがやさしく受け止めて、ちゃんと残しておくにゃ♡",
    confusion:
      "わからないところがあっても大丈夫にゃ。今わかる範囲で教えてくれるだけで、とっても助かるにゃ♡",
    relief:
      "痛みがないことや大丈夫なことも、大切な情報にゃ。教えてくれてありがとうにゃん♡",
    positive:
      "前向きな気持ちを教えてくれてありがとうにゃ。先生にも伝わるように、にゃんこが残しておくにゃ♡",
    important:
      "大切な情報を教えてくれてありがとうにゃ。先生が確認しやすいように、しっかり記録しておくにゃ♡",
    neutral: aiReaction || "にゃるほどにゃ〜♡ 教えてくれてありがとうにゃん！",
  };

  if (detected.label === "neutral") {
    return reactionByEmotion.neutral;
  }

  return reactionByEmotion[detected.label];
}
