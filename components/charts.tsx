"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { Entry } from "@/lib/types";

type Point = Entry & { label: string };

function toPoints(entries: Entry[]): Point[] {
  return entries.map((e) => ({
    ...e,
    label: new Date(`${e.date}T00:00:00`).toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
    }),
  }));
}

const AXIS = { stroke: "#94a3b8", fontSize: 12 };

/** Énergie vs stress — le graphique principal du dashboard. */
export function EnergyChart({ entries }: { entries: Entry[] }) {
  return (
    <ResponsiveContainer width="100%" height={240}>
      <LineChart data={toPoints(entries)}>
        <CartesianGrid stroke="#e2e8f0" vertical={false} />
        <XAxis dataKey="label" tick={AXIS} minTickGap={24} />
        <YAxis domain={[0, 10]} tick={AXIS} width={28} />
        <Tooltip />
        <Line type="monotone" dataKey="energy" name="Énergie" stroke="#0f172a" strokeWidth={2} dot={false} />
        <Line type="monotone" dataKey="stress" name="Stress" stroke="#f87171" strokeWidth={2} dot={false} />
      </LineChart>
    </ResponsiveContainer>
  );
}

/** Sommeil : durée (ligne) — module 2b. */
export function SleepChart({ entries }: { entries: Entry[] }) {
  return (
    <ResponsiveContainer width="100%" height={240}>
      <LineChart data={toPoints(entries)}>
        <CartesianGrid stroke="#e2e8f0" vertical={false} />
        <XAxis dataKey="label" tick={AXIS} minTickGap={24} />
        <YAxis domain={[0, 12]} tick={AXIS} width={28} />
        <Tooltip />
        <Line type="monotone" dataKey="sleepHours" name="Heures de sommeil" stroke="#2563eb" strokeWidth={2} dot={false} />
        <Line type="monotone" dataKey="sleepQuality" name="Qualité (/5)" stroke="#93c5fd" strokeWidth={2} dot={false} />
      </LineChart>
    </ResponsiveContainer>
  );
}

/** Temps d'écran et réseaux sociaux — module 2a. */
export function ScreenChart({ entries }: { entries: Entry[] }) {
  return (
    <ResponsiveContainer width="100%" height={240}>
      <BarChart data={toPoints(entries)}>
        <CartesianGrid stroke="#e2e8f0" vertical={false} />
        <XAxis dataKey="label" tick={AXIS} minTickGap={24} />
        <YAxis tick={AXIS} width={36} />
        <Tooltip />
        <Bar dataKey="screenTime" name="Écran (min)" fill="#cbd5e1" />
        <Bar dataKey="socialTime" name="Réseaux (min)" fill="#64748b" />
      </BarChart>
    </ResponsiveContainer>
  );
}
