"use client";

import { useState } from "react";

type Props = {
  onChange: (
    month: string,
    range: { start: string; end: string } | null
  ) => void;
};

export default function DateFilter({ onChange }: Props) {
  const currentMonth = new Date().toISOString().slice(0, 7);

  const [mode, setMode] = useState<"month" | "range">("month");
  const [month, setMonth] = useState(currentMonth);
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");

  return (
    <div className="space-y-4">

      {/* TABS */}
      <div className="flex gap-2">
        <button
          onClick={() => {
            setMode("month");
            onChange(currentMonth, null);
          }}
          className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
            mode === "month"
              ? "bg-gradient-to-r from-[#fbbd41] to-[#f8cc65] text-black shadow-md"
              : "bg-[#faf9f7] text-black hover:bg-[#f0ebe3] border"
          }`}
          style={mode !== "month" ? { borderColor: '#dad4c8' } : {}}
        >
          Mes
        </button>

        <button
          onClick={() => setMode("range")}
          className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
            mode === "range"
              ? "bg-gradient-to-r from-[#fbbd41] to-[#f8cc65] text-black shadow-md"
              : "bg-[#faf9f7] text-black hover:bg-[#f0ebe3] border"
          }`}
          style={mode !== "range" ? { borderColor: '#dad4c8' } : {}}
        >
          Rango
        </button>
      </div>

      {/* INPUTS */}
      {mode === "month" ? (
        <input
          type="month"
          value={month}
          onChange={(e) => {
            setMonth(e.target.value);
            onChange(e.target.value, null);
          }}
          className="input"
        />
      ) : (
        <div className="flex gap-3 flex-wrap">
          <input
            type="date"
            onChange={(e) => setStart(e.target.value)}
            className="input flex-1"
          />

          <input
            type="date"
            onChange={(e) => setEnd(e.target.value)}
            className="input flex-1"
          />

          <button
            onClick={() => start && end && onChange("", { start, end })}
            className="btn btn-primary"
          >
            Aplicar
          </button>
        </div>
      )}
    </div>
  );
}
