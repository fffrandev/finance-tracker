"use client";

import { Suspense, useState, useMemo } from "react";
import { useTransactions } from "@/context/TransactionsContext";
import { useAccounts } from "@/context/AccountsContext";
import useTransactionsFilters from "@/hooks/useTransactionsFilters";
import TransactionModal from "@/components/TransactionModal";
import DateFilter from "@/components/DateFilter";
import { TransactionInput, TransactionType } from "@/types/transaction";
import { motion, AnimatePresence } from "framer-motion";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import { BASE_CURRENCY, formatMoney, getTransactionBaseAmount } from "@/utils/currency";

type DateRange = {
  start: string;
  end: string;
};

function TransactionsPageContent() {
  const {
    transactions,
    deleteTransaction,
    addTransaction,
    updateTransaction,
    getTransaction,
  } = useTransactions();
  const { accounts } = useAccounts();

  const {
    type,
    setType,
    category,
    setCategory,
    month,
    setMonth,
    categories,
    filtered,
  } = useTransactionsFilters(transactions);

  const [filterOpen, setFilterOpen] = useState(false);
  const [dateRange, setDateRange] = useState<DateRange | null>(null);
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const editingData = useMemo<TransactionInput | undefined>(() => {
    if (!editingId) return undefined;
    const t = getTransaction(editingId);
    if (!t) return undefined;
    return {
      amount: t.amount,
      description: t.description,
      type: t.type,
      categoryId: t.category.id,
      date: t.date,
      accountId: t.accountId,
    };
  }, [editingId, getTransaction]);

  const accountNameById = useMemo(
    () =>
      new Map(accounts.map((account) => [account.id, account.name])),
    [accounts]
  );

  const regularMovements = useMemo(
    () => filtered.filter((transaction) => transaction.category.id !== "transfer"),
    [filtered]
  );

  const transferGroups = useMemo(() => {
    const transfers = transactions.filter((transaction) => {
      if (transaction.category.id !== "transfer") return false;
      if (dateRange) {
        return (
          transaction.date >= dateRange.start &&
          transaction.date <= dateRange.end
        );
      }
      if (month) {
        return transaction.date.startsWith(month);
      }
      return true;
    });
    const grouped = new Map<
      string,
      {
        incomeId?: string;
        expenseId?: string;
        amount: number;
        date: string;
        description: string;
        fromAccountId?: string;
        toAccountId?: string;
      }
    >();

    const getTransferKey = (description: string, amount: number, date: string) =>
      `${date}|${amount}|${description
        .replace("Transferencia enviada", "Transferencia")
        .replace("Transferencia recibida", "Transferencia")}`;

    transfers.forEach((transaction) => {
      const key = getTransferKey(
        transaction.description,
        transaction.amount,
        transaction.date
      );
      const current = grouped.get(key) ?? {
        amount: transaction.amount,
        date: transaction.date,
        description: transaction.description
          .replace("Transferencia enviada", "Transferencia")
          .replace("Transferencia recibida", "Transferencia"),
      };

      if (transaction.type === "expense") {
        current.expenseId = transaction.id;
        current.fromAccountId = transaction.accountId;
      } else {
        current.incomeId = transaction.id;
        current.toAccountId = transaction.accountId;
      }

      grouped.set(key, current);
    });

    return Array.from(grouped.values());
  }, [dateRange, month, transactions]);

  // Include transfers in type "all"
  const allItems = useMemo(() => {
    const items = regularMovements.map((t) => ({
      id: t.id,
      type: "movement" as const,
      data: t,
    }));

    // Include transfers when type is "all" or "transfers"
    if (type === "all" || type === "transfers") {
      items.push(
        ...transferGroups.map((transfer) => ({
          id: transfer.expenseId ?? transfer.incomeId ?? "",
          type: "transfer" as const,
          data: transfer,
        }))
      );
    }

    return items.sort((a, b) => {
      const dateA = "date" in a.data ? a.data.date : a.data.date;
      const dateB = "date" in b.data ? b.data.date : b.data.date;
      return new Date(dateB).getTime() - new Date(dateA).getTime();
    });
  }, [regularMovements, transferGroups, type]);

  const handleResetFilter = () => {
    setMonth(new Date().toISOString().slice(0, 7));
    setDateRange(null);
    setFilterOpen(false);
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Filter and Type Controls */}
      <div className="space-y-4">
        {/* Top row: Tipo filters + right-aligned filters */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 flex-wrap">
            {["all", "income", "expense", "transfers"].map((t) => (
              <button
                key={t}
                onClick={() => setType(t as "all" | TransactionType | "transfers")}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition ${
                  type === t
                    ? "text-black"
                    : "border transition"
                }`}
                style={type === t ? { background: 'linear-gradient(to right, #fbbd41, #f8cc65)' } : { backgroundColor: '#faf9f7', borderColor: '#dad4c8', color: '#9f9b93' }}
              >
                {t === "all" ? "Todos" : t === "income" ? "Ingresos" : t === "expense" ? "Gastos" : "Transferencias"}
              </button>
            ))}
          </div>

          {/* Right side actions */}
          <div className="flex items-center gap-2">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="rounded-xl border-2 bg-white px-3 py-2 text-sm font-semibold outline-none transition focus:ring-2"
              style={{ borderColor: '#dad4c8', color: '#9f9b93' }}
            >
              <option value="">Categorías</option>
              {categories.map((currentCategory) => (
                <option key={currentCategory.id} value={currentCategory.id}>
                  {currentCategory.name}
                </option>
              ))}
            </select>

            <button
              onClick={() => setFilterOpen(!filterOpen)}
              className="flex h-10 w-10 items-center justify-center rounded-lg transition"
              title="Filtro de fechas"
              style={{ color: '#9f9b93' }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#faf9f7')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
            >
              <CalendarTodayIcon className="w-5 h-5" />
            </button>

            <button
              onClick={() => {
                setEditingId(null);
                setOpen(true);
              }}
              className="flex h-10 w-10 items-center justify-center rounded-full text-black font-bold text-lg transition hover:brightness-95"
              aria-label="Nuevo movimiento"
              style={{ background: 'linear-gradient(to right, #fbbd41, #f8cc65)' }}
            >
              +
            </button>
          </div>
        </div>

        {/* Collapsible Date Filter - below the buttons */}
        {filterOpen && (
          <div className="rounded-2xl border-2 bg-white p-4 animate-in fade-in slide-in-from-top"
               style={{ borderColor: '#dad4c8' }}>
            <DateFilter
              onChange={(selectedMonth, range) => {
                setDateRange(range);
                setMonth(range ? "" : selectedMonth);
              }}
            />
          </div>
        )}
      </div>

      {/* Transactions List */}
      <div className="space-y-3">
        {allItems.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl border-2 py-12 text-center"
            style={{ borderColor: '#dad4c8', backgroundColor: '#faf9f7' }}
          >
            <p className="text-lg font-semibold text-black">No hay movimientos</p>
            <p className="mt-2 text-sm" style={{ color: '#9f9b93' }}>Crea tu primer movimiento para empezar</p>
          </motion.div>
        ) : (
          <AnimatePresence>
            {allItems.map((item) => {
              if (item.type === "movement") {
                const t = item.data;
                return (
                  <motion.div
                    key={t.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    transition={{ duration: 0.2 }}
                    drag="x"
                    onDragEnd={(e, info) => {
                      if (info.offset.x < -120) void deleteTransaction(t.id);
                    }}
                    className={`rounded-2xl border-2 p-4 flex justify-between items-center transition ${
                      t.type === "income"
                        ? "border-emerald-200 bg-emerald-50 text-emerald-950 hover:bg-emerald-100"
                        : "border-rose-200 bg-rose-50 text-rose-950 hover:bg-rose-100"
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-bold ${
                            t.type === "income"
                              ? "bg-emerald-200 text-emerald-900"
                              : "bg-rose-200 text-rose-900"
                          }`}
                        >
                          {t.type === "income" ? "Ingreso" : "Gasto"}
                        </span>
                        <p className="font-bold">{t.category?.name || "Sin categoría"}</p>
                      </div>
                      <p className="mt-2 text-sm text-opacity-75">
                        {t.description || "Sin descripción"} • {t.date}
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <p className="font-bold">
                        {t.type === "income" ? "+" : "-"}
                        {formatMoney(getTransactionBaseAmount(t), BASE_CURRENCY)}
                      </p>
                      <button
                        onClick={() => {
                          setEditingId(t.id);
                          setOpen(true);
                        }}
                        className="text-opacity-60 hover:text-opacity-100 transition"
                      >
                        <EditIcon className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => void deleteTransaction(t.id)}
                        className="text-opacity-60 hover:text-opacity-100 transition"
                      >
                        <DeleteIcon className="w-5 h-5" />
                      </button>
                    </div>
                  </motion.div>
                );
              } else {
                const transfer = item.data;
                return (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    transition={{ duration: 0.2 }}
                    className="rounded-2xl border-2 border-sky-200 bg-sky-50 p-4 text-sky-950 flex justify-between items-center hover:bg-sky-100 transition"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="rounded-full bg-sky-200 px-3 py-1 text-xs font-bold text-sky-900">
                          Transferencia
                        </span>
                        <p className="font-bold">{transfer.description || "Transferencia interna"}</p>
                      </div>
                      <p className="mt-2 text-sm text-opacity-75">
                        {accountNameById.get(transfer.fromAccountId || "") || "Origen"} →{" "}
                        {accountNameById.get(transfer.toAccountId || "") || "Destino"} • {transfer.date}
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <p className="font-bold">{formatMoney(transfer.amount, BASE_CURRENCY)}</p>
                      <button
                        onClick={() => {
                          if (transfer.expenseId) void deleteTransaction(transfer.expenseId);
                          if (transfer.incomeId) void deleteTransaction(transfer.incomeId);
                        }}
                        className="text-opacity-60 hover:text-opacity-100 transition"
                      >
                        <DeleteIcon className="w-5 h-5" />
                      </button>
                    </div>
                  </motion.div>
                );
              }
            })}
          </AnimatePresence>
        )}
      </div>

      <TransactionModal
        open={open}
        onClose={() => setOpen(false)}
        title={editingId ? "Editar movimiento" : "Nuevo movimiento"}
        initialData={editingData}
        onSubmit={async (data) => {
          if (editingId) return updateTransaction(editingId, data);
          return addTransaction(data);
        }}
      />
    </div>
  );
}

export default function TransactionsPage() {
  return (
    <Suspense fallback={<div className="py-8 text-center font-semibold" style={{ color: '#9f9b93' }}>Cargando movimientos...</div>}>
      <TransactionsPageContent />
    </Suspense>
  );
}
