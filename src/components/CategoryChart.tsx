"use client";

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { Transaction } from "@/types/transaction";

type Props = {
  transactions: Transaction[];
};

const COLORS = ["#4ade80", "#f87171", "#60a5fa", "#facc15", "#a78bfa", "#f97316"];

export default function CategoryChart({ transactions }: Props) {
  // Agrupar monto por categoría
  const data = Object.values(
    transactions.reduce(
      (acc: Record<string, { name: string; value: number }>, t) => {
      const key = t.category.id;
      const current = acc[key] || { name: t.category.name, value: 0 };
      acc[key] = {
        name: t.category.name,
        value: current.value + t.amount,
      };
      return acc;
    }, {})
  );

  return (
    <div className="bg-white p-5 rounded-2xl shadow h-64">
      <h2 className="text-gray-500 mb-2">Por categoría</h2>
      {data.length === 0 ? (
        <p className="text-gray-400">Sin transacciones</p>
      ) : (
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              outerRadius={80}
              fill="#8884d8"
              label
            >
              {data.map((_, index) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
