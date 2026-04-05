import { createClient } from "@/lib/supabase-server";
import { ArbreInteractif } from "@/components/arbre/ArbreInteractif";

export default async function ArbrePage() {
  const supabase = await createClient();

  const { data: phases } = await supabase
    .from("phases")
    .select("*")
    .order("ordre");

  const { data: modules } = await supabase
    .from("modules")
    .select("*, phases(nom, couleur, code)")
    .order("ordre");

  return (
    <section className="min-h-[calc(100vh-120px)] bg-[#F8FAF9]">
      {/* Header */}
      <div className="px-4 pt-10 text-center">
        <h1 className="text-3xl font-bold text-gray-900">
          L&apos;Arbre des modules
        </h1>
        <p className="mt-2 text-gray-500">
          {modules?.length || 0} modules — clique sur une phase pour l&apos;ouvrir
        </p>
      </div>

      {/* Mobile hint */}
      <div className="block px-4 pt-4 text-center sm:hidden">
        <p className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-xs text-gray-400">
          Meilleure expérience sur desktop
        </p>
      </div>

      {/* Arbre */}
      <ArbreInteractif
        phases={phases || []}
        modules={modules || []}
      />

      {/* Légende */}
      <div className="flex flex-wrap items-center justify-center gap-4 px-4 pb-10">
        {phases?.map((phase) => (
          <div key={phase.code} className="flex items-center gap-2">
            <div
              className="h-3 w-3 rounded-full"
              style={{ backgroundColor: phase.couleur }}
            />
            <span className="text-xs text-gray-500">{phase.nom}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
