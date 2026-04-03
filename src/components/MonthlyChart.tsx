"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";
import { Transaction } from "@/types/transaction";
import { useMemo } from "react";
import CustomTooltip from "./CustomTooltip";

type Props = {
  transactions: Transaction[];
};

export default function MonthlyChart({ transactions }: Props) {
  const data = useMemo(() => {
    const map: Record<string, { income: number; expense: number }> = {};

    transactions.forEach((t) => {
      const month = t.date.slice(0, 7);
      if (!map[month]) map[month] = { income: 0, expense: 0 };

      if (t.type === "income") map[month].income += t.amount;
      else map[month].expense += t.amount;
    });

    return Object.entries(map).map(([month, value]) => ({
      month,
      ...value,
    }));
  }, [transactions]);

  return (
    <div className="bg-white p-5 rounded-2xl shadow h-64">
      <h2 className="text-gray-500 mb-2">📈 Evolución mensual</h2>

      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip content={<CustomTooltip />} />
          <Legend />

          <Line
            type="monotone"
            dataKey="income"
            stroke="#22c55e"
            strokeWidth={3}
            dot={{ r: 4 }}
            activeDot={{ r: 7 }}
            animationDuration={400}
          />

          <Line
            type="monotone"
            dataKey="expense"
            stroke="#ef4444"
            strokeWidth={3}
            dot={{ r: 4 }}
            activeDot={{ r: 7 }}
            animationDuration={400}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}