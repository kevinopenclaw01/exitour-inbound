import Image from "next/image";
import Link from "next/link";
import { services } from "@/content/services";
import { site } from "@/content/site";
import { Container } from "./ui";

// 홈 첫 화면. 영상(site.heroVideo)이 있으면 소리 없이 반복 재생하고(사진은 영상이 뜨기 전·움직임 줄이기 설정용 정지 화면),
// 사진(site.heroImage)만 있으면 사진을 깔고, 둘 다 없으면 한국 도로 안내표지 그림을 보여 준다.

const shortNames: Record<string, { label: string; hint: string }> = {
  "private-driver": { label: "Private driver", hint: "Van + driver" },
  "driver-guide": { label: "Driver-guide", hint: "Van + licensed guide" },
  "guide-tour": { label: "Guide tour", hint: "Guide + trip planning" },
};

const trust = [
  "Registered travel agency",
  "Government-licensed guides",
  "Registered rental vans",
  "No forced shopping",
  "Replies on WhatsApp",
];

/** 한국 고속도로 방향 안내표지 모양의 그림. 한글 지명은 크게, 영어는 작게(실제 표지 방식). */
function RouteSign() {
  return (
    <svg
      viewBox="0 0 520 400"
      role="img"
      aria-label="Road sign style map: Seoul at the centre, Nami Island ahead, Incheon Airport to the left, Suwon to the right, and tourist sights in Seoul below"
      className="h-auto w-full max-w-[520px] drop-shadow-xl"
    >
      <rect x="4" y="4" width="512" height="300" rx="18" fill="#0d6a4b" />
      <rect x="14" y="14" width="492" height="280" rx="12" fill="none" stroke="#ffffff" strokeWidth="4" />

      {/* 위: 남이섬 */}
      <path d="M260 150 V62" stroke="#ffffff" strokeWidth="14" strokeLinecap="round" />
      <path d="M232 84 L260 50 L288 84 Z" fill="#ffffff" />
      <text x="300" y="70" fill="#ffffff" fontSize="30" fontWeight="700" fontFamily="'Apple SD Gothic Neo','Malgun Gothic','Noto Sans KR',sans-serif">
        남이섬
      </text>
      <text x="300" y="96" fill="#ffffff" fontSize="17" fontFamily="Arial,Helvetica,sans-serif">
        Nami Island
      </text>

      {/* 왼쪽: 인천공항 */}
      <path d="M248 172 H96" stroke="#ffffff" strokeWidth="14" strokeLinecap="round" />
      <path d="M112 146 L76 172 L112 198 Z" fill="#ffffff" />
      <text x="40" y="236" fill="#ffffff" fontSize="28" fontWeight="700" fontFamily="'Apple SD Gothic Neo','Malgun Gothic','Noto Sans KR',sans-serif">
        인천공항
      </text>
      <text x="40" y="260" fill="#ffffff" fontSize="16" fontFamily="Arial,Helvetica,sans-serif">
        Incheon Airport
      </text>

      {/* 오른쪽: 수원 */}
      <path d="M272 172 H424" stroke="#ffffff" strokeWidth="14" strokeLinecap="round" />
      <path d="M408 146 L444 172 L408 198 Z" fill="#ffffff" />
      <text x="482" y="236" textAnchor="end" fill="#ffffff" fontSize="28" fontWeight="700" fontFamily="'Apple SD Gothic Neo','Malgun Gothic','Noto Sans KR',sans-serif">
        수원
      </text>
      <text x="482" y="260" textAnchor="end" fill="#ffffff" fontSize="16" fontFamily="Arial,Helvetica,sans-serif">
        Suwon Hwaseong
      </text>

      {/* 가운데: 지금 위치 서울 */}
      <circle cx="260" cy="172" r="30" fill="#ffffff" />
      <text x="260" y="168" textAnchor="middle" fill="#0d6a4b" fontSize="17" fontWeight="700" fontFamily="'Apple SD Gothic Neo','Malgun Gothic','Noto Sans KR',sans-serif">
        서울
      </text>
      <text x="260" y="186" textAnchor="middle" fill="#0d6a4b" fontSize="11" fontWeight="700" fontFamily="Arial,Helvetica,sans-serif">
        SEOUL
      </text>

      {/* 아래: 관광지 안내(갈색) */}
      <rect x="44" y="300" width="432" height="92" rx="12" fill="#8a5527" />
      <rect x="52" y="308" width="416" height="76" rx="8" fill="none" stroke="#ffffff" strokeWidth="3" />
      <text x="74" y="340" fill="#ffffff" fontSize="20" fontWeight="700" fontFamily="'Apple SD Gothic Neo','Malgun Gothic','Noto Sans KR',sans-serif">
        경복궁 · 북촌 · 한강
      </text>
      <text x="74" y="366" fill="#ffffff" fontSize="15" fontFamily="Arial,Helvetica,sans-serif">
        Gyeongbokgung · Bukchon · Han River
      </text>
      <path d="M440 346 l-16 -12 v8 h-18 v8 h18 v8 z" fill="#ffffff" />
      <rect x="236" y="300" width="48" height="6" fill="#0d6a4b" />
    </svg>
  );
}

