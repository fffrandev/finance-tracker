"use client";

import "./globals.css";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { usePathname } from "next/navigation";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import DashboardIcon from "@mui/icons-material/Dashboard";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import AssignmentIcon from "@mui/icons-material/Assignment";
import MenuIcon from "@mui/icons-material/Menu";
import SavingsIcon from "@mui/icons-material/Savings";
import AuthGuard from "@/components/AuthGuard";
import { AppDataProvider } from "@/context/AppDataContext";
import { useAuth } from "@/context/AuthContext";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Manrope:wght@200;300;400;500;600;700;800&family=Space+Mono:wght@400;700&display=swap" rel="stylesheet" />
      </head>
      <body className="min-h-screen bg-[#faf9f7] text-black" style={{ fontFamily: "'Manrope', sans-serif" }}>
        <AppDataProvider>
          <AuthGuard>
            <AppShell>{children}</AppShell>
          </AuthGuard>
        </AppDataProvider>
      </body>
    </html>
  );
}

const menuItems = [
  { href: "/dashboard", label: "Dashboard", icon: DashboardIcon },
  { href: "/accounts", label: "Cuentas", icon: AccountBalanceWalletIcon },
  { href: "/transactions", label: "Movimientos", icon: SwapHorizIcon },
  { href: "/budgets", label: "Presupuestos", icon: TrendingUpIcon },
  { href: "/categories", label: "Categorías", icon: LocalOfferIcon },

  { href: "/saving-goals", label: "Metas", icon: SavingsIcon },
  { href: "/reports", label: "Reportes", icon: AssignmentIcon },
];

function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { session, signOut, authLoading } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const isAuthRoute = pathname === "/" || pathname.startsWith("/auth");

  if (isAuthRoute) {
    return <>{children}</>;
  }

  const handleSignOut = async () => {
    setSidebarOpen(false);
    await signOut();
  };

  return (
    <div className="min-h-screen md:grid md:h-screen md:grid-cols-[250px_1fr] md:overflow-hidden lg:grid-cols-[280px_1fr]">
      {/* Desktop Sidebar */}
      <aside
        className="hidden md:sticky md:top-0 md:flex md:h-screen md:flex-col md:overflow-hidden md:border-r md:bg-white md:shadow-lg"
        style={{ borderColor: "#dad4c8" }}
      >
        <div className="p-6 border-b flex items-center justify-center" style={{ borderColor: '#dad4c8' }}>
          <Image
            src="/assets/TRANSFERTRACKER.png"
            alt="FinanceTracker Logo"
            width={200}
            height={60}
            priority
            className="w-full h-auto"
          />
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map((item) => {
            const IconComponent = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition ${
                  pathname === item.href
                    ? "bg-gradient-to-r from-[#fbbd41] to-[#f8cc65] text-black"
                    : "text-black hover:bg-[#eff1f3]"
                }`}
              >
                <IconComponent className="w-5 h-5" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {session && (
          <div className="p-4">
            <button
              onClick={handleSignOut}
              disabled={authLoading}
              className="flex h-10 w-10 items-center justify-center rounded-full text-black transition hover:text-[#fbbd41] disabled:cursor-not-allowed disabled:opacity-50"
              title="Cerrar sesión"
            >
              <LogoutRoundedIcon />
            </button>
          </div>
        )}
      </aside>

      {/* Mobile Sidebar */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black/50 md:hidden">
          <aside className="flex h-full w-64 flex-col bg-white">
            <div className="p-6 border-b flex items-center justify-center" style={{ borderColor: '#dad4c8' }}>
              <Image
                src="/assets/LOGO.png"
                alt="FinanceTracker Logo"
                width={160}
                height={50}
                className="w-full h-auto"
              />
            </div>
            <nav className="flex-1 p-4 space-y-2">
              {menuItems.map((item) => {
                const IconComponent = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-black hover:bg-[#eff1f3] transition"
                    onClick={() => setSidebarOpen(false)}
                  >
                    <IconComponent className="w-5 h-5" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>

            {session && (
              <div className="border-t p-4" style={{ borderColor: "#dad4c8" }}>
                <button
                  onClick={handleSignOut}
                  disabled={authLoading}
                  className="flex w-full items-center gap-3 rounded-xl px-4 py-3 font-semibold text-black transition hover:bg-[#eff1f3] disabled:cursor-not-allowed disabled:opacity-50"
                  title="Cerrar sesión"
                >
                  <LogoutRoundedIcon className="w-5 h-5" />
                  <span>Cerrar sesión</span>
                </button>
              </div>
            )}
          </aside>
        </div>
      )}

      {/* Main Content */}
      <main className="flex min-h-screen flex-col md:h-screen md:overflow-hidden">
        {/* Header with action slot */}
        <header className="flex items-center justify-between px-4 py-4 md:px-6">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="flex h-10 w-10 items-center justify-center rounded-lg border text-black transition hover:bg-[#faf9f7] md:hidden"
            style={{ borderColor: '#dad4c8' }}
          >
            <MenuIcon className="w-5 h-5" />
          </button>
          <h1 className="flex-1 text-lg font-bold text-black text-center md:text-left">{getPageTitle(pathname)}</h1>
          <div id="header-action" className="w-10 flex items-center justify-center" />
        </header>

        {/* Content */}
        <section className="flex-1 overflow-y-auto p-4 md:p-6">{children}</section>
      </main>
    </div>
  );
}

function getPageTitle(pathname: string): string {
  const titles: Record<string, string> = {
    "/dashboard": "Dashboard",
    "/accounts": "Cuentas",
    "/transactions": "Movimientos",
    "/budgets": "Presupuestos",
    "/categories": "Categorías",
    "/saving-goals": "Metas de Ahorro",
    "/reports": "Reportes",
  };
  return titles[pathname] || "Finance Tracker";
}
