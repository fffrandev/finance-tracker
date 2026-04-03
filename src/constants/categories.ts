import { Category } from "@/types/category";

export const defaultCategories: Category[] = [
  // 🟥 Gastos
  { id: "food", name: "Comida", type: "expense" },
  { id: "transport", name: "Transporte", type: "expense" },
  { id: "shopping", name: "Compras", type: "expense" },
  { id: "bills", name: "Servicios", type: "expense" },

  // 🟩 Ingresos
  { id: "salary", name: "Sueldo", type: "income" },
  { id: "transfer", name: "Transferencia", type: "income" },
  { id: "refund", name: "Devolución", type: "income" },
];