import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    hasUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
    hasAnonKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    hasServiceKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
    urlValue: process.env.NEXT_PUBLIC_SUPABASE_URL ? "Set" : "Not Set",
    anonKeyValue: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "Set" : "Not Set",
    serviceKeyValue: process.env.SUPABASE_SERVICE_ROLE_KEY ? "Set" : "Not Set",
  });
}
