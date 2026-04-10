import { getRoleFromUser } from "@/lib/auth/roles";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export const getServerAuthContext = async () => {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return {
      user: null,
      role: null,
      unauthorizedResponse: NextResponse.json({ message: "Unauthorized" }, { status: 401 }),
    };
  }

  const role = getRoleFromUser(user);

  return {
    user,
    role,
    unauthorizedResponse: null,
  };
};
