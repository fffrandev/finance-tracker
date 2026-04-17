"use client";

import { useMemo, useState } from "react";
import Papa from "papaparse";
import DateFilter from "@/components/DateFilter";
import { useAccounts } from "@/context/AccountsContext";
import { useTransactions } from "@/context/TransactionsContext";
import { BASE_CURRENCY, formatMoney, getTransactionBaseAmount } from "@/utils/currency";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import DownloadRoundedIcon from "@mui/icons-material/DownloadRounded";
import InsightsRoundedIcon from "@mui/icons-material/InsightsRounded";
import TrendingDownRoundedIcon from "@mui/icons-material/TrendingDownRounded";
import TrendingUpRoundedIcon from "@mui/icons-material/TrendingUpRounded";
import WalletRoundedIcon from "@mui/icons-material/WalletRounded";

type DateRange = {
  start: string;
  end: string;
};

type PreviousWindow =
  | { month: string }
  | { start: string; end: string };

type Finding = {
  title: string;
  text: string;
  tone: "green" | "gold" | "blue";
};

export default function ReportsPage() {
  const { transactions } = useTransactions();
  const { accounts } = useAccounts();

  const [month, setMonth] = useState(new Date().toISOString().slice(0, 7));
  const [range, setRange] = useState<DateRange | null>(null);
  const [filterOpen, setFilterOpen] = useState(false);

  const filtered = useMemo(() => {
    return transactions.filter((transaction) => {
      if (range) {
        return transaction.date >= range.start && transaction.date <= range.end;
      }

      if (month) return transaction.date.startsWith(month);
      return true;
    });
  }, [month, range, transactions]);

  const expenseTransactions = useMemo(
    () =>
      filtered.filter(
        (transaction) =>
          transaction.type === "expense" && transaction.category.id !== "transfer"
      ),
    [filtered]
  );

  const incomeTransactions = useMemo(
    () =>
      filtered.filter(
        (transaction) =>
          transaction.type === "income" && transaction.category.id !== "transfer"
      ),
    [filtered]
  );

  const income = incomeTransactions.reduce(
    (total, transaction) => total + getTransactionBaseAmount(transaction),
    0
  );
  const expense = expenseTransactions.reduce(
    (total, transaction) => total + getTransactionBaseAmount(transaction),
    0
  );
  const balance = income - expense;
  const savingsRate = income > 0 ? (balance / income) * 100 : 0;

  const previousWindow = useMemo<PreviousWindow | null>(() => {
    if (range) {
      const start = new Date(range.start);
      const end = new Date(range.end);
      const duration =
        Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;

      const previousEnd = new Date(start);
      previousEnd.setDate(previousEnd.getDate() - 1);

      const previousStart = new Date(previousEnd);
      previousStart.setDate(previousStart.getDate() - (duration - 1));

      return {
        start: previousStart.toISOString().slice(0, 10),
        end: previousEnd.toISOString().slice(0, 10),
      };
    }

    if (!month) return null;

    const [year, monthNumber] = month.split("-").map(Number);
    const currentDate = new Date(year, monthNumber - 1, 1);
    const previousDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() - 1,
      1
    );

    return {
      month: `${previousDate.getFullYear()}-${String(
        previousDate.getMonth() + 1
      ).padStart(2, "0")}`,
    };
  }, [month, range]);

  const previousTransactions = useMemo(() => {
    if (!previousWindow) return [];

    return transactions.filter((transaction) => {
      if ("month" in previousWindow) {
        return transaction.date.startsWith(previousWindow.month);
      }

      return (
        transaction.date >= previousWindow.start &&
        transaction.date <= previousWindow.end
      );
    });
  }, [previousWindow, transactions]);

  const previousIncome = previousTransactions
    .filter(
      (transaction) =>
        transaction.type === "income" && transaction.category.id !== "transfer"
    )
    .reduce((total, transaction) => total + getTransactionBaseAmount(transaction), 0);

  const previousExpense = previousTransactions
    .filter(
      (transaction) =>
        transaction.type === "expense" && transaction.category.id !== "transfer"
    )
    .reduce((total, transaction) => total + getTransactionBaseAmount(transaction), 0);

  const previousBalance = previousIncome - previousExpense;

  const topCategories = useMemo(() => {
    const map = new Map<
      string,
      { name: string; amount: number; share: number; count: number }
    >();

    expenseTransactions.forEach((transaction) => {
      const current = map.get(transaction.category.id) ?? {
        name: transaction.category.name,
        amount: 0,
        share: 0,
        count: 0,
      };

      map.set(transaction.category.id, {
        name: transaction.category.name,
        amount: current.amount + getTransactionBaseAmount(transaction),
        share: 0,
        count: current.count + 1,
      });
    });

    return Array.from(map.values())
      .map((category) => ({
        ...category,
        share: expense > 0 ? (category.amount / expense) * 100 : 0,
      }))
      .sort((a, b) => b.amount - a.amount);
  }, [expense, expenseTransactions]);

  const accountBreakdown = useMemo(() => {
    return accounts
      .map((account) => {
        const accountTransactions = filtered.filter(
          (transaction) => transaction.accountId === account.id
        );

        const incomeTotal = accountTransactions
          .filter(
            (transaction) =>
              transaction.type === "income" && transaction.category.id !== "transfer"
          )
          .reduce((total, transaction) => total + getTransactionBaseAmount(transaction), 0);

        const expenseTotal = accountTransactions
          .filter(
            (transaction) =>
              transaction.type === "expense" && transaction.category.id !== "transfer"
          )
          .reduce((total, transaction) => total + getTransactionBaseAmount(transaction), 0);

        const movementCount = accountTransactions.length;

        return {
          id: account.id,
          name: account.name,
          income: incomeTotal,
          expense: expenseTotal,
          balance: incomeTotal - expenseTotal,
          movementCount,
        };
      })
      .sort((a, b) => b.balance - a.balance);
  }, [accounts, filtered]);

  const monthlyTrend = useMemo(() => {
    const map = new Map<string, { income: number; expense: number }>();

    transactions.forEach((transaction) => {
      const currentMonth = transaction.date.slice(0, 7);
      const current = map.get(currentMonth) ?? { income: 0, expense: 0 };

      if (transaction.type === "income" && transaction.category.id !== "transfer") {
        current.income += getTransactionBaseAmount(transaction);
      }

      if (transaction.type === "expense" && transaction.category.id !== "transfer") {
        current.expense += getTransactionBaseAmount(transaction);
      }

      map.set(currentMonth, current);
    });

    return Array.from(map.entries())
      .map(([label, values]) => ({
        label,
        income: values.income,
        expense: values.expense,
        balance: values.income - values.expense,
      }))
      .sort((a, b) => b.label.localeCompare(a.label))
      .slice(0, 6);
  }, [transactions]);

  const averageExpenseTicket =
    expenseTransactions.length > 0 ? expense / expenseTransactions.length : 0;
  const averageIncomeTicket =
    incomeTransactions.length > 0 ? income / incomeTransactions.length : 0;

  const biggestExpense = [...expenseTransactions].sort(
    (a, b) => getTransactionBaseAmount(b) - getTransactionBaseAmount(a)
  )[0];

  const findings: Finding[] = [
    {
      title: "Resultado neto",
      text:
        balance >= 0
          ? `Cerraste el período con superávit de ${formatMoney(balance, BASE_CURRENCY)}.`
          : `Cerraste el período con déficit de ${formatMoney(
              Math.abs(balance),
              BASE_CURRENCY
            )}.`,
      tone: "green",
    },
    {
      title: "Peso de la categoría principal",
      text: topCategories[0]
        ? `${topCategories[0].name} explicó el ${topCategories[0].share.toFixed(
            1
          )}% del gasto.`
        : "Todavía no hay gasto suficiente para identificar una categoría dominante.",
      tone: "gold",
    },
    {
      title: "Comparación contra el período anterior",
      text:
        previousWindow && previousExpense > 0
          ? `Tus gastos variaron ${formatDelta(
              percentChange(expense, previousExpense)
            )} frente al período anterior.`
          : "Todavía no hay un período comparable anterior con gastos registrados.",
      tone: "blue",
    },
  ];

  const exportCsv = () => {
    const csv = Papa.unparse(
      filtered.map((transaction) => ({
        fecha: transaction.date,
        tipo: transaction.type,
        categoria: transaction.category.name,
        cuenta:
          accounts.find((account) => account.id === transaction.accountId)?.name ||
          transaction.accountId,
        descripcion: transaction.description,
        monto: transaction.amount,
        moneda: transaction.currency,
        monto_base: transaction.baseAmount,
      }))
    );

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `reporte-${month || "personalizado"}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div/>



        <div className="flex items-center gap-2 self-start md:self-auto">
          <button
            onClick={() => setFilterOpen((current) => !current)}
            className="flex items-center gap-2 rounded-xl border border-[#dad4c8] bg-white px-4 py-2 text-sm font-semibold text-black transition hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)]"
          >
            <CalendarTodayIcon sx={{ fontSize: 18 }} />
            Filtro
          </button>

          <button
            onClick={exportCsv}
            className="flex items-center gap-2 rounded-xl bg-[#fbbd41] px-4 py-2 text-sm font-semibold text-black transition hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(251,189,65,0.35)]"
          >
            <DownloadRoundedIcon sx={{ fontSize: 18 }} />
            Exportar CSV
          </button>
        </div>
      </div>

      {filterOpen && (
        <div className="rounded-3xl border-2 bg-white p-4 animate-in fade-in slide-in-from-top" style={{ borderColor: "#dad4c8" }}>
          <DateFilter
            onChange={(selectedMonth, selectedRange) => {
              setMonth(selectedMonth);
              setRange(selectedRange);
            }}
          />
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          label="Ingresos"
          value={formatMoney(income, BASE_CURRENCY)}
          tone="green"
          icon={<TrendingUpRoundedIcon sx={{ fontSize: 18 }} />}
        />
        <MetricCard
          label="Gastos"
          value={formatMoney(expense, BASE_CURRENCY)}
          tone="gold"
          icon={<TrendingDownRoundedIcon sx={{ fontSize: 18 }} />}
        />
        <MetricCard
          label="Balance"
          value={formatMoney(balance, BASE_CURRENCY)}
          tone={balance >= 0 ? "green" : "rose"}
          icon={<WalletRoundedIcon sx={{ fontSize: 18 }} />}
        />
        <MetricCard
          label="Tasa de ahorro"
          value={`${savingsRate.toFixed(1)}%`}
          tone="blue"
          icon={<InsightsRoundedIcon sx={{ fontSize: 18 }} />}
        />
      </div>

      <div className="rounded-3xl border-2 bg-white p-5" style={{ borderColor: "#dad4c8" }}>
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <h4 className="text-[20px] font-bold text-black">Hallazgos clave</h4>
            <p className="mt-1 text-sm text-[#9f9b93]">
              Lectura rápida del período seleccionado.
            </p>
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          {findings.map((finding) => (
            <FindingCard key={finding.title} finding={finding} />
          ))}
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <ReportTable
          title="Resumen ejecutivo"
          subtitle="Los indicadores principales del período."
          rows={[
            ["Ingresos", formatMoney(income, BASE_CURRENCY)],
            ["Gastos", formatMoney(expense, BASE_CURRENCY)],
            ["Balance", formatMoney(balance, BASE_CURRENCY)],
            ["Tasa de ahorro", `${savingsRate.toFixed(1)}%`],
            ["Ticket promedio de gasto", formatMoney(averageExpenseTicket, BASE_CURRENCY)],
            ["Ticket promedio de ingreso", formatMoney(averageIncomeTicket, BASE_CURRENCY)],
          ]}
        />

        <ReportTable
          title="Comparativa vs período anterior"
          subtitle="Cómo cambió tu comportamiento respecto de la ventana previa."
          rows={[
            ["Ingresos", compareLine(income, previousIncome)],
            ["Gastos", compareLine(expense, previousExpense)],
            ["Balance", compareLine(balance, previousBalance)],
            [
              "Mayor gasto",
              biggestExpense
                ? `${biggestExpense.category.name ?? "-"} · ${formatMoney(
                    getTransactionBaseAmount(biggestExpense),
                    BASE_CURRENCY
                  )}`
                : "-",
            ],
          ]}
        />
      </div>

      <div className="grid gap-4 xl:grid-cols-5">
        <section
          className="xl:col-span-3 rounded-3xl border-2 bg-white p-5"
          style={{ borderColor: "#dad4c8" }}
        >
          <h4 className="text-[20px] font-bold text-black">Ranking de categorías</h4>
          <p className="mt-1 text-sm text-[#9f9b93]">
            Qué categorías concentraron más gasto y cuántos movimientos tuvieron.
          </p>

          <div className="mt-5 overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-[#55534e]">
                <tr className="border-b" style={{ borderColor: "#dad4c8" }}>
                  <th className="pb-3 font-semibold">Categoría</th>
                  <th className="pb-3 font-semibold">Gasto</th>
                  <th className="pb-3 font-semibold">Participación</th>
                  <th className="pb-3 font-semibold">Movimientos</th>
                </tr>
              </thead>
              <tbody>
                {topCategories.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-6 text-[#9f9b93]">
                      Sin gastos en el período.
                    </td>
                  </tr>
                ) : (
                  topCategories.map((category) => (
                    <tr
                      key={category.name}
                      className="border-b last:border-b-0"
                      style={{ borderColor: "#eee9df" }}
                    >
                      <td className="py-4 font-semibold text-black">{category.name}</td>
                      <td className="py-4 text-black">
                        {formatMoney(category.amount, BASE_CURRENCY)}
                      </td>
                      <td className="py-4 text-[#55534e]">
                        {category.share.toFixed(1)}%
                      </td>
                      <td className="py-4 text-[#55534e]">{category.count}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>

        <section
          className="xl:col-span-2 rounded-3xl border-2 bg-white p-5"
          style={{ borderColor: "#dad4c8" }}
        >
          <h4 className="text-[20px] font-bold text-black">Distribución por cuenta</h4>
          <p className="mt-1 text-sm text-[#9f9b93]">
            Resultado, ingresos, gastos y volumen de movimientos por cuenta.
          </p>

          <div className="mt-5 space-y-3">
            {accountBreakdown.length === 0 ? (
              <div
                className="rounded-2xl border bg-[#faf9f7] p-4 text-sm text-[#9f9b93]"
                style={{ borderColor: "#dad4c8" }}
              >
                No hay cuentas con movimientos en este período.
              </div>
            ) : (
              accountBreakdown.map((account) => (
                <div
                  key={account.id}
                  className="rounded-2xl border bg-[#faf9f7] p-4"
                  style={{ borderColor: "#dad4c8" }}
                >
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-semibold text-black">{account.name}</p>
                    <p
                      className="font-bold"
                      style={{ color: account.balance >= 0 ? "#078a52" : "#fc7981" }}
                    >
                      {formatMoney(account.balance, BASE_CURRENCY)}
                    </p>
                  </div>
                  <div className="mt-3 grid gap-2 text-sm text-[#55534e]">
                    <p>Ingresos: {formatMoney(account.income, BASE_CURRENCY)}</p>
                    <p>Gastos: {formatMoney(account.expense, BASE_CURRENCY)}</p>
                    <p>Movimientos: {account.movementCount}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </div>

      <section
        className="rounded-3xl border-2 bg-white p-5"
        style={{ borderColor: "#dad4c8" }}
      >
        <h4 className=" font-bold text-black">Serie de los últimos 6 meses</h4>
        <p className="mt-1 text-sm text-[#9f9b93]">
          Evolución de ingresos, gastos y balance para leer tendencia.
        </p>

        <div className="mt-5 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="text-[#55534e]">
              <tr className="border-b" style={{ borderColor: "#dad4c8" }}>
                <th className="pb-3 font-semibold">Mes</th>
                <th className="pb-3 font-semibold">Ingresos</th>
                <th className="pb-3 font-semibold">Gastos</th>
                <th className="pb-3 font-semibold">Balance</th>
              </tr>
            </thead>
            <tbody>
              {monthlyTrend.map((row) => (
                <tr
                  key={row.label}
                  className="border-b last:border-b-0"
                  style={{ borderColor: "#eee9df" }}
                >
                  <td className="py-4 font-semibold text-black">{row.label}</td>
                  <td className="py-4 text-black">{formatMoney(row.income, BASE_CURRENCY)}</td>
                  <td className="py-4 text-black">{formatMoney(row.expense, BASE_CURRENCY)}</td>
                  <td
                    className="py-4 font-semibold"
                    style={{ color: row.balance >= 0 ? "#078a52" : "#fc7981" }}
                  >
                    {formatMoney(row.balance, BASE_CURRENCY)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

function MetricCard({
  label,
  value,
  tone,
  icon,
}: {
  label: string;
  value: string;
  tone: "green" | "gold" | "blue" | "rose";
  icon: React.ReactNode;
}) {
  const toneStyles = {
    green: { color: "#078a52", bg: "#effaf4" },
    gold: { color: "#d08a11", bg: "#fff6df" },
    blue: { color: "#01418d", bg: "#eef5ff" },
    rose: { color: "#fc7981", bg: "#fff1f3" },
  }[tone];

  return (
    <div className="rounded-3xl border-2 bg-white p-5" style={{ borderColor: "#dad4c8" }}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold" style={{ color: toneStyles.color }}>
            {label}
          </p>
          <p className="mt-2 text-2xl font-bold text-black">{value}</p>
        </div>
        <div
          className="flex h-10 w-10 items-center justify-center rounded-2xl"
          style={{ backgroundColor: toneStyles.bg, color: toneStyles.color }}
        >
          {icon}
        </div>
      </div>
    </div>
  );
}

function FindingCard({ finding }: { finding: Finding }) {
  const accent = {
    green: { border: "#84e7a5", bg: "#f3fff7", label: "#078a52" },
    gold: { border: "#f8cc65", bg: "#fff9ec", label: "#d08a11" },
    blue: { border: "#3bd3fd", bg: "#f1fbff", label: "#01418d" },
  }[finding.tone];

  return (
    <div
      className="rounded-2xl border p-4"
      style={{ borderColor: accent.border, backgroundColor: accent.bg }}
    >
      <p className="text-sm font-semibold" style={{ color: accent.label }}>
        {finding.title}
      </p>
      <p className="mt-2 text-base font-medium leading-7 text-black">{finding.text}</p>
    </div>
  );
}

function ReportTable({
  title,
  subtitle,
  rows,
}: {
  title: string;
  subtitle: string;
  rows: [string, string][];
}) {
  return (
    <section
      className="rounded-3xl border-2 bg-white p-5"
      style={{ borderColor: "#dad4c8" }}
    >
      <h4 className="text-[20px] font-bold text-black">{title}</h4>
      <p className="mt-1 text-sm text-[#9f9b93]">{subtitle}</p>

      <div className="mt-5 space-y-3">
        {rows.map(([label, value]) => (
          <div
            key={label}
            className="flex items-center justify-between gap-3 rounded-2xl border bg-[#faf9f7] p-4"
            style={{ borderColor: "#dad4c8" }}
          >
            <span className="text-sm text-[#55534e]">{label}</span>
            <span className="text-right font-semibold text-black">{value}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

function percentChange(current: number, previous: number) {
  if (previous === 0) return current === 0 ? 0 : 100;
  return ((current - previous) / Math.abs(previous)) * 100;
}

function formatDelta(value: number) {
  return `${value >= 0 ? "+" : ""}${value.toFixed(1)}%`;
}

function compareLine(current: number, previous: number) {
  if (previous === 0 && current === 0) return formatMoney(0, BASE_CURRENCY);
  if (previous === 0) {
    return `${formatMoney(current, BASE_CURRENCY)} · nuevo período comparable`;
  }

  return `${formatMoney(current, BASE_CURRENCY)} · ${formatDelta(
    percentChange(current, previous)
  )}`;
}
