import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Fetch conversations for current user
    const { data, error } = await supabase
      .from("conversations")
      .select("*")
      .or(
        `participant_1_id.eq.${user.id},participant_2_id.eq.${user.id}`
      )
      .order("last_message_at", { ascending: false });

    if (error) {
      throw error;
    }

    return NextResponse.json(
      { conversations: data },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { participantId, message, opportunityContext } = body;

    if (!participantId || !message) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Start or update conversation
    const { data, error } = await supabase
      .from("conversations")
      .insert([
        {
          participant_1_id: user.id,
          participant_2_id: participantId,
          last_message: message,
          last_message_at: new Date().toISOString(),
          opportunity_context: opportunityContext,
        },
      ])
      .select();

    if (error) {
      throw error;
    }

    return NextResponse.json(
      { conversation: data?.[0] },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
