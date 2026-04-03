"use client";

import { useState } from "react";

export function useDateFilter() {
  const [month, setMonth] = useState<string>(new Date().toISOString().slice(0, 7)); // YYYY-MM
  const [range, setRange] = useState<{ start: string; end: string } | null>(null);

  const selectMonth = (newMonth: string) => {
    setMonth(newMonth);
    setRange(null);
  };

  const selectRange = (start: string, end: string) => {
    setRange({ start, end });
  };

  return { month, range, selectMonth, selectRange };
}