import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error || !user) {
      return NextResponse.json(
        { authenticated: false, user: null },
        { status: 200 }
      );
    }

    return NextResponse.json(
      { authenticated: true, user: { id: user.id, email: user.email } },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { authenticated: false, user: null },
      { status: 200 }
    );
  }
}
