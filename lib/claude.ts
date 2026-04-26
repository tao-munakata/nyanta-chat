import "server-only";
import Anthropic from "@anthropic-ai/sdk";
import { getServiceConfig, type ServiceId } from "@/lib/services";

export type ClaudeExpression =
  | "welcome"
  | "happy"
  | "surprised"
  | "serious"
  | "thinking"
  | "encouraging"
  | "worried"
  | "relieved";

export type ReactionResult = {
  reaction: string;
  expression: ClaudeExpression;
};

const SYSTEM_PROMPT = `あなたは「にゃん太先生」です。白衣と聴診器をつけた、ふわふわの猫の医師キャラクターです。

ルール：
- 必ず「にゃ〜」「〜にゃん」「♡」を含む猫語で話す
- 1〜2文の短いリアクションを返す
- 患者の回答を優しく受け止めて、励ますかほめる
- 医療的な診断・アドバイス・判断は絶対にしない
- 回答は以下のJSON形式のみで返す（他の文字を含めない）：
{"reaction": "猫語リアクション文", "expression": "表情コード"}

表情コードの選択ルール：
- "welcome": 通常の優しい反応
- "happy": 情報を教えてもらえた嬉しい反応
- "surprised": 重要な情報（病名・手術・アレルギーなど）を聞いた時
- "serious": 症状・痛み・緊急性の高い内容を聞いた時
- "thinking": ユーザーが「わからない」「不明」など迷っている時
- "encouraging": 最後の質問・困難そうな状況に励ます時
- "worried": 不安・心配・困りごとが強い時
- "relieved": 問題なし・痛みなし・できる等、安心できる回答の時`;

const VALID_EXPRESSIONS: ClaudeExpression[] = [
  "welcome",
  "happy",
  "surprised",
  "serious",
  "thinking",
  "encouraging",
  "worried",
  "relieved",
];

let client: Anthropic | null = null;

function getClient(): Anthropic {
  if (!client) {
    client = new Anthropic();
  }
  return client;
}

const normalizeMessage = (message: string): string =>
  message
    .replace(/[Ａ-Ｚａ-ｚ０-９]/g, (char) =>
      String.fromCharCode(char.charCodeAt(0) - 0xfee0)
    )
    .toLowerCase()
    .trim();

const includesAny = (message: string, words: string[]): boolean =>
  words.some((word) => message.includes(word));

