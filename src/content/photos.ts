// 사장님이 주신 실제 사진(2026-11-16). 편집본과 원본 번호는
// C:\Users\kevin\Desktop\바탕화면\AI\semi ochestra\.orchestra\out put\2026-11-16\EntourKorea_사진편집\README.md 에 있다.
// - 번호판 글자는 지웠고, 촬영 위치 정보(EXIF)는 없다. 없는 것을 그려 넣거나 배경을 바꾸지 않았다.
// - alt(대체 글)에는 사진에 실제로 보이는 것만 영어로 적는다.
// - 파일은 public/images/ 아래에 둔다(tests/assets.test.ts가 파일이 있는지 확인한다).
// - AI로 만든 그림은 풍경에만 쓰고 우리 차량·기사·손님처럼 보이게 쓰지 않는다(docs/decisions.md).
//   여기 있는 차량·장소 사진은 실제 사진이라 그 원칙과 충돌하지 않는다.

export interface Photo {
  src: string;
  alt: string;
  width: number;
  height: number;
  /** 사진 아래에 나오는 짧은 설명 */
  caption?: string;
}

// ── 실제 차량(스타리아). 두 상품 쪽의 "Your van"에 나온다.
export const vanPhotos: Photo[] = [
  {
    src: "/images/van/van-exterior-front-angle.webp",
    alt: "A black Hyundai Staria van parked, seen from the front corner",
    width: 2000,
    height: 1500,
    caption: "Outside",
  },
  {
    src: "/images/van/van-interior-rear-seats.webp",
    alt: "Inside the van: rows of black leather seats seen from the side door",
    width: 2000,
    height: 1333,
    caption: "Passenger seats",
  },
  {
    src: "/images/van/van-interior-front-cabin.webp",
    alt: "The front passenger seat and the centre console with cup holders",
    width: 2000,
    height: 1500,
    caption: "Front cabin",
  },
  {
    src: "/images/van/van-dashboard.webp",
    alt: "The driver's view of the steering wheel, instrument panel and centre screen",
    width: 2000,
    height: 1125,
    caption: "Dashboard",
  },
];

// ── 실제 장소. 사람이 없거나 아주 작게 나온 사진만.
export const placePhotos = {
  gyeonghoeru: {
    src: "/images/places/seoul-gyeonghoeru-pavilion.webp",
    alt: "Gyeonghoeru Pavilion standing over its pond at Gyeongbokgung Palace under a blue sky",
    width: 2400,
    height: 1350,
    caption: "Gyeonghoeru Pavilion, Gyeongbokgung Palace",
  },
  nSeoulTower: {
    src: "/images/places/seoul-n-tower.webp",
    alt: "N Seoul Tower rising above the trees on Namsan against a deep blue sky",
    width: 2000,
    height: 1333,
    caption: "N Seoul Tower on Namsan",
  },
  dumulmeori: {
    src: "/images/places/gyeonggi-dumulmeori-frame.webp",
    alt: "A large picture-frame photo spot on the riverbank at Dumulmeori, with calm water and hills behind",
    width: 2400,
    height: 1350,
    caption: "Dumulmeori, Yangpyeong",
  },
  namiIsland: {
    src: "/images/places/nami-island-sign.webp",
    alt: "Large red letters spelling NAMI ISLAND on a lawn in front of tall trees",
    width: 2400,
    height: 1350,
    caption: "Nami Island",
  },
} satisfies Record<string, Photo>;

export type PlacePhotoKey = keyof typeof placePhotos;

/** 홈 "What fits in 10 hours" 위에 나오는 사진 줄. 첫 화면 사진(site.heroImage)과 겹치지 않게 고른다. */
export const homePlaceStrip: PlacePhotoKey[] = ["nSeoulTower", "dumulmeori", "namiIsland"];

// ── 실제 손님 사진 — 2026-11-16 사장님 「손님 사진은 블러나 모자이크로 가려서 후기에 내보내 줘」로 켬.
// 얼굴이 보이는 사진은 얼굴(지나가는 사람 포함)을 모자이크+흐림으로 가린 편집본만 쓴다:
//   편집본 폴더 `손님_얼굴가림\`(원본 번호·가린 자리: `_작업\boxes.json`). 얼굴이 안 보이는 뒷모습은 `손님_뒷모습\`.
// 홈에 "Days out with our guests" 구역으로 나온다(src/components/Photos.tsx의 GuestMoments).
// 후기 글은 지어내지 않는다. 실제 후기를 받으면 따로 넣는다.
export const guestPhotos: { enabled: boolean; photos: Photo[] } = {
  enabled: true,
  photos: [
    {
      src: "/images/guests/guests-nami-island.webp",
      alt: "A family of four under the Nami Island sign among autumn trees, faces blurred",
      width: 1600,
      height: 1200,
    },
    {
      src: "/images/guests/guests-hanbok-gyeonghoeru.webp",
      alt: "Three guests in hanbok in front of Gyeonghoeru Pavilion and its pond, faces blurred",
      width: 1200,
      height: 1600,
    },
    {
      src: "/images/guests/guests-ginkgo-family.webp",
      alt: "A family of five on a path in front of a bright yellow ginkgo tree, faces blurred",
      width: 1200,
      height: 1600,
    },
    {
      src: "/images/guests/guests-bukchon-family.webp",
      alt: "A family of five in a hanok alley in Bukchon with N Seoul Tower far behind, faces blurred",
      width: 1600,
      height: 1200,
    },
    {
      src: "/images/guests/guests-hanbok-gyotaejeon.webp",
      alt: "Five guests in hanbok on the steps of a palace hall at Gyeongbokgung, faces blurred",
      width: 1200,
      height: 1600,
    },
    {
      src: "/images/guests/guests-pink-muhly.webp",
      alt: "Two guests in front of a field of pink muhly grass, faces blurred",
      width: 1600,
      height: 1200,
    },
    {
      src: "/images/guests/guests-garden-chairs.webp",
      alt: "Five guests seen from behind, sitting on colourful chairs and looking out over a garden pond",
      width: 2000,
      height: 1333,
    },
    {
      src: "/images/guests/guests-mother-child.webp",
      alt: "A woman and a child seen from behind, looking through a large glass window",
      width: 2000,
      height: 1333,
    },
    {
      src: "/images/guests/guests-hanbok-alley.webp",
      alt: "Guests in hanbok seen from behind, walking up a brick-paved alley",
      width: 1600,
      height: 2000,
    },
    {
      src: "/images/guests/guests-hanbok-pair.webp",
      alt: "Two guests in pink and blue hanbok seen from behind, walking down an alley",
      width: 1600,
      height: 2000,
    },
    {
      src: "/images/guests/guest-observatory.webp",
      alt: "A guest looking through a viewing telescope on an observation deck",
      width: 1600,
      height: 2000,
    },
    {
      src: "/images/guests/guest-forest-bridge.webp",
      alt: "A guest seen from behind on a footbridge among pine trees, taking a photo",
      width: 1600,
      height: 2000,
    },
  ],
};

/** 화면에 내보낼 손님 사진. 꺼져 있으면 빈 배열. */
export function visibleGuestPhotos(): Photo[] {
  return guestPhotos.enabled ? guestPhotos.photos : [];
}
