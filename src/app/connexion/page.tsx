import Link from "next/link";
import { GoogleAuthButton, MagicLinkForm } from "@/components/auth/AuthButton";

export default function ConnexionPage() {
  return (
    <section className="flex min-h-[calc(100vh-120px)] items-center justify-center bg-[#0A0F0D] px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="mb-8 text-center">
          <Link href="/" className="text-3xl font-bold">
            <span className="text-white">Etic</span>
            <span className="text-[#1D9E75]">Lab</span>
          </Link>
        </div>

        {/* Carte */}
        <div className="rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-sm">
          <h1 className="mb-6 text-center text-xl font-bold text-white">
            Rejoindre EticLab
          </h1>

          {/* Google */}
          <GoogleAuthButton />

          {/* Séparateur */}
          <div className="my-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-white/10" />
            <span className="text-xs text-gray-500">ou</span>
            <div className="h-px flex-1 bg-white/10" />
          </div>

          {/* Magic Link */}
          <MagicLinkForm />
        </div>

        {/* CGU */}
        <p className="mt-6 text-center text-xs text-gray-600">
          En continuant, tu acceptes nos{" "}
          <Link href="/cgu" className="text-gray-400 underline underline-offset-2 hover:text-white">
            CGU
          </Link>
        </p>
      </div>
    </section>
  );
}
