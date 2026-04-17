"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { checkEmailExists, validateRegisterForm } from "@/utils/auth";
import Image from "next/image";
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

export default function AuthForm() {
  const { signIn, signUp, authLoading } = useAuth();

  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!email.trim() || !password.trim()) {
      setError("Completá email y contraseña.");
      return;
    }

    if (mode === "login") {
      const result = await signIn(email.trim(), password);
      if (result.error) setError(result.error);
      return;
    }

    const registerError = validateRegisterForm({
      email,
      password,
      confirmPassword,
    });

    if (registerError) {
      setError(registerError);
      return;
    }

    try {
      const exists = await checkEmailExists(email.trim());
      if (exists) {
        setError("Ese email ya está registrado.");
        return;
      }
    } catch (err) {
      setError("No se pudo validar el email.");
      return;
    }

    const result = await signUp(email.trim(), password);

    if (result.error) {
      setError(result.error);
      return;
    }

    if (result.needsEmailConfirmation) {
      setMessage("Revisá tu email para confirmar la cuenta.");
      setMode("login");
      setConfirmPassword("");
      return;
    }

    setMessage("Cuenta creada correctamente.");
    setConfirmPassword("");
  };

  return (
    <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-xl shadow-black/5 transition-all">
      
      {/* LOGO */}
      <div className="mb-6 flex justify-center">
        <Image
          src="/assets/LOGO.png"
          alt="FinanceTracker Logo"
          width={180}
          height={50}
          priority
        />
      </div>

      {/* TITULO */}
      <div className="mb-6 text-center">
        <h4 className="text-2xl font-bold text-black">
          {mode === "login" ? "Iniciar sesión" : "Crear cuenta"}
        </h4>
        <p className="text-sm text-gray-500 mt-1">
          {mode === "login"
            ? "Ingresá tus datos para continuar"
            : "Completá los datos para registrarte"}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">

        {/* EMAIL */}
        <div>
          <label className="mb-1 block text-xs font-bold uppercase text-gray-600">
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="tu@email.com"
            className="w-full rounded-2xl border-2 border-[#dad4c8] px-4 py-3 text-black outline-none transition-all placeholder:text-gray-400 focus:border-[#fbbd41] focus:ring-2 focus:ring-[#fbbd41]/30"
          />
        </div>

        {/* PASSWORD */}
        <div>
          <label className="mb-1 block text-xs font-bold uppercase text-gray-600">
            Contraseña
          </label>

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="********"
              className="w-full rounded-2xl border-2 border-[#dad4c8] px-4 py-3 pr-12 text-black outline-none transition-all placeholder:text-gray-400 focus:border-[#fbbd41] focus:ring-2 focus:ring-[#fbbd41]/30"
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-500 hover:text-black"
            >
              
              {showPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
            </button>
          </div>
        </div>

        {/* CONFIRM PASSWORD */}
        {mode === "register" && (
          <div>
            <label className="mb-1 block text-xs font-bold uppercase text-gray-600">
              Repetir contraseña
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="********"
              className="w-full rounded-2xl border-2 border-[#dad4c8] px-4 py-3 text-black outline-none transition-all placeholder:text-gray-400 focus:border-[#fbbd41] focus:ring-2 focus:ring-[#fbbd41]/30"
            />
          </div>
        )}

        {/* ERROR / MESSAGE */}
        {error && (
          <p className="text-sm font-medium text-red-500">{error}</p>
        )}
        {message && (
          <p className="text-sm font-medium text-green-600">{message}</p>
        )}

        {/* BUTTON */}
        <button
          type="submit"
          disabled={authLoading}
          className="w-full rounded-2xl bg-gradient-to-r from-[#fbbd41] to-[#f8cc65] px-4 py-3 font-bold text-black transition hover:brightness-95 disabled:opacity-50"
        >
          {authLoading
            ? "Procesando..."
            : mode === "login"
            ? "Entrar"
            : "Crear cuenta"}
        </button>
      </form>

      {/* SWITCH MODE */}
      <div className="mt-6 text-center text-sm text-gray-600">
        {mode === "login" ? (
          <>
            ¿No tenés cuenta?{" "}
            <button
              onClick={() => setMode("register")}
              className="font-semibold text-black hover:underline"
            >
              Crear cuenta
            </button>
          </>
        ) : (
          <>
            ¿Ya tenés cuenta?{" "}
            <button
              onClick={() => setMode("login")}
              className="font-semibold text-black hover:underline"
            >
              Iniciar sesión
            </button>
          </>
        )}
      </div>
    </div>
  );
}