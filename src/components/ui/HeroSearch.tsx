"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function HeroSearch() {
  const router = useRouter();
  const [query, setQuery] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/modules?q=${encodeURIComponent(query.trim())}`);
    } else {
      router.push("/modules");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="hero-fade hero-fade-3 mx-auto mt-10 flex max-w-lg overflow-hidden rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm"
    >
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Rechercher un module, un concept..."
        className="flex-1 bg-transparent px-5 py-3.5 text-sm text-white outline-none placeholder:text-gray-500"
      />
      <button
        type="submit"
        className="bg-[#1D9E75] px-6 py-3.5 text-sm font-medium text-white transition-colors hover:bg-[#178a64]"
      >
        Rechercher
      </button>
    </form>
  );
}
