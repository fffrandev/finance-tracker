"use client";

import { useMemo } from "react";
import { useBudgets } from "@/context/BudgetsContext";
import { useCategories } from "@/context/CategoriesContext";
import { Transaction } from "@/types/transaction";

type Props = {
  transactions: Transaction[];
  month: string;
};

export default function BudgetsOverview({ transactions, month }: Props) {
  const { budgets } = useBudgets();
  const { categories } = useCategories();

  const rows = useMemo(() => {
    const categoryNameById = new Map(
      categories.map((category) => [category.id, category.name])
    );

    return budgets
      .filter((budget) => budget.month === month)
      .map((budget) => {
        const spent = transactions
          .filter(
            (transaction) =>
              transaction.type === "expense" &&
              transaction.category.id === budget.categoryId
          )
          .reduce((total, transaction) => total + transaction.amount, 0);

        return {
          ...budget,
          categoryName:
            categoryNameById.get(budget.categoryId) || "Categoría eliminada",
          spent,
          progress: budget.amount === 0 ? 0 : (spent / budget.amount) * 100,
        };
      })
      .sort((a, b) => b.progress - a.progress)
      .slice(0, 4);
  }, [budgets, categories, month, transactions]);

  if (rows.length === 0) return null;

  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-4 space-y-4">
      <div>
        <h2 className="text-xl text-white font-semibold">Presupuestos</h2>
      </div>

      <div className="space-y-4">
        {rows.map((row) => {
          const overBudget = row.spent > row.amount;

          return (
            <div key={row.id} className="space-y-2">
              <div className="flex items-center justify-between gap-3">
                <p className="font-medium text-[#FFD600]">{row.categoryName}</p>
                <p
                  className={`text-sm font-semibold ${
                    overBudget ? "text-rose-400" : "text-zinc-300"
                  }`}
                >
                  ${row.spent.toLocaleString("es-AR")} / $
                  {row.amount.toLocaleString("es-AR")}
                </p>
              </div>

              <div className="h-2 overflow-hidden rounded-full bg-zinc-800">
                <div
                  className={`h-full rounded-full ${
                    overBudget ? "bg-rose-500" : "bg-[#FFD600]"
                  }`}
                  style={{ width: `${Math.min(row.progress, 100)}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
