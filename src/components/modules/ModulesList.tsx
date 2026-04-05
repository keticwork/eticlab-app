"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";

type Module = {
  id: string;
  code: string;
  nom: string;
  description: string;
  statut: string;
  tags: string[];
  phaseNom: string;
  phaseCouleur: string;
  phaseCode: string;
};

type Phase = {
  code: string;
  nom: string;
  couleur: string;
  ordre: number;
  modules: Module[];
};

export function ModulesList({
  modules,
  phases,
}: {
  modules: Module[];
  phases: Phase[];
}) {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";
  const [search, setSearch] = useState(initialQuery);

  useEffect(() => {
    const q = searchParams.get("q");
    if (q) setSearch(q);
  }, [searchParams]);

  const filtered = modules.filter((m) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      m.code.toLowerCase().includes(q) ||
      m.nom.toLowerCase().includes(q) ||
      (m.description && m.description.toLowerCase().includes(q))
    );
  });

  // Group filtered modules by phase
  const groupedByPhase = phases
    .map((phase) => ({
      ...phase,
      modules: filtered.filter((m) => m.phaseCode === phase.code),
    }))
    .filter((phase) => phase.modules.length > 0);

  return (
    <>
      {/* Barre de recherche */}
      <div className="mx-auto mb-10 max-w-lg">
        <div className="flex overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
          <div className="flex items-center pl-4 text-gray-400">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </div>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher un module, un concept..."
            className="flex-1 px-3 py-3.5 text-sm text-gray-700 outline-none placeholder:text-gray-400"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="px-4 text-sm text-gray-400 hover:text-gray-600"
            >
              Effacer
            </button>
          )}
        </div>
      </div>

      {/* Résultats */}
      {filtered.length === 0 ? (
        <div className="py-16 text-center">
          <p className="text-lg text-gray-400">Aucun module trouvé</p>
          <p className="mt-2 text-sm text-gray-400">
            Essaie un autre terme de recherche.
          </p>
        </div>
      ) : (
        <div className="space-y-10">
          {groupedByPhase.map((phase) => (
            <div key={phase.code}>
              {/* Titre de phase */}
              <div className="mb-4 flex items-center gap-3">
                <div
                  className="h-3 w-3 rounded-full"
                  style={{ backgroundColor: phase.couleur }}
                />
                <h2 className="text-lg font-semibold text-gray-900">
                  {phase.nom}
                </h2>
                <span className="text-sm text-gray-400">
                  {phase.modules.length} module
                  {phase.modules.length > 1 ? "s" : ""}
                </span>
              </div>

              {/* Cards */}
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {phase.modules.map((m) => (
                  <Link
                    key={m.id}
                    href={`/modules/${m.code.toLowerCase()}`}
                    className="group flex flex-col rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-gray-300 hover:shadow-md"
                  >
                    <div className="flex items-start justify-between">
                      <span
                        className="rounded-md px-2 py-0.5 text-xs font-semibold text-white"
                        style={{ backgroundColor: phase.couleur }}
                      >
                        {m.code}
                      </span>
                      <span className="text-sm">
                        {m.statut === "disponible" ? "✅" : "🔲"}
                      </span>
                    </div>
                    <h3 className="mt-3 text-sm font-semibold text-gray-900 group-hover:text-[#1D9E75]">
                      {m.nom}
                    </h3>
                    {m.description && (
                      <p className="mt-1.5 text-xs leading-relaxed text-gray-500">
                        {m.description}
                      </p>
                    )}
                    {m.tags && m.tags.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-1">
                        {m.tags.map((tag) => (
                          <span
                            key={tag}
                            className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-500"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Compteur filtré */}
      {search && filtered.length > 0 && (
        <p className="mt-8 text-center text-sm text-gray-400">
          {filtered.length} résultat{filtered.length > 1 ? "s" : ""} pour
          &quot;{search}&quot;
        </p>
      )}
    </>
  );
}
