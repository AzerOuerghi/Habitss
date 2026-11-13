import Link from "next/link";
import { redirect } from "next/navigation";
import { getUser } from "@/lib/auth";

export default async function Home() {
  if (await getUser()) redirect("/today");

  return (
    <div className="mx-auto max-w-2xl py-12 text-center">
      <h1 className="text-4xl font-semibold tracking-tight text-slate-900">
        Comprends ce qui fait varier ton énergie
      </h1>
      <p className="mt-4 text-lg text-slate-600">
        Consigne ton sommeil, ta nutrition, ton activité et ton temps d&apos;écran. L&apos;IA croise
        tes données, détecte les corrélations et prédit tes baisses d&apos;énergie.
      </p>

      <div className="mt-8 flex justify-center gap-3">
        <Link
          href="/signup"
          className="rounded-md bg-slate-900 px-5 py-2.5 font-medium text-white hover:bg-slate-700"
        >
          Commencer
        </Link>
        <Link
          href="/login"
          className="rounded-md border border-slate-300 bg-white px-5 py-2.5 font-medium hover:border-slate-900"
        >
          J&apos;ai déjà un compte
        </Link>
      </div>

      <ul className="mt-12 grid gap-4 text-left sm:grid-cols-3">
        {[
          ["Saisie en 30 secondes", "Sommeil, café, énergie, stress, symptômes, temps d'écran."],
          ["Corrélations réelles", "Coefficient de Pearson sur 7, 30 ou 90 jours."],
          ["Rapport médecin", "Un PDF structuré et anonymisé, prêt à imprimer."],
        ].map(([title, desc]) => (
          <li key={title} className="rounded-xl border border-slate-200 bg-white p-4">
            <div className="font-medium text-slate-900">{title}</div>
            <p className="mt-1 text-sm text-slate-600">{desc}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
