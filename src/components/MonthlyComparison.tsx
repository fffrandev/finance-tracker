"use client";

import { Transaction } from "@/types/transaction";
import { useMemo } from "react";
import { getTransactionBaseAmount } from "@/utils/currency";
import { motion } from "framer-motion";

type Props = {
  transactions: Transaction[];
};

export default function MonthlyComparison({ transactions }: Props) {
  const { changeIncome, changeExpense, changeBalance } = useMemo(() => {
    const now = new Date();
    const current = `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, "0")}`;
    const prevDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const prev = `${prevDate.getFullYear()}-${(prevDate.getMonth() + 1).toString().padStart(2, "0")}`;

    const sumByMonth = (month: string, type: "income" | "expense") =>
      transactions
        .filter((t) => t.date.startsWith(month) && t.type === type)
        .reduce((sum, t) => sum + getTransactionBaseAmount(t), 0);

    const currentIncome = sumByMonth(current, "income");
    const prevIncome = sumByMonth(prev, "income");
    const currentExpense = sumByMonth(current, "expense");
    const prevExpense = sumByMonth(prev, "expense");

    const currentBalance = currentIncome - currentExpense;
    const prevBalance = prevIncome - prevExpense;

    const percentChange = (currentVal: number, prevVal: number) =>
      prevVal === 0 ? 100 : ((currentVal - prevVal) / Math.abs(prevVal)) * 100;

    return {
      changeIncome: percentChange(currentIncome, prevIncome),
      changeExpense: percentChange(currentExpense, prevExpense),
      changeBalance: percentChange(currentBalance, prevBalance),
    };
  }, [transactions]);

  const format = (num: number) => (num >= 0 ? `+${num.toFixed(1)}%` : `${num.toFixed(1)}%`);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  return (
    <motion.div
      className="glass p-6 rounded-3xl"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.div className="flex items-center gap-2 mb-6">
        <TrendingUpIcon className="text-[#078a52]" />
        <motion.h2
          className="font-black text-[20px] bg-gradient-to-r from-[#078a52] to-[#3bd3fd] bg-clip-text text-transparent uppercase tracking-widest"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          Comparativa mensual
        </motion.h2>
      </motion.div>

      <motion.div className="grid grid-cols-3 gap-4" variants={containerVariants}>
        {/* Ingresos */}
        <motion.div
          variants={itemVariants}
          whileHover={{ scale: 1.05, y: -4 }}
          className="p-5 rounded-2xl bg-white border transition-all duration-300"
          style={{ borderColor: '#dad4c8' }}
        >
          <motion.div
            initial={{ rotate: -180 }}
            animate={{ rotate: 0 }}
            transition={{ duration: 0.8 }}
            className="text-lg mb-3"
          >
            📥
          </motion.div>
          <p className="text-xs font-bold text-[#078a52] uppercase tracking-widest">Ingresos</p>
          <motion.p
            className={`text-sm font-black mt-3 ${
              changeIncome >= 0 ? "text-[#078a52]" : "text-[#fc7981]"
            }`}
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            {format(changeIncome)}
          </motion.p>
          <motion.p
            className="text-xs mt-2 font-semibold"
            style={{ color: '#9f9b93' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            vs. mes anterior
          </motion.p>
        </motion.div>

        {/* Gastos */}
        <motion.div
          variants={itemVariants}
          whileHover={{ scale: 1.05, y: -4 }}
          className="p-5 rounded-2xl bg-white border transition-all duration-300"
          style={{ borderColor: '#dad4c8' }}
        >
          <motion.div
            initial={{ rotate: 180 }}
            animate={{ rotate: 0 }}
            transition={{ duration: 0.8 }}
            className="text-lg mb-3"
          >
            📤
          </motion.div>
          <p className="text-xs font-bold text-[#fbbd41] uppercase tracking-widest">Gastos</p>
          <motion.p
            className={`text-sm font-black mt-3 ${
              changeExpense < 0 ? "text-[#078a52]" : "text-[#fc7981]"
            }`}
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            {format(changeExpense)}
          </motion.p>
          <motion.p
            className="text-xs mt-2 font-semibold"
            style={{ color: '#9f9b93' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            vs. mes anterior
          </motion.p>
        </motion.div>

        {/* Balance */}
        <motion.div
          variants={itemVariants}
          whileHover={{ scale: 1.05, y: -4 }}
          className="p-5 rounded-2xl bg-white border transition-all duration-300"
          style={{ borderColor: '#dad4c8' }}
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.8 }}
            className="text-lg mb-3"
          >
            ⚖️
          </motion.div>
          <p className="text-xs font-bold text-[#01418d] uppercase tracking-widest">Balance</p>
          <motion.p
            className={`text-sm font-black mt-3 ${
              changeBalance >= 0 ? "text-[#078a52]" : "text-[#fc7981]"
            }`}
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            {format(changeBalance)}
          </motion.p>
          <motion.p
            className="text-xs mt-2 font-semibold"
            style={{ color: '#9f9b93' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            vs. mes anterior
          </motion.p>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
