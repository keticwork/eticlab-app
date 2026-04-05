import Link from "next/link";
import { ScrollFadeProvider } from "@/components/ui/ScrollFadeProvider";
import { supabase } from "@/lib/supabase";

/* ─── Couleurs dégradées par phase ─── */

const phaseGradients: Record<string, { from: string; to: string }> = {
  "#1D9E75": { from: "#1D9E75", to: "#5DCAA5" },
  "#378ADD": { from: "#378ADD", to: "#85B7EB" },
  "#7F77DD": { from: "#7F77DD", to: "#AFA9EC" },
  "#EF9F27": { from: "#EF9F27", to: "#FAC775" },
  "#D85A30": { from: "#D85A30", to: "#F0997B" },
};

const aiExamples = [
  "Je veux créer un SaaS de A à Z",
  "Comprendre les API REST",
  "Déployer mon premier site",
  "Sécuriser mon application",
];

/* ─── Tree data ─── */

const treeData = {
  root: { label: "Ton projet", x: 250, y: 30 },
  level1: [
    { label: "Fondations", x: 50, y: 120, color: "#1D9E75" },
    { label: "Bases web", x: 150, y: 120, color: "#378ADD" },
    { label: "Application", x: 250, y: 120, color: "#7F77DD" },
    { label: "Données", x: 350, y: 120, color: "#EF9F27" },
    { label: "Production", x: 450, y: 120, color: "#D85A30" },
  ],
  level2: [
    { label: "Git", x: 20, y: 210, color: "#1D9E75", parent: 0 },
    { label: "Terminal", x: 80, y: 210, color: "#1D9E75", parent: 0 },
    { label: "HTML", x: 120, y: 210, color: "#378ADD", parent: 1 },
    { label: "CSS", x: 175, y: 210, color: "#378ADD", parent: 1 },
    { label: "Next.js", x: 225, y: 210, color: "#7F77DD", parent: 2 },
    { label: "React", x: 280, y: 210, color: "#7F77DD", parent: 2 },
    { label: "Supabase", x: 330, y: 210, color: "#EF9F27", parent: 3 },
    { label: "API", x: 380, y: 210, color: "#EF9F27", parent: 3 },
    { label: "Vercel", x: 425, y: 210, color: "#D85A30", parent: 4 },
    { label: "SEO", x: 480, y: 210, color: "#D85A30", parent: 4 },
  ],
};

/* ─── Page ─── */