export function Hero() {
  const photo = site.heroImage;
  const video = site.heroVideo;
  const hasMedia = Boolean(photo || video);
  return (
    <section className="relative overflow-hidden bg-sign-deep text-white">
      {hasMedia ? (
        <>
          {photo ? <Image src={photo.src} alt={photo.alt} fill priority sizes="100vw" className="object-cover" /> : null}
          {video ? (
            <video
              className="absolute inset-0 h-full w-full object-cover motion-reduce:hidden"
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              poster={photo?.src}
              aria-hidden="true"
            >
              <source src={video} type="video/mp4" />
            </video>
          ) : null}
          <div className="absolute inset-0 bg-gradient-to-r from-sign-deep via-sign-deep/85 to-sign-deep/30" aria-hidden="true" />
        </>
      ) : (
        <div
          aria-hidden="true"
          className="absolute inset-0 opacity-[0.07] [background-image:repeating-linear-gradient(135deg,#fff_0_2px,transparent_2px_26px)]"
        />
      )}

      <Container className="relative grid items-center gap-10 py-12 sm:py-16 lg:grid-cols-[1.1fr_1fr] lg:py-20">
        <div className="grid gap-6">
          <p className="inline-flex w-fit items-center rounded border-2 border-white/80 px-2.5 py-1 text-xs font-bold tracking-[0.12em] uppercase">
            Seoul · Gyeonggi · Incheon
          </p>
          <h1 className="font-display text-4xl leading-[1.06] sm:text-5xl lg:text-[3.4rem]">
            Korea in your own van, with a licensed guide who speaks your language.
          </h1>
          <p className="max-w-xl text-lg text-white/85">
            Pick a driver, a driver-guide or a guide. We set it up legally, match the language, and plan the day with you.
          </p>

          <div className="grid gap-2 sm:grid-cols-3">
            {services.map((s) => {
              const n = shortNames[s.id] ?? { label: s.name, hint: "" };
              return (
                <Link
                  key={s.id}
                  href={s.path}
                  className="grid gap-0.5 rounded-md border border-white/30 bg-white/10 px-4 py-3 transition-colors hover:border-white hover:bg-white/20"
                >
                  <span className="font-semibold">{n.label} →</span>
                  <span className="text-sm text-white/75">{n.hint}</span>
                </Link>
              );
            })}
          </div>

          <div className="flex flex-wrap gap-3">
            <Link href="/plan" className="rounded-md bg-white px-5 py-3 font-semibold text-sign-deep hover:bg-sign-soft">
              Plan my trip
            </Link>
            <Link href="/prices" className="rounded-md border border-white/70 px-5 py-3 font-semibold hover:bg-white/10">
              See prices
            </Link>
          </div>
        </div>

        {hasMedia ? null : (
          <div className="flex justify-center lg:justify-end">
            <RouteSign />
          </div>
        )}
      </Container>

      <div className="relative border-t border-white/15 bg-black/15">
        <Container>
          <ul className="flex flex-wrap justify-center gap-x-5 gap-y-1.5 py-3 text-sm text-white/90">
            {trust.map((t) => (
              <li key={t} className="flex items-center gap-1.5">
                <span aria-hidden="true" className="text-brown-soft">
                  ✓
                </span>
                {t}
              </li>
            ))}
          </ul>
        </Container>
      </div>

      {photo?.credit ? (
        <p className="absolute right-2 bottom-12 text-[10px] text-white/60">Photo: {photo.credit}</p>
      ) : null}
    </section>
  );
}
