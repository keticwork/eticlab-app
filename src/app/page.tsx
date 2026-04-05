import Link from "next/link";

const phases = [
  {
    name: "Fondations",
    modules: 8,
    tags: ["Node.js", "Terminal", "Git"],
    from: "#1D9E75",
    to: "#5DCAA5",
  },
  {
    name: "Bases du web",
    modules: 4,
    tags: ["HTML", "CSS", "JavaScript"],
    from: "#378ADD",
    to: "#85B7EB",
  },
  {
    name: "L'application",
    modules: 3,
    tags: ["Next.js", "Routing", "UI"],
    from: "#7F77DD",
    to: "#AFA9EC",
  },
  {
    name: "Les données",
    modules: 2,
    tags: ["Supabase", "API REST", "SQL"],
    from: "#EF9F27",
    to: "#FAC775",
  },
  {
    name: "Mise en prod",
    modules: 6,
    tags: ["Vercel", "SEO", "Sécurité"],
    from: "#D85A30",
    to: "#F0997B",
  },
];

const treeNodes = [
  { label: "C5", x: 50, y: 20, color: "#D85A30" },
  { label: "C4", x: 25, y: 45, color: "#EF9F27" },
  { label: "C3", x: 75, y: 45, color: "#7F77DD" },
  { label: "C1", x: 10, y: 75, color: "#1D9E75" },
  { label: "C2", x: 40, y: 75, color: "#378ADD" },
  { label: "T", x: 65, y: 75, color: "#1D9E75" },
  { label: "IA", x: 90, y: 75, color: "#7F77DD" },
];

const aiExamples = [
  "Je veux créer un SaaS de A à Z",
  "Comprendre les API REST",
  "Déployer mon premier site",
  "Sécuriser mon application",
];

