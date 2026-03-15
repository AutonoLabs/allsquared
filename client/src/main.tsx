import { trpc } from "@/lib/trpc";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink } from "@trpc/client";
import { createRoot } from "react-dom/client";
import { useRef } from "react";
import superjson from "superjson";
import App from "./App";
import { ClerkAuthProvider } from "./lib/clerk";
import { useAuth as useClerkAuth } from "@clerk/clerk-react";
import "./index.css";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 1, staleTime: 30_000 },
  },
});

// Inner component — lives inside ClerkProvider so useAuth() works
function AppWithTRPC() {
  const { getToken } = useClerkAuth();

  // Store getToken in a ref that updates every render so headers() always
  // uses the latest Clerk-provided function (not a stale initial one)
  const getTokenRef = useRef(getToken);
  getTokenRef.current = getToken;

  // Stable tRPC client — created once, but headers() reads getTokenRef.current
  const trpcClientRef = useRef(
    trpc.createClient({
      links: [
        httpBatchLink({
          url: "/api/trpc",
          transformer: superjson,
          async headers() {
            try {
              const token = await getTokenRef.current();
              return token ? { Authorization: `Bearer ${token}` } : {};
            } catch {
              return {};
            }
          },
        }),
      ],
    })
  );

  return (
    <trpc.Provider client={trpcClientRef.current} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </trpc.Provider>
  );
}

createRoot(document.getElementById("root")!).render(
  <ClerkAuthProvider>
    <AppWithTRPC />
  </ClerkAuthProvider>
);
