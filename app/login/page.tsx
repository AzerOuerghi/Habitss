import { redirect } from "next/navigation";
import { AuthForm } from "@/components/auth-form";
import { Card } from "@/components/ui";
import { getUser } from "@/lib/auth";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ check?: string }>;
}) {
  if (await getUser()) redirect("/today");
  const { check } = await searchParams;

  return (
    <div className="mx-auto max-w-sm">
      <h1 className="mb-6 text-2xl font-semibold">Connexion</h1>
      {check && (
        <p className="mb-4 rounded-md bg-amber-50 px-3 py-2 text-sm text-amber-800">
          Compte créé. Vérifie ta boîte mail pour confirmer, puis connecte-toi.
        </p>
      )}
      <Card>
        <AuthForm mode="login" />
      </Card>
    </div>
  );
}
