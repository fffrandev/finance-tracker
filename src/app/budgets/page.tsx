"use client";

import { useMemo, useState } from "react";
import { useBudgets } from "@/context/BudgetsContext";
import { useCategories } from "@/context/CategoriesContext";
import { useTransactions } from "@/context/TransactionsContext";

export default function BudgetsPage() {
  const { budgets, addBudget, deleteBudget } = useBudgets();
  const { categories } = useCategories();
  const { transactions } = useTransactions();

  const currentMonth = new Date().toISOString().slice(0, 7);
  const expenseCategories = useMemo(
    () => categories.filter((category) => category.type === "expense"),
    [categories]
  );

  const [form, setForm] = useState({
    categoryId: expenseCategories[0]?.id ?? "",
    amount: "",
    month: currentMonth,
  });

  const budgetRows = useMemo(() => {
    const categoryNameById = new Map(
      expenseCategories.map((category) => [category.id, category.name])
    );

    return [...budgets]
      .map((budget) => {
        const spent = transactions
          .filter(
            (transaction) =>
              transaction.type === "expense" &&
              transaction.category.id === budget.categoryId &&
              transaction.date.startsWith(budget.month)
          )
          .reduce((total, transaction) => total + transaction.amount, 0);

        return {
          ...budget,
          spent,
          remaining: budget.amount - spent,
          categoryName:
            categoryNameById.get(budget.categoryId) || "Categoría eliminada",
        };
      })
      .sort((a, b) => b.month.localeCompare(a.month));
  }, [budgets, expenseCategories, transactions]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const amount = Number(form.amount);
    if (!form.categoryId || !amount || !form.month) return;

    const created = addBudget({
      categoryId: form.categoryId,
      amount,
      month: form.month,
    });

    if (!created) return;

    setForm({
      categoryId: expenseCategories[0]?.id ?? "",
      amount: "",
      month: currentMonth,
    });
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Presupuestos</h1>

      <form
        onSubmit={handleSubmit}
        className="rounded-2xl bg-white p-5 text-black space-y-4"
      >
        <h2 className="font-semibold">Nuevo presupuesto</h2>

        <div className="grid gap-3 md:grid-cols-3">
          <select
            className="rounded border p-2"
            value={form.categoryId}
            onChange={(e) =>
              setForm((current) => ({
                ...current,
                categoryId: e.target.value,
              }))
            }
          >
            {expenseCategories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>

          <input
            type="number"
            min="1"
            className="rounded border p-2"
            placeholder="Monto"
            value={form.amount}
            onChange={(e) =>
              setForm((current) => ({
                ...current,
                amount: e.target.value,
              }))
            }
          />

          <input
            type="month"
            className="rounded border p-2"
            value={form.month}
            onChange={(e) =>
              setForm((current) => ({
                ...current,
                month: e.target.value,
              }))
            }
          />
        </div>

        <button
          type="submit"
          className="rounded bg-[#FFD600] px-4 py-2 font-semibold text-black"
        >
          Guardar presupuesto
        </button>
      </form>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {budgetRows.map((budget) => {
          const progress =
            budget.amount === 0 ? 0 : (budget.spent / budget.amount) * 100;
          const overBudget = budget.spent > budget.amount;

          return (
            <div
              key={budget.id}
              className="rounded-2xl bg-white p-5 text-black shadow-sm"
            >
              <p className="text-sm text-zinc-500">{budget.month}</p>
              <h2 className="mt-1 text-xl font-semibold">
                {budget.categoryName}
              </h2>

              <div className="mt-4 space-y-2">
                <p className="text-sm text-zinc-500">
                  Gastado: ${budget.spent.toLocaleString("es-AR")}
                </p>
                <p className="text-sm text-zinc-500">
                  Límite: ${budget.amount.toLocaleString("es-AR")}
                </p>
                <p
                  className={`text-sm font-semibold ${
                    overBudget ? "text-rose-500" : "text-emerald-600"
                  }`}
                >
                  {overBudget ? "Excedido" : "Disponible"}: $
                  {Math.abs(budget.remaining).toLocaleString("es-AR")}
                </p>
              </div>

              <div className="mt-4 h-2 overflow-hidden rounded-full bg-zinc-200">
                <div
                  className={`h-full rounded-full ${
                    overBudget ? "bg-rose-500" : "bg-[#FFD600]"
                  }`}
                  style={{ width: `${Math.min(progress, 100)}%` }}
                />
              </div>

              <button
                onClick={() => deleteBudget(budget.id)}
                className="mt-4 text-sm text-red-500"
              >
                Eliminar
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
