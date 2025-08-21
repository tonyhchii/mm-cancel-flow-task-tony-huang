import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";
export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const { cancellationId } = await req.json();
    if (!cancellationId)
      return NextResponse.json(
        { error: "Missing cancellationId" },
        { status: 400 }
      );

    // Set accepted_downsell = true (only while in_progress)
    const { data: updated, error: upErr } = await supabaseAdmin
      .from("cancellations")
      .update({ accepted_downsell: true })
      .eq("id", cancellationId)
      .eq("status", "in_progress")
      .select("id, subscription_id, accepted_downsell, status")
      .single();

    if (upErr || !updated) {
      return NextResponse.json(
        { error: upErr?.message || "Not found or not in_progress" },
        { status: 409 }
      );
    }

    // Flip subscription to ACTIVE (idempotent)
    const { error: subErr } = await supabaseAdmin
      .from("subscriptions")
      .update({ status: "active" })
      .eq("id", updated.subscription_id)
      .neq("status", "active");

    if (subErr) {
      // non-fatal: you can decide to 500 here if you prefer strict behavior
      console.error("[accept-downsell] subscription update error", subErr);
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
