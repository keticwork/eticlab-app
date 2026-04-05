"use client";

import Link from "next/link";
import { useState } from "react";
import { createClient } from "@/lib/supabase-client";

export default function ResetPasswordPage() {
  const supabase = createClient();
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/callback`,
    });

    if (error) {
      setError(error.message);
      return;
    }

    setSent(true);
  };

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
          <h1 className="mb-2 text-center text-xl font-bold text-white">
            Mot de passe oublié
          </h1>
          <p className="mb-6 text-center text-sm text-gray-500">
            Entre ton email pour recevoir un lien de réinitialisation.
          </p>

          {sent ? (
            <div className="rounded-lg border border-[#1D9E75]/30 bg-[#1D9E75]/10 p-4 text-center">
              <p className="text-sm text-[#1D9E75]">
                Lien envoyé ! Vérifie ta boîte mail.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
              <input
                type="email"
                name="email"
                placeholder="ton@email.com"
                required
                className="rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none placeholder:text-gray-600 focus:border-[#1D9E75]/50"
              />
              {error && <p className="text-xs text-red-400">{error}</p>}
              <button
                type="submit"
                className="rounded-lg bg-[#1D9E75] px-6 py-3 text-sm font-medium text-white transition-all hover:-translate-y-0.5 hover:bg-[#178a64]"
              >
                Envoyer le lien de réinitialisation
              </button>
            </form>
          )}

          <div className="mt-6 text-center">
            <Link
              href="/connexion"
              className="text-xs text-gray-500 underline underline-offset-2 hover:text-gray-300"
            >
              ← Retour à la connexion
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
