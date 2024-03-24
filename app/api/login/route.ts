// edge-functions/login.ts
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import bcrypt from "bcryptjs";

// Supabaseクライアントの初期化
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function POST(req: NextRequest) {
  // リクエストボディの解析
  const { username, password } = await req.json();

  // Supabaseを使用したユーザ認証
  try {
    const { data, error } = await supabase.from("m_user").select("*").eq("id", username).single();

    if (error) throw new Error("User not found");

    // パスワード検証（実際にはハッシュ化されたパスワードの検証が必要）
    const isValidPassword = bcrypt.compareSync(password, data.password);
    if (isValidPassword) {
      // 認証成功
      return new NextResponse(JSON.stringify({ message: "Login successful" }), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          // 必要に応じてセキュリティヘッダーを設定
        },
      });
    } else {
      // 認証失敗
      return new NextResponse("Authentication failed", { status: 401 });
    }
  } catch (error) {
    return new NextResponse((error as Error).message || "Internal server error", { status: 500 });
  }
}
