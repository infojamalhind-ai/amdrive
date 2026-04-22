import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";

export async function GET() {
  try {
    const supabase = getSupabaseAdmin();

    const { data, error } = await supabase
      .from("cars")
      .select(
        "id, slug, name, image, category, seats, bags, doors, minimum_days, daily_price, weekly_price, monthly_price, monthly_plans, badge_text, allow_no_deposit, show_refundable_deposit, no_deposit_fee, stock, is_available, sort_order"
      )
      .order("sort_order", { ascending: true });

    if (error) {
      console.error("Cars fetch error:", error);
      return NextResponse.json(
        { error: "Failed to fetch cars" },
        { status: 500 }
      );
    }

    return NextResponse.json({ cars: data || [] }, { status: 200 });
  } catch (error) {
    console.error("Cars API error:", error);
    return NextResponse.json(
      { error: "Something went wrong while fetching cars" },
      { status: 500 }
    );
  }
}
