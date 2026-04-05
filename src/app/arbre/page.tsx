import { createClient } from "@/lib/supabase-server";
import { ArbreGraph } from "@/components/arbre/ArbreGraph";

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

  const { data: connexions } = await supabase
    .from("module_connexions")
    .select("*");

  return (
    <section className="min-h-[calc(100vh-120px)] bg-[#0A0F0D]">
      {/* Mobile hint */}
      <div className="block px-4 pt-4 text-center sm:hidden">
        <p className="rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-xs text-gray-500">
          Meilleure expérience sur desktop — zoom et drag disponibles
        </p>
      </div>

      {/* Header */}
      <div className="px-4 pt-8 text-center">
        <h1 className="text-3xl font-bold text-white">
          L&apos;Arbre des modules
        </h1>
        <p className="mt-2 text-gray-500">
          {modules?.length || 0} modules — clique sur une bulle pour explorer
        </p>
      </div>

      {/* Graph */}
      <ArbreGraph
        phases={phases || []}
        modules={modules || []}
        connexions={connexions || []}
      />

      {/* Légende */}
      <div className="flex flex-wrap items-center justify-center gap-4 px-4 pb-8">
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
