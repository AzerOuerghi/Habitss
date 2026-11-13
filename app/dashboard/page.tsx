import Link from "next/link";
import { getEntries } from "@/actions/entries";
import { EnergyChart, ScreenChart, SleepChart } from "@/components/charts";
import { Card, Empty, PageTitle, Stat } from "@/components/ui";
import { summarize } from "@/lib/stats";

const RANGES = [7, 30, 90];

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ range?: string }>;
}) {
  const { range: raw } = await searchParams;
  const range = RANGES.includes(Number(raw)) ? Number(raw) : 30;

  const entries = await getEntries(range);
  const stats = summarize(entries);

  return (
    <>
      <PageTitle title="Dashboard" subtitle={`${stats.days} jour(s) de données sur ${range}`} />

      <div className="mb-6 flex gap-2">
        {RANGES.map((r) => (
          <Link
            key={r}
            href={`/dashboard?range=${r}`}
            className={`rounded-md border px-3 py-1.5 text-sm ${
              r === range
                ? "border-slate-900 bg-slate-900 text-white"
                : "border-slate-300 bg-white text-slate-600 hover:border-slate-900"
            }`}
          >
            {r} jours
          </Link>
        ))}
      </div>

      {entries.length === 0 ? (
        <Empty>
          Aucune donnée. Commence par{" "}
          <Link href="/today" className="font-medium text-slate-900 underline">
            la saisie du jour
          </Link>
          , ou lance <code className="font-mono">npm run seed</code> pour générer 60 jours de démo.
        </Empty>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <Stat label="Énergie moy." value={stats.energy} unit="/10" />
            <Stat label="Sommeil moy." value={stats.sleepHours} unit="h" />
            <Stat label="Cafés / jour" value={stats.caffeine} />
            <Stat label="Écran / jour" value={stats.screenTime} unit="min" />
          </div>

          <Card title="Énergie et stress" subtitle="Les deux courbes à croiser en premier">
            <EnergyChart entries={entries} />
          </Card>

          <Card title="Sommeil" subtitle="Durée et qualité ressentie">
            <SleepChart entries={entries} />
          </Card>

          <Card title="Temps d'écran" subtitle="Total et part réseaux sociaux">
            <ScreenChart entries={entries} />
          </Card>

          {stats.topSymptoms.length > 0 && (
            <Card title="Symptômes les plus fréquents">
              <ul className="flex flex-wrap gap-2">
                {stats.topSymptoms.map((s) => (
                  <li
                    key={s.name}
                    className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-700"
                  >
                    {s.name} · {s.count}x
                  </li>
                ))}
              </ul>
            </Card>
          )}
        </div>
      )}
    </>
  );
}
