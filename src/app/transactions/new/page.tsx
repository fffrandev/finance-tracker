"use client";

import { useRouter } from "next/navigation";
import { useTransactions } from "@/context/TransactionsContext";
import TransactionForm from "@/components/TransactionForm";


export default function NewTransaction() {
  const router = useRouter();
  const { addTransaction } = useTransactions();

  return (
    <div className="bg-white p-5 rounded-2xl shadow">
      <h1 className="text-xl font-bold mb-4">
        Nueva Transacción
      </h1>

      <TransactionForm
        submitText="Crear"
        onSubmit={(data) => {
          addTransaction(data);
          router.push("/transactions");
        }}
      />
    </div>
  );
}