export default function Home() {
  return (
    <>
      {/* ─── HERO ─── */}
      <section
        className="animate-fade-up"
        style={{
          background: "linear-gradient(180deg, #E1F5EE 0%, #ffffff 100%)",
        }}
      >
        <div className="mx-auto max-w-4xl px-4 pb-20 pt-16 text-center">
          {/* Badge */}
          <div className="animate-fade-up-delay-1 mb-6 inline-flex items-center gap-2 rounded-full border border-green-200 bg-white px-4 py-1.5 text-sm text-gray-600 shadow-sm">
            <span
              className="animate-pulse-dot inline-block h-2 w-2 rounded-full bg-[#0F6E56]"
            />
            Plateforme de formation tech
          </div>

          {/* Titre */}
          <h1 className="animate-fade-up-delay-1 mx-auto max-w-3xl text-4xl font-bold leading-tight tracking-tight text-gray-900 sm:text-5xl">
            Comprends chaque brique technologique —{" "}
            <span className="text-[#0F6E56]">du code à la mise en production</span>
          </h1>

          {/* Sous-titre */}
          <p className="animate-fade-up-delay-2 mx-auto mt-6 max-w-2xl text-lg text-gray-500">
            Des modules clairs, interactifs et guidés par IA. Pour les débutants
            qui veulent vraiment comprendre ce qu&apos;ils construisent.
          </p>

          {/* Barre de recherche */}
          <div className="animate-fade-up-delay-3 mx-auto mt-8 flex max-w-lg overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
            <input
              type="text"
              placeholder="Rechercher un module, un concept..."
              className="flex-1 px-4 py-3 text-sm text-gray-700 outline-none placeholder:text-gray-400"
            />
            <button className="bg-[#0F6E56] px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-[#0b5a46]">
              Rechercher
            </button>
          </div>

          {/* CTA */}
          <div className="animate-fade-up-delay-4 mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/modules"
              className="rounded-lg bg-[#0F6E56] px-6 py-3 text-sm font-medium text-white shadow-sm transition-all hover:-translate-y-0.5 hover:bg-[#0b5a46] hover:shadow-md"
            >
              Voir tous les modules
            </Link>
            <Link
              href="/arbre"
              className="rounded-lg border border-gray-300 bg-white px-6 py-3 text-sm font-medium text-gray-700 shadow-sm transition-all hover:-translate-y-0.5 hover:border-gray-400 hover:shadow-md"
            >
              Explorer l&apos;arbre ↗
            </Link>
          </div>
        </div>
      </section>

      {/* ─── PHASES ─── */}
      <section className="animate-fade-up-delay-2 bg-white py-20">
        <div className="mx-auto max-w-6xl px-4">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold text-gray-900">
              Les grandes phases d&apos;apprentissage
            </h2>
            <p className="mt-3 text-gray-500">
              Clique sur une phase pour explorer ses modules
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {phases.map((phase) => (
              <button
                key={phase.name}
                className="group flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white text-left shadow-sm transition-all hover:-translate-y-0.5 hover:border-gray-300 hover:shadow-md"
              >
                {/* Barre colorée */}
                <div
                  className="h-2 w-full"
                  style={{
                    background: `linear-gradient(90deg, ${phase.from}, ${phase.to})`,
                  }}
                />
                <div className="flex flex-1 flex-col p-4">
                  <h3 className="text-sm font-semibold text-gray-900">
                    {phase.name}
                  </h3>
                  <p className="mt-1 text-xs text-gray-400">
                    {phase.modules} modules
                  </p>
                  <div className="mt-3 flex flex-wrap gap-1">
                    {phase.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-500"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ─── ARBRE PREVIEW ─── */}
      <section
        className="animate-fade-up-delay-3 py-20"
        style={{
          background:
            "linear-gradient(135deg, #E1F5EE 0%, #E8F0FE 100%)",
        }}
      >
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 md:grid-cols-2">
          {/* Texte */}
          <div>
            <h2 className="text-3xl font-bold text-gray-900">
              L&apos;arbre technologique
            </h2>
            <p className="mt-4 text-gray-600">
              Visualise les connexions entre chaque brique. Chaque noeud est un
              module, chaque lien une dépendance. Commence par les racines,
              monte vers la production.
            </p>
            <Link
              href="/arbre"
              className="mt-6 inline-block rounded-lg bg-[#0F6E56] px-6 py-3 text-sm font-medium text-white shadow-sm transition-all hover:-translate-y-0.5 hover:bg-[#0b5a46] hover:shadow-md"
            >
              Explorer l&apos;arbre complet →
            </Link>
          </div>

          {/* Mini arbre */}
          <div className="flex items-center justify-center">
            <div className="relative h-64 w-full max-w-xs">
              {/* Lignes de connexion */}
              <svg
                className="absolute inset-0 h-full w-full"
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
              >
                {/* Ton projet → C5 */}
                <line x1="50" y1="5" x2="50" y2="20" stroke="#d1d5db" strokeWidth="0.5" />
                {/* C5 → C4, C3 */}
                <line x1="50" y1="20" x2="25" y2="45" stroke="#d1d5db" strokeWidth="0.5" />
                <line x1="50" y1="20" x2="75" y2="45" stroke="#d1d5db" strokeWidth="0.5" />
                {/* C4 → C1, C2 */}
                <line x1="25" y1="45" x2="10" y2="75" stroke="#d1d5db" strokeWidth="0.5" />
                <line x1="25" y1="45" x2="40" y2="75" stroke="#d1d5db" strokeWidth="0.5" />
                {/* C3 → T, IA */}
                <line x1="75" y1="45" x2="65" y2="75" stroke="#d1d5db" strokeWidth="0.5" />
                <line x1="75" y1="45" x2="90" y2="75" stroke="#d1d5db" strokeWidth="0.5" />
              </svg>

              {/* Noeud racine */}
              <div
                className="absolute left-1/2 top-0 -translate-x-1/2 rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-xs font-semibold text-gray-700 shadow-sm transition-transform hover:scale-110"
              >
                Ton projet
              </div>

              {/* Noeuds */}
              {treeNodes.map((node) => (
                <div
                  key={node.label}
                  className="absolute flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full text-xs font-bold text-white shadow-sm transition-transform hover:scale-110"
                  style={{
                    left: `${node.x}%`,
                    top: `${node.y}%`,
                    backgroundColor: node.color,
                  }}
                >
                  {node.label}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── GUIDE IA ─── */}
      <section className="animate-fade-up-delay-4 bg-white py-20">
        <div className="mx-auto max-w-2xl px-4">
          <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
            {/* En-tête */}
            <div className="p-6 text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                <span className="text-xl">🤖</span>
              </div>
              <h2 className="text-2xl font-bold text-gray-900">
                Guide IA — génère ton parcours personnalisé
              </h2>
              <p className="mt-2 text-sm text-gray-500">
                Décris ton projet ou ton objectif, et l&apos;IA te crée un
                parcours sur mesure avec les modules à suivre.
              </p>
            </div>

            {/* Champ de saisie (désactivé) */}
            <div className="px-6">
              <div className="flex overflow-hidden rounded-xl border border-gray-200 bg-gray-50">
                <input
                  type="text"
                  placeholder="Décris ton projet..."
                  disabled
                  className="flex-1 bg-transparent px-4 py-3 text-sm text-gray-400 outline-none"
                />
                <button
                  disabled
                  className="bg-gray-200 px-5 py-3 text-sm text-gray-400"
                >
                  Générer
                </button>
              </div>
            </div>

            {/* Bandeau membre */}
            <div
              className="mx-6 mt-4 rounded-lg px-4 py-2.5 text-center text-sm font-medium text-white"
              style={{
                background: "linear-gradient(90deg, #1D9E75, #0F6E56)",
              }}
            >
              Fonctionnalité membre — Créer un compte gratuit
            </div>

            {/* Pills exemples */}
            <div className="flex flex-wrap justify-center gap-2 p-6">
              {aiExamples.map((example) => (
                <span
                  key={example}
                  className="cursor-pointer rounded-full border border-gray-200 bg-white px-3 py-1.5 text-xs text-gray-500 transition-colors hover:border-[#0F6E56] hover:text-[#0F6E56]"
                >
                  {example}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
