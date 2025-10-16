import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin, WaitlistUser } from "@/lib/supabase";

export async function GET(request: NextRequest) {
  try {
    // Check if Supabase is properly configured
    if (!supabaseAdmin) {
      console.error("Supabase not configured");
      return NextResponse.json(
        {
          error: "Supabase configuration missing",
          details:
            "Please check your .env.local file and ensure all Supabase variables are set",
          environment: {
            hasUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
            hasAnonKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
            hasServiceKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
          },
        },
        { status: 500 }
      );
    }

    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";

    let query = supabaseAdmin
      .from("waitlist")
      .select("*", { count: "exact" })
      .order("created_at", { ascending: false });

    if (search) {
      query = query.ilike("email", `%${search}%`);
    }

    const { data, error, count } = await query;

    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json(
        {
          error: "Failed to fetch waitlist users",
          details: error.message,
          code: error.code,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      users: data as WaitlistUser[],
      total: count || 0,
    });
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
