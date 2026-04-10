import { supabaseAdmin } from "@/lib/supabase/admin";
import { NextResponse } from "next/server";

type DemoUserInput = {
  email: string;
  password: string;
  role: "employee" | "candidate";
};

const isAlreadyExistsError = (message: string) => {
  const normalized = message.toLowerCase();
  return normalized.includes("already") || normalized.includes("exists");
};

const ensureDemoUser = async ({ email, password, role }: DemoUserInput) => {
  const { error } = await supabaseAdmin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    app_metadata: {
      role,
    },
    user_metadata: {
      role,
    },
  });

  if (!error) {
    return;
  }

  if (!isAlreadyExistsError(error.message)) {
    throw error;
  }

  const { data: usersData, error: usersError } = await supabaseAdmin.auth.admin.listUsers({
    page: 1,
    perPage: 1000,
  });

  if (usersError) {
    throw usersError;
  }

  const matchedUser = usersData.users.find((user) => user.email === email);

  if (!matchedUser) {
    return;
  }

  const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
    matchedUser.id,
    {
      password,
      email_confirm: true,
      app_metadata: {
        ...(matchedUser.app_metadata ?? {}),
        role,
      },
      user_metadata: {
        ...(matchedUser.user_metadata ?? {}),
        role,
      },
    },
  );

  if (updateError) {
    throw updateError;
  }
};

export async function POST() {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json(
      { message: "Demo user bootstrap is disabled in production." },
      { status: 403 },
    );
  }

  const employeeEmail = process.env.DEMO_EMPLOYEE_EMAIL;
  const employeePassword = process.env.DEMO_EMPLOYEE_PASSWORD;
  const candidateEmail = process.env.DEMO_CANDIDATE_EMAIL;
  const candidatePassword = process.env.DEMO_CANDIDATE_PASSWORD;

  if (!employeeEmail || !employeePassword || !candidateEmail || !candidatePassword) {
    return NextResponse.json(
      {
        message:
          "Missing demo credential env variables. Set DEMO_EMPLOYEE_EMAIL, DEMO_EMPLOYEE_PASSWORD, DEMO_CANDIDATE_EMAIL, DEMO_CANDIDATE_PASSWORD.",
      },
      { status: 400 },
    );
  }

  try {
    await ensureDemoUser({
      email: employeeEmail,
      password: employeePassword,
      role: "employee",
    });

    await ensureDemoUser({
      email: candidateEmail,
      password: candidatePassword,
      role: "candidate",
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ message }, { status: 500 });
  }
}
