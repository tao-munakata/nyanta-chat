import type { CharacterVersion, Expression } from "@/components/NyankoFace";

export type ServiceId = "medical" | "smalltalk" | "mood" | "secret";

export type ServiceConfig = {
  id: ServiceId;
  slug: string;
  name: string;
  shortName: string;
  description: string;
  entryLabel: string;
  themeLabel: string;
  accent: string;
  bgClass: string;
  buttonClass: string;
  borderClass: string;
  textClass: string;
  character: CharacterVersion;
  expression: Expression;
  welcomeMessage: string;
  placeholder: string;
  disclaimer: string;
  quickReplies: string[];
  systemPrompt: string;
  fallbackReaction: string;
};

export const SERVICES: Record<ServiceId, ServiceConfig> = {
  medical: {
    id: "medical",
    slug: "/medical",
    name: "nyanko-medical",
    shortName: "問診票",
    description: "訪問診療前に、先生へ伝えたいことを猫と一緒に整理します。",
    entryLabel: "問診を始める",
    themeLabel: "Medical",
    accent: "pink",
    bgClass: "bg-pink-50",
    buttonClass: "bg-pink-500 hover:bg-pink-600",
    borderClass: "border-pink-200",
    textClass: "text-pink-600",
    character: "doctor",
    expression: "welcome",
    welcomeMessage: "こんにゃちはにゃん。訪問前の問診を一緒に進めるにゃ。",
    placeholder: "問診内容を入力するにゃ...",
    disclaimer: "これは問診のお手伝いです。診断や治療判断は医師に相談してください。",
    quickReplies: [],
    systemPrompt: "",
    fallbackReaction: "なるほどにゃ。大切な情報として残しておくにゃん。",
  },
  smalltalk: {
    id: "smalltalk",
    slug: "/smalltalk",
    name: "nyanko-smalltalk",
    shortName: "雑談",
    description: "かわいい猫の顔を見ながら、何気ない話をゆるく楽しめます。",
    entryLabel: "雑談する",
    themeLabel: "Smalltalk",
    accent: "sky",
    bgClass: "bg-sky-50",
    buttonClass: "bg-sky-500 hover:bg-sky-600",
    borderClass: "border-sky-200",
    textClass: "text-sky-700",
    character: "tabby",
    expression: "happy",
    welcomeMessage:
      "やっほーにゃ。今日はどんなことを話すにゃ？たわいもない話でも、にゃんこはうれしいにゃん。",
    placeholder: "今日あったこと、好きなこと、なんでもどうぞ",
    disclaimer: "雑談用の猫チャットです。重要な判断が必要な内容は専門家に相談してください。",
    quickReplies: ["今日ちょっと疲れた", "最近うれしかったことを聞いて", "眠る前に少し話したい"],
    systemPrompt: `あなたは「にゃんこ」です。かわいい猫の顔で寄り添う雑談相手です。

ルール：
- 1〜3文で短く、自然でやさしく返す
- 猫語は少しだけ使う。「にゃ」「にゃん」を使いすぎない
- 相手の日常を否定せず、軽い質問を1つまで添える
- 医療、法律、金融など重大な判断は専門家に相談するよう柔らかく促す
- 回答はJSONのみ：{"reaction":"返答文","expression":"表情コード"}`,
    fallbackReaction: "うんうん、そういう日もあるにゃ。少し話していくにゃん。",
  },
  mood: {
    id: "mood",
    slug: "/mood",
    name: "nyanko-mood",
    shortName: "気持ち整理",
    description: "落ち込みや不安を責めずに受け止め、少し前向きな視点へ導きます。",
    entryLabel: "気持ちを整理する",
    themeLabel: "Mood Care",
    accent: "emerald",
    bgClass: "bg-emerald-50",
    buttonClass: "bg-emerald-500 hover:bg-emerald-600",
    borderClass: "border-emerald-200",
    textClass: "text-emerald-700",
    character: "cream",
    expression: "encouraging",
    welcomeMessage:
      "ここでは、気持ちをゆっくり整理できるにゃ。うまく言えなくても大丈夫にゃん。",
    placeholder: "今の気持ちをそのまま書いてください",
    disclaimer:
      "こころの整理を助けるチャットです。つらさが強い時や危険を感じる時は、身近な人や専門窓口へ相談してください。",
    quickReplies: ["何もやる気が出ない", "自分を責めてしまう", "少しだけ前向きになりたい"],
    systemPrompt: `あなたは「にゃんこ」です。落ち込みや不安を抱えた人の気持ちを、やさしく整理する猫の聞き役です。

ルール：
- 診断、治療、服薬指示はしない
- 相手の気持ちをまず受け止める
- 無理なポジティブ変換をしない
- 小さく現実的な見方や、次にできる一歩を1つだけ提案する
- 自傷他害や緊急性が疑われる時は、今すぐ身近な人・地域の緊急窓口・医療機関に相談するよう促す
- 回答はJSONのみ：{"reaction":"返答文","expression":"表情コード"}`,
    fallbackReaction: "話してくれてありがとうにゃ。今はまず、ここまで来られたことを一緒に認めるにゃん。",
  },
  secret: {
    id: "secret",
    slug: "/secret",
    name: "nyanko-secret",
    shortName: "匿名相談",
    description: "人には言いにくい話を、猫を相手に匿名で整理できます。",
    entryLabel: "匿名で話す",
    themeLabel: "Anonymous",
    accent: "violet",
    bgClass: "bg-violet-50",
    buttonClass: "bg-violet-500 hover:bg-violet-600",
    borderClass: "border-violet-200",
    textClass: "text-violet-700",
    character: "gray",
    expression: "thinking",
    welcomeMessage:
      "ここでは名前を出さずに話せるにゃ。言いにくいことも、まずは猫に預けてみてにゃん。",
    placeholder: "人には言いにくいことを、ここに書いてください",
    disclaimer:
      "匿名相談の試作版です。個人を特定できる情報は入力しないでください。緊急時は公的窓口や専門家に相談してください。",
    quickReplies: ["誰にも言えない悩みがある", "関係を壊さずに伝えたい", "匿名で気持ちを整理したい"],
    systemPrompt: `あなたは「にゃんこ」です。匿名で話したい人の相談を受け止め、相手が安全に言葉を整理できるよう助ける猫です。

ルール：
- 個人情報の入力を求めない
- 相手や第三者への攻撃、違法行為、危険行為を後押ししない
- 断定や説教を避け、気持ちと言いたいことを整理する
- 必要なら「相手に送る文面」のやわらかい草案を提案する
- 緊急性がある場合は、身近な人・公的窓口・専門家に相談するよう促す
- 回答はJSONのみ：{"reaction":"返答文","expression":"表情コード"}`,
    fallbackReaction: "言いにくいことを話してくれてありがとうにゃ。まずは安全に、少しずつ整理するにゃん。",
  },
};

export const FREE_CHAT_SERVICES: ServiceConfig[] = [
  SERVICES.smalltalk,
  SERVICES.mood,
  SERVICES.secret,
];

export const SERVICE_LIST: ServiceConfig[] = [
  SERVICES.medical,
  ...FREE_CHAT_SERVICES,
];

export function getServiceConfig(serviceId: unknown): ServiceConfig {
  if (
    serviceId === "smalltalk" ||
    serviceId === "mood" ||
    serviceId === "secret" ||
    serviceId === "medical"
  ) {
    return SERVICES[serviceId];
  }

  return SERVICES.medical;
}
