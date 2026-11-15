import { describe, expect, it, vi } from "vitest";
import { configuredChannels, notifyConfigured, notifyOwner } from "@/lib/notify";

// 문의 알림: 환경변수가 있을 때만 켜지고, 실패해도 던지지 않는다. 실제 전송은 하지 않는다(fetch를 가짜로 바꾼다).

const okFetch = () => vi.fn(async () => new Response("{}", { status: 200 }));

describe("inquiry notification", () => {
  it("is off when no environment variable is set", async () => {
    const fetchMock = okFetch();
    expect(notifyConfigured({})).toBe(false);
    expect(await notifyOwner("s", "t", {}, fetchMock as unknown as typeof fetch)).toEqual([]);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("needs both Telegram values, and both email values", () => {
    expect(configuredChannels({ EXITOUR_TELEGRAM_BOT_TOKEN: "x" })).toHaveLength(0);
    expect(configuredChannels({ EXITOUR_TELEGRAM_CHAT_ID: "1" })).toHaveLength(0);
    expect(configuredChannels({ EXITOUR_RESEND_API_KEY: "k" })).toHaveLength(0);
    expect(configuredChannels({ EXITOUR_TELEGRAM_BOT_TOKEN: "x", EXITOUR_TELEGRAM_CHAT_ID: "1" }).map((c) => c.name)).toEqual(["telegram"]);
  });

  it("sends to every configured channel", async () => {
    const fetchMock = okFetch();
    const env = {
      EXITOUR_TELEGRAM_BOT_TOKEN: "TOKEN",
      EXITOUR_TELEGRAM_CHAT_ID: "42",
      EXITOUR_RESEND_API_KEY: "KEY",
      EXITOUR_NOTIFY_EMAIL_TO: "a@example.com, b@example.com",
      EXITOUR_NOTIFY_WEBHOOK_URL: "https://hooks.example.com/x",
    };
    const results = await notifyOwner("New request ABC", "Name: Test", env, fetchMock as unknown as typeof fetch);
    expect(results.map((r) => [r.channel, r.ok])).toEqual([
      ["telegram", true],
      ["email", true],
      ["webhook", true],
    ]);
    const calls = fetchMock.mock.calls as unknown as [string, { body: string; headers: Record<string, string> }][];
    expect(calls[0]![0]).toBe("https://api.telegram.org/botTOKEN/sendMessage");
    expect(JSON.parse(calls[0]![1].body)).toMatchObject({ chat_id: "42" });
    expect(JSON.parse(calls[0]![1].body).text).toContain("New request ABC");
    expect(calls[1]![0]).toBe("https://api.resend.com/emails");
    expect(calls[1]![1].headers.Authorization).toBe("Bearer KEY");
    expect(JSON.parse(calls[1]![1].body).to).toEqual(["a@example.com", "b@example.com"]);
    expect(calls[2]![0]).toBe("https://hooks.example.com/x");
    expect(JSON.parse(calls[2]![1].body)).toHaveProperty("text");
    expect(JSON.parse(calls[2]![1].body)).toHaveProperty("content");
  });

  it("reports a failed channel without throwing and without leaking the key", async () => {
    const failing = vi.fn(async (url: string) => {
      if (String(url).includes("telegram")) throw new Error("network down");
      return new Response("bad key", { status: 401 });
    });
    const env = { EXITOUR_TELEGRAM_BOT_TOKEN: "SECRET", EXITOUR_TELEGRAM_CHAT_ID: "1", EXITOUR_NOTIFY_WEBHOOK_URL: "https://hooks.example.com/x" };
    const results = await notifyOwner("s", "t", env, failing as unknown as typeof fetch);
    expect(results).toEqual([
      { channel: "telegram", ok: false, detail: "network down" },
      { channel: "webhook", ok: false, detail: "401 bad key" },
    ]);
    expect(JSON.stringify(results)).not.toContain("SECRET");
  });
});
