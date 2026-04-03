"use client";

import { useState, useMemo, useEffect } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { Transaction } from "@/types/transaction";

export default function useTransactionsFilters(
  transactions: Transaction[],
  syncUrl: boolean = true
) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [type, setType] = useState(searchParams.get("type") || "all");
  const [category, setCategory] = useState(searchParams.get("category") || "");
  const [month, setMonth] = useState(searchParams.get("month") || "");

  useEffect(() => {
    if (!syncUrl) return;
    if (!pathname?.startsWith("/transactions")) return;

    const handler = setTimeout(() => {
      const params = new URLSearchParams();

      if (search) params.set("search", search);
      if (type !== "all") params.set("type", type);
      if (category) params.set("category", category);
      if (month) params.set("month", month);

      router.replace("/transactions?" + params.toString());
    }, 400);

    return () => clearTimeout(handler);
  }, [search, type, category, month, pathname, router, syncUrl]);

  // 🔥 categorías filtradas por tipo
  const categories = useMemo(() => {
    const list =
      type === "all"
        ? transactions
        : transactions.filter((t) => t.type === type);
    const uniqueCategories = new Map(
      list.map((t) => [t.category.id, t.category])
    );

    return Array.from(uniqueCategories.values());
  }, [transactions, type]);

  const filtered = useMemo(() => {
    return transactions.filter((t) => {
      if (type !== "all" && t.type !== type) return false;
      if (category && t.category.id !== category) return false;
      if (month && !t.date.startsWith(month)) return false;

      if (search) {
        const s = search.toLowerCase();
        return (
          t.description.toLowerCase().includes(s) ||
          t.category.name.toLowerCase().includes(s)
        );
      }

      return true;
    });
  }, [transactions, search, type, category, month]);

  return {
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
  };
}
