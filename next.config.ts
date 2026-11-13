import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Désactivé volontairement : toutes nos pages dépendent de l'utilisateur
  // connecté (cookies Supabase), il n'y a rien à prérendre. Avec
  // cacheComponents: true, Next exige un <Suspense> ou "use cache" sur chaque
  // accès à cookies() — complexité inutile ici.
  cacheComponents: false,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
