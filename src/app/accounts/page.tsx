"use client";

import { useMemo, useState } from "react";
import { useAccounts } from "@/context/AccountsContext";
import { useTransactions } from "@/context/TransactionsContext";
import TransferModal from "@/components/TransferModal";
import { CurrencyCode } from "@/types/account";
import { formatMoney } from "@/utils/currency";
import { motion } from "framer-motion";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import Image from "next/image";
import TT from "../../../assets/TT.png";

export default function AccountsPage() {
  const { accounts, addAccount, updateAccount, deleteAccount } = useAccounts();
  const { getAccountBalance, transactions } = useTransactions();

  const [name, setName] = useState("");
  const [currency, setCurrency] = useState<CurrencyCode>("ARS");
  const [transferOpen, setTransferOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");
  const [editingCurrency, setEditingCurrency] = useState<CurrencyCode>("ARS");

  const sortedAccounts = useMemo(
    () =>
      [...accounts].sort((a, b) =>
        a.name.localeCompare(b.name, "es", { sensitivity: "base" })
      ),
    [accounts]
  );

  const handleAdd = async () => {
    const created = await addAccount(name, "bank", currency);
    if (!created) return;

    setName("");
    setCurrency("ARS");
    setCreateOpen(false);
  };

  const handleEdit = (id: string, currentName: string, currentCurrency: CurrencyCode) => {
    setEditingId(id);
    setEditingName(currentName);
    setEditingCurrency(currentCurrency);
  };

  const handleSaveEdit = async () => {
    if (!editingId) return;

    const updated = await updateAccount(editingId, editingName, editingCurrency);
    if (!updated) return;

    setEditingId(null);
    setEditingName("");
    setEditingCurrency("ARS");
  };

  const gradients = [
    "linear-gradient(135deg, #f8cc65 0%, #fbbd41 100%)",
    "linear-gradient(135deg, #84e7a5 0%, #078a52 100%)",
    "linear-gradient(135deg, #3bd3fd 0%, #0089ad 100%)",
    "linear-gradient(135deg, #c1b0ff 0%, #43089f 100%)",
    "linear-gradient(135deg, #fc7981 0%, #f8cc65 100%)",
    "linear-gradient(135deg, #01418d 0%, #3bd3fd 100%)",
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
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
        <button
          onClick={() => setCreateOpen(true)}
          className="flex h-11 w-11 items-center justify-center rounded-full border text-lg font-bold text-black transition hover:translate-y-[-2px]"
          style={{
            backgroundColor: "#fbbd41",
            borderColor: "#000000",
            boxShadow:
              "rgba(0,0,0,0.1) 0px 1px 1px, rgba(0,0,0,0.04) 0px -1px 1px inset, rgba(0,0,0,0.05) 0px -0.5px 1px",
          }}
          aria-label="Agregar cuenta"
        >
          +
        </button>
      </div>

      <motion.div className="grid md:grid-cols-3 gap-6">
        {sortedAccounts.map((account, idx) => {
          const balance = getAccountBalance(account.id);
          const gradient = gradients[idx % gradients.length];

          return (
            <motion.div
              key={account.id}
              whileHover={{ y: -6 }}
              className="overflow-hidden rounded-[28px] border border-[#dad4c8] bg-white"
              style={{
                boxShadow:
                  "rgba(0,0,0,0.1) 0px 1px 1px, rgba(0,0,0,0.04) 0px -1px 1px inset, rgba(0,0,0,0.05) 0px -0.5px 1px",
              }}
            >
              <div
                className="flex min-h-[190px] flex-col justify-between p-5"
                style={{ background: gradient }}
              >
                {editingId === account.id ? (
                  <div className="space-y-3">
                    <input
                      className="w-full rounded-xl border border-black/10 bg-white/85 px-4 py-3 text-black outline-none transition"
                      value={editingName}
                      onChange={(e) => setEditingName(e.target.value)}
                    />
                    <select
                      className="w-full rounded-xl border border-black/10 bg-white/85 px-4 py-3 text-black outline-none transition"
                      value={editingCurrency}
                      onChange={(e) => setEditingCurrency(e.target.value as CurrencyCode)}
                    >
                      <option value="ARS">Pesos argentinos</option>
                      <option value="USD">Dólares</option>
                      <option value="EUR">Euros</option>
                    </select>
                    <div className="flex gap-2 pt-2">
                      <button
                        onClick={handleSaveEdit}
                        className="flex-1 rounded-xl border border-black bg-[#fbbd41] px-3 py-2 text-sm font-semibold text-black transition hover:translate-y-[-1px]"
                      >
                        Guardar
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        className="flex-1 rounded-xl border border-black/15 bg-white/70 px-3 py-2 text-sm font-semibold text-black transition hover:translate-y-[-1px]"
                      >
                        Cancelar
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <motion.div className="flex justify-between items-start">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[1.08px] text-black/70">
                          Saldo disponible
                        </p>
                        <p className="mt-1 text-[30px] font-semibold -tracking-[0.06em] text-black">
                          {formatMoney(balance, account.currency)}
                        </p>
                      </div>
                      <div className="rounded-full border border-black/10 bg-white/70 px-3 py-1.5 text-xs font-semibold uppercase tracking-[1.08px] text-black">
                        {account.currency}
                      </div>
                    </motion.div>

                    <motion.div className="flex justify-between items-end">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[1.08px] text-black/65">
                          Cuenta
                        </p>
                        <p className="mt-1 text-lg font-semibold text-black">{account.name}</p>
                      </div>
                      <Image
                        src={TT}
                        alt="logo"
                        width={40}
                        height={40}
                        className="h-10 w-10 object-contain"
                      />
                    </motion.div>
                  </>
                )}
              </div>

              {editingId !== account.id && (
                <div className="flex gap-2 border-t border-dashed border-[#dad4c8] bg-[#faf9f7] p-3">
                  <button
                    onClick={() => handleEdit(account.id, account.name, account.currency)}
                    className="flex flex-1 items-center justify-center gap-1 rounded-xl border border-[#dad4c8] bg-white px-3 py-2.5 text-xs font-semibold uppercase tracking-[1.08px] text-[#55534e] transition hover:translate-y-[-1px]"
                    title="Editar"
                  >
                    <EditIcon className="w-4 h-4" />
                    Editar
                  </button>
                  <button
                    onClick={() => {
                      const hasTransactions = transactions.some(
                        (t) => t.accountId === account.id
                      );
                      if (hasTransactions) {
                        alert("No podés eliminar una cuenta que tiene movimientos");
                        return;
                      }
                      if (confirm("¿Eliminar cuenta?")) {
                        void deleteAccount(account.id);
                      }
                    }}
                    className="flex flex-1 items-center justify-center gap-1 rounded-xl border px-3 py-2.5 text-xs font-semibold uppercase tracking-[1.08px] transition hover:translate-y-[-1px]"
                    style={{
                      borderColor: "rgba(252, 121, 129, 0.4)",
                      backgroundColor: "rgba(252, 121, 129, 0.1)",
                      color: "#fc7981",
                    }}
                    title="Eliminar"
                  >
                    <DeleteIcon className="w-4 h-4" />
                    Eliminar
                  </button>
                </div>
              )}
            </motion.div>
          );
        })}
      </motion.div>

      {createOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div
            className="mx-4 w-full max-w-md rounded-[28px] border bg-white p-8"
            style={{
              borderColor: "#dad4c8",
              boxShadow:
                "rgba(0,0,0,0.1) 0px 1px 1px, rgba(0,0,0,0.04) 0px -1px 1px inset, rgba(0,0,0,0.05) 0px -0.5px 1px",
            }}
          >
            <h2 className="mb-6 text-[20px] font-semibold text-black">Nueva cuenta</h2>

            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-semibold text-[#55534e]">Nombre</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ej: Banco Nación, Billetera, etc"
                  className="w-full rounded-xl border px-4 py-3 font-medium text-black outline-none transition"
                  style={{ borderColor: "#dad4c8", backgroundColor: "#faf9f7" }}
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-[#55534e]">Moneda</label>
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value as CurrencyCode)}
                  className="w-full rounded-xl border px-4 py-3 font-medium text-black outline-none transition"
                  style={{ borderColor: "#dad4c8", backgroundColor: "#faf9f7" }}
                >
                  <option value="ARS">Pesos argentinos</option>
                  <option value="USD">Dólares</option>
                  <option value="EUR">Euros</option>
                </select>
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setCreateOpen(false)}
                className="flex-1 rounded-xl border px-4 py-3 font-semibold text-[#55534e] transition hover:translate-y-[-1px]"
                style={{ borderColor: "#dad4c8", backgroundColor: "#faf9f7" }}
              >
                Cancelar
              </button>
              <button
                onClick={handleAdd}
                className="flex-1 rounded-xl border px-4 py-3 font-semibold text-black transition hover:translate-y-[-1px]"
                style={{ backgroundColor: "#fbbd41", borderColor: "#000000" }}
              >
                Crear cuenta
              </button>
            </div>
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
