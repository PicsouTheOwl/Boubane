import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex-1 flex items-center justify-center pt-20">
      <div className="text-center">
        <p className="text-[6rem] font-semibold text-text-dim/20 leading-none mb-4">404</p>
        <h1 className="text-[1.4rem] font-semibold text-text mb-2">Page introuvable</h1>
        <p className="text-[13px] text-text-muted mb-8">
          Cette page n&apos;existe pas ou a été déplacée.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-text text-bg font-medium text-[13px] hover:bg-[#f0f0f0] transition-colors"
        >
          Retour à l&apos;accueil
        </Link>
      </div>
    </main>
  );
}