function generateLocalServiceReply(
  serviceId: ServiceId,
  userMessage: string
): ReactionResult {
  const text = normalizeMessage(userMessage);
  const service = getServiceConfig(serviceId);

  if (serviceId === "smalltalk") {
    if (includesAny(text, ["疲れ", "つかれ", "しんど", "眠い", "ねむい"])) {
      return {
        reaction:
          "今日はよくがんばった日にゃ。少し肩の力を抜いて、あったかい飲み物でも飲む時間にするにゃん。",
        expression: "relieved",
      };
    }
    if (includesAny(text, ["嬉し", "うれし", "楽しか", "よかった", "好き"])) {
      return {
        reaction:
          "それはいい話にゃ。にゃん太までちょっと嬉しくなったにゃん、どんなところが一番よかったにゃ？",
        expression: "happy",
      };
    }
    if (includesAny(text, ["暇", "ひま", "退屈", "話したい"])) {
      return {
        reaction:
          "じゃあ少しおしゃべりするにゃ。今日の気分を天気で言うと、晴れ・くもり・雨のどれに近いにゃ？",
        expression: "welcome",
      };
    }
    return {
      reaction:
        "うんうん、聞いてるにゃ。もう少しだけ、その話の続きを教えてほしいにゃん。",
      expression: "happy",
    };
  }

  if (serviceId === "mood") {
    if (
      includesAny(text, [
        "死にたい",
        "消えたい",
        "自傷",
        "傷つけ",
        "終わりにしたい",
      ])
    ) {
      return {
        reaction:
          "そこまでつらい気持ちを一人で抱えているのは危ないにゃ。今すぐ近くの人、救急、地域の相談窓口につながってほしいにゃ。",
        expression: "serious",
      };
    }
    if (includesAny(text, ["やる気", "動け", "何も", "だるい", "無理"])) {
      return {
        reaction:
          "やる気が出ない時は、心と体が休みたいサインかもしれないにゃ。今日は小さく、顔を洗うだけでも一歩にしていいにゃん。",
        expression: "encouraging",
      };
    }
    if (includesAny(text, ["責め", "だめ", "ダメ", "嫌い", "価値"])) {
      return {
        reaction:
          "自分を責める声が強い時ほど、事実より厳しく見えてしまうことがあるにゃ。今は責めるより、つらかったことを分けて見るにゃん。",
        expression: "worried",
      };
    }
    if (includesAny(text, ["不安", "心配", "怖い", "こわい", "緊張"])) {
      return {
        reaction:
          "不安を言葉にできたのは大事な一歩にゃ。まずは『何が一番心配か』を一つだけ選んでみるにゃん。",
        expression: "worried",
      };
    }
    return {
      reaction:
        "話してくれてありがとうにゃ。今の気持ちを急いで変えなくていいから、一緒に少しずつ整理するにゃん。",
      expression: "encouraging",
    };
  }

  if (serviceId === "secret") {
    if (includesAny(text, ["誰にも", "言えない", "秘密", "恥ずか", "匿名"])) {
      return {
        reaction:
          "言いにくいことをここに置いてくれてありがとうにゃ。まずは名前や個人情報を出さずに、何が一番重いか一緒に整理するにゃん。",
        expression: "thinking",
      };
    }
    if (includesAny(text, ["伝えたい", "line", "ライン", "送る", "文面"])) {
      return {
        reaction:
          "相手に送る言葉を一緒にやわらかく整えるにゃ。責める文より、『私はこう感じた』から始めると伝わりやすいにゃん。",
        expression: "encouraging",
      };
    }
    if (includesAny(text, ["怒り", "許せ", "むかつ", "嫌い", "復讐"])) {
      return {
        reaction:
          "強い怒りがある時は、すぐ送らず下書きにするのが安全にゃ。まずは送らない前提で、言いたいことを全部ここに出すにゃん。",
        expression: "serious",
      };
    }
    return {
      reaction:
        "ここでは急いで結論を出さなくて大丈夫にゃ。相手に見せる言葉と、自分だけの本音を分けて考えるにゃん。",
      expression: "thinking",
    };
  }

  return {
    reaction: service.fallbackReaction,
    expression: service.expression,
  };
}

export async function generateReaction(
  questionText: string,
  userAnswer: string
): Promise<ReactionResult> {
  try {
    const message = await getClient().messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 200,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: "user",
          content: `質問：「${questionText}」\nユーザーの回答：「${userAnswer}」`,
        },
      ],
    });

    const text =
      message.content[0].type === "text" ? message.content[0].text : "";
    const parsed = JSON.parse(text);

    const validExpressions: ClaudeExpression[] = [
      "welcome",
      "happy",
      "surprised",
      "serious",
      "thinking",
      "encouraging",
      "worried",
      "relieved",
    ];
    const expression: ClaudeExpression = validExpressions.includes(
      parsed.expression
    )
      ? parsed.expression
      : "welcome";

    return {
      reaction: typeof parsed.reaction === "string" ? parsed.reaction : "なるほどにゃ〜♡",
      expression,
    };
  } catch {
    return {
      reaction: "なるほどにゃ〜！ありがとうにゃ♡",
      expression: "welcome",
    };
  }
}

export async function generateServiceReply(
  serviceId: ServiceId,
  userMessage: string
): Promise<ReactionResult> {
  const service = getServiceConfig(serviceId);

  if (!process.env.ANTHROPIC_API_KEY) {
    return generateLocalServiceReply(service.id, userMessage);
  }

  try {
    const message = await getClient().messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 260,
      system: `${service.systemPrompt}

表情コードは次のどれかのみ：${VALID_EXPRESSIONS.join(", ")}`,
      messages: [
        {
          role: "user",
          content: userMessage,
        },
      ],
    });

    const text =
      message.content[0].type === "text" ? message.content[0].text : "";
    const parsed = JSON.parse(text);
    const expression: ClaudeExpression = VALID_EXPRESSIONS.includes(
      parsed.expression
    )
      ? parsed.expression
      : service.expression;

    return {
      reaction:
        typeof parsed.reaction === "string"
          ? parsed.reaction
          : service.fallbackReaction,
      expression,
    };
  } catch {
    return generateLocalServiceReply(service.id, userMessage);
  }
}
