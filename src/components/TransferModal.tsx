"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { useAccounts } from "@/context/AccountsContext";
import { useTransactions } from "@/context/TransactionsContext";
import CloseIcon from "@mui/icons-material/Close";
import { convertCurrency, formatExchangeRateLabel, formatMoney } from "@/utils/currency";

type Props = {
  open: boolean;
  onClose: () => void;
};

export default function TransferModal({ open, onClose }: Props) {
  const { accounts } = useAccounts();
  const { transferBetweenAccounts, getAccountBalance } = useTransactions();

  const today = new Date().toISOString().split("T")[0];

  const [form, setForm] = useState({
    fromAccountId: "",
    toAccountId: "",
    amount: "",
    date: today,
  });

  const selectedBalance = getAccountBalance(form.fromAccountId);
  const amountNumber = Number(form.amount || 0);
  const insufficient = amountNumber > selectedBalance;
  const fromAccount = accounts.find((account) => account.id === form.fromAccountId);
  const toAccount = accounts.find((account) => account.id === form.toAccountId);
  const previewAmount =
    fromAccount && toAccount && amountNumber
      ? convertCurrency(amountNumber, fromAccount.currency, toAccount.currency)
      : 0;

  const handleTransfer = async () => {
    if (
      !amountNumber ||
      !form.fromAccountId ||
      !form.toAccountId ||
      form.fromAccountId === form.toAccountId ||
      insufficient
    ) return;

    await transferBetweenAccounts({
      ...form,
      amount: amountNumber,
    });

    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            onClick={(event) => event.stopPropagation()}
            initial={{ scale: 0.95, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="w-full max-w-md space-y-5 rounded-3xl bg-white p-6 text-black shadow-2xl"
            style={{ border: '1px solid #dad4c8' }}
          >
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-[20px] font-bold text-black">
                Transferir dinero
              </h2>
              <button
                onClick={onClose}
                className="flex h-10 w-10 items-center justify-center rounded-full text-black transition hover:bg-[#faf9f7]"
                style={{ border: '1px solid #dad4c8' }}
                aria-label="Cerrar modal"
              >
                <CloseIcon fontSize="small" />
              </button>
            </div>

            {/* DESDE */}
            <select
              value={form.fromAccountId}
              onChange={(e) =>
                setForm({ ...form, fromAccountId: e.target.value })
              }
              className="w-full rounded-xl border bg-white p-3 text-black outline-none transition focus:ring-2"
              style={{ borderColor: '#dad4c8' }}
              onFocus={(e) => (e.currentTarget.style.boxShadow = 'inset 0 0 0 2px #fbbd41')}
              onBlur={(e) => (e.currentTarget.style.boxShadow = 'none')}
            >
              <option value="">Desde cuenta</option>
              {accounts.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.name}
                </option>
              ))}
            </select>

            {/* SALDO */}
            {form.fromAccountId && (
              <p className="text-sm" style={{ color: '#9f9b93' }}>
                Disponible:{" "}
                <span className="font-semibold text-black">
                  {formatMoney(selectedBalance, fromAccount?.currency ?? "ARS")}
                </span>
              </p>
            )}

            {/* HACIA */}
            <select
              value={form.toAccountId}
              onChange={(e) =>
                setForm({ ...form, toAccountId: e.target.value })
              }
              className="w-full rounded-xl border bg-white p-3 text-black outline-none transition focus:ring-2"
              style={{ borderColor: '#dad4c8' }}
              onFocus={(e) => (e.currentTarget.style.boxShadow = 'inset 0 0 0 2px #fbbd41')}
              onBlur={(e) => (e.currentTarget.style.boxShadow = 'none')}
            >
              <option value="">Hacia cuenta</option>
              {accounts.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.name}
                </option>
              ))}
            </select>

            {/* MONTO */}
            <input
              type="text"
              inputMode="numeric"
              placeholder="Monto"
              value={form.amount}
              onChange={(e) => {
                const value = e.target.value;
                if (/^\d*\.?\d*$/.test(value)) {
                  setForm({ ...form, amount: value });
                }
              }}
              className="w-full rounded-xl border bg-white p-3 text-black outline-none transition focus:ring-2"
              style={{ borderColor: '#dad4c8' }}
              onFocus={(e) => (e.currentTarget.style.boxShadow = 'inset 0 0 0 2px #fbbd41')}
              onBlur={(e) => (e.currentTarget.style.boxShadow = 'none')}
            />

            {/* ERROR */}
            {insufficient && (
              <p className="text-sm font-medium" style={{ color: '#fc7981' }}>
                No tenés saldo suficiente
              </p>
            )}

            {fromAccount && toAccount && fromAccount.currency !== toAccount.currency && amountNumber > 0 && (
              <div className="rounded-2xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
                <p className="font-semibold">
                  Recibís {formatMoney(previewAmount, toAccount.currency)}
                </p>
                <p className="mt-1">{formatExchangeRateLabel(fromAccount.currency, toAccount.currency)}</p>
              </div>
            )}

            {/* FECHA */}
            <input
              type="date"
              value={form.date}
              onChange={(e) =>
                setForm({ ...form, date: e.target.value })
              }
              className="w-full rounded-xl border border-blue-200 bg-blue-50 p-3 text-black outline-none transition focus:border-blue-600 focus:bg-white"
            />

            {/* BOTÓN PRINCIPAL */}
            <button
              onClick={handleTransfer}
              disabled={insufficient}
              className={`w-full py-3 rounded-xl font-semibold transition ${
                insufficient
                  ? "bg-blue-100 text-blue-600"
                  : "bg-[#FACC15] text-black hover:brightness-95"
              }`}
            >
              Transferir
            </button>

            {/* CANCELAR */}
            <button
              onClick={onClose}
              className="w-full rounded-xl border border-blue-200 py-3 text-blue-700 transition hover:bg-blue-50"
            >
              Cancelar
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
