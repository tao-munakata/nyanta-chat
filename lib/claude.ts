import "server-only";
import Anthropic from "@anthropic-ai/sdk";

export type ClaudeExpression =
  | "welcome"
  | "happy"
  | "surprised"
  | "serious"
  | "encouraging";

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
- "encouraging": 最後の質問・困難そうな状況に励ます時`;

let client: Anthropic | null = null;

function getClient(): Anthropic {
  if (!client) {
    client = new Anthropic();
  }
  return client;
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
      "encouraging",
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
