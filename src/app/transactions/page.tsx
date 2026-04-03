"use client";

import Link from "next/link";
import { useTransactions } from "@/context/TransactionsContext";
import useTransactionsFilters from "@/hooks/useTransactionsFilters";

export default function TransactionsPage() {
  const { transactions, deleteTransaction } = useTransactions();

  const {
    search,
    setSearch,
    type,
    setType,
    category,
    setCategory,
    month,
    setMonth,
    categories,
    filtered,
  } = useTransactionsFilters(transactions);

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Transacciones</h1>
        <Link
          href="/transactions/new"
          className="bg-blue-500 text-white px-4 py-2 rounded-xl"
        >
          + Nueva
        </Link>
      </div>

      {/* FILTROS */}
      <div className="bg-white p-4 rounded-2xl shadow grid gap-4 md:grid-cols-4">
        {/* SEARCH */}
        <input
          placeholder="Buscar..."
          className="border p-2 rounded"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {/* TYPE */}
        <select
          className="border p-2 rounded"
          value={type}
          onChange={(e) => {
            setType(e.target.value);
            setCategory(""); // reset categoría
          }}
        >
          <option value="all">Todos</option>
          <option value="income">Ingresos</option>
          <option value="expense">Gastos</option>
        </select>

        {/* CATEGORY */}
        <select
          className="border p-2 rounded"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="">Todas</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>

        {/* MONTH */}
        <input
          type="month"
          className="border p-2 rounded"
          value={month}
          onChange={(e) => setMonth(e.target.value)}
        />
      </div>

      {/* TABLA */}
      <div className="bg-white p-5 rounded-2xl shadow">
        {filtered.length === 0 ? (
          <p className="text-gray-500">No hay resultados</p>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="text-left text-gray-500 border-b">
                <th>Fecha</th>
                <th>Descripción</th>
                <th>Categoría</th>
                <th>Monto</th>
                <th></th>
              </tr>
            </thead>

            <tbody>
              {filtered.map((t) => (
                <tr key={t.id} className="border-b">
                  <td>{t.date}</td>

                  <td>{t.description}</td>

                  {/* 🔥 FIX CLAVE */}
                  <td>{t.category?.name || "-"}</td>

                  <td
                    className={
                      t.type === "income"
                        ? "text-green-600"
                        : "text-red-500"
                    }
                  >
                    ${t.amount}
                  </td>

                  <td className="flex gap-3">
                    <Link
                      href={`/transactions/${t.id}`}
                      className="text-blue-500"
                    >
                      Editar
                    </Link>

                    <button
                      onClick={() => {
                        if (confirm("¿Eliminar transacción?")) {
                          deleteTransaction(t.id);
                        }
                      }}
                      className="text-red-500"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
