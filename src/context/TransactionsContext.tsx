"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import {
  Transaction,
  TransactionInput,
} from "@/types/transaction";
import { defaultCategories } from "@/constants/categories";
import { Category } from "@/types/category";

interface ContextProps {
  transactions: Transaction[];
  addTransaction: (t: TransactionInput) => void;
  deleteTransaction: (id: string) => void;
  getTransaction: (id: string) => Transaction | undefined;
  updateTransaction: (id: string, t: TransactionInput) => void;
}

const TransactionsContext = createContext<ContextProps | null>(
  null
);

const STORAGE_KEY = "transactions";

const categoryById = new Map(
  defaultCategories.map((category) => [category.id, category])
);

const normalizeCategory = (category: Transaction["category"] | string): Category => {
  if (typeof category !== "string") {
    return category;
  }

  return (
    categoryById.get(category) ?? {
      id: category,
      name: category,
      type: "expense",
    }
  );
};

const normalizeTransaction = (transaction: Transaction): Transaction => ({
  ...transaction,
  category: normalizeCategory(transaction.category),
});

export const TransactionsProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [transactions, setTransactions] = useState<
    Transaction[]
  >(() => {
    // 👇 evita flicker
    if (typeof window === "undefined") return [];
    const data = localStorage.getItem(STORAGE_KEY);
    return data
      ? (JSON.parse(data) as Transaction[]).map(normalizeTransaction)
      : [];
  });

  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(transactions)
    );
  }, [transactions]);

  const addTransaction = (t: TransactionInput) => {
    setTransactions((prev) => [
      ...prev,
      { ...t, id: crypto.randomUUID() },
    ]);
  };

  const deleteTransaction = (id: string) => {
    setTransactions((prev) =>
      prev.filter((t) => t.id !== id)
    );
  };

  const getTransaction = (id: string) => {
    return transactions.find((t) => t.id === id);
  };

  const updateTransaction = (
    id: string,
    updated: TransactionInput
  ) => {
    setTransactions((prev) =>
      prev.map((t) =>
        t.id === id ? { ...updated, id } : t
      )
    );
  };

  return (
    <TransactionsContext.Provider
      value={{
        transactions,
        addTransaction,
        deleteTransaction,
        getTransaction,
        updateTransaction,
      }}
    >
      {children}
    </TransactionsContext.Provider>
  );
};

export const useTransactions = () => {
  const ctx = useContext(TransactionsContext);
  if (!ctx) throw new Error("useTransactions fuera de provider");
  return ctx;
};
