"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Skeleton } from "boneyard-js/react";
import { useAuth } from "@/context/AuthContext";
import AuthForm from "./AuthForm";
import "@/bones/registry";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { ready, loading, session } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const isAuthRoute = pathname.startsWith("/auth");

  useEffect(() => {
    if (!ready) return;

    if (!session && !isAuthRoute) {
      router.replace("/auth");
      return;
    }

    if (session && isAuthRoute) {
      router.replace("/transactions");
    }
  }, [ready, session, isAuthRoute, router]);

  if (!ready || loading) {
    return (
      <Skeleton name="auth-loading" loading animate="pulse" transition={300}>
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-white to-[#f5f3ef] px-4">
          <div className="w-full max-w-5xl grid gap-10 md:grid-cols-[1.2fr_0.8fr] items-center">
            <div className="space-y-6">
              <div className="h-6 w-40 rounded-md bg-gray-200" />
              <div className="h-10 w-80 rounded-md bg-gray-200" />
              <div className="space-y-3">
                <div className="h-4 w-full rounded-md bg-gray-200" />
                <div className="h-4 w-5/6 rounded-md bg-gray-200" />
              </div>
            </div>
            <div className="space-y-4">
              <div className="h-12 rounded-xl bg-gray-200" />
              <div className="h-12 rounded-xl bg-gray-200" />
              <div className="h-12 rounded-xl bg-gray-200" />
            </div>
          </div>
        </div>
      </Skeleton>
    );
  }

  if (!session) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-white to-[#f5f3ef] px-4">
        <div className="w-full max-w-6xl grid gap-12 md:grid-cols-[1.2fr_0.8fr] items-center">
          
          {/* LADO IZQUIERDO */}
          <div className="space-y-6">
            <h1 className="text-4xl md:text-5xl font-black leading-tight text-black">
              Controlá tus finanzas
              <span className="block text-[#fbbd41]">sin esfuerzo</span>
            </h1>

            <p className="text-lg text-gray-700 max-w-md">
              Visualizá tus movimientos, organizá tus cuentas y generá reportes en segundos.
            </p>

            <div className="flex gap-4 text-sm text-gray-500">
              <span>✔ Seguro</span>
              <span>✔ Simple</span>
              <span>✔ Rápido</span>
            </div>
          </div>

          {/* FORM */}
          <AuthForm />
        </div>
      </div>
    );
  }

  if (isAuthRoute) return null;

  return <>{children}</>;
}