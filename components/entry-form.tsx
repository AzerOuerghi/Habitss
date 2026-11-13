"use client";

import { useState } from "react";
import { useFormStatus } from "react-dom";
import { saveEntry } from "@/actions/entries";
import { FIELDS, type Entry } from "@/lib/types";

const DEFAULTS: Record<string, number> = {
  sleepHours: 7,
  sleepQuality: 3,
  caffeine: 1,
  lastCaffeineHour: 10,
  meals: 3,
  energy: 6,
  stress: 4,
  screenTime: 180,
  socialTime: 60,
  steps: 5000,
};

export function EntryForm({ date, entry }: { date: string; entry: Entry | null }) {
  const habit = FIELDS.filter((f) => f.group === "habit");
  const device = FIELDS.filter((f) => f.group === "device");

  return (
    <form action={saveEntry} className="space-y-6">
      <input type="hidden" name="date" value={date} />

      <Group title="Habitudes" hint="Sommeil, nutrition, énergie, stress">
        {habit.map((f) => (
          <Input key={f.key} field={f} value={value(entry, f.key)} />
        ))}
      </Group>

      <Group title="Appareils" hint="Temps d'écran, réseaux sociaux, activité">
        {device.map((f) => (
          <Input key={f.key} field={f} value={value(entry, f.key)} />
        ))}
      </Group>

      <label className="block">
        <span className="text-sm font-medium text-slate-700">Symptômes</span>
        <input
          name="symptoms"
          defaultValue={(entry?.symptoms ?? []).join(", ")}
          placeholder="mal de tête, ballonnements, fatigue..."
          className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 outline-none focus:border-slate-900"
        />
        <span className="mt-1 block text-xs text-slate-500">Séparés par des virgules</span>
      </label>

      <Submit existing={!!entry} />
    </form>
  );
}

function value(entry: Entry | null, key: string) {
  const v = entry?.[key as keyof Entry];
  return typeof v === "number" ? v : DEFAULTS[key] ?? 0;
}

function Group({
  title,
  hint,
  children,
}: {
  title: string;
  hint: string;
  children: React.ReactNode;
}) {
  return (
    <fieldset>
      <legend className="font-medium text-slate-900">{title}</legend>
      <p className="mb-3 text-sm text-slate-500">{hint}</p>
      <div className="grid gap-4 sm:grid-cols-2">{children}</div>
    </fieldset>
  );
}

function Input({
  field,
  value: initial,
}: {
  field: (typeof FIELDS)[number];
  value: number;
}) {
  const [v, setV] = useState(initial);
  const isScale = field.max <= 10 && field.min >= 0 && field.step === 1;

  return (
    <label className="block">
      <span className="flex items-baseline justify-between text-sm font-medium text-slate-700">
        {field.label}
        <span className="font-mono text-slate-500">
          {v}
          {field.unit}
        </span>
      </span>

      <input
        name={field.key}
        type={isScale ? "range" : "number"}
        min={field.min}
        max={field.max}
        step={field.step}
        value={v}
        onChange={(e) => setV(Number(e.target.value))}
        className={
          isScale
            ? "mt-2 w-full accent-slate-900"
            : "mt-1 w-full rounded-md border border-slate-300 px-3 py-2 outline-none focus:border-slate-900"
        }
      />
    </label>
  );
}

function Submit({ existing }: { existing: boolean }) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full rounded-md bg-slate-900 px-4 py-2.5 font-medium text-white hover:bg-slate-700 disabled:opacity-50"
    >
      {pending ? "Enregistrement..." : existing ? "Mettre à jour ma journée" : "Enregistrer ma journée"}
    </button>
  );
}
