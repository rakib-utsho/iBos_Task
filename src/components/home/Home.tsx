"use client";
import MyFormInput from "@/components/form/MyFormInput";
import MyFormWrapper from "@/components/form/MyFormWrapper";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";

type LoginValues = {
  emailOrUserId: string;
  password: string;
};

function Home() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLogin = async (values: LoginValues) => {
    setIsSubmitting(true);

    await new Promise((resolve) => setTimeout(resolve, 500));

    toast.success("Login form submitted", {
      description: `Email/User ID: ${values.emailOrUserId}`,
    });

    setIsSubmitting(false);
  };

  return (
    <section className="mx-auto flex min-h-[calc(100vh-7rem)] w-full max-w-7xl items-center justify-center px-4 py-10 sm:px-6 lg:px-8">
      <div className="w-full max-w-130 rounded-2xl border border-(--akij-border) bg-white/85 p-6 shadow-[0_14px_40px_rgba(28,39,64,0.08)] backdrop-blur-sm sm:p-8">
        <h2 className="mb-8 text-center text-4xl font-semibold tracking-tight text-(--akij-heading)">
          Sign In
        </h2>

        <MyFormWrapper<LoginValues>
          onSubmit={handleLogin}
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

          <div className="mb-6 flex justify-end">
            <Link
              href="/auth/forgot-password"
              className="text-sm text-(--akij-text) transition hover:text-(--akij-btn-start)"
            >
              Forget Password?
            </Link>
          </div>

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
