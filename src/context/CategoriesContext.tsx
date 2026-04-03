"use client";

import { createContext, useContext, useState } from "react";
import { Category } from "@/types/category";
import { defaultCategories } from "@/constants/categories";

type ContextType = {
  categories: Category[];
  addCategory: (category: Category) => void;
};

const CategoriesContext = createContext<ContextType | null>(null);

export function CategoriesProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [categories, setCategories] = useState<Category[]>(
    defaultCategories
  );

  const addCategory = (category: Category) => {
    setCategories((prev) => [...prev, category]);
  };

  return (
    <CategoriesContext.Provider value={{ categories, addCategory }}>
      {children}
    </CategoriesContext.Provider>
  );
}

export const useCategories = () => {
  const ctx = useContext(CategoriesContext);
  if (!ctx) throw new Error("useCategories fuera de provider");
  return ctx;
};
