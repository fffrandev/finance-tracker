"use client";

import { useMemo } from "react";
import {
  BarChart,
  Bar,
  Cell,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import { Transaction } from "@/types/transaction";
import { formatMoney, getTransactionBaseAmount } from "@/utils/currency";
import { motion } from "framer-motion";
import BarChartIcon from "@mui/icons-material/BarChart";

type Props = {
  transactions: Transaction[];
};

const CHART_COLORS = [
  "#078a52", // Matcha
  "#3bd3fd", // Slushie
  "#fbbd41", // Lemon
  "#43089f", // Ube
  "#fc7981", // Pomegranate
  "#01418d", // Blueberry
];

export default function TopCategories({ transactions }: Props) {
  const data = useMemo(() => {
    const expensesByCategory = Object.values(
      transactions
        .filter((t) => t.type === "expense")
        .reduce(
          (acc: Record<string, { name: string; value: number }>, t) => {
            const key = t.category.id;
            const current = acc[key] || {
              name: t.category.name,
              value: 0,
            };

            acc[key] = {
              name: t.category.name,
              value: current.value + getTransactionBaseAmount(t),
            };

            return acc;
          },
          {}
        )
    ).sort((a, b) => b.value - a.value);

    return expensesByCategory.slice(0, 6);
  }, [transactions]);

  if (data.length === 0) {
    return null;
  }

  return (
    <motion.div
      className="glass p-6 rounded-3xl h-96 flex flex-col"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div className="flex items-center gap-2 mb-6">
        <BarChartIcon className="text-[#078a52]" />
        <motion.h2
          className="font-black text-[20px] bg-gradient-to-r from-[#078a52] to-[#3bd3fd] bg-clip-text text-transparent uppercase tracking-widest"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          Top Categorías
        </motion.h2>
      </motion.div>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 5, right: 30, left: 100, bottom: 5 }}
        >
          <defs>
            <linearGradient id="topCategoriesGradient" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#2563eb" stopOpacity={1} />
              <stop offset="100%" stopColor="#06b6d4" stopOpacity={1} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(218, 212, 200, 0.3)" />
          <XAxis type="number" stroke="#9f9b93" />
          <YAxis type="category" dataKey="name" stroke="#9f9b93" width={95} />
          <Tooltip
            cursor={{ fill: "rgba(218, 212, 200, 0.1)" }}
            formatter={(value: number) => formatMoney(value)}
            contentStyle={{
              backgroundColor: "rgba(255, 255, 255, 0.95)",
              border: "2px solid #dad4c8",
              borderRadius: "12px",
              boxShadow: "rgba(0,0,0,0.1) 0px 1px 1px, rgba(0,0,0,0.04) 0px -1px 1px inset, rgba(0,0,0,0.05) 0px -0.5px 1px",
            }}
          />
          <Bar dataKey="value" fill="url(#topCategoriesGradient)" radius={[0, 12, 12, 0]}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </motion.div>
  );
}
