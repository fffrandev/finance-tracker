"use client";

import { useMemo } from "react";
import { Budget } from "@/types/budget";
import { Category } from "@/types/category";
import { Transaction } from "@/types/transaction";
import { formatMoney, getTransactionBaseAmount } from "@/utils/currency";
import { motion } from "framer-motion";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import CreditCardIcon from "@mui/icons-material/CreditCard";

type Props = {
  budgets: Budget[];
  transactions: Transaction[];
  categories: Category[];
};

export default function BudgetsOverview({ budgets = [], transactions = [], categories = [] }: Props) {
  if (!budgets || budgets.length === 0) {
    return (
      <div className="rounded-3xl border-2 bg-white p-6 text-center" style={{ borderColor: '#dad4c8' }}>
        <p className="text-black font-medium">No hay presupuestos creados aún</p>
      </div>
    );
  }
  const getBudgetAlertTone = (alertLevel: "none" | "warning" | "critical") => {
    const tones: Record<string, string> = {
      none: "bg-[#078a52] text-white",
      warning: "bg-[#fbbd41] text-black",
      critical: "bg-[#fc7981] text-white",
    };

    return tones[alertLevel];
  };

  const getBudgetAlertLabel = (alertLevel: "none" | "warning" | "critical") => {
    const labels: Record<string, string> = {
      none: "En control",
      warning: "Advertencia",
      critical: "Crítico",
    };

    return labels[alertLevel];
  };

  const rows = useMemo(() => {
    return budgets.map((budget) => {
      const spent = transactions
        .filter((t) => t.type === "expense" && t.categoryId === budget.categoryId)
        .reduce((sum, t) => sum + getTransactionBaseAmount(t), 0);

      const category = categories.find((c) => c.id === budget.categoryId);

      let alertLevel: "none" | "warning" | "critical" = "none";
      const progress = (spent / budget.amount) * 100;

      if (progress >= 100) {
        alertLevel = "critical";
      } else if (progress >= 80) {
        alertLevel = "warning";
      }

      return {
        id: budget.id,
        categoryName: category?.name ?? "Unknown",
        amount: budget.amount,
        spent,
        progress,
        alertLevel,
      };
    });
  }, [budgets, transactions, categories]);

  if (rows.length === 0) return null;

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
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.3 } },
  };

  return (
    <motion.div
      className="glass rounded-3xl p-6 space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <h2 className="text-[20px] font-black bg-gradient-to-r from-[#078a52] to-[#3bd3fd] bg-clip-text text-transparent">
          Presupuestos
        </h2>
      </motion.div>

      <motion.div className="space-y-5" variants={containerVariants}>
        {rows.map((row, idx) => {
          const overBudget = row.spent > row.amount;
          const percentageUsed = (row.spent / row.amount) * 100;

          return (
            <motion.div
              key={row.id}
              variants={itemVariants}
              whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
              className="space-y-3 p-4 rounded-2xl bg-white border transition-all duration-300"
              style={{ borderColor: '#dad4c8' }}
            >
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity }}
                  >
                    <CreditCardIcon className="text-[#078a52]" />
                  </motion.div>
                  <div>
                    <p className="font-bold text-black">{row.categoryName}</p>
                    {row.alertLevel !== "none" && (
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${getBudgetAlertTone(
                          row.alertLevel
                        )}`}
                      >
                        {getBudgetAlertLabel(row.alertLevel)}
                      </motion.span>
                    )}
                  </div>
                </div>
                <motion.p
                  className={`text-sm font-bold ${
                    overBudget ? "text-[#fc7981]" : "text-[#078a52]"
                  }`}
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  {formatMoney(row.spent)} / {formatMoney(row.amount)}
                </motion.p>
              </div>

              {/* Progress bar mejorada */}
              <div className="h-3 overflow-hidden rounded-full bg-[#faf9f7] border" style={{ borderColor: '#dad4c8' }}>
                <motion.div
                  className={`h-full rounded-full transition-all ${
                    overBudget
                      ? "bg-gradient-to-r from-[#fc7981] to-[#fc4a5a]"
                      : "bg-gradient-to-r from-[#078a52] to-[#3bd3fd]"
                  }`}
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(percentageUsed, 100)}%` }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                />
              </div>

              {/* Porcentaje */}
              <motion.div
                className="flex justify-between items-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <span className="text-xs text-black font-semibold">
                  {percentageUsed.toFixed(1)}% utilizado
                </span>
                <span className="text-xs" style={{ color: '#9f9b93' }}>
                  {formatMoney(row.amount - row.spent)} disponible
                </span>
              </motion.div>
            </motion.div>
          );
        })}
      </motion.div>
    </motion.div>
  );
}
