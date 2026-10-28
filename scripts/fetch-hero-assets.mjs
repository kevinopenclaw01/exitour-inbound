// 메인 화면용 사진·영상을 내려받아 public/에 웹용으로 저장한다.
// 사용: node scripts/fetch-hero-assets.mjs            (scripts/hero-assets.json 전체)
//       node scripts/fetch-hero-assets.mjs hero-road  (이름 하나만)
// 사진은 가로 2400px WebP(품질 80)로 줄여 public/images/<name>.webp, 영상은 그대로 public/videos/<name>.mp4.
// 이미 있는 파일은 건너뛴다(다시 받으려면 파일을 지우고 실행).

import { existsSync } from "node:fs";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const list = JSON.parse(await readFile(join(root, "scripts", "hero-assets.json"), "utf8")).assets;
const only = process.argv[2];

for (const asset of list) {
  if (only && asset.name !== only) continue;
  const isVideo = asset.type === "video";
  const out = join(root, "public", isVideo ? "videos" : "images", `${asset.name}.${isVideo ? "mp4" : "webp"}`);
  if (existsSync(out)) {
    console.log(`건너뜀(이미 있음): ${out}`);
    continue;
  }
  const res = await fetch(asset.url);
  if (!res.ok) {
    console.error(`실패 ${res.status}: ${asset.name} ${asset.url}`);
    process.exitCode = 1;
    continue;
  }
  const bytes = Buffer.from(await res.arrayBuffer());
  await mkdir(dirname(out), { recursive: true });
  if (isVideo) {
    await writeFile(out, bytes);
  } else {
    const sharp = (await import("sharp")).default;
    await sharp(bytes).resize({ width: 2400, withoutEnlargement: true }).webp({ quality: 80 }).toFile(out);
  }
  const { size } = await import("node:fs").then((fs) => fs.statSync(out));
  console.log(`저장: ${out} (${(size / 1024 / 1024).toFixed(2)} MB)${isVideo && size > 4 * 1024 * 1024 ? "  ← 4MB가 넘음, 압축 권장(docs/08_handoff.md)" : ""}`);
}
