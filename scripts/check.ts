// Script de vérification jetable : lit les données seedées et fait tourner
// le moteur d'analyse hors Next, pour valider lib/stats.ts.
import { config } from "dotenv";
import { MongoClient } from "mongodb";
import { computeCorrelations, predictTomorrowEnergy, summarize } from "../lib/stats";
import { aiProvider, askAI } from "../lib/ai";
import type { Entry } from "../lib/types";

config({ path: ".env.local" });

async function main() {
  const userId = process.argv[2] ?? "demo-user-test";

  const client = await new MongoClient(process.env.MONGODB_URI!).connect();
  const db = client.db(process.env.MONGODB_DB);
  const entries = (await db
    .collection<Entry>("entries")
    .find({ userId })
    .sort({ date: 1 })
    .toArray()) as Entry[];

  console.log(`${entries.length} entrées pour ${userId}\n`);
  console.log("moyennes :", summarize(entries));
  console.log("\ncorrélations détectées :");
  for (const c of computeCorrelations(entries))
    console.log(`  r=${String(c.r).padStart(5)}  [${c.strength.padEnd(7)}] ${c.label}`);
  const prediction = predictTomorrowEnergy(entries);
  console.log("\nprédiction :", prediction);

  // Smoke test du chemin IA : valide la clé, le modèle et le format de sortie.
  console.log(`\nprovider IA : ${aiProvider()}`);
  if (aiProvider() !== "none") {
    const correlations = computeCorrelations(entries);
    const text = await askAI(
      `Corrélations mesurées :\n${correlations.map((c) => `- ${c.label} : r = ${c.r}`).join("\n")}\nÉnergie prédite demain : ${prediction.tomorrowEnergy}/10.

Donne exactement 4 conseils personnalisés, concrets, en français. Une phrase par conseil, 25 mots max, un par ligne, sans numérotation ni markdown.`,
      "Tu es un coach santé factuel. Tu t'appuies uniquement sur les données fournies."
    );
    console.log("conseils générés :");
    for (const l of text.split("\n").map((s) => s.replace(/^[-*\d.)\s]+/, "").trim()).filter((s) => s.length > 15))
      console.log(`  • ${l}`);
  }

  await client.close();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
