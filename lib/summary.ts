import { QUESTIONS, type Question } from "@/lib/questions";

export type ImportantPoint = {
  id: string;
  label: string;
  question: string;
  answer: string;
  tone: "urgent" | "caution" | "info";
};

export type VisitSummaryCard = {
  headline: string;
  sections: Array<{
    title: string;
    body: string;
  }>;
};

export const IMPORTANT_POINT_GROUPS = [
  {
    tone: "urgent",
    label: "要確認",
    description: "診察前に特に確認したい内容",
  },
  {
    tone: "caution",
    label: "注意",
    description: "診察・支援の参考になる内容",
  },
  {
    tone: "info",
    label: "参考",
    description: "訪問準備や希望に関する内容",
  },
] as const;

type AnswerMap = Record<string, string | undefined>;

const isAnswered = (answer?: string): answer is string =>
  Boolean(answer && answer.trim() && !answer.startsWith("data:image"));

const getQuestionText = (questions: Question[], id: string): string =>
  questions.find((question) => question.id === id)?.text ?? "";

const addPoint = (
  points: ImportantPoint[],
  questions: Question[],
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
    question: getQuestionText(questions, id),
    answer,
    tone,
  });
};

const includesAny = (answer: string | undefined, words: string[]): boolean =>
  Boolean(answer && words.some((word) => answer.includes(word)));

export function buildImportantPoints(
  answerMap: AnswerMap,
  questions: Question[] = QUESTIONS
): ImportantPoint[] {
  const points: ImportantPoint[] = [];

  if (
    includesAny(answerMap["symptoms-pain"], [
      "少し痛い",
      "かなり痛い",
      "我慢できないほど痛い",
    ])
  ) {
    addPoint(points, questions, answerMap, "symptoms-pain", "痛み", "urgent");
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
    addPoint(points, questions, answerMap, "symptoms-main", "主な症状", "urgent");
  }

  addPoint(points, questions, answerMap, "symptoms-other", "その他の症状", "caution");

  if (answerMap["history-disease"]) {
    addPoint(points, questions, answerMap, "history-disease", "病歴・手術歴", "caution");
  }

  if (answerMap["history-admit"] === "ある") {
    addPoint(points, questions, answerMap, "history-admit", "1年以内の入院", "caution");
  }

  if (answerMap["med-names"]) {
    addPoint(points, questions, answerMap, "med-names", "服薬情報", "caution");
  }

  if (answerMap["med-allergy"] && answerMap["med-allergy"] !== "ない") {
    addPoint(points, questions, answerMap, "med-allergy", "アレルギー・副作用", "urgent");
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
      addPoint(points, questions, answerMap, id, "生活動作・介助", "caution");
    }
  });

  if (answerMap["home-parking"] !== "ある") {
    addPoint(points, questions, answerMap, "home-parking", "駐車場所", "info");
  }

  if (answerMap["home-access"] !== "ない・フラット") {
    addPoint(points, questions, answerMap, "home-access", "住環境・段差", "info");
  }

  addPoint(points, questions, answerMap, "wishes-hope", "本人・家族の希望", "info");
  addPoint(points, questions, answerMap, "wishes-visit", "訪問希望時期", "info");

  return points;
}

const pickAnswered = (answerMap: AnswerMap, ids: string[]): string | undefined =>
  ids.map((id) => answerMap[id]?.trim()).find(Boolean);

export function buildVisitSummaryCard(
  answerMap: AnswerMap,
  importantPoints: ImportantPoint[]
): VisitSummaryCard {
  const mainConcern =
    pickAnswered(answerMap, ["symptoms-main", "symptoms-other"]) ??
    "体調確認と訪問前相談";
  const wish =
    pickAnswered(answerMap, ["wishes-hope", "wishes-visit"]) ??
    "詳細は訪問時に確認";
  const lifestyle =
    [
      answerMap["adl-walk"],
      answerMap["adl-meal"],
      answerMap["adl-toilet"],
      answerMap["adl-family"],
    ]
      .filter(Boolean)
      .join(" / ") || "生活状況は訪問時に確認";
  const cautions = importantPoints
    .filter((point) => point.tone !== "info")
    .slice(0, 3)
    .map((point) => `${point.label}: ${point.answer}`)
    .join(" / ");

  return {
    headline: `${mainConcern}。にゃん太が訪問前に気になった点をまとめたにゃ。`,
    sections: [
      {
        title: "主な相談",
        body: mainConcern,
      },
      {
        title: "要確認",
        body: cautions || "大きな注意点は今のところ目立っていないにゃ。",
      },
      {
        title: "生活状況",
        body: lifestyle,
      },
      {
        title: "希望",
        body: wish,
      },
    ],
  };
}
