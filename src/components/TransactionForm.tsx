"use client";

import { useState, useMemo } from "react";
import {
  TransactionInput,
  TransactionType,
} from "@/types/transaction";
import { useCategories } from "@/context/CategoriesContext";
import { Category } from "@/types/category";

type Props = {
  initialData?: TransactionInput;
  onSubmit: (data: TransactionInput) => void;
  submitText?: string;
};

export default function TransactionForm({
  initialData,
  onSubmit,
  submitText = "Guardar",
}: Props) {
  const { categories, addCategory } = useCategories();

  const [form, setForm] = useState<TransactionInput>(
    initialData || {
      amount: 0,
      description: "",
      type: "expense",
      category: categories[0],
      date: "",
    }
  );

  const [newCategory, setNewCategory] = useState("");

  // 🔥 Filtrar categorías según tipo
  const filteredCategories = useMemo(() => {
    return categories.filter((c) => c.type === form.type);
  }, [categories, form.type]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.description || !form.date) {
      alert("Campos obligatorios");
      return;
    }

    onSubmit({
      ...form,
      amount: Number(form.amount),
      type: form.type as TransactionType,
    });
  };

  const handleAddCategory = () => {
    if (!newCategory) return;

    const newCat: Category = {
      id: crypto.randomUUID(),
      name: newCategory,
      type: form.type,
    };

    addCategory(newCat);
    setForm({ ...form, category: newCat });
    setNewCategory("");
  };

  return (
    <form onSubmit={handleSubmit} className="grid gap-4">
      <input
        type="number"
        placeholder="Monto"
        className="border p-2 rounded"
        value={form.amount}
        onChange={(e) =>
          setForm({ ...form, amount: Number(e.target.value) })
        }
      />

      <input
        type="text"
        placeholder="Descripción"
        className="border p-2 rounded"
        value={form.description}
        onChange={(e) =>
          setForm({ ...form, description: e.target.value })
        }
      />

      <select
        className="border p-2 rounded"
        value={form.type}
        onChange={(e) => {
          const nextType = e.target.value as TransactionType;
          const nextCategories = categories.filter(
            (c) => c.type === nextType
          );

          setForm({
            ...form,
            type: nextType,
            category: nextCategories[0], // reset
          });
        }}
      >
        <option value="expense">Gasto</option>
        <option value="income">Ingreso</option>
      </select>

      {/* 🔥 SELECT DE CATEGORÍAS */}
      <select
        className="border p-2 rounded"
        value={form.category?.id}
        onChange={(e) => {
          const cat = filteredCategories.find(
            (c) => c.id === e.target.value
          );
          if (cat) setForm({ ...form, category: cat });
        }}
      >
        {filteredCategories.map((c) => (
          <option key={c.id} value={c.id}>
            {c.name}
          </option>
        ))}
      </select>

      {/* ➕ Crear categoría */}
      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Nueva categoría"
          className="border p-2 rounded flex-1"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
        />
        <button
          type="button"
          onClick={handleAddCategory}
          className="bg-gray-200 px-3 rounded"
        >
          +
        </button>
      </div>

      <input
        type="date"
        className="border p-2 rounded"
        value={form.date}
        onChange={(e) =>
          setForm({ ...form, date: e.target.value })
        }
      />

      <button className="bg-blue-500 text-white p-2 rounded">
        {submitText}
      </button>
    </form>
  );
}
