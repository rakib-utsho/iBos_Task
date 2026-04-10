"use client";
import MyFormInput from "@/components/form/MyFormInput";
import MyFormWrapper from "@/components/form/MyFormWrapper";
import { getRoleFromUser } from "@/lib/auth/roles";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";

type LoginValues = {
  emailOrUserId: string;
  password: string;
};

const loginSchema = z.object({
  emailOrUserId: z
    .string({ required_error: "Email is required" })
    .min(1, "Email is required")
    .email("Enter a valid email"),
  password: z
    .string({ required_error: "Password is required" })
    .min(6, "Password must be at least 6 characters"),
});

function Home() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleLogin = async (values: LoginValues) => {
    const supabase = createSupabaseBrowserClient();

    setIsSubmitting(true);

    try {
      // In development, this creates/updates demo employee and candidate users from env values.
      await fetch("/api/auth/bootstrap-demo-users", {
        method: "POST",
      });

      const { data, error } = await supabase.auth.signInWithPassword({
        email: values.emailOrUserId,
        password: values.password,
      });

      if (error) {
        toast.error(error.message || "Login failed.");
        return;
      }

      const fallbackUserResponse = await supabase.auth.getUser();
      const user = data.user ?? fallbackUserResponse.data.user;
      const role = getRoleFromUser(user);

      if (!role) {
        toast.error("No role found for this account. Please contact admin.");
        return;
      }

      const sessionResponse = await supabase.auth.getSession();
      if (!sessionResponse.data.session) {
        toast.error("Session not created. Please try again.");
        return;
      }

      toast.success("Sign in successful");

      const targetPath =
        role === "employee" ? "/employer-dashboard" : "/candidate-dashboard";

      router.replace(targetPath);
      // Hard navigation fallback for any client router race condition after auth cookie write.
      setTimeout(() => {
        window.location.assign(targetPath);
      }, 120);

      router.refresh();
    } catch {
      toast.error("Unexpected error while signing in.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="mx-auto flex min-h-[calc(100vh-7rem)] w-full max-w-7xl items-center justify-center px-4 py-10 sm:px-6 lg:px-8">
      <div className="w-full max-w-130 rounded-2xl border border-(--akij-border) bg-white/85 p-6 shadow-[0_14px_40px_rgba(28,39,64,0.08)] backdrop-blur-sm sm:p-8">
        <h2 className="mb-8 text-center text-4xl font-semibold tracking-tight text-(--akij-heading)">
          Sign In
        </h2>

        <MyFormWrapper<LoginValues>
          onSubmit={handleLogin}
          resolver={zodResolver(loginSchema)}
          defaultValues={{
            emailOrUserId: "",
            password: "",
          }}
          className="space-y-1"
        >
          <MyFormInput
            name="emailOrUserId"
            label="Email/User ID"
            placeholder="Enter your email/User ID"
            required
            className="mb-2"
            labelClassName="text-sm font-medium text-(--akij-text)"
            inputClassName="h-11 rounded-lg border-(--akij-border) bg-white px-3 text-sm text-(--akij-text) placeholder:text-(--akij-subtext) focus:ring-(--akij-btn-start)"
          />

          <MyFormInput
            name="password"
            type="password"
            label="Password"
            placeholder="Enter your password"
            required
            className="mb-1"
            labelClassName="text-sm font-medium text-(--akij-text)"
            inputClassName="h-11 rounded-lg border-(--akij-border) bg-white px-3 pr-11 text-sm text-(--akij-text) placeholder:text-(--akij-subtext) focus:ring-(--akij-btn-start)"
          />
          <div className="mb-6" />

          <button
            type="submit"
            disabled={isSubmitting}
            className="h-11 w-full rounded-lg bg-linear-to-r from-(--akij-btn-start) to-(--akij-btn-end) text-base font-semibold text-white shadow-[0_10px_22px_rgba(88,64,248,0.35)] transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSubmitting ? "Signing In..." : "Sign In"}
          </button>
        </MyFormWrapper>
      </div>
    </section>
  );
}

export default Home;
