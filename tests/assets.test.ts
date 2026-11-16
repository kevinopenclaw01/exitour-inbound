import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { crew, crewEntries } from "@/content/crew";
import { dayPlans } from "@/content/dayPlans";
import { guestPhotos, homePlaceStrip, placePhotos, vanPhotos, visibleGuestPhotos } from "@/content/photos";
import { site } from "@/content/site";

// site.ts·crew.ts·photos.ts가 가리키는 사진·영상 파일이 public/에 실제로 있는지(빠뜨리고 배포하면 화면이 비어 보인다).
const pub = join(__dirname, "..", "public");

describe("hero media", () => {
  it("heroImage file exists when set", () => {
    if (site.heroImage) expect(existsSync(join(pub, site.heroImage.src))).toBe(true);
  });
  it("heroVideo file exists when set, and has a poster image", () => {
    if (site.heroVideo) {
      expect(existsSync(join(pub, site.heroVideo))).toBe(true);
      expect(site.heroImage, "set heroImage as the video's still frame").not.toBeNull();
    }
  });
  it("labels AI-generated scenery as such, and only real photos carry a place name", () => {
    // AI로 만든 풍경(/images/hero-*.webp)을 다시 쓰면 출처를 밝힌다(docs/decisions.md).
    if (site.heroImage && /\/images\/hero-/.test(site.heroImage.src)) expect(site.heroImage.credit).toBe("AI-generated scenery");
  });
});

describe("real photos", () => {
  it("every van and place photo file exists and has alt text", () => {
    for (const photo of [...vanPhotos, ...Object.values(placePhotos)]) {
      expect(existsSync(join(pub, photo.src)), photo.src).toBe(true);
      expect(photo.alt.length, photo.src).toBeGreaterThan(20);
      expect(photo.width, photo.src).toBeGreaterThan(0);
      expect(photo.height, photo.src).toBeGreaterThan(0);
    }
  });

  it("day plans and the home strip only point at photos that exist", () => {
    const keys = new Set(Object.keys(placePhotos));
    for (const key of homePlaceStrip) expect(keys.has(key), key).toBe(true);
    for (const plan of dayPlans) for (const key of plan.photos ?? []) expect(keys.has(key), `${plan.slug}: ${key}`).toBe(true);
  });

  it("does not name places that are not confirmed yet", () => {
    // 별마당 도서관의 지점과 소나무 정원의 이름은 사장님 확인 전이다(편집본 README). 그 사진은 아직 쓰지 않는다.
    const used = JSON.stringify([vanPhotos, placePhotos]);
    expect(used).not.toMatch(/byeolmadang|garden-old-pine/);
  });
});

describe("guest photos (back views)", () => {
  it("are on with faces blurred (2026-11-16 owner decision)", () => {
    expect(guestPhotos.enabled).toBe(true);
    expect(visibleGuestPhotos().length).toBeGreaterThan(0);
    // 얼굴이 보이는 사진은 가린 편집본만 쓴다(alt에 "faces blurred" 또는 뒷모습 "seen from behind").
    for (const p of visibleGuestPhotos()) expect(p.alt, p.src).toMatch(/faces blurred|seen from behind|looking through/);
  });

  it("are not placed in public/ while they are off, and all exist once on", () => {
    const dir = join(pub, "images", "guests");
    if (guestPhotos.enabled) {
      for (const photo of guestPhotos.photos) expect(existsSync(join(pub, photo.src)), photo.src).toBe(true);
    } else {
      // public/에 넣으면 화면에 걸지 않아도 주소로 열린다.
      expect(existsSync(dir) ? readdirSync(dir) : []).toEqual([]);
    }
  });
});

describe("crew photos", () => {
  it("every crew photo file exists, shown or not", () => {
    for (const entry of crewEntries) {
      if (entry.photo) expect(existsSync(join(pub, entry.photo.src)), entry.photo.src).toBe(true);
    }
    for (const member of crew) {
      if (member.photo) expect(existsSync(join(pub, member.photo.src)), member.photo.src).toBe(true);
    }
  });

  it("a crew entry is shown only with a name and an introduction", () => {
    for (const entry of crewEntries) {
      if (entry.show) {
        expect(entry.name, "name").toBeTruthy();
        expect(entry.intro, "intro").toBeTruthy();
      }
    }
    expect(crew.length).toBe(crewEntries.filter((e) => e.show && e.name && e.intro).length);
  });
});

describe("IndexNow key file", () => {
  it("exists once and contains its own name", () => {
    const keyFiles = readdirSync(pub).filter((name) => /^[a-f0-9]{32}\.txt$/.test(name));
    expect(keyFiles).toHaveLength(1);
    expect(readFileSync(join(pub, keyFiles[0]!), "utf8").trim()).toBe(keyFiles[0]!.replace(/\.txt$/, ""));
  });
});
