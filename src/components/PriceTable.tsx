import { vehicles } from "@/content/services";
import type { PriceRule } from "@/content/types";
import { priceText } from "@/lib/pricing";

// 예전 값 표(서비스 × 차량). 지금은 숨긴 /guide-tour 쪽에서만 쓴다. 두 상품의 값은 ProductMatrix.tsx(네 칸 표)가 그린다.
// 확정되지 않은 값(draft 포함)은 priceText가 "Quote on request"로 바꿔 보여 준다.

function vehicleNames(rule: PriceRule): string {
  if (rule.vehicles.length === 0) return "No van (add one if needed)";
  return rule.vehicles.map((id) => vehicles.find((v) => v.id === id)?.name ?? id).join(" / ");
}

export function PriceTable({ rules, caption }: { rules: PriceRule[]; caption: string }) {
  return (
    <div className="overflow-x-auto rounded-md border border-line bg-surface">
      <table className="w-full min-w-[560px] border-collapse text-left text-sm">
        <caption className="sr-only">{caption}</caption>
        <thead className="bg-paper text-xs text-muted">
          <tr>
            <th scope="col" className="px-4 py-2.5 font-semibold">What you book</th>
            <th scope="col" className="px-4 py-2.5 font-semibold">Vehicle</th>
            <th scope="col" className="px-4 py-2.5 font-semibold">Price per group</th>
          </tr>
        </thead>
        <tbody>
          {rules.map((r) => (
            <tr key={`${r.service}-${r.region}-${r.unit}-${r.vehicles.join("+")}`} className="border-t border-line">
              <th scope="row" className="px-4 py-3 font-medium">
                {r.label}
                {r.note ? <span className="block text-xs font-normal text-muted">{r.note}</span> : null}
              </th>
              <td className="px-4 py-3 text-muted">{vehicleNames(r)}</td>
              <td className="px-4 py-3 font-semibold tabular-nums">{priceText(r)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
