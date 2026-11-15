import Image from "next/image";
import { crew, crewLanguageLine } from "@/content/crew";

// 기사·가이드 소개. 자료(src/content/crew.ts)가 없으면 구역 전체가 나오지 않는다.

export function CrewSection({ title = "Meet your driver-guide" }: { title?: string }) {
  if (crew.length === 0) return null;
  const languageLine = crewLanguageLine();
  return (
    <section className="grid gap-4">
      <h2 className="text-2xl font-bold">{title}</h2>
      <div className="grid gap-4 sm:grid-cols-2">
        {crew.map((member) => (
          <article key={member.name} className="grid grid-cols-[auto_1fr] items-start gap-4 rounded-md border border-line bg-surface p-5">
            {member.photo ? (
              <Image
                src={member.photo.src}
                alt={member.photo.alt}
                width={96}
                height={96}
                className="h-24 w-24 rounded-full object-cover"
              />
            ) : null}
            <div className={`grid gap-1.5 ${member.photo ? "" : "col-span-2"}`}>
              <h3 className="text-lg font-bold">{member.name}</h3>
              <p className="text-sm font-semibold text-sign-deep">{member.role}</p>
              <dl className="grid gap-1 text-sm">
                {member.licence ? (
                  <div>
                    <dt className="inline font-semibold">Licence: </dt>
                    <dd className="inline text-muted">{member.licence}</dd>
                  </div>
                ) : null}
                {member.languages.length > 0 ? (
                  <div>
                    <dt className="inline font-semibold">Speaks: </dt>
                    <dd className="inline text-muted">{member.languages.join(", ")}</dd>
                  </div>
                ) : null}
              </dl>
              <p className="text-muted">{member.intro}</p>
            </div>
          </article>
        ))}
      </div>
      {languageLine ? <p className="text-sm text-muted">{languageLine}</p> : null}
    </section>
  );
}
