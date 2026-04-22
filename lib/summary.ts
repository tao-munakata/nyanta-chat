import { QUESTIONS } from "@/lib/questions";

export type ImportantPoint = {
  id: string;
  label: string;
  question: string;
  answer: string;
  tone: "urgent" | "caution" | "info";
};

type AnswerMap = Record<string, string | undefined>;

const isAnswered = (answer?: string): answer is string =>
  Boolean(answer && answer.trim() && !answer.startsWith("data:image"));

const getQuestionText = (id: string): string =>
  QUESTIONS.find((question) => question.id === id)?.text ?? "";

const addPoint = (
  points: ImportantPoint[],
  answerMap: AnswerMap,
  id: string,
  label: string,
  tone: ImportantPoint["tone"] = "info"
) => {
  const answer = answerMap[id];
  if (!isAnswered(answer)) return;

  points.push({
    id,
    label,
    question: getQuestionText(id),
    answer,
    tone,
  });
};

const includesAny = (answer: string | undefined, words: string[]): boolean =>
  Boolean(answer && words.some((word) => answer.includes(word)));

export function buildImportantPoints(answerMap: AnswerMap): ImportantPoint[] {
  const points: ImportantPoint[] = [];

  if (
    includesAny(answerMap["symptoms-pain"], [
      "少し痛い",
      "かなり痛い",
      "我慢できないほど痛い",
    ])
  ) {
    addPoint(points, answerMap, "symptoms-pain", "痛み", "urgent");
  }

  if (
    includesAny(answerMap["symptoms-main"], [
      "痛",
      "苦し",
      "食べられない",
      "眠れない",
      "むく",
      "不安",
      "心配",
    ])
  ) {
    addPoint(points, answerMap, "symptoms-main", "主な症状", "urgent");
  }

  addPoint(points, answerMap, "symptoms-other", "その他の症状", "caution");

  if (answerMap["history-disease"]) {
    addPoint(points, answerMap, "history-disease", "病歴・手術歴", "caution");
  }

  if (answerMap["history-admit"] === "ある") {
    addPoint(points, answerMap, "history-admit", "1年以内の入院", "caution");
  }

  if (answerMap["med-names"]) {
    addPoint(points, answerMap, "med-names", "服薬情報", "caution");
  }

  if (answerMap["med-allergy"] && answerMap["med-allergy"] !== "ない") {
    addPoint(points, answerMap, "med-allergy", "アレルギー・副作用", "urgent");
  }

  const careQuestionIds = ["adl-meal", "adl-toilet", "adl-walk"];
  careQuestionIds.forEach((id) => {
    if (
      includesAny(answerMap[id], [
        "一部",
        "全介助",
        "オムツ",
        "車椅子",
        "寝たきり",
        "杖",
        "歩行器",
      ])
    ) {
      addPoint(points, answerMap, id, "生活動作・介助", "caution");
    }
  });

  if (answerMap["home-parking"] !== "ある") {
    addPoint(points, answerMap, "home-parking", "駐車場所", "info");
  }

  if (answerMap["home-access"] !== "ない・フラット") {
    addPoint(points, answerMap, "home-access", "住環境・段差", "info");
  }

  addPoint(points, answerMap, "wishes-hope", "本人・家族の希望", "info");
  addPoint(points, answerMap, "wishes-visit", "訪問希望時期", "info");

  return points;
}
