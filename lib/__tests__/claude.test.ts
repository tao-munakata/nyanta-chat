import { describe, it, expect, vi, beforeEach } from "vitest";

// Anthropic SDKをモック
vi.mock("@anthropic-ai/sdk", () => ({
  default: vi.fn().mockImplementation(() => ({
    messages: {
      create: vi.fn().mockResolvedValue({
        content: [
          {
            type: "text",
            text: JSON.stringify({
              reaction: "なるほどにゃ〜！教えてくれてありがとうにゃ♡",
              expression: "happy",
            }),
          },
        ],
      }),
    },
  })),
}));

const { generateReaction } = await import("../claude.js");

describe("claude", () => {
  it("reactionとexpressionを返す", async () => {
    const result = await generateReaction(
      "お名前をおしえてにゃ",
      "田中太郎"
    );
    expect(result.reaction).toBeTruthy();
    expect([
      "welcome",
      "happy",
      "surprised",
      "serious",
      "encouraging",
    ]).toContain(result.expression);
  });

  it("JSONパースに失敗した場合はデフォルト値を返す", async () => {
    const Anthropic = (await import("@anthropic-ai/sdk")).default as unknown as ReturnType<typeof vi.fn>;
    Anthropic.mockImplementationOnce(() => ({
      messages: {
        create: vi.fn().mockResolvedValue({
          content: [{ type: "text", text: "壊れたレスポンスにゃ" }],
        }),
      },
    }));
    const result = await generateReaction("質問", "回答");
    expect(result.reaction).toBeTruthy();
    expect(result.expression).toBe("welcome");
  });
});
