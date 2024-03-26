import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { SignJWT } from "jose";
import bcrypt from "bcryptjs";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function POST(req: NextRequest) {
  const { username, password } = await req.json();

  try {
    const { data, error } = await supabase.from("m_user").select("*").eq("id", username).single();

    if (error) throw new Error("User not found");

    const isValidPassword = bcrypt.compareSync(password, data.password);
    if (isValidPassword) {
      const jwtToken = await new SignJWT({ userId: data.id })
        .setProtectedHeader({ alg: "HS256", typ: "JWT" })
        .setIssuedAt()
        .setExpirationTime("1w")
        .sign(new TextEncoder().encode(process.env.SECRET_KEY));

      const cookieOptions = {
        path: "/",
        httpOnly: true,
        sameSite: "none",
        maxAge: 604800,
        secure: true,
      };

      const cookie = `pocha-token=${jwtToken}; Path=${cookieOptions.path}; HttpOnly; SameSite=${cookieOptions.sameSite}; Max-Age=${cookieOptions.maxAge}; Secure`;

      return new NextResponse(JSON.stringify({ success: true }), {
        status: 200,
        headers: {
          "Set-Cookie": cookie,
          "Content-Type": "application/json",
        },
      });
    } else {
      return new NextResponse(JSON.stringify({ error: "Authentication failed" }), { status: 401 });
    }
  } catch (error) {
    return new NextResponse((error as Error).message || "Internal server error", { status: 500 });
  }
}
