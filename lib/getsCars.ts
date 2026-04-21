import { getSupabaseAdmin } from "@/lib/supabase";

export async function getCars() {
  try {
    const supabase = getSupabaseAdmin();

    const { data, error } = await supabase
      .from("cars")
      .select("*")
      .order("sort_order", { ascending: true });

    if (error) {
      console.error("getCars error:", error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error("getCars server error:", error);
    return [];
  }
}