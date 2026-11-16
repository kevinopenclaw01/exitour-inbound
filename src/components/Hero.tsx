import Image from "next/image";
import Link from "next/link";
import { dayProduct, productLabels, productOrder } from "@/content/pricing";
import { getService } from "@/content/services";
import { site } from "@/content/site";
import { getT } from "@/i18n/server";
import { Container } from "./ui";
import { msg } from "@/i18n/msg";

// 홈 첫 화면. 흰 바탕에 글과 버튼을 왼쪽에, 사진을 오른쪽 틀 안에 둔다(큰 색 면을 쓰지 않는다).
// 영상(site.heroVideo)이 있으면 사진 틀 안에서 소리 없이 반복 재생하고(사진은 영상이 뜨기 전·움직임 줄이기 설정용 정지 화면),
// 사진도 영상도 없으면 한국 도로 안내표지 그림을 보여 준다.
// 사진은 4:3 틀에 맞춰 잘라 넣는다. 자르는 기준(가운데·왼쪽)은 site.heroImage.position.

const trust = [
  msg("Registered travel agency"),
  msg("Government-licensed guides"),
  msg("Registered rental vans"),
  msg("No forced shopping"),
  msg("Replies on WhatsApp"),
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

export async function Hero() {
  const t = await getT();
  const photo = site.heroImage ? t.obj(site.heroImage) : null;
  const video = site.heroVideo;
  const hasMedia = Boolean(photo || video);
  return (
    <section className="border-b border-line bg-surface">
      <Container className="grid items-center gap-8 py-10 sm:py-14 lg:grid-cols-[1.15fr_1fr] lg:gap-12 lg:py-16">
        <div className="grid gap-5">
          <p className="text-xs font-bold tracking-[0.14em] text-sign uppercase">{t("Seoul · Gyeonggi · private van days")}</p>
          <h1 className="font-display text-4xl leading-[1.08] text-ink sm:text-5xl">
            {t("Your own van and driver in Korea, for a {hours}-hour day.", { hours: dayProduct.hours })}
          </h1>
          <p className="max-w-xl text-lg text-muted">
            {t(
              "A private {vehicle} for up to {max} passengers, in Seoul or on a Gyeonggi day trip. Choose a driver only, or a licensed guide in your language. Priced per group.",
              { vehicle: dayProduct.vehicle, max: dayProduct.maxPassengers },
            )}
          </p>

          <div className="grid gap-2 sm:grid-cols-2">
            {productOrder.map((id) => {
              const service = getService(id);
              return (
                <Link
                  key={id}
                  href={t.href(service.path)}
                  className="grid gap-0.5 rounded-md border border-line px-4 py-3 transition-colors hover:border-sign hover:bg-sign-soft"
                >
                  <span className="font-semibold text-sign-deep">{t(productLabels[id].name)} →</span>
                  <span className="text-sm text-muted">{t(productLabels[id].hint)}</span>
                </Link>
              );
            })}
          </div>

          <div className="flex flex-wrap gap-3">
            <Link href={t.href("/plan")} className="rounded-md bg-sign px-5 py-3 font-semibold text-white hover:bg-sign-deep">
              {t("Plan my trip")}
            </Link>
            <Link
              href={t.href("/prices")}
              className="rounded-md border border-sign px-5 py-3 font-semibold text-sign-deep hover:bg-sign-soft"
            >
              {t("See prices")}
            </Link>
          </div>
        </div>

        {hasMedia ? (
          <figure className="grid gap-1.5">
            <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-paper">
              {photo ? (
                <Image
                  src={photo.src}
                  alt={photo.alt}
                  fill
                  priority
                  sizes="(min-width: 1024px) 460px, 100vw"
                  className={`object-cover ${photo.position === "left" ? "object-left" : "object-center"}`}
                />
              ) : null}
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
            </div>
            {photo?.credit ? <figcaption className="text-right text-xs text-muted">{photo.credit}</figcaption> : null}
          </figure>
        ) : (
          <div className="flex justify-center lg:justify-end">
            <RouteSign />
          </div>
        )}
      </Container>

      <div className="border-t border-line">
        <Container>
          <ul className="flex flex-wrap justify-center gap-x-5 gap-y-1.5 py-3 text-sm text-muted">
            {trust.map((item) => (
              <li key={item} className="flex items-center gap-1.5">
                <span aria-hidden="true" className="text-sign">
                  ✓
                </span>
                {t(item)}
              </li>
            ))}
          </ul>
        </Container>
      </div>
    </section>
  );
}
