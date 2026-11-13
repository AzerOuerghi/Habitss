import { requireUser } from "@/lib/auth";
import { Chat } from "@/components/chat";
import { PageTitle } from "@/components/ui";

export default async function CoachPage() {
  await requireUser();

  return (
    <>
      <PageTitle
        title="Coach IA"
        subtitle="Il connaît tes 7 derniers jours et tes corrélations détectées."
      />
      <Chat />
    </>
  );
}
