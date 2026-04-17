"use client";

import { CurrencyCode } from "@/types/account";
import { formatMoney } from "@/utils/currency";
import { motion } from "framer-motion";

type Props = {
  title: string;
  amount: number;
  currency?: CurrencyCode;
  tone?: "matcha" | "pomegranate" | "lemon";
};

const tones = {
  matcha: {
    backgroundColor: "rgba(132, 231, 165, 0.2)",
    borderColor: "rgba(7, 138, 82, 0.18)",
    dot: "#078a52",
  },
  pomegranate: {
    backgroundColor: "rgba(252, 121, 129, 0.12)",
    borderColor: "rgba(252, 121, 129, 0.24)",
    dot: "#fc7981",
  },
  lemon: {
    backgroundColor: "rgba(248, 204, 101, 0.22)",
    borderColor: "rgba(208, 138, 17, 0.2)",
    dot: "#d08a11",
  },
} as const;

export default function BalanceCard({
  title,
  amount,
  currency = "ARS",
  tone = "lemon",
}: Props) {
  const cardTone = tones[tone];
  const isPositive = amount >= 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3 }}
      className="relative overflow-hidden rounded-[28px] border p-6"
      style={{
        ...cardTone,
        boxShadow:
          "rgba(0,0,0,0.1) 0px 1px 1px, rgba(0,0,0,0.04) 0px -1px 1px inset, rgba(0,0,0,0.05) 0px -0.5px 1px",
      }}
    >
      <motion.div
        className="absolute inset-x-0 top-0 h-1"
        initial={{ width: 0 }}
        animate={{ width: "100%" }}
        transition={{ duration: 0.45, ease: "easeOut" }}
        style={{ backgroundColor: cardTone.dot }}
      />

      <motion.div
        className="absolute -right-16 -top-16 h-32 w-32 rounded-full blur-3xl"
        animate={{ scale: [1, 1.08, 1] }}
        transition={{ duration: 4, repeat: Infinity }}
        style={{ backgroundColor: `${cardTone.dot}22` }}
      />

      <div className="relative z-10">
        <p className="text-xs font-semibold uppercase tracking-[1.08px] text-[#55534e]">
          {title}
        </p>
        <p className="mt-3 text-[30px] font-semibold -tracking-[0.06em] text-black">
          {formatMoney(amount, currency)}
        </p>
        <div className="mt-4 flex items-center gap-2">
          <span
            className="h-2 w-2 rounded-full"
            style={{ backgroundColor: cardTone.dot }}
          />
          <span className="text-xs font-semibold uppercase tracking-[1.08px] text-[#55534e]">
            {isPositive ? "Saldo positivo" : "Saldo negativo"}
          </span>
        </div>
      </div>
    </motion.div>
  );
}
