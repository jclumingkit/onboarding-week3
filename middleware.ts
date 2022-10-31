import { NextResponse, NextRequest } from "next/server";
import supabase from "./utils/supabase";

export async function middleware(req: NextRequest) {
  const api_path = req.nextUrl.href;
  const called_by = req.cookies.get("current_user");
  const { error } = await supabase.from("api_call_table").insert({
    api_path: api_path,
    called_by: called_by,
  });
  console.log(error);
  return NextResponse.next();
}

export const config = {
  matcher: "/api/:path*",
};
