export type QuestionType = "text" | "select" | "date" | "photo";

export type Question = {
  id: string;
  category: string;
  text: string;
  type: QuestionType;
  options?: string[];
  skippable: boolean;
};

export type Category = {
  id: string;
  label: string;
};

export type QuestionOverrideMap = Record<string, string>;

export const CATEGORIES: Category[] = [
  { id: "basic", label: "基本情報" },
  { id: "symptoms", label: "現在の症状" },
  { id: "history", label: "病歴・治療歴" },
  { id: "medication", label: "お薬・アレルギー" },
  { id: "adl", label: "日常生活" },
  { id: "home", label: "在宅環境" },
  { id: "wishes", label: "その他・希望" },
];

export const QUESTIONS: Question[] = [
  // ── 基本情報 ─────────────────────────────
  {
    id: "basic-name",
    category: "basic",
    text: "まずは自己紹介にゃ♡ お名前（フルネーム）をおしえてにゃ〜！",
    type: "text",
    skippable: false,
  },
  {
    id: "basic-kana",
    category: "basic",
    text: "ふりがなもおしえてにゃん♡（例：やまだたろう）",
    type: "text",
    skippable: false,
  },
  {
    id: "basic-dob",
    category: "basic",
    text: "生年月日をおしえてにゃ〜！",
    type: "date",
    skippable: false,
  },
  {
    id: "basic-gender",
    category: "basic",
    text: "性別を選んでにゃ♡",
    type: "select",
    options: ["男性", "女性", "その他"],
    skippable: false,
  },
  {
    id: "basic-phone",
    category: "basic",
    text: "連絡先の電話番号をおしえてにゃ〜（ハイフンなしでもOKにゃ）",
    type: "text",
    skippable: false,
  },
  // ── 現在の症状 ───────────────────────────
  {
    id: "symptoms-main",
    category: "symptoms",
    text: "今、一番気になるお身体のことは何にゃ？ 例えば「足がむくむ」「ご飯が食べられない」とか、気軽に教えてにゃん♡",
    type: "text",
    skippable: false,
  },
  {
    id: "symptoms-since",
    category: "symptoms",
    text: "それはいつごろから続いてるにゃ？（例：「2週間前から」「半年くらい前から」）",
    type: "text",
    skippable: true,
  },
  {
    id: "symptoms-pain",
    category: "symptoms",
    text: "今、痛みはあるにゃ？ある場合はどのくらい強いにゃ？",
    type: "select",
    options: ["痛みはない", "少し痛い", "かなり痛い", "我慢できないほど痛い"],
    skippable: false,
  },
  {
    id: "symptoms-other",
    category: "symptoms",
    text: "他にも気になる症状があれば教えてにゃ〜（なければスキップOKにゃ）",
    type: "text",
    skippable: true,
  },
  // ── 病歴・治療歴 ─────────────────────────
  {
    id: "history-disease",
    category: "history",
    text: "これまでに大きな病気や手術をしたことはあるにゃ？（例：「心臓の手術」「糖尿病」など）なければスキップOKにゃ♡",
    type: "text",
    skippable: true,
  },
  {
    id: "history-hospital",
    category: "history",
    text: "今、かかりつけの病院や主治医の先生はいるにゃ？",
    type: "select",
    options: ["いる", "いない", "わからない"],
    skippable: false,
  },
  {
    id: "history-hospital-name",
    category: "history",
    text: "かかりつけ病院の名前と主治医の先生のお名前をおしえてにゃ♡ わからない場合はスキップOKにゃ",
    type: "text",
    skippable: true,
  },
  {
    id: "history-admit",
    category: "history",
    text: "最近1年以内に入院したことはあるにゃ？",
    type: "select",
    options: ["ある", "ない"],
    skippable: false,
  },
  // ── お薬・アレルギー ──────────────────────
  {
    id: "med-photo",
    category: "medication",
    text: "今飲んでいるお薬があれば、お薬手帳の写真を見せてにゃ♡ とっても助かるにゃ〜！（なければスキップOKにゃ）",
    type: "photo",
    skippable: true,
  },
  {
    id: "med-names",
    category: "medication",
    text: "お薬の名前が分かれば教えてにゃ〜（自由記入でOKにゃ♡）なければスキップOKにゃ",
    type: "text",
    skippable: true,
  },
  {
    id: "med-allergy",
    category: "medication",
    text: "薬や食べ物でアレルギーや副作用が出たことはあるにゃ？",
    type: "select",
    options: ["ある", "ない", "わからない"],
    skippable: false,
  },
  // ── 日常生活（ADL）────────────────────────
  {
    id: "adl-meal",
    category: "adl",
    text: "ご飯は自分で食べられるにゃ？",
    type: "select",
    options: ["自分で食べられる", "一部手助けが必要", "全介助が必要"],
    skippable: false,
  },
  {
    id: "adl-toilet",
    category: "adl",
    text: "おトイレはどうしてるにゃ？",
    type: "select",
    options: ["自分でできる", "一部介助が必要", "全介助・オムツ使用"],
    skippable: false,
  },
  {
    id: "adl-walk",
    category: "adl",
    text: "歩いたり移動するのはどうにゃ？",
    type: "select",
    options: ["自分で歩ける", "杖・歩行器を使う", "車椅子を使う", "寝たきり"],
    skippable: false,
  },
  {
    id: "adl-family",
    category: "adl",
    text: "一緒に暮らしている家族や、介護してくれる方はいるにゃ？（例：「妻と同居」「一人暮らし」など）",
    type: "text",
    skippable: false,
  },
  // ── 在宅環境 ─────────────────────────────
  {
    id: "home-parking",
    category: "home",
    text: "おうちの近くに車を停められる場所はあるにゃ？ お医者さんが来るとき必要にゃ〜！",
    type: "select",
    options: ["ある", "ない", "わかりません"],
    skippable: false,
  },
  {
    id: "home-access",
    category: "home",
    text: "玄関まで段差や急な坂はあるにゃ？",
    type: "select",
    options: ["ない・フラット", "少しある", "多い・バリアあり"],
    skippable: false,
  },
  {
    id: "home-services",
    category: "home",
    text: "今、訪問看護やヘルパーなどのサービスを使っているにゃ？使っていれば教えてにゃ♡ なければスキップOKにゃ",
    type: "text",
    skippable: true,
  },
  // ── その他・希望 ─────────────────────────
  {
    id: "wishes-hope",
    category: "wishes",
    text: "お医者さんに来てもらうにあたって、特に伝えておきたいことはあるにゃ？ なんでも教えてにゃ〜♡ なければスキップOKにゃ",
    type: "text",
    skippable: true,
  },
  {
    id: "wishes-visit",
    category: "wishes",
    text: "初回の訪問、いつごろが都合いいにゃ？希望があれば教えてにゃ♡（例：「来週の午前中」「急ぎではない」など）",
    type: "text",
    skippable: true,
  },
];

export function getQuestion(id: string): Question | undefined {
  return QUESTIONS.find((q) => q.id === id);
}

export function applyQuestionOverrides(
  questions: Question[],
  overrides: QuestionOverrideMap
): Question[] {
  return questions.map((question) => ({
    ...question,
    text: overrides[question.id]?.trim() || question.text,
  }));
}
