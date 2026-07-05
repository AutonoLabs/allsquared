import { useAuth } from "@/hooks/useAuth";
import { useLocation } from "wouter";

export function useMarketingCta() {
  const { isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();

  function goToPath(path: string) {
    setLocation(path);
  }

  function handleGetStarted() {
    if (isAuthenticated) {
      setLocation("/dashboard/contracts/new");
      return;
    }

    setLocation("/sign-up?redirect=%2Fdashboard%2Fcontracts%2Fnew");
  }

  return {
    goToPath,
    handleGetStarted,
    isAuthenticated,
  };
}
