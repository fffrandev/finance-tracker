"use client";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { Transaction } from "@/types/transaction";
import { formatMoney, getTransactionBaseAmount } from "@/utils/currency";
import { motion } from "framer-motion";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";

type Props = {
  transactions: Transaction[];
};

const COLORS = [
  "#078a52", // Matcha
  "#3bd3fd", // Slushie
  "#fbbd41", // Lemon
  "#43089f", // Ube
  "#fc7981", // Pomegranate
  "#01418d", // Blueberry
  "#084d2c", // Matcha Dark
  "#0089ad", // Slushie Dark
  "#d08a11", // Lemon Dark
  "#32037d", // Ube Dark
  "#c1b0ff", // Ube Light
  "#84e7a5", // Matcha Light
];

export default function CategoryChart({ transactions }: Props) {
  const data = Object.values(
    transactions.reduce(
      (acc: Record<string, { name: string; value: number }>, t) => {
        const key = t.category.id;
        const current = acc[key] || {
          name: t.category.name,
          value: 0,
        };

        acc[key] = {
          name: t.category.name,
          value: current.value + getTransactionBaseAmount(t),
        };

        return acc;
      },
      {}
    )
  );

  const total = data.reduce((acc, item) => acc + item.value, 0);

  return (
    <motion.div
      className="glass p-6 rounded-3xl h-96 flex flex-col"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <motion.div className="flex items-center gap-2 mb-6">
        <LocalOfferIcon className="text-[#078a52]" />
        <motion.h2
          className="font-black text-[20px] bg-gradient-to-r from-[#078a52] to-[#3bd3fd] bg-clip-text text-transparent uppercase tracking-widest"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          Por categoría
        </motion.h2>
      </motion.div>

      {data.length === 0 ? (
        <motion.p
          className="text-[#9f9b93] flex items-center justify-center flex-1"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          Sin transacciones
        </motion.p>
      ) : (
        <div className="flex items-center flex-1 gap-6 min-h-0">
          <div className="w-1/2 h-full min-h-0">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={data}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={80}
                  innerRadius={40}
                  paddingAngle={2}
                >
                  {data.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number) => formatMoney(value)}
                  contentStyle={{
                    backgroundColor: "rgba(255, 255, 255, 0.95)",
                    border: "2px solid #dad4c8",
                    borderRadius: "12px",
                    boxShadow: "rgba(0,0,0,0.1) 0px 1px 1px, rgba(0,0,0,0.04) 0px -1px 1px inset, rgba(0,0,0,0.05) 0px -0.5px 1px",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <motion.div
            className="w-1/2 space-y-3 max-h-80 overflow-y-auto pr-3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            {data.map((item, index) => (
              <motion.div
                key={item.name}
                className="flex items-center justify-between p-2 rounded-lg transition-all"
                style={{ backgroundColor: '#faf9f7', border: '1px solid #dad4c8' }}
                whileHover={{ scale: 1.02 }}
              >
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  />
                  <span className="text-xs font-semibold text-black">{item.name}</span>
                </div>
                <motion.span
                  className="text-xs font-bold text-black"
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  {((item.value / total) * 100).toFixed(0)}%
                </motion.span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      )}
    </motion.div>
  );
}
