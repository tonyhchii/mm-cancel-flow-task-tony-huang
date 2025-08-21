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

    // Submit the cancellation
    const { data: updated, error: upErr } = await supabaseAdmin
      .from("cancellations")
      .update({ status: "submitted" })
      .eq("id", cancellationId)
      .eq("status", "in_progress")
      .select("id, subscription_id, accepted_downsell, status")
      .single();

    if (upErr || !updated) {
      // If already submitted, make it idempotent
      const { data: existing } = await supabaseAdmin
        .from("cancellations")
        .select("id, subscription_id, accepted_downsell, status")
        .eq("id", cancellationId)
        .single();
      if (existing?.status === "submitted") {
        return NextResponse.json(
          { ok: true, cancellation: existing },
          { status: 200 }
        );
      }
      return NextResponse.json(
        { error: upErr?.message || "Not found or not in_progress" },
        { status: 409 }
      );
    }

    // If they did NOT accept the downsell, cancel subscription
    if (!updated.accepted_downsell) {
      const { error: subErr } = await supabaseAdmin
        .from("subscriptions")
        .update({ status: "cancelled" })
        .eq("id", updated.subscription_id)
        .neq("status", "cancelled");

      if (subErr) {
        console.error("[complete] subscription cancel error", subErr);
        // decide if you want to 500; many apps just log
      }
    } else {
      // Belt & suspenders: keep active if accepted
      await supabaseAdmin
        .from("subscriptions")
        .update({ status: "active" })
        .eq("id", updated.subscription_id)
        .neq("status", "active");
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
