import { getEntry } from "@/actions/entries";
import { EntryForm } from "@/components/entry-form";
import { Card, PageTitle } from "@/components/ui";
import { today } from "@/lib/types";

export default async function TodayPage() {
  const date = today();
  const entry = await getEntry(date);

  return (
    <>
      <PageTitle
        title="Saisie du jour"
        subtitle={new Date(`${date}T00:00:00`).toLocaleDateString("fr-FR", {
          weekday: "long",
          day: "numeric",
          month: "long",
        })}
      />

      {entry && (
        <p className="mb-4 rounded-md bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
          Journée déjà enregistrée — tu peux corriger et renvoyer.
        </p>
      )}

      <Card>
        <EntryForm date={date} entry={entry} />
      </Card>
    </>
  );
}
