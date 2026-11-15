import { lang } from "next/root-params";
import { isLang, type Lang } from "./config";
import { translator, type Translator } from "./translate";

// 서버 컴포넌트에서 지금 쪽의 언어로 번역기를 얻는다. 언어는 주소의 첫 칸(app/[lang])에서 온다.
// 쓰는 법: const t = await getT();

export async function currentLang(): Promise<Lang> {
  const value = await lang();
  return isLang(value) ? value : "en";
}

export async function getT(): Promise<Translator> {
  return translator(await currentLang());
}

/** 영어로만 두는 쪽(약관 초안·숨긴 쪽)의 맨 위에서 부른다. 다른 언어 주소면 없는 쪽(404)으로 보낸다. */
export async function englishOnly(): Promise<void> {
  const { notFound } = await import("next/navigation");
  if ((await currentLang()) !== "en") notFound();
}
