"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase-client";
import type { User } from "@supabase/supabase-js";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    window.location.href = "/";
  };

  const initials = user?.email
    ? user.email.slice(0, 2).toUpperCase()
    : "?";

  return (
    <nav className="border-b border-gray-200 bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        {/* Logo */}
        <Link href="/" className="text-xl font-bold">
          <span className="text-black">Etic</span>
          <span className="text-[#0F6E56]">Lab</span>
        </Link>

        {/* Liens — desktop */}
        <div className="hidden items-center gap-6 md:flex">
          <Link href="/modules" className="text-sm text-gray-600 hover:text-black">
            Modules
          </Link>
          <Link href="/arbre" className="text-sm text-gray-600 hover:text-black">
            L&apos;arbre
          </Link>
        </div>

        {/* Boutons — desktop */}
        <div className="hidden items-center gap-3 md:flex">
          {loading ? (
            <div className="h-8 w-24" />
          ) : user ? (
            <>
              <Link
                href="/ia"
                className="rounded-lg bg-[#1D9E75]/10 px-3 py-2 text-sm font-medium text-[#1D9E75] hover:bg-[#1D9E75]/20"
              >
                🤖 IA
              </Link>
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#0F6E56] text-xs font-bold text-white">
                {initials}
              </div>
              <button
                onClick={handleLogout}
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
              >
                Déconnexion
              </button>
            </>
          ) : (
            <>
              <Link
                href="/connexion"
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
              >
                Connexion
              </Link>
              <Link
                href="/connexion"
                className="rounded-lg bg-[#0F6E56] px-4 py-2 text-sm text-white hover:bg-[#0b5a46]"
              >
                Commencer
              </Link>
            </>
          )}
        </div>

        {/* Menu burger — mobile */}
        <button
          className="text-2xl text-gray-600 md:hidden"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Menu"
        >
          {menuOpen ? "✕" : "☰"}
        </button>
      </div>

      {/* Menu mobile */}
      {menuOpen && (
        <div className="border-t border-gray-200 px-4 py-4 md:hidden">
          <div className="flex flex-col gap-3">
            <Link
              href="/modules"
              className="text-sm text-gray-600 hover:text-black"
              onClick={() => setMenuOpen(false)}
            >
              Modules
            </Link>
            <Link
              href="/arbre"
              className="text-sm text-gray-600 hover:text-black"
              onClick={() => setMenuOpen(false)}
            >
              L&apos;arbre
            </Link>
            <hr className="border-gray-200" />
            {user ? (
              <>
                <Link
                  href="/ia"
                  className="text-sm font-medium text-[#1D9E75] hover:text-[#178a64]"
                  onClick={() => setMenuOpen(false)}
                >
                  🤖 Guide IA
                </Link>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#0F6E56] text-xs font-bold text-white">
                    {initials}
                  </div>
                  {user.email}
                </div>
                <button
                  onClick={() => { setMenuOpen(false); handleLogout(); }}
                  className="text-left text-sm text-gray-600 hover:text-black"
                >
                  Déconnexion
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/connexion"
                  className="text-sm text-gray-600 hover:text-black"
                  onClick={() => setMenuOpen(false)}
                >
                  Connexion
                </Link>
                <Link
                  href="/connexion"
                  className="rounded-lg bg-[#0F6E56] px-4 py-2 text-center text-sm text-white hover:bg-[#0b5a46]"
                  onClick={() => setMenuOpen(false)}
                >
                  Commencer
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
