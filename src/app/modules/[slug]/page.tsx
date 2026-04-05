import Link from "next/link";

export default async function ModulePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  return (
    <section className="flex min-h-[calc(100vh-120px)] items-center justify-center bg-[#F8FAF9] px-4">
      <div className="max-w-md text-center">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#1D9E75]/10">
          <span className="text-3xl">📖</span>
        </div>
        <h1 className="text-2xl font-bold text-gray-900">
          Module {slug.toUpperCase()}
        </h1>
        <p className="mt-3 text-gray-500">
          Le contenu de ce module arrive bientôt.
        </p>
        <Link
          href="/modules"
          className="mt-8 inline-block rounded-lg border border-gray-300 px-6 py-3 text-sm font-medium text-gray-700 transition-all hover:-translate-y-0.5 hover:border-gray-400 hover:shadow-sm"
        >
          ← Retour aux modules
        </Link>
      </div>
    </section>
  );
}
