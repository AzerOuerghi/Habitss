// Script de vérification jetable : lit les données seedées et fait tourner
// le moteur d'analyse hors Next, pour valider lib/stats.ts.
import { config } from "dotenv";
import { MongoClient } from "mongodb";
import { computeCorrelations, predictTomorrowEnergy, summarize } from "../lib/stats";
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
  console.log("\nprédiction :", predictTomorrowEnergy(entries));

  await client.close();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
