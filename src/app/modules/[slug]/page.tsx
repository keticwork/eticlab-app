import Link from "next/link";
import { createClient } from "@/lib/supabase-server";
import { getReadmeUrl } from "@/lib/module-folders";
import { ModuleContent } from "@/components/modules/ModuleContent";

export default async function ModulePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = await createClient();

  // Chercher le module par code (case-insensitive)
  const { data: mod } = await supabase
    .from("modules")
    .select("*, phases(nom, couleur, code)")
    .ilike("code", slug)
    .single();

  // Fetch le README depuis GitHub
  let markdown: string | null = null;
  if (mod) {
    const readmeUrl = getReadmeUrl(mod.code);
    if (readmeUrl) {
      try {
        const res = await fetch(readmeUrl, { next: { revalidate: 300 } });
        if (res.ok) {
          markdown = await res.text();
        }
      } catch {
        // silently fail — affichera "contenu à venir"
      }
    }
  }

  // Module non trouvé en BDD
  if (!mod) {
    return (
      <section className="flex min-h-[calc(100vh-120px)] items-center justify-center bg-[#F8FAF9] px-4">
        <div className="max-w-md text-center">
          <h1 className="text-2xl font-bold text-gray-900">Module introuvable</h1>
          <p className="mt-3 text-gray-500">Le module &quot;{slug}&quot; n&apos;existe pas.</p>
          <Link
            href="/modules"
            className="mt-8 inline-block rounded-lg border border-gray-300 px-6 py-3 text-sm font-medium text-gray-700 hover:border-gray-400"
          >
            ← Retour aux modules
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-[calc(100vh-120px)] bg-[#F8FAF9]">
      <div className="mx-auto max-w-3xl px-4 py-10">
        {/* Breadcrumb */}
        <nav className="mb-8 flex items-center gap-2 text-sm text-gray-400">
          <Link href="/modules" className="hover:text-gray-600">
            Modules
          </Link>
          <span>/</span>
          <span style={{ color: mod.phases?.couleur }}>
            {mod.phases?.nom}
          </span>
          <span>/</span>
          <span className="text-gray-600">{mod.nom}</span>
        </nav>

        {/* Header module */}
        <div className="mb-8 flex items-start gap-4">
          <span
            className="rounded-lg px-3 py-1.5 text-sm font-bold text-white"
            style={{ backgroundColor: mod.phases?.couleur || "#666" }}
          >
            {mod.code}
          </span>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{mod.nom}</h1>
            {mod.description && (
              <p className="mt-1 text-gray-500">{mod.description}</p>
            )}
          </div>
        </div>

        {/* Contenu markdown ou placeholder */}
        {markdown ? (
          <ModuleContent markdown={markdown} />
        ) : (
          <div className="rounded-2xl border border-gray-200 bg-white p-10 text-center">
            <span className="text-3xl">📖</span>
            <p className="mt-4 text-gray-500">
              Le contenu de ce module arrive bientôt.
            </p>
          </div>
        )}

        {/* Bouton retour */}
        <div className="mt-10">
          <Link
            href="/modules"
            className="inline-block rounded-lg border border-gray-300 px-6 py-3 text-sm font-medium text-gray-700 transition-all hover:-translate-y-0.5 hover:border-gray-400 hover:shadow-sm"
          >
            ← Retour aux modules
          </Link>
        </div>
      </div>
    </section>
  );
}
