"use client";

import { useParams, useRouter } from "next/navigation";
import { useTransactions } from "@/context/TransactionsContext";
import { useMemo } from "react";
import { TransactionInput } from "@/types/transaction";
import TransactionForm from "@/components/TransactionForm";

export default function EditTransaction() {
  const { id } = useParams();
  const router = useRouter();
  const { getTransaction, updateTransaction } =
    useTransactions();

  const data = useMemo<TransactionInput | null>(() => {
    const transaction = getTransaction(id as string);

    if (!transaction) return null;

    const { id: transactionId, ...rest } = transaction;
    void transactionId;
    return rest;
  }, [getTransaction, id]);

  if (!data) return <p>Cargando...</p>;

  return (
    <div className="bg-white p-5 rounded-2xl shadow">
      <h1 className="text-xl font-bold mb-4">
        Editar Transacción
      </h1>

      <TransactionForm
        initialData={data}
        submitText="Guardar cambios"
        onSubmit={(form) => {
          updateTransaction(id as string, form);
          router.push("/transactions");
        }}
      />
    </div>
  );
}
