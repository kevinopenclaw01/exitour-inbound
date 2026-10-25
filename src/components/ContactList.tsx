import { site } from "@/content/site";

/** 연락 채널 목록. 값이 있는 채널만 보인다(site.ts). */
export function contactChannels(): { label: string; value: string; href?: string }[] {
  const out: { label: string; value: string; href?: string }[] = [];
  if (site.whatsapp)
    out.push({ label: "WhatsApp", value: site.phone ?? site.whatsapp, href: `https://wa.me/${site.whatsapp.replace(/\D/g, "")}` });
  if (site.line) out.push({ label: "LINE", value: site.line });
  if (site.kakaoId) out.push({ label: "KakaoTalk ID", value: site.kakaoId });
  if (site.email) out.push({ label: "Email", value: site.email });
  return out;
}

export function ContactList({ compact = false }: { compact?: boolean }) {
  const channels = contactChannels();
  if (channels.length === 0) return null;
  return (
    <div className={compact ? "grid gap-1 text-sm" : "grid gap-2"}>
      <dl className={compact ? "flex flex-wrap gap-x-5 gap-y-1" : "grid gap-2 sm:grid-cols-2"}>
        {channels.map((c) => (
          <div key={c.label} className={compact ? "flex gap-1.5" : "rounded-md border border-line bg-surface p-4"}>
            <dt className={compact ? "text-muted" : "text-sm text-muted"}>{c.label}</dt>
            <dd className={compact ? "font-medium select-all" : "text-lg font-semibold select-all"}>
              {c.href ? (
                <a href={c.href} target="_blank" rel="noopener noreferrer" className="underline decoration-sign/40 hover:text-sign">
                  {c.value}
                </a>
              ) : (
                c.value
              )}
            </dd>
          </div>
        ))}
      </dl>
      <p className={compact ? "text-muted" : "text-sm text-muted"}>{site.officeHours}</p>
    </div>
  );
}
