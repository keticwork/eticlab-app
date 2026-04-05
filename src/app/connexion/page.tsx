"use client";

import Link from "next/link";
import { useState } from "react";
import { GoogleAuthButton, LoginForm, SignupForm } from "@/components/auth/AuthButton";

export default function ConnexionPage() {
  const [mode, setMode] = useState<"login" | "signup">("login");

  return (
    <section className="flex min-h-[calc(100vh-120px)] items-center justify-center bg-[#0A0F0D] px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="mb-8 text-center">
          <Link href="/" className="text-3xl font-bold">
            <span className="text-white">Etic</span>
            <span className="text-[#1D9E75]">Lab</span>
          </Link>
        </div>

        {/* Carte */}
        <div className="rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-sm">
          {/* Onglets */}
          <div className="mb-6 flex rounded-lg border border-white/10 bg-white/5">
            <button
              onClick={() => setMode("login")}
              className={`flex-1 rounded-lg py-2.5 text-sm font-medium transition-colors ${
                mode === "login"
                  ? "bg-[#1D9E75] text-white"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Se connecter
            </button>
            <button
              onClick={() => setMode("signup")}
              className={`flex-1 rounded-lg py-2.5 text-sm font-medium transition-colors ${
                mode === "signup"
                  ? "bg-[#1D9E75] text-white"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Créer un compte
            </button>
          </div>

          {/* Google */}
          <GoogleAuthButton />

          {/* Séparateur */}
          <div className="my-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-white/10" />
            <span className="text-xs text-gray-500">ou</span>
            <div className="h-px flex-1 bg-white/10" />
          </div>

          {/* Formulaire */}
          {mode === "login" ? <LoginForm /> : <SignupForm />}

          {/* Mot de passe oublié */}
          {mode === "login" && (
            <div className="mt-4 text-center">
              <Link
                href="/reset-password"
                className="text-xs text-gray-500 underline underline-offset-2 hover:text-gray-300"
              >
                Mot de passe oublié ?
              </Link>
            </div>
          )}
        </div>

        {/* CGU */}
        <p className="mt-6 text-center text-xs text-gray-600">
          En continuant, tu acceptes nos{" "}
          <Link
            href="/cgu"
            className="text-gray-400 underline underline-offset-2 hover:text-white"
          >
            CGU
          </Link>
        </p>
      </div>
    </section>
  );
}
