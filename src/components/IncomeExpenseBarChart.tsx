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
import TrendingUpIcon from "@mui/icons-material/TrendingUp";

type Props = {
  transactions: Transaction[];
};

function CustomTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: Array<{ value: number; name: string }>;
}) {
  if (active && payload && payload.length) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white p-3 rounded-lg shadow-lg"
        style={{ borderColor: '#dad4c8', border: '1px solid #dad4c8' }}
      >
        {payload.map((entry, index) => (
          <div
            key={index}
            className="text-sm font-semibold"
            style={{ color: entry.value > 0 ? "#078a52" : "#fc7981" }}
          >
            {entry.name}: {formatMoney(entry.value)}
          </div>
        ))}
      </motion.div>
    );
  }
  return null;
}

export default function IncomeExpenseBarChart({ transactions }: Props) {
  const data = useMemo(() => {
    const monthlyData: Record<
      string,
      { date: string; income: number; expense: number }
    > = {};

    transactions.forEach((t) => {
      const date = t.date.substring(0, 7);
      if (!monthlyData[date]) {
        monthlyData[date] = { date, income: 0, expense: 0 };
      }

      const amount = getTransactionBaseAmount(t);
      if (t.type === "income") {
        monthlyData[date].income += amount;
      } else {
        monthlyData[date].expense += amount;
      }
    });

    return Object.values(monthlyData)
      .sort((a, b) => a.date.localeCompare(b.date))
      .slice(-12);
  }, [transactions]);

  if (data.length === 0) {
    return null;
  }

  return (
    <motion.div
      className="glass p-6 rounded-3xl h-96 flex flex-col"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
    >
      <motion.div className="flex items-center gap-2 mb-6">
        <TrendingUpIcon className="text-[#078a52]" />
        <motion.h2
          className="font-black text-[20px] bg-gradient-to-r from-[#078a52] to-[#3bd3fd] bg-clip-text text-transparent uppercase tracking-widest"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          Flujo de dinero
        </motion.h2>
      </motion.div>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <defs>
            <linearGradient id="incomeGradientPro" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#078a52" stopOpacity={1} />
              <stop offset="100%" stopColor="#078a52" stopOpacity={0.3} />
            </linearGradient>
            <linearGradient id="expenseGradientPro" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#fc7981" stopOpacity={1} />
              <stop offset="100%" stopColor="#fc7981" stopOpacity={0.3} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(218, 212, 200, 0.4)" />
          <XAxis dataKey="date" stroke="#9f9b93" />
          <YAxis stroke="#9f9b93" />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="income" fill="url(#incomeGradientPro)" radius={[8, 8, 0, 0]} />
          <Bar dataKey="expense" fill="url(#expenseGradientPro)" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </motion.div>
  );
}
