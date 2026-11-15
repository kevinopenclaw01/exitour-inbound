// 새 여행 요청이 오면 사장님께 알린다. 환경변수만 넣으면 켜지고, 아무것도 없으면 조용히 건너뛴다.
// 이 파일은 /api/inquiry(서버)에서만 부른다. 키는 서버 환경변수에서만 읽는다(브라우저로 나가지 않는다).
//
// 켜는 법(셋 중 하나 이상. .env.local과 Vercel 환경변수에 같은 이름으로 넣는다 — docs/10_narrow-launch.md):
//   1) 텔레그램      EXITOUR_TELEGRAM_BOT_TOKEN + EXITOUR_TELEGRAM_CHAT_ID
//   2) 이메일(Resend) EXITOUR_RESEND_API_KEY + EXITOUR_NOTIFY_EMAIL_TO  (+ EXITOUR_NOTIFY_EMAIL_FROM, 없으면 Resend 시험용 보내는 주소)
//   3) 웹훅          EXITOUR_NOTIFY_WEBHOOK_URL  (Slack·Discord·n8n·Make 등. JSON {text, content}를 POST)
// 이름에 EXITOUR_를 붙인 이유는 src/lib/supabase.ts와 같다(사장님 PC의 다른 프로젝트 환경변수와 겹치지 않게).
//
// 알림이 실패해도 손님 화면에는 영향을 주지 않는다(요청은 이미 저장됐다). 실패는 서버 로그에만 남긴다.

type Env = Record<string, string | undefined>;
type Fetch = typeof fetch;

export interface NotifyResult {
  channel: "telegram" | "email" | "webhook";
  ok: boolean;
  detail?: string;
}

interface Channel {
  name: NotifyResult["channel"];
  send: (subject: string, text: string, fetchImpl: Fetch) => Promise<Response>;
}

const TIMEOUT_MS = 5000;

const post = (fetchImpl: Fetch, url: string, body: unknown, headers: Record<string, string> = {}) =>
  fetchImpl(url, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...headers },
    body: JSON.stringify(body),
    cache: "no-store",
    signal: AbortSignal.timeout(TIMEOUT_MS),
  });

/** 환경변수가 다 들어 있는 알림 통로만 돌려준다. */
export function configuredChannels(env: Env = process.env): Channel[] {
  const channels: Channel[] = [];

  const botToken = env.EXITOUR_TELEGRAM_BOT_TOKEN;
  const chatId = env.EXITOUR_TELEGRAM_CHAT_ID;
  if (botToken && chatId) {
    channels.push({
      name: "telegram",
      send: (subject, text, f) =>
        post(f, `https://api.telegram.org/bot${botToken}/sendMessage`, {
          chat_id: chatId,
          text: `${subject}\n\n${text}`,
          disable_web_page_preview: true,
        }),
    });
  }

  const resendKey = env.EXITOUR_RESEND_API_KEY;
  const emailTo = env.EXITOUR_NOTIFY_EMAIL_TO;
  if (resendKey && emailTo) {
    const from = env.EXITOUR_NOTIFY_EMAIL_FROM || "Entour Korea <onboarding@resend.dev>";
    channels.push({
      name: "email",
      send: (subject, text, f) =>
        post(
          f,
          "https://api.resend.com/emails",
          { from, to: emailTo.split(",").map((a) => a.trim()).filter(Boolean), subject, text },
          { Authorization: `Bearer ${resendKey}` },
        ),
    });
  }

  const webhook = env.EXITOUR_NOTIFY_WEBHOOK_URL;
  if (webhook) {
    channels.push({
      name: "webhook",
      // Slack은 text, Discord는 content를 읽는다. 둘 다 넣어 한 주소 설정으로 어느 쪽이든 되게 한다.
      send: (subject, text, f) => post(f, webhook, { text: `${subject}\n${text}`, content: `${subject}\n${text}` }),
    });
  }

  return channels;
}

export function notifyConfigured(env: Env = process.env): boolean {
  return configuredChannels(env).length > 0;
}

/** 켜져 있는 모든 통로로 보낸다. 던지지 않는다(실패는 결과에 담는다). */
export async function notifyOwner(subject: string, text: string, env: Env = process.env, fetchImpl: Fetch = fetch): Promise<NotifyResult[]> {
  const channels = configuredChannels(env);
  return Promise.all(
    channels.map(async (channel): Promise<NotifyResult> => {
      try {
        const res = await channel.send(subject, text, fetchImpl);
        if (res.ok) return { channel: channel.name, ok: true };
        const detail = await res.text().catch(() => "");
        return { channel: channel.name, ok: false, detail: `${res.status} ${detail.slice(0, 200)}` };
      } catch (e) {
        return { channel: channel.name, ok: false, detail: e instanceof Error ? e.message : String(e) };
      }
    }),
  );
}
