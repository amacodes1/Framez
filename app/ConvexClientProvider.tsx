// ConvexClientProvider.tsx
import { ReactNode } from "react";
import { ConvexReactClient, ConvexProvider } from "convex/react";

// Ensure the URL is read from Expo Constants if needed
const CONVEX_URL =
  process.env.EXPO_PUBLIC_CONVEX_URL ||
  // For production, Expo puts `extra` variables here
  (typeof globalThis !== "undefined" &&
    (globalThis as any)?.Expo?.Constants?.manifest?.extra?.CONVEX_URL) ||
  "";

if (!CONVEX_URL) {
  throw new Error(
    "No EXPO_PUBLIC_CONVEX_URL found. Make sure it is set in .env or app.json extra."
  );
}

const convex = new ConvexReactClient(CONVEX_URL);

export function ConvexClientProvider({ children }: { children: ReactNode }) {
  return <ConvexProvider client={convex}>{children}</ConvexProvider>;
}

export default ConvexClientProvider;
