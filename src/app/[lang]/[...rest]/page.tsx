import { notFound } from "next/navigation";

// 없는 주소를 모두 이곳으로 받아 언어에 맞는 404 쪽(app/[lang]/not-found.tsx)을 보여 준다.
export default function CatchAll() {
  notFound();
}
