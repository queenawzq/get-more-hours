import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { createServiceClient } from "@/lib/supabase/server";
import { PRICING } from "@/lib/constants";
import type Stripe from "stripe";

export async function POST(req: Request) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature");

  if (!sig) {
    return NextResponse.json(
      { error: "Missing stripe-signature header" },
      { status: 400 }
    );
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json(
      { error: "Invalid signature" },
      { status: 400 }
    );
  }

  const serviceClient = await createServiceClient();
  const rawEvent = event as unknown as Record<string, unknown>;

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      const { caseId, stage, includeWhiteGlove, type } = session.metadata || {};

      if (!caseId) {
        console.error("Missing caseId metadata in checkout session");
        break;
      }

      // Standalone white-glove upgrade (no stage fee component).
      if (type === "white_glove_standalone") {
        await serviceClient.from("billing").insert({
          case_id: caseId,
          stage: 1,
          amount: PRICING.whiteGlove,
          type: "white_glove",
          status: "paid",
          stripe_payment_id: session.payment_intent as string,
          stripe_event: rawEvent,
        });
        await serviceClient
          .from("cases")
          .update({ tier: "white_glove" })
          .eq("id", caseId);
        break;
      }

      if (!stage) {
        console.error("Missing stage metadata in stage-fee checkout session");
        break;
      }

      const stageNum = parseInt(stage, 10);

      // Update or insert billing record for the stage fee
      const { data: existingBilling } = await serviceClient
        .from("billing")
        .select("id")
        .eq("case_id", caseId)
        .eq("stage", stageNum)
        .eq("type", "stage_fee")
        .single();

      if (existingBilling) {
        await serviceClient
          .from("billing")
          .update({
            status: "paid",
            stripe_payment_id: session.payment_intent as string,
            stripe_event: rawEvent,
          })
          .eq("id", existingBilling.id);
      } else {
        const STAGE_AMOUNTS: Record<number, number> = {
          1: PRICING.stage1,
          2: PRICING.stage2,
          3: PRICING.stage3,
        };
        await serviceClient.from("billing").insert({
          case_id: caseId,
          stage: stageNum,
          amount: STAGE_AMOUNTS[stageNum] || 0,
          type: "stage_fee",
          status: "paid",
          stripe_payment_id: session.payment_intent as string,
          stripe_event: rawEvent,
        });
      }

      // Handle White Glove add-on bundled with stage fee.
      if (includeWhiteGlove === "true") {
        await serviceClient.from("billing").insert({
          case_id: caseId,
          stage: stageNum,
          amount: PRICING.whiteGlove,
          type: "white_glove",
          status: "paid",
          stripe_payment_id: session.payment_intent as string,
          stripe_event: rawEvent,
        });

        await serviceClient
          .from("cases")
          .update({ tier: "white_glove" })
          .eq("id", caseId);
      }
      break;
    }

    case "charge.refunded":
    case "charge.failed": {
      const charge = event.data.object as Stripe.Charge;
      const pi = charge.payment_intent as string | null;
      if (!pi) {
        console.error(`${event.type}: charge has no payment_intent`);
        break;
      }
      await serviceClient
        .from("billing")
        .update({
          status: event.type === "charge.refunded" ? "refunded" : "failed",
          stripe_event: rawEvent,
        })
        .eq("stripe_payment_id", pi);
      break;
    }

    case "charge.dispute.created": {
      const dispute = event.data.object as Stripe.Dispute;
      const chargeId =
        typeof dispute.charge === "string" ? dispute.charge : dispute.charge.id;
      const charge = await stripe.charges.retrieve(chargeId);
      const pi = charge.payment_intent as string | null;
      if (!pi) {
        console.error("Dispute: charge has no payment_intent");
        break;
      }
      await serviceClient
        .from("billing")
        .update({ status: "disputed", stripe_event: rawEvent })
        .eq("stripe_payment_id", pi);
      break;
    }

    case "checkout.session.expired": {
      const session = event.data.object as Stripe.Checkout.Session;
      const { caseId, stage, type } = session.metadata || {};
      if (!caseId || type === "white_glove_standalone") break;
      await serviceClient
        .from("billing")
        .update({ status: "expired", stripe_event: rawEvent })
        .eq("case_id", caseId)
        .eq("stage", parseInt(stage || "0", 10))
        .eq("type", "stage_fee")
        .eq("status", "pending");
      break;
    }

    default:
      break;
  }

  return NextResponse.json({ received: true });
}
