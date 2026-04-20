"use client";

import { useState, useMemo } from "react";
import { useSavingGoals } from "@/context/SavingGoalsContext";
import { useAccounts } from "@/context/AccountsContext";
import { useTransactions } from "@/context/TransactionsContext";
import { getSavingGoalProgress } from "@/utils/finance";
import { formatMoney } from "@/utils/currency";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import { CurrencyCode } from "@/types/account";
import { motion } from "framer-motion";

export default function SavingGoalsPage() {
  const { savingGoals, addSavingGoal, deleteSavingGoal } = useSavingGoals();
  const { accounts } = useAccounts();
  const { transactions } = useTransactions();

  const [createOpen, setCreateOpen] = useState(false);
  const [goalForm, setGoalForm] = useState({
    name: "",
    targetAmount: "",
    accountId: "",
    targetDate: new Date().toISOString().slice(0, 10),
    currency: "ARS" as CurrencyCode,
  });

  const handleAddGoal = async () => {
    if (!goalForm.accountId) return;
    const selectedAccount = accounts.find((a) => a.id === goalForm.accountId);
    await addSavingGoal({
      name: goalForm.name,
      targetAmount: parseFloat(goalForm.targetAmount) || 0,
      accountId: goalForm.accountId,
      targetDate: goalForm.targetDate,
      currency: selectedAccount?.currency || "ARS",
    });
    setGoalForm({
      name: "",
      targetAmount: "",
      accountId: "",
      targetDate: new Date().toISOString().slice(0, 10),
      currency: "ARS",
    });
    setCreateOpen(false);
  };

  const sortedGoals = useMemo(
    () => [...savingGoals].sort((a, b) => a.name.localeCompare(b.name)),
    [savingGoals],
  );

  return (
    <div className="space-y-6">
      {/* Header with Add Button */}
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium" style={{ color: "#9f9b93" }}>
          Gestiona tus metas de ahorro
        </p>
        <button
          onClick={() => setCreateOpen(true)}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-[#fbbd41] to-[#f8cc65] text-black font-bold text-lg transition hover:brightness-95"
          aria-label="Nueva meta"
        >
          +
        </button>
      </div>

      {/* Goals Grid */}
      {sortedGoals.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-3xl border-2 py-16 text-center"
          style={{ borderColor: "#dad4c8", backgroundColor: "#faf9f7" }}
        >
          <p className="text-lg font-semibold text-black">
            No tienes metas de ahorro aún
          </p>
          <p className="mt-2 text-sm" style={{ color: "#9f9b93" }}>
            Crea tu primera meta para empezar a ahorrar
          </p>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid gap-4 md:grid-cols-2 lg:grid-cols-3"
        >
          {sortedGoals.map((goal) => {
            const account = accounts.find((a) => a.id === goal.accountId);
            const progress = getSavingGoalProgress(
              goal,
              accounts,
              transactions,
            );
            const progressPercent = Math.min(
              (progress.currentAmount / goal.targetAmount) * 100,
              100,
            );

            return (
              <motion.div
                key={goal.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="rounded-2xl border-2 bg-white p-6 shadow-sm transition hover:shadow-md"
                style={{ borderColor: "#dad4c8" }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-black">
                      {goal.name}
                    </h3>
                    <p
                      className="text-sm font-medium"
                      style={{ color: "#9f9b93" }}
                    >
                      {account?.name || "Cuenta desconocida"}
                    </p>
                  </div>
                  <button
                    onClick={() => deleteSavingGoal(goal.id)}
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-[#fc7981] transition"
                    style={{ color: "#fc7981" }}
                  >
                    <DeleteIcon className="w-5 h-5" />
                  </button>
                </div>

                {/* Progress Bar */}
                <div className="mb-4 space-y-2">
                  <div
                    className="h-2 w-full rounded-full overflow-hidden"
                    style={{ backgroundColor: "#f0ede8" }}
                  >
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${progressPercent}%` }}
                      transition={{ duration: 0.6, ease: "easeOut" }}
                      className="h-full"
                      style={{
                        background:
                          "linear-gradient(to right, #078a52, #078a52)",
                      }}
                    />
                  </div>
                  <div
                    className="flex justify-between text-xs font-medium"
                    style={{ color: "#9f9b93" }}
                  >
                    <span>
                      {formatMoney(
                        progress.currentAmount,
                        account?.currency || "ARS",
                      )}
                    </span>
                    <span>{Math.round(progressPercent)}%</span>
                  </div>
                </div>

                {/* Target Info */}
                <div
                  className="space-y-2 border-t pt-4"
                  style={{ borderColor: "#dad4c8" }}
                >
                  <div className="flex justify-between">
                    <span
                      className="text-sm font-medium"
                      style={{ color: "#9f9b93" }}
                    >
                      Meta:
                    </span>
                    <span className="font-bold text-black">
                      {formatMoney(
                        goal.targetAmount,
                        account?.currency || "ARS",
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span
                      className="text-sm font-medium"
                      style={{ color: "#9f9b93" }}
                    >
                      Falta:
                    </span>
                    <span className="font-bold text-black">
                      {formatMoney(
                        Math.max(0, goal.targetAmount - progress.currentAmount),
                        account?.currency || "ARS",
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span
                      className="text-sm font-medium"
                      style={{ color: "#9f9b93" }}
                    >
                      Fecha límite:
                    </span>
                    <span className="text-sm font-medium text-black">
                      {new Date(goal.targetDate).toLocaleDateString("es-ES")}
                    </span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      )}

      {/* Create Modal */}
      {createOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="rounded-3xl border-2 bg-white p-8 shadow-2xl w-full max-w-md mx-4"
            style={{ borderColor: "#dad4c8" }}
          >
            <h2 className="mb-6 text-[20px] font-bold text-black">
              Nueva meta de ahorro
            </h2>

            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-bold text-black">
                  Nombre
                </label>
                <input
                  type="text"
                  value={goalForm.name}
                  onChange={(e) =>
                    setGoalForm({ ...goalForm, name: e.target.value })
                  }
                  placeholder="Ej: Vacaciones, Auto, Casa"
                  className="w-full rounded-xl border-2 bg-white px-4 py-3 text-black font-medium outline-none transition focus:ring-2"
                  style={{ borderColor: "#dad4c8" }}
                  onFocus={(e) =>
                    (e.currentTarget.style.boxShadow =
                      "inset 0 0 0 2px #fbbd41")
                  }
                  onBlur={(e) => (e.currentTarget.style.boxShadow = "none")}
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-bold text-black">
                  Monto objetivo
                </label>
                <input
                  type="number"
                  value={goalForm.targetAmount}
                  onChange={(e) =>
                    setGoalForm({
                      ...goalForm,
                     targetAmount: e.target.value,
                    })
                  }
                  placeholder="0.00"
                  className="w-full rounded-xl border-2 bg-white px-4 py-3 text-black font-medium outline-none transition focus:ring-2"
                  style={{ borderColor: "#dad4c8" }}
                  onFocus={(e) =>
                    (e.currentTarget.style.boxShadow =
                      "inset 0 0 0 2px #fbbd41")
                  }
                  onBlur={(e) => (e.currentTarget.style.boxShadow = "none")}
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-bold text-black">
                  Cuenta
                </label>
                <select
                  value={goalForm.accountId}
                  onChange={(e) =>
                    setGoalForm({ ...goalForm, accountId: e.target.value })
                  }
                  className="w-full rounded-xl border-2 bg-white px-4 py-3 text-black font-medium outline-none transition focus:ring-2"
                  style={{ borderColor: "#dad4c8" }}
                  onFocus={(e) =>
                    (e.currentTarget.style.boxShadow =
                      "inset 0 0 0 2px #fbbd41")
                  }
                  onBlur={(e) => (e.currentTarget.style.boxShadow = "none")}
                >
                  <option value="">Seleccionar cuenta...</option>
                  {accounts.map((account) => (
                    <option key={account.id} value={account.id}>
                      {account.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-bold text-black">
                  Fecha límite
                </label>
                <input
                  type="date"
                  value={goalForm.targetDate}
                  onChange={(e) =>
                    setGoalForm({ ...goalForm, targetDate: e.target.value })
                  }
                  className="w-full rounded-xl border-2 bg-white px-4 py-3 text-black font-medium outline-none transition focus:ring-2"
                  style={{ borderColor: "#dad4c8" }}
                  onFocus={(e) =>
                    (e.currentTarget.style.boxShadow =
                      "inset 0 0 0 2px #fbbd41")
                  }
                  onBlur={(e) => (e.currentTarget.style.boxShadow = "none")}
                />
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setCreateOpen(false)}
                className="flex-1 rounded-xl border-2 px-4 py-3 font-bold transition hover:brightness-95"
                style={{
                  borderColor: "#dad4c8",
                  color: "#9f9b93",
                  backgroundColor: "#faf9f7",
                }}
              >
                Cancelar
              </button>
              <button
                onClick={handleAddGoal}
                className="flex-1 rounded-xl px-4 py-3 font-bold text-black transition hover:brightness-95"
                style={{
                  background: "linear-gradient(to right, #fbbd41, #f8cc65)",
                }}
              >
                Crear meta
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
