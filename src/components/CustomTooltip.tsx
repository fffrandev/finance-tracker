"use client";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
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
    <div className="bg-white border rounded-xl shadow-lg p-3" style={{ borderColor: '#dad4c8' }}>
      <p className="font-semibold mb-1 text-black">{label}</p>

      {payload.map((p) => (
        <div
          key={p.dataKey}
          className={`text-sm flex justify-between gap-4 ${
            p.dataKey === "income" ? "text-[#078a52]" : "text-[#fc7981]"
          }`}
        >
          <span className="flex items-center gap-1">
            {p.dataKey === "income" ? (
              <>
                <AttachMoneyIcon className="text-xs w-4 h-4" />
                Ingresos
              </>
            ) : (
              <>
                <TrendingDownIcon className="text-xs w-4 h-4" />
                Gastos
              </>
            )}
          </span>
          <span>${p.value.toLocaleString()}</span>
        </div>
      ))}
    </div>
  );
}
