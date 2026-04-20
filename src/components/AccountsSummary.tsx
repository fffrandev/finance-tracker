"use client";

import Image from "next/image";
import TT from "../../assets/TT.png";
import { useAccounts } from "@/context/AccountsContext";
import { useTransactions } from "@/context/TransactionsContext";
import { Transaction } from "@/types/transaction";
import { formatMoney } from "@/utils/currency";
import { motion } from "framer-motion";

type Props = {
  transactions: Transaction[];
};

export default function AccountsSummary({ transactions }: Props) {
  const { accounts } = useAccounts();
  const { getAccountBalanceFromList } = useTransactions();

  const gradients = [
    "linear-gradient(135deg, #f8cc65 0%, #fbbd41 100%)",
    "linear-gradient(135deg, #84e7a5 0%, #078a52 100%)",
    "linear-gradient(135deg, #3bd3fd 0%, #0089ad 100%)",
    "linear-gradient(135deg, #c1b0ff 0%, #43089f 100%)",
    "linear-gradient(135deg, #fc7981 0%, #f8cc65 100%)",
    "linear-gradient(135deg, #01418d 0%, #3bd3fd 100%)",
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  return (
    <motion.div
      className="grid gap-5 md:grid-cols-3"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {accounts.map((acc, idx) => {
        const balance = getAccountBalanceFromList(acc.id, transactions);
        const gradient = gradients[idx % gradients.length];

        return (
          <motion.div
            key={acc.id}
            whileHover={{ y: -6 }}
            className="relative overflow-hidden rounded-[28px] border border-[#dad4c8] bg-white"
            style={{
              boxShadow:
                "rgba(0,0,0,0.1) 0px 1px 1px, rgba(0,0,0,0.04) 0px -1px 1px inset, rgba(0,0,0,0.05) 0px -0.5px 1px",
            }}
          >
            <div
              className="flex min-h-[190px] flex-col justify-between p-5"
              style={{ background: gradient }}
            >
              <motion.div
                className="flex justify-between items-start"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[1.08px] text-black/70">
                    Saldo disponible
                  </p>
                  <p className="mt-1 text-[30px] font-semibold -tracking-[0.06em] text-black">
                    {formatMoney(balance, acc.currency)}
                  </p>
                </div>
                <div className="rounded-full border border-black/10 bg-white/70 px-3 py-1.5 text-xs font-semibold uppercase tracking-[1.08px] text-black">
                  {acc.currency}
                </div>
              </motion.div>

              <motion.div
                className="flex justify-between items-end"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[1.08px] text-black/65">
                    Cuenta
                  </p>
                  <p className="mt-1 text-lg font-semibold text-black">{acc.name}</p>
                </div>
                <motion.div className="relative h-10 w-10" whileHover={{ scale: 1.05 }}>
                  <Image
                    src={TT}
                    alt="logo"
                    width={40}
                    height={40}
                    className="h-full w-full object-contain"
                  />
                </motion.div>
              </motion.div>
            </div>
          </motion.div>
        );
      })}
    </motion.div>
  );
}
