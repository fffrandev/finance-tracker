"use client";

import { Skeleton } from "boneyard-js/react";
import "@/bones/registry";

export function DashboardLoadingSkeleton() {
  return (
    <Skeleton name="dashboard-page" loading={true} animate="pulse">
      <div className="space-y-8">
        {/* Filter Button */}
        <div className="flex justify-end mb-2">
          <div className="h-8 w-8 rounded-lg bg-gray-200"></div>
        </div>

        {/* Transfer Button */}
        <div className="space-y-4 glass p-5 rounded-2xl">
          <div className="h-10 rounded-lg bg-gray-200"></div>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="h-24 rounded-3xl bg-gray-200"></div>
            <div className="h-24 rounded-3xl bg-gray-200"></div>
            <div className="h-24 rounded-3xl bg-gray-200"></div>
          </div>
        </div>

        {/* Balance Cards */}
        <div className="grid md:grid-cols-3 gap-4">
          <div className="h-32 rounded-3xl bg-gray-200"></div>
          <div className="h-32 rounded-3xl bg-gray-200"></div>
          <div className="h-32 rounded-3xl bg-gray-200"></div>
        </div>

        {/* Charts */}
        <div className="grid md:grid-cols-2 gap-4">
          <div className="h-96 rounded-3xl bg-gray-200"></div>
          <div className="h-96 rounded-3xl bg-gray-200"></div>
        </div>
      </div>
    </Skeleton>
  );
}
