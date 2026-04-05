"use client";

import Link from "next/link";
import { useState } from "react";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

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
          <Link
            href="/connexion"
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
          >
            Connexion
          </Link>
          <Link
            href="/commencer"
            className="rounded-lg bg-[#0F6E56] px-4 py-2 text-sm text-white hover:bg-[#0b5a46]"
          >
            Commencer
          </Link>
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
            <Link
              href="/connexion"
              className="text-sm text-gray-600 hover:text-black"
              onClick={() => setMenuOpen(false)}
            >
              Connexion
            </Link>
            <Link
              href="/commencer"
              className="rounded-lg bg-[#0F6E56] px-4 py-2 text-center text-sm text-white hover:bg-[#0b5a46]"
              onClick={() => setMenuOpen(false)}
            >
              Commencer
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
