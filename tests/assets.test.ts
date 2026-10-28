import { existsSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { site } from "@/content/site";

// site.ts가 가리키는 메인 사진·영상 파일이 public/에 실제로 있는지(빠뜨리고 배포하면 첫 화면이 비어 보인다).
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
