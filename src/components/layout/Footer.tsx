import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-white">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 py-6 text-sm text-gray-500 sm:flex-row">
        <p>&copy; 2026 Etic — EticLab</p>
        <div className="flex gap-6">
          <Link href="/mentions-legales" className="hover:text-black">
            Mentions légales
          </Link>
          <Link href="/confidentialite" className="hover:text-black">
            Confidentialité
          </Link>
          <Link href="/cgu" className="hover:text-black">
            CGU
          </Link>
          <Link href="/contact" className="hover:text-black">
            Contact
          </Link>
        </div>
      </div>
    </footer>
  );
}
