import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase-server";

export default async function ArbrePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/connexion");

  return (
    <section className="flex min-h-[calc(100vh-120px)] items-center justify-center bg-[#F8FAF9] px-4">
      <div className="max-w-md text-center">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#1D9E75]/10">
          <span className="text-3xl">🌳</span>
        </div>
        <h1 className="text-3xl font-bold text-gray-900">
          L&apos;Arbre des modules
        </h1>
        <p className="mt-3 text-gray-500">
          La carte interactive arrive bientôt.
        </p>
        <Link
          href="/modules"
          className="mt-8 inline-block rounded-lg bg-[#1D9E75] px-6 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:-translate-y-0.5 hover:bg-[#178a64] hover:shadow-md"
        >
          Voir les modules
        </Link>
      </div>
    </section>
  );
}
