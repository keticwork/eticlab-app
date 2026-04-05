// Mapping code module Supabase → dossier GitHub
// Le code en BDD est simplifié (ex: "T-01"), le dossier GitHub
// inclut un suffixe descriptif (ex: "T-01-nodejs").
const CODE_TO_FOLDER: Record<string, string> = {
  "T-01": "T-01-nodejs",
  "T-01b": "T-01b-package-json",
  "T-02": "T-02-terminal",
  "T-03": "T-03-git",
  "T-A01": "T-A01-claude",
  "T-A02": "T-A02-outils-alternatives",
  "T-A03": "T-A03-seo-llm",
  "T-A03b": "T-A03b-landing-page",
  "T-ORG01": "T-ORG01-organisation",
  "T-GCLOUD01": "T-GCLOUD01-google-cloud",
  "T-SEC01": "T-SEC01-securite",
  "T-LEG01": "T-LEG01-legal-rgpd",
  "C1-01": "C1-01-ports",
  "C1-02": "C1-02-http",
  "C1-03": "C1-03-cdn",
  "C1-04": "C1-04-ssl",
  "C2-01": "C2-01-os",
  "C3-01": "C3-01-nextjs",
  "C3-02": "C3-02-routing",
  "C3-03": "C3-03-composants-ui",
  "C3-04": "C3-04-authentification",
  "C4-01": "C4-01-supabase",
  "C4-02": "C4-02-api-rest",
  "C5-01": "C5-01-vercel",
};

export function getGitHubFolder(code: string): string | null {
  return CODE_TO_FOLDER[code] || null;
}

export function getReadmeUrl(code: string): string | null {
  const folder = getGitHubFolder(code);
  if (!folder) return null;
  return `https://raw.githubusercontent.com/keticwork/eticlab/main/${folder}/README.md`;
}
