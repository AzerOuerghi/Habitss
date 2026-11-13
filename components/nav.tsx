import Link from "next/link";
import { getUser } from "@/lib/auth";
import { signOut } from "@/actions/auth";

const LINKS = [
  { href: "/today", label: "Saisie du jour" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/insights", label: "Insights IA" },
  { href: "/report", label: "Rapport" },
  { href: "/coach", label: "Coach" },
];

export async function Nav() {
  const user = await getUser();

  return (
    <header className="no-print border-b border-slate-200 bg-white">
      <nav className="max-w-5xl mx-auto px-4 h-14 flex items-center gap-6">
        <Link href="/" className="font-semibold shrink-0">
          AI Habits
        </Link>

        {user && (
          <ul className="flex items-center gap-4 text-sm text-slate-600 overflow-x-auto">
            {LINKS.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="hover:text-slate-900 whitespace-nowrap">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        )}

        <div className="ml-auto flex items-center gap-3 text-sm shrink-0">
          {user ? (
            <>
              <Link href="/profile" className="text-slate-600 hover:text-slate-900">
                Profil
              </Link>
              <form action={signOut}>
                <button className="text-slate-500 hover:text-slate-900">Déconnexion</button>
              </form>
            </>
          ) : (
            <>
              <Link href="/login" className="text-slate-600 hover:text-slate-900">
                Connexion
              </Link>
              <Link
                href="/signup"
                className="rounded-md bg-slate-900 px-3 py-1.5 text-white hover:bg-slate-700"
              >
                Inscription
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
