"use client";

import { useState } from "react";

type Props = {
  onChange: (
    month: string,
    range: { start: string; end: string } | null
  ) => void;
};

type Mode = "month" | "range";

export default function DateFilter({ onChange }: Props) {
  const currentMonth = new Date().toISOString().slice(0, 7);

  const [mode, setMode] = useState<Mode>("month");

  const [month, setMonth] = useState(currentMonth);
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");

  // 🔁 Cambiar a modo MES
  const handleModeMonth = () => {
    setMode("month");
    setStart("");
    setEnd("");
    setMonth(currentMonth);
    onChange(currentMonth, null);
  };

  // 🔁 Cambiar a modo RANGO
  const handleModeRange = () => {
    setMode("range");
    setMonth("");
    onChange("", null);
  };

  // 📅 Cambio de mes
  const handleMonthChange = (value: string) => {
    setMonth(value);
    onChange(value, null);
  };

  // 📊 Aplicar rango
  const handleApplyRange = () => {
    if (start && end) {
      onChange("", { start, end });
    }
  };

  return (
    <div className="bg-white p-4 rounded-2xl shadow space-y-4">
      
      {/* 🔥 Tabs */}
      <div className="flex gap-2">
        <button
          onClick={handleModeMonth}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
            mode === "month"
              ? "bg-blue-600 text-white"
              : "bg-gray-100 hover:bg-gray-200"
          }`}
        >
          Mes
        </button>

        <button
          onClick={handleModeRange}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
            mode === "range"
              ? "bg-blue-600 text-white"
              : "bg-gray-100 hover:bg-gray-200"
          }`}
        >
          Rango
        </button>
      </div>

      {/* 📅 MODO MES */}
      {mode === "month" && (
        <div>
          <label className="text-sm text-gray-500">Seleccionar mes</label>
          <input
            type="month"
            value={month}
            onChange={(e) => handleMonthChange(e.target.value)}
            className="border rounded px-3 py-2 mt-1 block"
          />
        </div>
      )}

      {/* 📊 MODO RANGO */}
      {mode === "range" && (
        <div className="flex flex-wrap gap-3 items-end">
          <div>
            <label className="text-sm text-gray-500">Desde</label>
            <input
              type="date"
              value={start}
              onChange={(e) => setStart(e.target.value)}
              className="border rounded px-3 py-2 block"
            />
          </div>

          <div>
            <label className="text-sm text-gray-500">Hasta</label>
            <input
              type="date"
              value={end}
              onChange={(e) => setEnd(e.target.value)}
              className="border rounded px-3 py-2 block"
            />
          </div>

          <button
            onClick={handleApplyRange}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            Aplicar
          </button>
        </div>
      )}
    </div>
  );
}