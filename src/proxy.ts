import { getRoleFromUser } from "@/lib/auth/roles";
import { createServerClient } from "@supabase/ssr";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const publicRoutes = ["/"];

export default async function proxy(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    return response;
  }

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value),
        );
        response = NextResponse.next({
          request: {
            headers: request.headers,
          },
        });
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options),
        );
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const role = getRoleFromUser(user);
  const { pathname } = request.nextUrl;

  if (publicRoutes.some((route) => pathname === route)) {
    if (user) {
      if (role === "employee") {
        return NextResponse.redirect(
          new URL("/employer-dashboard", request.url),
        );
      }

      if (role === "candidate") {
        return NextResponse.redirect(
          new URL("/candidate-dashboard", request.url),
        );
      }
    }

    return response;
  }

  if (pathname.startsWith("/employer-dashboard")) {
    if (!user) {
      return NextResponse.redirect(new URL("/", request.url));
    }

    if (role !== "employee") {
      return NextResponse.redirect(
        new URL("/candidate-dashboard", request.url),
      );
    }
  }

  if (pathname.startsWith("/candidate-dashboard")) {
    if (!user) {
      return NextResponse.redirect(new URL("/", request.url));
    }

    if (role !== "candidate") {
      return NextResponse.redirect(new URL("/employer-dashboard", request.url));
    }
  }

  if (!user && !pathname.startsWith("/api/")) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api).*)"],
};
