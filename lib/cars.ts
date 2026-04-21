import { getSupabaseAdmin } from "@/lib/supabase";
import type { Car } from "@/app/components/Vehicle";

export async function getCars(): Promise<Car[]> {
  try {
    const supabase = getSupabaseAdmin();

    const { data, error } = await supabase
      .from("cars")
      .select(
        "id, slug, name, image, category, seats, bags, doors, minimum_days, daily_price, weekly_price, monthly_price, no_deposit_fee, stock, is_available"
      )
      .order("sort_order", { ascending: true });

    if (error) {
      console.error("Cars fetch error:", error);
      return [];
    }

    return (data ?? []) as Car[];
  } catch (error) {
    console.error("Cars load error:", error);
    return [];
  }
}
