// IndexNow 제출: 「이 주소들이 바뀌었으니 다시 읽어 가라」고 Bing·네이버·Yandex 등에 한 번에 알린다(구글은 IndexNow를 쓰지 않는다).
// ChatGPT 검색·Copilot은 Bing 색인에 기대므로, 운영 배포 뒤마다 한 번 돌린다.
//
// 사용(운영 배포 뒤, 저장소 폴더에서):
//   node scripts/indexnow-submit.mjs https://entourkorea.com            ← 사이트맵의 모든 주소를 알린다
//   node scripts/indexnow-submit.mjs https://entourkorea.com --dry-run  ← 보내지 않고 보낼 내용만 본다
// 주소를 안 적으면 환경변수 NEXT_PUBLIC_SITE_URL을 쓴다. localhost와 *.vercel.app(임시 주소)에는 보내지 않는다.
//
// 키는 public/<32자>.txt 한 곳에 있다(누구나 볼 수 있는 확인용 값이며 비밀이 아니다). 그 파일을 지우면 제출이 멈춘다.
// 규격: https://www.indexnow.org/documentation
import { readdirSync } from "node:fs";

const args = process.argv.slice(2);
const dryRun = args.includes("--dry-run");
const base = (args.find((a) => /^https?:\/\//.test(a)) ?? process.env.NEXT_PUBLIC_SITE_URL ?? "").replace(/\/+$/, "");

if (!base) {
  console.error("사이트 주소가 없습니다. 예: node scripts/indexnow-submit.mjs https://entourkorea.com");
  process.exit(1);
}
const host = new URL(base).host;
if (/^(localhost|127\.0\.0\.1)(:|$)/.test(host) || host.endsWith(".vercel.app")) {
  console.error(`${host} 는 운영 도메인이 아니라서 보내지 않습니다. 도메인을 연결한 뒤 그 주소로 실행하세요.`);
  process.exit(1);
}

const keyFile = readdirSync(new URL("../public/", import.meta.url)).find((name) => /^[a-f0-9]{32}\.txt$/.test(name));
if (!keyFile) throw new Error("public 폴더에 IndexNow 키 파일이 없습니다.");
const key = keyFile.replace(/\.txt$/, "");

const served = await fetch(`${base}/${keyFile}`);
const servedKey = served.ok ? (await served.text()).trim() : "";
if (servedKey !== key) throw new Error(`운영 주소에서 키 파일이 안 열립니다(${served.status}). 먼저 배포하세요: ${base}/${keyFile}`);

const sitemap = await (await fetch(`${base}/sitemap.xml`)).text();
const urlList = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
if (urlList.length === 0) throw new Error("사이트맵에서 주소를 찾지 못했습니다.");
const foreign = urlList.filter((url) => new URL(url).host !== host);
if (foreign.length > 0) throw new Error(`사이트맵에 다른 주소가 섞여 있습니다(NEXT_PUBLIC_SITE_URL 확인): ${foreign[0]}`);

const body = { host, key, keyLocation: `${base}/${keyFile}`, urlList };
console.log(`주소 ${urlList.length}개:\n  ${urlList.join("\n  ")}`);
if (dryRun) {
  console.log("\n--dry-run: 보내지 않았습니다.");
  process.exit(0);
}

const meaning = { 200: "받음", 202: "받음(키 확인 중)", 400: "형식 오류", 403: "키가 맞지 않음", 422: "주소가 이 사이트 것이 아니거나 키 규격이 다름", 429: "너무 자주 보냄" };
const response = await fetch("https://api.indexnow.org/indexnow", {
  method: "POST",
  headers: { "Content-Type": "application/json; charset=utf-8" },
  body: JSON.stringify(body),
});
console.log(`\nIndexNow 응답: ${response.status} ${meaning[response.status] ?? ""}`);
if (!response.ok) process.exit(1);
