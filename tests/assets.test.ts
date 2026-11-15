import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { crew } from "@/content/crew";
import { site } from "@/content/site";

// site.ts·crew.ts가 가리키는 사진·영상 파일이 public/에 실제로 있는지(빠뜨리고 배포하면 화면이 비어 보인다).
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
});

describe("crew photos", () => {
  it("every crew photo file exists", () => {
    for (const member of crew) {
      if (member.photo) expect(existsSync(join(pub, member.photo.src)), member.photo.src).toBe(true);
    }
  });
});

describe("IndexNow key file", () => {
  it("exists once and contains its own name", () => {
    const keyFiles = readdirSync(pub).filter((name) => /^[a-f0-9]{32}\.txt$/.test(name));
    expect(keyFiles).toHaveLength(1);
    expect(readFileSync(join(pub, keyFiles[0]!), "utf8").trim()).toBe(keyFiles[0]!.replace(/\.txt$/, ""));
  });
});
