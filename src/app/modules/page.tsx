import { createClient } from "@/lib/supabase-server";
import { ModulesList } from "@/components/modules/ModulesList";

export default async function ModulesPage() {
  const supabase = await createClient();

  const { data: phases } = await supabase
    .from("phases")
    .select("*, modules(*)")
    .order("ordre");

  const allModules =
    phases?.flatMap((phase) =>
      (phase.modules || [])
        .sort((a: { ordre: number }, b: { ordre: number }) => a.ordre - b.ordre)
        .map((m: {
          id: string;
          code: string;
          nom: string;
          description: string;
          statut: string;
          tags: string[];
        }) => ({
          ...m,
          phaseNom: phase.nom,
          phaseCouleur: phase.couleur,
          phaseCode: phase.code,
        }))
    ) || [];

  const totalDisponible = allModules.filter(
    (m) => m.statut === "disponible"
  ).length;

  return (
    <section className="min-h-[calc(100vh-120px)] bg-gradient-to-b from-[#0A0F0D] via-[#F8FAF9] to-[#F8FAF9] py-12">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-10 text-center">
          <h1 className="text-3xl font-bold text-white">
            Tous les modules
          </h1>
          <p className="mt-2 text-gray-400">
            {totalDisponible} modules disponibles — {allModules.length} au total
          </p>
        </div>

        <ModulesList modules={allModules} phases={phases || []} />
      </div>
    </section>
  );
}
