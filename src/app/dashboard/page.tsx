"use client";

import { useState } from "react";
import { useTransactions } from "@/context/TransactionsContext";
import { useAccounts } from "@/context/AccountsContext";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";

import BalanceCard from "@/components/BalanceCard";
import CategoryChart from "@/components/CategoryChart";
import TopCategories from "@/components/TopCategories";
import AnimatedCard from "@/components/AnimatedCard";
import Insights from "@/components/Insights";
import AccountsSummary from "@/components/AccountsSummary";
import BudgetsOverview from "@/components/BudgetsOverview";
import DateFilter from "@/components/DateFilter";
import TransferModal from "@/components/TransferModal";
import { BASE_CURRENCY, formatMoney, getTransactionBaseAmount } from "@/utils/currency";
import { useSavingGoals } from "@/context/SavingGoalsContext";
import { getSavingGoalProgress } from "@/utils/finance";
import { useBudgets } from "@/context/BudgetsContext";
import { useCategories } from "@/context/CategoriesContext";
import Link from "next/link";

type DateRange = {
  start: string;
  end: string;
};

export default function DashboardPage() {
  const { transactions } = useTransactions();
  const { accounts } = useAccounts();
  const { savingGoals } = useSavingGoals();
  const { budgets } = useBudgets();
  const { categories } = useCategories();

  const [transferOpen, setTransferOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [month, setMonth] = useState(new Date().toISOString().slice(0, 7));
  const [range, setRange] = useState<DateRange | null>(null);

  const handleFilter = (m: string, r: DateRange | null) => {
    setMonth(m);
    setRange(r);
    setFilterOpen(false);
  };

  const filtered = transactions.filter((t) => {
    if (range) return t.date >= range.start && t.date <= range.end;
    if (month) return t.date.startsWith(month);
    return true;
  });

  const income = filtered
    .filter((t) => t.type === "income")
    .reduce((acc, t) => acc + getTransactionBaseAmount(t), 0);

  const expense = filtered
    .filter((t) => t.type === "expense")
    .reduce((acc, t) => acc + getTransactionBaseAmount(t), 0);

  const balance = income - expense;
  const expenseOnly = filtered.filter(
    (t) => t.type === "expense" && t.category.id !== "transfer"
  );

  return (
      <div className="space-y-8">
        <div className="flex items-center justify-between gap-4">
          <div>
          </div>
          <button
            onClick={() => setFilterOpen(!filterOpen)}
            className="flex h-11 w-11 items-center justify-center rounded-2xl border bg-white transition hover:translate-y-[-2px]"
            title="Filtro de fechas"
            style={{
              color: "#55534e",
              borderColor: "#dad4c8",
              boxShadow:
                "rgba(0,0,0,0.1) 0px 1px 1px, rgba(0,0,0,0.04) 0px -1px 1px inset, rgba(0,0,0,0.05) 0px -0.5px 1px",
            }}
          >
            <CalendarTodayIcon className="w-5 h-5" />
          </button>
        </div>

        {filterOpen && (
          <div
            className="animate-in slide-in-from-top rounded-[28px] border bg-white p-4 fade-in"
            style={{
              borderColor: "#dad4c8",
              boxShadow:
                "rgba(0,0,0,0.1) 0px 1px 1px, rgba(0,0,0,0.04) 0px -1px 1px inset, rgba(0,0,0,0.05) 0px -0.5px 1px",
            }}
          >
            <DateFilter onChange={handleFilter} />
          </div>
        )}

      <div
        className="space-y-5 rounded-[32px] border bg-white p-5"
        style={{
          borderColor: "#dad4c8",
          boxShadow:
            "rgba(0,0,0,0.1) 0px 1px 1px, rgba(0,0,0,0.04) 0px -1px 1px inset, rgba(0,0,0,0.05) 0px -0.5px 1px",
        }}
      >
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[1.08px] text-[#55534e]">
              Cuentas
            </p>
            <h2 className="mt-2 text-2xl font-semibold -tracking-[0.04em] text-black">
              Estado actual de tus saldos
            </h2>
          </div>
          <button
            onClick={() => setTransferOpen(true)}
            className="rounded-full border px-5 py-3 text-sm font-semibold text-black transition hover:translate-y-[-2px]"
            style={{
              backgroundColor: "#fbbd41",
              borderColor: "#000000",
              boxShadow:
                "rgba(0,0,0,0.1) 0px 1px 1px, rgba(0,0,0,0.04) 0px -1px 1px inset, rgba(0,0,0,0.05) 0px -0.5px 1px",
            }}
          >
            Transferir
          </button>
        </div>

        <AccountsSummary transactions={filtered} />
      </div>

      {month && (
        <BudgetsOverview 
          budgets={budgets.filter((b) => b.month === month)} 
          transactions={filtered} 
          categories={categories}
        />
      )}

      {/* BALANCE */}
      <div className="grid md:grid-cols-3 gap-4">
        <BalanceCard
          title="Ingresos"
          amount={income}
          currency={BASE_CURRENCY}
          tone="matcha"
        />
        <BalanceCard
          title="Gastos"
          amount={expense}
          currency={BASE_CURRENCY}
          tone="pomegranate"
        />
        <BalanceCard
          title="Balance"
          amount={balance}
          currency={BASE_CURRENCY}
          tone="lemon"
        />
      </div>

      {/* INSIGHTS */}
      <Insights transactions={filtered} />

      {/* CHARTS */}
      <div className="grid md:grid-cols-2 gap-4">
        <AnimatedCard>
          <CategoryChart transactions={expenseOnly} />
        </AnimatedCard>

        <AnimatedCard>
          <TopCategories transactions={expenseOnly} />
        </AnimatedCard>
      </div>

      {savingGoals.length > 0 && (
        <div
          className="space-y-5 rounded-[32px] border bg-white p-5"
          style={{
            borderColor: "#dad4c8",
            boxShadow:
              "rgba(0,0,0,0.1) 0px 1px 1px, rgba(0,0,0,0.04) 0px -1px 1px inset, rgba(0,0,0,0.05) 0px -0.5px 1px",
          }}
        >
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[1.08px] text-[#55534e]">
                Metas de ahorro
              </p>
              <h2 className="mt-2 text-2xl font-semibold -tracking-[0.04em] text-black">
                Seguimiento de objetivos
              </h2>
            </div>
            <Link
              href="/saving-goals"
              className="text-sm font-semibold transition hover:text-[#078a52]"
              style={{ color: "#55534e" }}
            >
              Ver todas →
            </Link>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {savingGoals.slice(0, 4).map((goal) => {
              const progress = getSavingGoalProgress(goal, accounts, transactions);
              return (
                <div
                  key={goal.id}
                  className="rounded-[24px] border p-4"
                  style={{
                    backgroundColor: "rgba(132, 231, 165, 0.15)",
                    borderColor: "#dad4c8",
                  }}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="font-semibold text-black">{goal.name}</p>
                      <p className="mt-1 text-sm text-[#55534e]">
                        {goal.currency} · vence {goal.targetDate}
                      </p>
                    </div>
                    <p className="text-sm font-semibold text-[#55534e]">
                      {progress.progress.toFixed(0)}%
                    </p>
                  </div>
                  <div className="mt-3 h-2 rounded-full bg-[#dad4c8]">
                    <div
                      className="h-2 rounded-full bg-[#078a52]"
                      style={{ width: `${progress.progress}%` }}
                    />
                  </div>
                  <p className="mt-3 text-sm text-[#55534e]">
                    {formatMoney(progress.currentAmount, goal.currency)} de {formatMoney(goal.targetAmount, goal.currency)}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <TransferModal
        open={transferOpen}
        onClose={() => setTransferOpen(false)}
      />
    </div>
  );
}
