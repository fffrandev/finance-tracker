import { Category } from "./category";

export type TransactionType = "income" | "expense";

export type Transaction = {
  id: string;
  amount: number;
  description: string;
  type: TransactionType;
  category: Category; // 🔥 antes era string
  date: string;
};

export type TransactionInput = Omit<Transaction, "id">;