export default async function Home() {
  const { data: phasesData } = await supabase
    .from("phases")
    .select("*, modules(*)")
    .order("ordre");

  return (
    <ScrollFadeProvider>
      {/* ════════════════════════════════════════════
          1. HERO — fond sombre
      ════════════════════════════════════════════ */}
      <section className="hero-grid relative overflow-hidden bg-[#0A0F0D]">
        {/* Glow radial */}
        <div
          className="animate-glow pointer-events-none absolute left-1/2 top-1/3 h-[500px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{ background: "radial-gradient(circle, rgba(29,158,117,0.15) 0%, transparent 70%)" }}
        />

        <div className="relative z-10 mx-auto max-w-4xl px-4 pb-24 pt-20 text-center">
          {/* Badge */}
          <div className="hero-fade hero-fade-1 mb-8 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm text-gray-400 backdrop-blur-sm">
            <span className="animate-pulse-dot inline-block h-2 w-2 rounded-full bg-[#1D9E75]" />
            Plateforme de formation tech
          </div>

          {/* Titre */}
          <h1 className="hero-fade hero-fade-2 mx-auto max-w-3xl text-4xl font-bold leading-tight tracking-tight text-white sm:text-5xl">
            Comprends chaque brique technologique{" "}
            <span className="text-[#1D9E75]">— du code à la mise en production</span>
          </h1>

          {/* Sous-titre */}
          <p className="hero-fade hero-fade-3 mx-auto mt-6 max-w-2xl text-lg text-gray-400">
            Des modules clairs, interactifs et guidés par IA. Pour les débutants
            qui veulent vraiment comprendre ce qu&apos;ils construisent.
          </p>

          {/* Barre de recherche */}
          <div className="hero-fade hero-fade-3 mx-auto mt-10 flex max-w-lg overflow-hidden rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm">
            <input
              type="text"
              placeholder="Rechercher un module, un concept..."
              className="flex-1 bg-transparent px-5 py-3.5 text-sm text-white outline-none placeholder:text-gray-500"
            />
            <button className="bg-[#1D9E75] px-6 py-3.5 text-sm font-medium text-white transition-colors hover:bg-[#178a64]">
              Rechercher
            </button>
          </div>

          {/* CTA */}
          <div className="hero-fade hero-fade-4 mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/modules"
              className="rounded-lg bg-[#1D9E75] px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-green-900/20 transition-all hover:-translate-y-0.5 hover:bg-[#178a64] hover:shadow-xl hover:shadow-green-900/30"
            >
              Voir les modules
            </Link>
            <Link
              href="/arbre"
              className="rounded-lg border border-white/20 px-7 py-3.5 text-sm font-semibold text-white transition-all hover:-translate-y-0.5 hover:border-white/40 hover:bg-white/5"
            >
              Explorer l&apos;arbre ↗
            </Link>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════
          2. POURQUOI ETICLAB — fond clair
      ════════════════════════════════════════════ */}
      <section className="bg-[#F8FAF9] py-24">
        <div className="scroll-fade mx-auto max-w-5xl px-4">
          <h2 className="text-center text-3xl font-bold text-gray-900">
            Pourquoi EticLab ?
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-center text-gray-500">
            Une approche différente de la formation technique
          </p>

          <div className="mt-14 grid gap-6 sm:grid-cols-3">
            {/* Card 1 */}
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-50">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#1D9E75" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                  <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
                </svg>
              </div>
              <h3 className="mt-4 text-lg font-semibold text-gray-900">Comprendre vraiment</h3>
              <p className="mt-2 text-sm leading-relaxed text-gray-500">
                Pas juste copier-coller du code. Chaque module explique le pourquoi
                avant le comment, avec des analogies simples.
              </p>
            </div>

            {/* Card 2 */}
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-50">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#1D9E75" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2a5 5 0 0 1 5 5v2a5 5 0 0 1-10 0V7a5 5 0 0 1 5-5z" />
                  <path d="M8 14v.5A5.5 5.5 0 0 0 13.5 20h0a5.5 5.5 0 0 0 5.5-5.5V14" />
                  <line x1="12" y1="20" x2="12" y2="23" />
                </svg>
              </div>
              <h3 className="mt-4 text-lg font-semibold text-gray-900">Guidé par IA</h3>
              <p className="mt-2 text-sm leading-relaxed text-gray-500">
                Décris ton projet, l&apos;IA génère ton parcours personnalisé.
                Les modules s&apos;illuminent dans l&apos;ordre optimal.
              </p>
            </div>

            {/* Card 3 */}
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-50">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#1D9E75" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
                </svg>
              </div>
              <h3 className="mt-4 text-lg font-semibold text-gray-900">De zéro à la prod</h3>
              <p className="mt-2 text-sm leading-relaxed text-gray-500">
                Du terminal à Vercel, chaque brique est documentée avec un POC
                que tu peux tester toi-même sur ta machine.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════
          3. GRAPHIQUE DES MODULES — fond sombre
      ════════════════════════════════════════════ */}
      <section
        className="py-24"
        style={{ background: "linear-gradient(180deg, #0A0F0D 0%, #0F1A15 100%)" }}
      >
        <div className="scroll-fade mx-auto max-w-4xl px-4">
          <h2 className="text-center text-3xl font-bold text-white">
            L&apos;arbre de toutes les briques
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-center text-gray-500">
            Chaque noeud est un module. Chaque lien une dépendance.
          </p>

          {/* SVG Tree */}
          <div className="mt-12 flex justify-center">
            <svg viewBox="0 0 500 260" className="w-full max-w-2xl" style={{ minHeight: 220 }}>
              {/* Lines: root → level1 */}
              {treeData.level1.map((node, i) => (
                <line
                  key={`r-${i}`}
                  x1={treeData.root.x} y1={treeData.root.y + 16}
                  x2={node.x} y2={node.y - 16}
                  stroke="rgba(255,255,255,0.1)" strokeWidth="1"
                />
              ))}
              {/* Lines: level1 → level2 */}
              {treeData.level2.map((node, i) => (
                <line
                  key={`l-${i}`}
                  x1={treeData.level1[node.parent].x} y1={treeData.level1[node.parent].y + 16}
                  x2={node.x} y2={node.y - 10}
                  stroke="rgba(255,255,255,0.07)" strokeWidth="1"
                />
              ))}

              {/* Root node */}
              <g className="cursor-pointer">
                <rect
                  x={treeData.root.x - 45} y={treeData.root.y - 14}
                  width="90" height="28" rx="8"
                  fill="#1D9E75" className="transition-all hover:fill-[#25b888]"
                />
                <text
                  x={treeData.root.x} y={treeData.root.y + 5}
                  textAnchor="middle" fill="white" fontSize="11" fontWeight="600"
                >
                  Ton projet
                </text>
              </g>

              {/* Level 1 nodes */}
              {treeData.level1.map((node, i) => (
                <g key={`n1-${i}`} className="cursor-pointer">
                  <rect
                    x={node.x - 40} y={node.y - 14}
                    width="80" height="28" rx="8"
                    fill={node.color} fillOpacity="0.85"
                    className="transition-all hover:fill-opacity-100"
                  />
                  <text
                    x={node.x} y={node.y + 4}
                    textAnchor="middle" fill="white" fontSize="10" fontWeight="500"
                  >
                    {node.label}
                  </text>
                </g>
              ))}

              {/* Level 2 nodes */}
              {treeData.level2.map((node, i) => (
                <g key={`n2-${i}`} className="cursor-pointer">
                  <circle
                    cx={node.x} cy={node.y} r="18"
                    fill={node.color} fillOpacity="0.2"
                    stroke={node.color} strokeOpacity="0.4" strokeWidth="1"
                    className="transition-all hover:fill-opacity-40 hover:stroke-opacity-80"
                  />
                  <text
                    x={node.x} y={node.y + 4}
                    textAnchor="middle" fill={node.color} fontSize="9" fontWeight="500"
                  >
                    {node.label}
                  </text>
                </g>
              ))}
            </svg>
          </div>

          <p className="mt-8 text-center text-sm text-gray-600">
            Version complète et interactive dans{" "}
            <Link href="/arbre" className="text-[#1D9E75] underline underline-offset-2 hover:text-[#25b888]">
              L&apos;arbre
            </Link>
          </p>
        </div>
      </section>

      {/* ════════════════════════════════════════════
          4. PHASES — fond clair
      ════════════════════════════════════════════ */}
      <section className="bg-[#F8FAF9] py-24">
        <div className="scroll-fade mx-auto max-w-6xl px-4">
          <h2 className="text-center text-3xl font-bold text-gray-900">
            Les grandes phases d&apos;apprentissage
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-center text-gray-500">
            Clique sur une phase pour explorer ses modules
          </p>

          <div className="mt-14 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {phasesData?.map((phase) => {
              const gradient = phaseGradients[phase.couleur] || { from: phase.couleur, to: phase.couleur };
              const modules = phase.modules || [];
              const tags = modules.slice(0, 3).map((m: { nom: string }) => m.nom);
              return (
                <button
                  key={phase.code}
                  className="group flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white text-left shadow-sm transition-all hover:-translate-y-1 hover:border-gray-300 hover:shadow-md"
                >
                  <div
                    className="h-1.5 w-full"
                    style={{ background: `linear-gradient(90deg, ${gradient.from}, ${gradient.to})` }}
                  />
                  <div className="flex flex-1 flex-col p-4">
                    <h3 className="text-sm font-semibold text-gray-900">{phase.nom}</h3>
                    <p className="mt-1 text-xs text-gray-400">{modules.length} modules</p>
                    <div className="mt-3 flex flex-wrap gap-1">
                      {tags.map((tag: string) => (
                        <span key={tag} className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-500">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════
          5. COMMENT ÇA MARCHE — fond clair
      ════════════════════════════════════════════ */}
      <section className="bg-white py-24">
        <div className="scroll-fade mx-auto max-w-5xl px-4">
          <h2 className="text-center text-3xl font-bold text-gray-900">
            Comment ça marche
          </h2>

          <div className="mt-14 grid gap-8 sm:grid-cols-3">
            {[
              {
                step: "1",
                title: "Choisis ton objectif",
                desc: "Décris ce que tu veux créer : un SaaS, une API, un portfolio...",
              },
              {
                step: "2",
                title: "L'IA génère ton parcours",
                desc: "Les modules s'illuminent dans l'ordre optimal, adaptés à ton projet.",
              },
              {
                step: "3",
                title: "Tu apprends et tu construis",
                desc: "Module par module, avec des POC que tu testes sur ta machine.",
              },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#1D9E75] text-lg font-bold text-white shadow-lg shadow-green-900/10">
                  {item.step}
                </div>
                <h3 className="mt-5 text-lg font-semibold text-gray-900">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-500">{item.desc}</p>
              </div>
            ))}
          </div>

          {/* Ligne de connexion */}
          <div className="mx-auto mt-0 hidden max-w-md sm:block">
            <div className="relative -top-[6.5rem] mx-auto h-px w-2/3 bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════
          6. GUIDE IA — fond sombre
      ════════════════════════════════════════════ */}
      <section className="relative overflow-hidden bg-[#0A0F0D] py-24">
        {/* Glow */}
        <div
          className="animate-glow pointer-events-none absolute left-1/2 top-1/2 h-[400px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{ background: "radial-gradient(circle, rgba(29,158,117,0.1) 0%, transparent 70%)" }}
        />

        <div className="scroll-fade relative z-10 mx-auto max-w-2xl px-4">
          <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm">
            {/* En-tête */}
            <div className="p-8 text-center">
              <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-[#1D9E75]/20">
                <span className="text-xl">🤖</span>
              </div>
              <h2 className="text-2xl font-bold text-white">
                Guide IA — génère ton parcours
              </h2>
              <p className="mt-2 text-sm text-gray-500">
                Décris ton projet, l&apos;IA te crée un parcours sur mesure.
              </p>
            </div>

            {/* Champ terminal */}
            <div className="px-8">
              <div className="flex overflow-hidden rounded-xl border border-white/10 bg-[#050807]">
                <div className="flex items-center pl-4 text-[#1D9E75]">
                  <span className="text-sm font-mono">→</span>
                </div>
                <input
                  type="text"
                  placeholder="Décris ton projet..."
                  disabled
                  className="flex-1 bg-transparent px-3 py-3.5 font-mono text-sm text-gray-500 outline-none placeholder:text-gray-700"
                />
                <button
                  disabled
                  className="bg-white/5 px-5 py-3.5 text-sm text-gray-600"
                >
                  Générer
                </button>
              </div>
            </div>

            {/* Bandeau membre */}
            <div
              className="mx-8 mt-5 rounded-lg px-4 py-2.5 text-center text-sm font-medium text-white"
              style={{ background: "linear-gradient(90deg, #1D9E75, #0F6E56)" }}
            >
              Fonctionnalité membre — Créer un compte gratuit
            </div>

            {/* Pills */}
            <div className="flex flex-wrap justify-center gap-2 p-8">
              {aiExamples.map((example) => (
                <span
                  key={example}
                  className="cursor-pointer rounded-full border border-white/10 bg-white/5 px-3.5 py-1.5 text-xs text-gray-400 transition-colors hover:border-[#1D9E75]/50 hover:text-[#1D9E75]"
                >
                  {example}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════
          7. CTA FINAL — fond sombre dégradé
      ════════════════════════════════════════════ */}
      <section
        className="py-24"
        style={{ background: "linear-gradient(180deg, #0F1A15 0%, #0A1210 100%)" }}
      >
        <div className="scroll-fade mx-auto max-w-3xl px-4 text-center">
          <h2 className="text-3xl font-bold text-white sm:text-4xl">
            Prêt à comprendre comment tout fonctionne ?
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-gray-500">
            {phasesData?.reduce((acc, p) => acc + (p.modules?.length || 0), 0) || 0} modules gratuits. Du terminal à la mise en production.
            Commence maintenant, à ton rythme.
          </p>
          <Link
            href="/modules"
            className="mt-8 inline-block rounded-xl bg-[#1D9E75] px-8 py-4 text-base font-semibold text-white shadow-lg shadow-green-900/30 transition-all hover:-translate-y-0.5 hover:bg-[#178a64] hover:shadow-xl hover:shadow-green-900/40"
          >
            Commencer gratuitement →
          </Link>
        </div>
      </section>
    </ScrollFadeProvider>
  );
}
