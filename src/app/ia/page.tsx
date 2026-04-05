import { createClient } from "@/lib/supabase-server";
import { ChatInterface } from "@/components/chat/ChatInterface";
import Link from "next/link";

export default async function IAPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return (
      <section className="flex min-h-[calc(100vh-120px)] items-center justify-center bg-[#F8FAF9] px-4">
        <div className="max-w-sm text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#1D9E75]/10">
            <span className="text-3xl">🤖</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Guide IA</h1>
          <p className="mt-3 text-gray-500">
            Connecte-toi pour accéder au guidage IA et générer ton parcours personnalisé.
          </p>
          <Link
            href="/connexion"
            className="mt-6 inline-block rounded-lg bg-[#1D9E75] px-6 py-3 text-sm font-semibold text-white transition-all hover:-translate-y-0.5 hover:bg-[#178a64]"
          >
            Se connecter →
          </Link>
        </div>
      </section>
    );
  }

  // Récupérer le compteur de requêtes
  let { data: profile } = await supabase
    .from("profiles")
    .select("ai_requests_today, ai_last_request_date")
    .eq("id", user.id)
    .single();

  const today = new Date().toISOString().split("T")[0];
  let remaining = 10;

  if (profile) {
    if (profile.ai_last_request_date === today) {
      remaining = Math.max(0, 10 - (profile.ai_requests_today || 0));
    }
  }

  return (
    <section className="flex min-h-[calc(100vh-120px)] flex-col bg-[#F8FAF9]">
      <ChatInterface initialRemaining={remaining} />
    </section>
  );
}
