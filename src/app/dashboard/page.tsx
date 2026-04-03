"use client";

import { useState } from "react";
import { useTransactions } from "@/context/TransactionsContext";

import BalanceCard from "@/components/BalanceCard";
import CategoryChart from "@/components/CategoryChart";
import TopCategories from "@/components/TopCategories";
import MonthlyComparison from "@/components/MonthlyComparison";
import AnimatedCard from "@/components/AnimatedCard";
import ExportDashboard from "@/components/ExportDashboard";
import IncomeExpenseBarChart from "@/components/IncomeExpenseBarChart";
import Insights from "@/components/Insights";

import DateFilter from "@/components/DateFilter";

export default function DashboardPage() {
  const { transactions } = useTransactions();

  const [month, setMonth] = useState(
    new Date().toISOString().slice(0, 7)
  );

  const [range, setRange] = useState<{
    start: string;
    end: string;
  } | null>(null);

  // 🔁 Manejo de filtros
  const handleFilter = (
    m: string,
    r: { start: string; end: string } | null
  ) => {
    setMonth(m);
    setRange(r);
  };

  // 🔎 Filtrado principal
  const filtered = transactions.filter((t) => {
    if (range) return t.date >= range.start && t.date <= range.end;
    if (month) return t.date.startsWith(month);
    return true;
  });

  // 💰 Cálculos
  const income = filtered
    .filter((t) => t.type === "income")
    .reduce((acc, t) => acc + t.amount, 0);

  const expense = filtered
    .filter((t) => t.type === "expense")
    .reduce((acc, t) => acc + t.amount, 0);

  const balance = income - expense;

  return (
    <div className="space-y-6">
      {/* 🔥 Title */}
      <h1 className="text-3xl font-bold">
        🔥 Dashboard PRO Fintech
      </h1>

      {/* 📅 Filtros */}
      <DateFilter onChange={handleFilter} />

      {/* 💰 Balance */}
      <AnimatedCard>
        <div className="grid md:grid-cols-3 gap-4">
          <BalanceCard
            title="Ingresos"
            amount={income}
            className="text-green-600"
          />

          <BalanceCard
            title="Gastos"
            amount={expense}
            className="text-red-500"
          />

          <BalanceCard
            title="Balance"
            amount={balance}
            className={
              balance >= 0 ? "text-green-600" : "text-red-500"
            }
          />
        </div>
      </AnimatedCard>

      {/* 🧠 Insights */}
      <Insights transactions={filtered} />

      {/* 📊 Gráficos principales */}
      <div className="grid md:grid-cols-2 gap-4">
        <AnimatedCard>
          <CategoryChart transactions={filtered} />
        </AnimatedCard>

        <AnimatedCard>
          <IncomeExpenseBarChart transactions={filtered} />
        </AnimatedCard>
      </div>

      {/* 🏆 Top categorías */}
      <AnimatedCard>
        <TopCategories transactions={filtered} top={5} />
      </AnimatedCard>

      {/* 📉 Comparación mensual (solo si NO hay rango) */}
      {!range && (
        <AnimatedCard>
          <MonthlyComparison transactions={filtered} />
        </AnimatedCard>
      )}

      {/* 📤 Export */}
      <AnimatedCard>
        <ExportDashboard transactions={filtered} />
      </AnimatedCard>
    </div>
  );
}