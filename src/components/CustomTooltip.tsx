"use client";

type TooltipPayloadItem = {
  dataKey: string;
  value: number;
};

type Props = {
  active?: boolean;
  payload?: TooltipPayloadItem[];
  label?: string;
};

export default function CustomTooltip({ active, payload, label }: Props) {
  if (!active || !payload || payload.length === 0) return null;

  return (
    <div className="bg-white border rounded-xl shadow-lg p-3">
      <p className="font-semibold mb-1">{label}</p>

      {payload.map((p) => (
        <div
          key={p.dataKey}
          className={`text-sm flex justify-between gap-4 ${
            p.dataKey === "income" ? "text-green-600" : "text-red-500"
          }`}
        >
          <span>
            {p.dataKey === "income" ? "💰 Ingresos" : "💸 Gastos"}
          </span>
          <span>${p.value.toLocaleString()}</span>
        </div>
      ))}
    </div>
  );
}
