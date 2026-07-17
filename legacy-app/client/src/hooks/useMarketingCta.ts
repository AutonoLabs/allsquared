import { useLocation } from "wouter";

export function useMarketingCta() {
  const [, setLocation] = useLocation();

  function goToPath(path: string) {
    setLocation(path);
  }

  function handleGetStarted() {
    setLocation("/waitlist");
  }

  return {
    goToPath,
    handleGetStarted,
  };
}
