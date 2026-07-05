import { useAuth } from "@/hooks/useAuth";
import { useLocation } from "wouter";
import { useEffect } from "react";
import DashboardLayout from "./DashboardLayout";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!loading && user && user.role !== 'admin') {
      setLocation('/dashboard');
    }
  }, [loading, user, setLocation]);

  // Show nothing while checking auth
  if (loading) {
    return null;
  }

  // Redirect handled by useEffect, but prevent flash
  if (!user || user.role !== 'admin') {
    return null;
  }

  return <DashboardLayout>{children}</DashboardLayout>;
}
