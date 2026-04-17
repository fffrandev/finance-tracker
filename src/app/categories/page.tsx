"use client";

import { useState } from "react";
import { useCategories } from "@/context/CategoriesContext";
import { TransactionType } from "@/types/transaction";
import CloseIcon from "@mui/icons-material/Close";

export default function CategoriesPage() {
  const { categories, addCategory, updateCategory, deleteCategory } = useCategories();

  const [name, setName] = useState("");
  const [type, setType] = useState<TransactionType>("expense");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");
  const [createOpen, setCreateOpen] = useState(false);

  const expenseCategories = categories.filter(
    (c) => c.type === "expense"
  );

  const incomeCategories = categories.filter(
    (c) => c.type === "income"
  );

  const handleAdd = async () => {
    if (!name.trim()) return;

    const ok = await addCategory(name.trim(), type);
    if (!ok) return;
    setName("");
    setType("expense");
    setCreateOpen(false);
  };

  const handleStartEdit = (id: string, currentName: string) => {
    setEditingId(id);
    setEditingName(currentName);
  };

  const handleSaveEdit = async () => {
    if (!editingId) return;

    const ok = await updateCategory(editingId, editingName);
    if (!ok) return;

    setEditingId(null);
    setEditingName("");
  };

  const renderCategoryList = (
    list: typeof categories,
    title: string,
    tone: "rose" | "emerald"
  ) => (
    <div className="rounded-3xl bg-white p-5 text-black shadow-sm" style={{ border: '1px solid #dad4c8' }}>
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">{title}</h2>
          <p className="text-sm" style={{ color: tone === "rose" ? "#fc7981" : "#078a52" }}>
            {list.length} {list.length === 1 ? "categoría" : "categorías"}
          </p>
        </div>
        <span
          className="rounded-full px-3 py-1 text-xs font-semibold text-white"
          style={{
            backgroundColor: tone === "rose" ? "#fc7981" : "#078a52"
          }}
        >
          {tone === "rose" ? "Gastos" : "Ingresos"}
        </span>
      </div>

      {list.length === 0 ? (
        <p className="rounded-2xl border border-dashed px-4 py-6 text-center text-sm" style={{ borderColor: '#dad4c8', color: '#9f9b93' }}>
          No hay categorías todavía.
        </p>
      ) : (
        <div className="space-y-3">
          {list.map((category) => (
            <div
              key={category.id}
              className="rounded-2xl bg-white p-4"
              style={{ border: '1px solid #dad4c8' }}
            >
              {editingId === category.id ? (
                <div className="space-y-3">
                  <input
                    className="w-full rounded-xl border bg-white px-4 py-3 outline-none transition focus:ring-2"
                    style={{ borderColor: '#dad4c8' }}
                    value={editingName}
                    onChange={(e) => setEditingName(e.target.value)}
                    placeholder="Nombre de la categoría"
                    onFocus={(e) => (e.currentTarget.style.boxShadow = 'inset 0 0 0 2px #fbbd41')}
                    onBlur={(e) => (e.currentTarget.style.boxShadow = 'none')}
                  />

                  <p className="text-sm" style={{ color: '#9f9b93' }}>
                    {category.type === "expense" ? "Gasto" : "Ingreso"}
                  </p>

                  <div className="flex gap-2">
                    <button
                      onClick={handleSaveEdit}
                      className="flex-1 rounded-xl px-3 py-2 text-sm font-semibold text-black transition hover:brightness-95"
                      style={{ backgroundColor: '#fbbd41' }}
                    >
                      Guardar
                    </button>
                    <button
                      onClick={() => {
                        setEditingId(null);
                        setEditingName("");
                      }}
                      className="flex-1 rounded-xl border px-3 py-2 text-sm font-medium text-black transition hover:bg-[#faf9f7]"
                      style={{ borderColor: '#dad4c8' }}
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="font-semibold text-black">{category.name}</p>
                    <p className="mt-1 text-sm" style={{ color: '#9f9b93' }}>
                      {category.type === "expense" ? "Gasto" : "Ingreso"}
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleStartEdit(category.id, category.name)}
                      className="rounded-xl border px-3 py-2 text-sm font-semibold text-black transition hover:bg-[#faf9f7]"
                      style={{ borderColor: '#dad4c8' }}
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => {
                        if (confirm("¿Eliminar categoría?")) {
                          void deleteCategory(category.id);
                        }
                      }}
                      className="rounded-xl px-3 py-2 text-sm font-semibold text-white transition hover:brightness-95"
                      style={{ backgroundColor: '#fc7981' }}
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-end gap-4">
        <button
          onClick={() => setCreateOpen(true)}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-[#fbbd41] to-[#f8cc65] text-black font-bold text-lg transition hover:brightness-95"
          aria-label="Agregar categoría"
        >
          +
        </button>
      </div>

      {createOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl border bg-white p-6 text-black shadow-2xl" style={{ borderColor: '#dad4c8' }}>
            <div className="mb-5 flex items-center justify-between gap-4">
              <h2 className="text-[20px] font-bold">Nueva categoría</h2>
              <button
                onClick={() => setCreateOpen(false)}
                className="flex h-10 w-10 items-center justify-center rounded-full border text-black transition hover:bg-[#faf9f7]"
                style={{ borderColor: '#dad4c8' }}
                aria-label="Cerrar modal"
              >
                <CloseIcon fontSize="small" />
              </button>
            </div>

            <div className="space-y-4">
              <input
                className="w-full rounded-xl border bg-white px-4 py-3 outline-none transition focus:ring-2"
                style={{ borderColor: '#dad4c8' }}
                placeholder="Nombre"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onFocus={(e) => (e.currentTarget.style.boxShadow = 'inset 0 0 0 2px #fbbd41')}
                onBlur={(e) => (e.currentTarget.style.boxShadow = 'none')}
              />

              <select
                className="w-full rounded-xl border bg-white px-4 py-3 outline-none transition focus:ring-2"
                style={{ borderColor: '#dad4c8' }}
                value={type}
                onChange={(e) =>
                  setType(e.target.value as TransactionType)
                }
                onFocus={(e) => (e.currentTarget.style.boxShadow = 'inset 0 0 0 2px #fbbd41')}
                onBlur={(e) => (e.currentTarget.style.boxShadow = 'none')}
              >
                <option value="expense">Gasto</option>
                <option value="income">Ingreso</option>
              </select>

              <button
                onClick={handleAdd}
                className="mx-auto block rounded-xl px-3 py-2 text-sm font-semibold text-black transition hover:brightness-95"
                style={{ backgroundColor: '#fbbd41' }}
              >
                Agregar
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        {renderCategoryList(expenseCategories, "Gastos", "rose")}
        {renderCategoryList(incomeCategories, "Ingresos", "emerald")}
      </div>
    </div>
  );
}
