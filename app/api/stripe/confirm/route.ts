import { NextRequest, NextResponse } from "next/server";
import { confirmStripePayment } from "@/lib/stripe-payment";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const sessionId = body.sessionId as string;
    const result = await confirmStripePayment(sessionId);

    if (!result.ok) {
      return NextResponse.json(
        { error: result.error },
        { status: result.status }
      );
    }

    return NextResponse.json(result.data);
  } catch (error) {
    console.error("Stripe confirm error:", error);
    return NextResponse.json(
      { error: "Failed to confirm Stripe payment" },
      { status: 500 }
    );
  }
}
