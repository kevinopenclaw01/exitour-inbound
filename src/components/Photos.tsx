import Image from "next/image";
import { homePlaceStrip, placePhotos, vanPhotos, visibleGuestPhotos, type Photo, type PlacePhotoKey } from "@/content/photos";

// 실제 사진을 보여 주는 조각들. 사진 자료는 src/content/photos.ts 한 곳에 있다.

export function PhotoFigure({
  photo,
  ratio = "aspect-[4/3]",
  sizes,
  showCaption = true,
}: {
  photo: Photo;
  ratio?: string;
  sizes: string;
  showCaption?: boolean;
}) {
  return (
    <figure className="grid content-start gap-1.5">
      <div className={`relative ${ratio} overflow-hidden rounded-md bg-paper`}>
        <Image src={photo.src} alt={photo.alt} fill sizes={sizes} className="object-cover" />
      </div>
      {showCaption && photo.caption ? <figcaption className="text-xs text-muted">{photo.caption}</figcaption> : null}
    </figure>
  );
}

/** 실제 차량 사진. 두 상품 쪽의 "Your van"에 나온다. */
export function VanGallery() {
  if (vanPhotos.length === 0) return null;
  return (
    <div className="grid gap-2">
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {vanPhotos.map((photo) => (
          <PhotoFigure key={photo.src} photo={photo} sizes="(min-width: 1024px) 230px, 50vw" />
        ))}
      </div>
      <p className="text-xs text-muted">Photos of our van. The number plate is covered.</p>
    </div>
  );
}

/** 하루 예시에 붙는 장소 사진(있는 것만). */
export function PlacePhotoRow({ keys, sizes = "(min-width: 640px) 400px, 100vw" }: { keys: PlacePhotoKey[]; sizes?: string }) {
  if (keys.length === 0) return null;
  return (
    <div className={`grid gap-3 ${keys.length > 1 ? "sm:grid-cols-2" : ""}`}>
      {keys.map((key) => (
        <PhotoFigure key={key} photo={placePhotos[key]} ratio="aspect-[16/9]" sizes={sizes} />
      ))}
    </div>
  );
}

/** 홈의 장소 사진 줄. */
export function HomePlaceStrip() {
  if (homePlaceStrip.length === 0) return null;
  return (
    <div className="grid grid-cols-3 gap-2 sm:gap-4">
      {homePlaceStrip.map((key) => (
        <PhotoFigure key={key} photo={placePhotos[key]} ratio="aspect-[3/2]" sizes="(min-width: 1024px) 320px, 33vw" />
      ))}
    </div>
  );
}

/** 손님 뒷모습 사진 구역. src/content/photos.ts의 guestPhotos.enabled가 꺼져 있으면 아무것도 나오지 않는다. */
export function GuestMoments() {
  const photos = visibleGuestPhotos();
  if (photos.length === 0) return null;
  return (
    <section className="grid gap-4">
      <div>
        <h2 className="text-2xl font-bold">Days out with our guests</h2>
        <p className="mt-1 text-muted">Shared with our guests&apos; permission.</p>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {photos.map((photo) => (
          <PhotoFigure key={photo.src} photo={photo} sizes="(min-width: 640px) 320px, 50vw" showCaption={false} />
        ))}
      </div>
    </section>
  );
}
