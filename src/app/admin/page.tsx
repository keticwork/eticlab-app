import { createClient } from "@/lib/supabase-server";
import { redirect } from "next/navigation";

const ADMIN_EMAIL = "keticwork@gmail.com";

export default async function AdminPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user || user.email !== ADMIN_EMAIL) {
    redirect("/");
  }

  // Fetch toutes les stats en parallèle
  const [
    { data: profiles },
    { data: aiProjects },
    { data: suggestions },
  ] = await Promise.all([
    supabase.from("profiles").select("*").order("created_at", { ascending: false }),
    supabase.from("ai_projects").select("*, profiles(*)").order("created_at", { ascending: false }).limit(10),
    supabase.from("ai_suggestions").select("*").order("count", { ascending: false }),
  ]);

  const today = new Date().toISOString().split("T")[0];
  const totalUsers = profiles?.length || 0;
  const aiRequestsToday = (profiles || []).reduce((sum, p) => {
    if (p.ai_last_request_date === today) return sum + (p.ai_requests_today || 0);
    return sum;
  }, 0);
  const estimatedCost = (aiRequestsToday * 0.01).toFixed(2);
  const totalProjects = aiProjects?.length || 0;
  const totalSuggestions = suggestions?.length || 0;

  return (
    <section className="min-h-[calc(100vh-120px)] bg-[#F8FAF9] py-10">
      <div className="mx-auto max-w-5xl px-4">
        <h1 className="mb-8 text-2xl font-bold text-gray-900">
          ⚙️ Superadmin — EticLab
        </h1>

        {/* ─── SECTION 1 — Stats ─── */}
        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <StatCard label="Utilisateurs" value={totalUsers} />
          <StatCard label="Requêtes IA (aujourd'hui)" value={aiRequestsToday} />
          <StatCard label="Coût estimé (aujourd'hui)" value={`${estimatedCost}€`} />
          <StatCard label="Projets IA" value={totalProjects} />
          <StatCard label="Modules manquants" value={totalSuggestions} />
        </div>

        {/* ─── SECTION 2 — Suggestions modules manquants ─── */}
        <div className="mb-8 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">
            Modules manquants suggérés par l&apos;IA
          </h2>
          {suggestions && suggestions.length > 0 ? (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 text-left text-xs text-gray-400">
                  <th className="pb-2">Concept</th>
                  <th className="pb-2">Demandé</th>
                  <th className="pb-2">Dernier</th>
                  <th className="pb-2"></th>
                </tr>
              </thead>
              <tbody>
                {suggestions.map((s) => (
                  <tr key={s.id} className="border-b border-gray-50">
                    <td className="py-2.5 font-medium text-gray-700">{s.module_manquant}</td>
                    <td className="py-2.5 text-gray-500">{s.count}×</td>
                    <td className="py-2.5 text-gray-400">
                      {new Date(s.last_seen_at).toLocaleDateString("fr-FR")}
                    </td>
                    <td className="py-2.5">
                      <span className="cursor-not-allowed rounded bg-gray-100 px-2 py-1 text-xs text-gray-400">
                        Créer le module
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-sm text-gray-400">Aucune suggestion pour l&apos;instant.</p>
          )}
        </div>

        {/* ─── SECTION 3 — Utilisateurs récents ─── */}
        <div className="mb-8 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">
            Utilisateurs récents
          </h2>
          {profiles && profiles.length > 0 ? (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 text-left text-xs text-gray-400">
                  <th className="pb-2">Prénom</th>
                  <th className="pb-2">Inscription</th>
                  <th className="pb-2">Requêtes IA</th>
                </tr>
              </thead>
              <tbody>
                {profiles.slice(0, 10).map((p) => (
                  <tr key={p.id} className="border-b border-gray-50">
                    <td className="py-2.5 font-medium text-gray-700">
                      {p.prenom || "—"}
                    </td>
                    <td className="py-2.5 text-gray-400">
                      {new Date(p.created_at).toLocaleDateString("fr-FR")}
                    </td>
                    <td className="py-2.5 text-gray-500">
                      {p.ai_requests_today || 0}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-sm text-gray-400">Aucun utilisateur.</p>
          )}
        </div>

        {/* ─── SECTION 4 — Projets IA récents ─── */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">
            Projets IA récents
          </h2>
          {aiProjects && aiProjects.length > 0 ? (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 text-left text-xs text-gray-400">
                  <th className="pb-2">Titre</th>
                  <th className="pb-2">Date</th>
                  <th className="pb-2">Modules</th>
                </tr>
              </thead>
              <tbody>
                {aiProjects.map((p) => (
                  <tr key={p.id} className="border-b border-gray-50">
                    <td className="py-2.5 font-medium text-gray-700">
                      {p.titre}
                    </td>
                    <td className="py-2.5 text-gray-400">
                      {new Date(p.created_at).toLocaleDateString("fr-FR")}
                    </td>
                    <td className="py-2.5 text-gray-500">
                      {Array.isArray(p.parcours) ? p.parcours.length : 0}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-sm text-gray-400">Aucun projet IA.</p>
          )}
        </div>
      </div>
    </section>
  );
}

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
      <p className="text-xs text-gray-400">{label}</p>
      <p className="mt-1 text-2xl font-bold text-gray-900">{value}</p>
    </div>
  );
}
