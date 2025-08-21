import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin"; // MUST be service-role client
import crypto from "crypto";

// A if even last hex digit, else B
function pickVariantFromUuid(id: string): "A" | "B" {
  const last = id.replace(/-/g, "").slice(-1).toLowerCase();
  return "02468ace".includes(last) ? "A" : "B";
}

export async function POST(req: NextRequest) {
  try {
    const { userId, subscriptionId } = (await req.json()) as {
      userId?: string;
      subscriptionId?: string;
    };

    if (!userId || !subscriptionId) {
      return NextResponse.json(
        { error: "Missing userId or subscriptionId" },
        { status: 400 }
      );
    }

    // 1) Validate subscription exists and belongs to the user
    const { data: sub, error: subErr } = await supabaseAdmin
      .from("subscriptions")
      .select("id,user_id,status")
      .eq("id", subscriptionId)
      .single();

    if (subErr || !sub) {
      return NextResponse.json(
        {
          error: "Subscription not found",
          code: subErr?.code,
          details: subErr?.message,
        },
        { status: 404 }
      );
    }
    if (sub.user_id !== userId) {
      return NextResponse.json(
        { error: "Subscription does not belong to user" },
        { status: 403 }
      );
    }

    // 2) Return existing in-progress cancellation if present
    const { data: existing, error: selErr } = await supabaseAdmin
      .from("cancellations")
      .select(
        "id,user_id,subscription_id,downsell_variant,accepted_downsell,answers,status,session_id,created_at,updated_at"
      )
      .eq("user_id", userId)
      .eq("subscription_id", subscriptionId)
      .eq("status", "in_progress")
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (selErr) {
      console.error("[cancel/create] select error", selErr);
      return NextResponse.json(
        { error: selErr.message, code: selErr.code },
        { status: 500 }
      );
    }

    if (existing) {
      // Make sure subscription is pending_cancellation
      await supabaseAdmin
        .from("subscriptions")
        .update({ status: "pending_cancellation" })
        .eq("id", subscriptionId)
        .neq("status", "pending_cancellation");
      return NextResponse.json(
        { existed: true, cancellation: existing },
        { status: 200 }
      );
    }

    // 3) Insert new cancellation
    const id = crypto.randomUUID();
    const variant = pickVariantFromUuid(id);

    const { data: created, error: insErr } = await supabaseAdmin
      .from("cancellations")
      .insert({
        id,
        user_id: userId,
        subscription_id: subscriptionId,
        downsell_variant: variant,
      })
      .select(
        "id,user_id,subscription_id,downsell_variant,accepted_downsell,answers,status,session_id,created_at,updated_at"
      )
      .single();

    // Handle common DB errors explicitly
    if (insErr) {
      const code = (insErr as any).code;
      // 23505 unique_violation (your partial unique index)
      if (code === "23505") {
        const { data: after } = await supabaseAdmin
          .from("cancellations")
          .select(
            "id,user_id,subscription_id,downsell_variant,accepted_downsell,answers,status,session_id,created_at,updated_at"
          )
          .eq("user_id", userId)
          .eq("subscription_id", subscriptionId)
          .eq("status", "in_progress")
          .limit(1)
          .maybeSingle();

        await supabaseAdmin
          .from("subscriptions")
          .update({ status: "pending_cancellation" })
          .eq("id", subscriptionId)
          .neq("status", "pending_cancellation");

        return NextResponse.json(
          { existed: true, cancellation: after },
          { status: 200 }
        );
      }
      // 23503 foreign_key_violation (bad user_id or subscription_id)
      if (code === "23503") {
        return NextResponse.json(
          {
            error: "Foreign key violation — check userId/subscriptionId",
            details: insErr.message,
          },
          { status: 422 }
        );
      }

      console.error("[cancel/create] insert error", insErr);
      return NextResponse.json(
        { error: insErr.message, code },
        { status: 500 }
      );
    }

    // 4) Mark subscription pending (idempotent)
    const { error: upErr } = await supabaseAdmin
      .from("subscriptions")
      .update({ status: "pending_cancellation" })
      .eq("id", subscriptionId)
      .neq("status", "pending_cancellation");

    if (upErr) {
      console.error("[cancel/create] subscription update error", upErr);
      // Not fatal to return; still provide created row
    }

    return NextResponse.json(
      { existed: false, cancellation: created },
      { status: 201 }
    );
  } catch (e: any) {
    console.error("[cancel/create] unhandled", e);
    return NextResponse.json(
      { error: e?.message ?? "Unhandled error" },
      { status: 500 }
    );
  }
}
