"use client";

import { Skeleton } from "boneyard-js/react";
import "@/bones/registry";

export default function DashboardSkeleton({ children }: { children: React.ReactNode; loading?: boolean }) {
  return (
    <Skeleton name="dashboard" loading={false} animate="pulse">
      {children}
    </Skeleton>
  );
}
