"use client";

import { Transaction } from "@/types/transaction";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useMemo } from "react";

type Props = {
  transactions: Transaction[];
  top?: number;
};

export default function TopCategories({ transactions, top = 5 }: Props) {
  const data = useMemo(() => {
    const map: Record<string, { name: string; value: number }> = {};

    transactions.forEach(t => {
      const key = t.category.id;
      const current = map[key] || { name: t.category.name, value: 0 };
      map[key] = {
        name: t.category.name,
        value: current.value + t.amount,
      };
    });

    return Object.values(map)
      .sort((a, b) => b.value - a.value)
      .slice(0, top);
  }, [transactions, top]);

  return (
    <div className="bg-white p-5 rounded-2xl shadow h-64">
      <h2 className="text-gray-500 mb-2">Top {top} categorías</h2>
      {data.length === 0 ? (
        <p className="text-gray-400">Sin transacciones</p>
      ) : (
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" />
            <YAxis type="category" dataKey="name" width={100} />
            <Tooltip formatter={(value: number) => `$${value.toLocaleString()}`} />
            <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
