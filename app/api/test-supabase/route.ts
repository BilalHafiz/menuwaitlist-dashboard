import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET() {
  try {
    // Check if Supabase is properly configured
    if (!supabaseAdmin) {
      return NextResponse.json(
        {
          success: false,
          error: "Supabase not configured",
          details: "Missing environment variables",
          environment: {
            hasUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
            hasAnonKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
            hasServiceKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
          },
        },
        { status: 500 }
      );
    }

    // Test the connection by fetching a simple count
    const { data, error, count } = await supabaseAdmin
      .from("waitlist")
      .select("*", { count: "exact" })
      .limit(5);

    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json(
        {
          success: false,
          error: error.message,
          details: error,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Supabase connection successful!",
      totalRecords: count,
      sampleData: data,
      environment: {
        hasUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
        hasAnonKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      },
    });
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to connect to Supabase",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
