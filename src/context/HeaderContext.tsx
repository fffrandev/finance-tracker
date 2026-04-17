"use client";

import React, { createContext, useContext, useState } from "react";

type HeaderAction = {
  icon: React.ReactNode;
  onClick: () => void;
  tooltip?: string;
};

type HeaderContextType = {
  action: HeaderAction | null;
  setAction: (action: HeaderAction | null) => void;
};

const HeaderContext = createContext<HeaderContextType | undefined>(undefined);

export function HeaderProvider({ children }: { children: React.ReactNode }) {
  const [action, setAction] = useState<HeaderAction | null>(null);

  return (
    <HeaderContext.Provider value={{ action, setAction }}>
      {children}
    </HeaderContext.Provider>
  );
}

export function useHeader() {
  const context = useContext(HeaderContext);
  if (context === undefined) {
    throw new Error("useHeader must be used within HeaderProvider");
  }
  return context;
}
