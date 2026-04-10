"use client";

import { getRoleFromUser, type AppRole } from "@/lib/auth/roles";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

export default function AuthActions() {
  const [role, setRole] = useState<AppRole | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const router = useRouter();
  const pathname = usePathname();

  const supabase = useMemo(() => createSupabaseBrowserClient(), []);

  useEffect(() => {
    let mounted = true;

    const init = async () => {
      const { data } = await supabase.auth.getUser();
      if (!mounted) {
        return;
      }

      const nextRole = getRoleFromUser(data.user);
      setRole(nextRole);
      setIsAuthenticated(Boolean(data.user));
    };

    init();

    const { data: subscription } = supabase.auth.onAuthStateChange((_event, session) => {
      const nextRole = getRoleFromUser(session?.user ?? null);
      setRole(nextRole);
      setIsAuthenticated(Boolean(session?.user));
    });

    return () => {
      mounted = false;
      subscription.subscription.unsubscribe();
    };
  }, [supabase]);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        toast.error(error.message || "Logout failed.");
        return;
      }

      toast.success("Logged out successfully.");
      router.replace("/");
      setTimeout(() => {
        window.location.assign("/");
      }, 100);
      router.refresh();
    } finally {
      setIsLoggingOut(false);
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  const employeeActive = pathname.startsWith("/employer-dashboard");
  const candidateActive = pathname.startsWith("/candidate-dashboard");

  return (
    <div className="ml-auto flex items-center gap-2">
      {(role === "candidate" || role === null) && (
        <Link
          href="/candidate-dashboard"
          className={`rounded-lg border bg-white px-3 py-1.5 text-xs font-semibold transition ${
            candidateActive
              ? "border-(--akij-btn-start) text-(--akij-btn-start)"
              : "border-(--akij-border) text-(--akij-heading) hover:border-(--akij-btn-start) hover:text-(--akij-btn-start)"
          }`}
        >
          Candidate
        </Link>
      )}

      {(role === "employee" || role === null) && (
        <Link
          href="/employer-dashboard"
          className={`rounded-lg border bg-white px-3 py-1.5 text-xs font-semibold transition ${
            employeeActive
              ? "border-(--akij-btn-start) text-(--akij-btn-start)"
              : "border-(--akij-border) text-(--akij-heading) hover:border-(--akij-btn-start) hover:text-(--akij-btn-start)"
          }`}
        >
          Employer
        </Link>
      )}

      <button
        type="button"
        onClick={handleLogout}
        disabled={isLoggingOut}
        className="rounded-lg border border-[#ef4444] bg-white px-3 py-1.5 text-xs font-semibold text-[#ef4444] transition hover:bg-[#fee2e2] disabled:cursor-not-allowed disabled:opacity-70"
      >
        {isLoggingOut ? "Logging out..." : "Logout"}
      </button>
    </div>
  );
}
