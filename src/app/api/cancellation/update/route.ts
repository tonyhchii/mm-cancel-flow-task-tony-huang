import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

export const runtime = "nodejs";

type Body = {
  cancellationId?: string;
  answers?: Record<string, unknown>;
};

/**
 * NOTE: This does a read-then-write shallow merge in app code.
 * If you need an atomic JSONB merge, we can add a tiny SQL RPC later.
 */
export async function POST(req: NextRequest) {
  try {
    const { cancellationId, answers } = (await req.json()) as Body;

    if (!cancellationId || !answers || typeof answers !== "object") {
      return NextResponse.json(
        { error: "Missing cancellationId or answers" },
        { status: 400 }
      );
    }

    // Fetch current answers + status
    const { data: row, error: selErr } = await supabaseAdmin
      .from("cancellations")
      .select("id, answers, status")
      .eq("id", cancellationId)
      .single();

    if (selErr || !row) {
      return NextResponse.json(
        { error: "Cancellation not found", code: selErr?.code },
        { status: 404 }
      );
    }
    if (row.status !== "in_progress") {
      return NextResponse.json(
        { error: "Cannot update answers when status is not 'in_progress'" },
        { status: 409 }
      );
    }

    // Shallow merge (answers keys overwrite existing on same level)
    const merged = { ...(row.answers ?? {}), ...answers };

    const { data: updated, error: upErr } = await supabaseAdmin
      .from("cancellations")
      .update({ answers: merged })
      .eq("id", cancellationId)
      .select(
        "id, user_id, subscription_id, downsell_variant, accepted_downsell, answers, status, session_id, created_at, updated_at"
      )
      .single();

    if (upErr) {
      return NextResponse.json(
        { error: upErr.message, code: (upErr as any).code },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { ok: true, cancellation: updated },
      { status: 200 }
    );
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.message ?? "Unhandled error" },
      { status: 500 }
    );
  }
}
