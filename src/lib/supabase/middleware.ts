import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { isSupabaseConfigured } from "./client";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  if (!isSupabaseConfigured()) {
    return supabaseResponse;
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

  try {
    const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    });

    const pathname = request.nextUrl.pathname;
    const isProtected =
      pathname.startsWith("/admin") ||
      pathname.startsWith("/dashboard") ||
      pathname.startsWith("/profile");

    // Only fetch user if configured and on protected routes or when refreshing session
    if (isProtected) {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      // Protect /admin (admin role only: students redirected to /dashboard)
      if (pathname.startsWith("/admin")) {
        if (!user) {
          const url = request.nextUrl.clone();
          url.pathname = "/";
          url.searchParams.set("auth", "login");
          return NextResponse.redirect(url);
        }

        const { data: profile } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", user.id)
          .single();

        if (profile?.role !== "admin") {
          const url = request.nextUrl.clone();
          url.pathname = "/dashboard";
          url.searchParams.delete("auth");
          return NextResponse.redirect(url);
        }
      }

      // Protect /dashboard (students only: admins redirected to /admin, EXCEPT /dashboard/upload which allows both)
      if (pathname.startsWith("/dashboard") && !pathname.startsWith("/dashboard/upload")) {
        if (!user) {
          const url = request.nextUrl.clone();
          url.pathname = "/";
          url.searchParams.set("auth", "login");
          return NextResponse.redirect(url);
        }

        const { data: profile } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", user.id)
          .single();

        if (profile?.role === "admin") {
          const url = request.nextUrl.clone();
          url.pathname = "/admin";
          url.searchParams.delete("auth");
          return NextResponse.redirect(url);
        }
      }

      // Protect /dashboard/upload (any logged in user: student or admin)
      if (pathname.startsWith("/dashboard/upload")) {
        if (!user) {
          const url = request.nextUrl.clone();
          url.pathname = "/";
          url.searchParams.set("auth", "login");
          return NextResponse.redirect(url);
        }
      }

      // Protect /profile (any logged in user)
      if (pathname.startsWith("/profile")) {
        if (!user) {
          const url = request.nextUrl.clone();
          url.pathname = "/";
          url.searchParams.set("auth", "login");
          return NextResponse.redirect(url);
        }
      }
    } else {
      // For general public routes, non-blocking session check
      await supabase.auth.getUser().catch(() => {});
    }
  } catch (err) {
    console.error("Middleware session update error:", err);
  }

  return supabaseResponse;
}
