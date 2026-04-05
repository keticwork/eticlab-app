"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

type Phase = {
  code: string;
  nom: string;
  couleur: string;
  ordre: number;
};

type Module = {
  id: string;
  code: string;
  nom: string;
  description: string;
  statut: string;
  prerequis: string[] | null;
  phases: { nom: string; couleur: string; code: string } | null;
};

// TODO: Ajouter une prop highlight?: string[] pour illuminer
// un chemin "fil rouge" entre modules (parcours IA personnalisé).
// Quand highlight est défini, les modules dont le code est dans
// la liste reçoivent une classe spéciale (border glow, opacité pleine)
// et les autres sont atténués. Les lignes SVG du chemin seraient
// colorées en vert #1D9E75 au lieu de gris.

export function ArbreInteractif({
  phases,
  modules,
}: {
  phases: Phase[];
  modules: Module[];
}) {
  const [openPhases, setOpenPhases] = useState<Set<string>>(new Set());
  const [selectedModule, setSelectedModule] = useState<Module | null>(null);
  const [parcoursCodes, setParcoursCodes] = useState<string[]>([]);

  // Charger le projet actif depuis localStorage
  useEffect(() => {
    const loadActive = () => {
      const stored = localStorage.getItem("eticlab-active-project");
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          setParcoursCodes((parsed.parcours || []).map((p: { code: string }) => p.code.toUpperCase()));
        } catch { setParcoursCodes([]); }
      } else {
        setParcoursCodes([]);
      }
    };
    loadActive();
    window.addEventListener("eticlab-project-changed", loadActive);
    return () => window.removeEventListener("eticlab-project-changed", loadActive);
  }, []);

  const togglePhase = (code: string) => {
    setOpenPhases((prev) => {
      const next = new Set(prev);
      if (next.has(code)) {
        next.delete(code);
      } else {
        next.add(code);
      }
      return next;
    });
  };

  const getModulesForPhase = (phaseCode: string) =>
    modules.filter((m) => m.phases?.code === phaseCode);

  return (
    <div className="relative mx-auto max-w-5xl px-4 py-10">
      {/* ─── Noeud racine ─── */}
      <div className="flex justify-center">
        <div className="rounded-xl bg-[#1D9E75] px-6 py-3 text-sm font-bold text-white shadow-md">
          Ton projet
        </div>
      </div>

      {/* Ligne verticale racine → phases */}
      <div className="mx-auto h-8 w-px bg-gray-300" />

      {/* ─── Ligne horizontale entre les phases ─── */}
      <div className="relative">
        <div className="absolute left-[10%] right-[10%] top-0 h-px bg-gray-300" />
      </div>

      {/* ─── Phases (niveau 1) ─── */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {phases.map((phase) => {
          const isOpen = openPhases.has(phase.code);
          const phaseModules = getModulesForPhase(phase.code);

          return (
            <div key={phase.code} className="flex flex-col items-center">
              {/* Ligne verticale vers la phase */}
              <div className="h-4 w-px bg-gray-300" />

              {/* Noeud phase */}
              <button
                onClick={() => togglePhase(phase.code)}
                className="group w-full rounded-xl border-2 bg-white p-4 text-center shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
                style={{
                  borderColor: isOpen ? phase.couleur : "#e5e7eb",
                }}
              >
                <div
                  className="mx-auto mb-2 h-1.5 w-10 rounded-full"
                  style={{ backgroundColor: phase.couleur }}
                />
                <h3 className="text-sm font-semibold text-gray-900">
                  {phase.nom}
                </h3>
                <p className="mt-1 text-xs text-gray-400">
                  {phaseModules.length} module{phaseModules.length > 1 ? "s" : ""}
                </p>
                <span className="mt-2 inline-block text-xs text-gray-400 transition-transform group-hover:translate-y-0.5">
                  {isOpen ? "▲ Fermer" : "▼ Ouvrir"}
                </span>
              </button>

              {/* ─── Modules (niveau 2) — accordion ─── */}
              <div
                className="w-full overflow-hidden transition-all duration-300 ease-in-out"
                style={{
                  maxHeight: isOpen ? `${phaseModules.length * 80}px` : "0px",
                  opacity: isOpen ? 1 : 0,
                }}
              >
                {isOpen && (
                  <>
                    {/* Ligne verticale phase → modules */}
                    <div className="mx-auto h-3 w-px" style={{ backgroundColor: phase.couleur }} />

                    <div className="flex flex-col gap-2">
                      {phaseModules.map((mod, idx) => (
                        <div key={mod.id} className="flex flex-col items-center">
                          {idx > 0 && (
                            <div
                              className="h-2 w-px"
                              style={{ backgroundColor: phase.couleur + "40" }}
                            />
                          )}
                          <button
                            onClick={() => setSelectedModule(mod)}
                            className={`w-full rounded-lg border bg-white px-3 py-2.5 text-left transition-all hover:-translate-y-0.5 hover:shadow-md ${
                              parcoursCodes.includes(mod.code.toUpperCase())
                                ? "shadow-md shadow-[#1D9E75]/20"
                                : "shadow-sm"
                            }`}
                            style={{
                              borderColor:
                                selectedModule?.id === mod.id
                                  ? phase.couleur
                                  : parcoursCodes.includes(mod.code.toUpperCase())
                                    ? "#1D9E75"
                                    : "#e5e7eb",
                            }}
                          >
                            {/* TODO: Animation future du fil rouge — quand parcoursCodes est défini,
                                dessiner une ligne SVG colorée en #1D9E75 reliant les modules
                                du parcours dans l'ordre vertical */}
                            <div className="flex items-center justify-between">
                              <span
                                className="rounded px-1.5 py-0.5 text-xs font-semibold text-white"
                                style={{ backgroundColor: phase.couleur }}
                              >
                                {mod.code}
                              </span>
                              <span className="text-xs">
                                {mod.statut === "disponible" ? "✅" : "🔲"}
                              </span>
                            </div>
                            <p className="mt-1.5 text-xs font-medium text-gray-800">
                              {mod.nom}
                            </p>
                          </button>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* ─── Panel module sélectionné ─── */}
      {selectedModule && (
        <div
          className="animate-slide-in fixed right-0 z-40 w-full overflow-y-auto border-l border-gray-200 bg-white p-6 shadow-xl sm:w-[360px]"
          style={{ top: "57px", bottom: "0" }}
        >
          <div className="flex items-start justify-between">
            <div>
              <span
                className="rounded-md px-2 py-0.5 text-xs font-semibold text-white"
                style={{
                  backgroundColor: selectedModule.phases?.couleur || "#666",
                }}
              >
                {selectedModule.code}
              </span>
              <span className="ml-2 text-xs text-gray-400">
                {selectedModule.phases?.nom}
              </span>
            </div>
            <button
              onClick={() => setSelectedModule(null)}
              className="text-lg text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </div>

          <h2 className="mt-4 text-lg font-bold text-gray-900">
            {selectedModule.nom}
          </h2>

          {selectedModule.description && (
            <p className="mt-3 text-sm leading-relaxed text-gray-500">
              {selectedModule.description}
            </p>
          )}

          <div className="mt-4 text-sm text-gray-500">
            {selectedModule.statut === "disponible"
              ? "✅ Disponible"
              : "🔲 Bientôt disponible"}
          </div>

          {selectedModule.prerequis && selectedModule.prerequis.length > 0 && (
            <div className="mt-4">
              <p className="text-xs font-medium text-gray-400">Prérequis :</p>
              <div className="mt-1 flex flex-wrap gap-1">
                {selectedModule.prerequis.map((pre) => (
                  <span
                    key={pre}
                    className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600"
                  >
                    {pre}
                  </span>
                ))}
              </div>
            </div>
          )}

          <Link
            href={`/modules/${selectedModule.code.toLowerCase()}`}
            className="mt-6 block rounded-lg bg-[#1D9E75] px-4 py-3 text-center text-sm font-medium text-white transition-colors hover:bg-[#178a64]"
          >
            Voir le module →
          </Link>
        </div>
      )}

      {/* Overlay quand panel ouvert */}
      {selectedModule && (
        <div
          className="fixed inset-0 z-30 bg-black/20"
          onClick={() => setSelectedModule(null)}
        />
      )}
    </div>
  );
}
