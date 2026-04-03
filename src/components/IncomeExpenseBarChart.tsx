"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  Cell,
} from "recharts";
import { Transaction } from "@/types/transaction";
import { useMemo } from "react";
import CustomTooltip from "./CustomTooltip";

type Props = {
  transactions: Transaction[];
};

export default function IncomeExpenseBarChart({ transactions }: Props) {
  const data = useMemo(() => {
    const map: Record<string, { income: number; expense: number }> = {};

    // 🧠 Agrupación inteligente
    const useWeekly = transactions.length > 20;

    transactions.forEach((t) => {
      let key = t.date;

      if (useWeekly) {
        const week = Math.ceil(new Date(t.date).getDate() / 7);
        key = `${t.date.slice(0, 7)}-W${week}`;
      }

      if (!map[key]) map[key] = { income: 0, expense: 0 };

      if (t.type === "income") map[key].income += t.amount;
      else map[key].expense += t.amount;
    });

    return Object.entries(map).map(([date, value]) => ({
      date,
      ...value,
    }));
  }, [transactions]);

  // 🔥 detectar pico de gasto
  const maxExpense = Math.max(...data.map(d => d.expense || 0));

  return (
    <div className="bg-white p-5 rounded-2xl shadow h-64">
      <h2 className="text-gray-500 mb-2">📊 Flujo de dinero</h2>

      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <defs>
            <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#22c55e" stopOpacity={1} />
              <stop offset="100%" stopColor="#22c55e" stopOpacity={0.6} />
            </linearGradient>

            <linearGradient id="expenseGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ef4444" stopOpacity={1} />
              <stop offset="100%" stopColor="#ef4444" stopOpacity={0.6} />
            </linearGradient>
          </defs>

          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip content={<CustomTooltip />} />

          <Bar dataKey="income" fill="url(#incomeGradient)" radius={[6, 6, 0, 0]}>
            {data.map((entry, index) => (
              <Cell key={index} />
            ))}
          </Bar>

          <Bar dataKey="expense" fill="url(#expenseGradient)" radius={[6, 6, 0, 0]}>
            {data.map((entry, index) => (
              <Cell
                key={index}
                stroke={entry.expense === maxExpense ? "#000" : undefined}
                strokeWidth={entry.expense === maxExpense ? 2 : 0}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}