import { getSupabaseAdmin } from "@/lib/supabase";
import type { Car } from "@/app/components/Vehicle";
import {
  getCarBadgeLabel,
  getRecommendedMonthlyPlan,
  normalizeMonthlyPlans,
  parseCarDisplayConfig,
} from "@/lib/car-display";

export async function getCars(options?: {
  homepageOnly?: boolean;
}): Promise<Car[]> {
  try {
    const supabase = getSupabaseAdmin();

    const { data, error } = await supabase
      .from("cars")
      .select(
        "id, slug, name, image, category, seats, bags, doors, minimum_days, daily_price, weekly_price, monthly_price, monthly_plans, badge_text, no_deposit_fee, stock, is_available, allow_no_deposit"
      )
      .order("sort_order", { ascending: true });

    if (error) {
      console.error("Cars fetch error:", error);
      return [];
    }

    const cars = (data ?? []).map((car) => {
      const displayConfig = parseCarDisplayConfig(car.badge_text);
      const monthlyPlans = normalizeMonthlyPlans(car.monthly_plans);
      const recommendedMonthlyPlan = getRecommendedMonthlyPlan(monthlyPlans);

      return {
        ...car,
        badgeLabel: getCarBadgeLabel(displayConfig, {
          allowNoDeposit: Boolean(car.allow_no_deposit),
        }),
        promoText: displayConfig.promoText,
        showOnWebsite: displayConfig.showOnWebsite,
        showOnHomepage: displayConfig.showOnHomepage,
        recommendedMonthlyPlan,
      };
    }) as Car[];

    const visibleCars = cars.filter((car) => car.showOnWebsite !== false);

    if (options?.homepageOnly) {
      const homepageCars = visibleCars.filter((car) => car.showOnHomepage !== false);
      return homepageCars.length > 0 ? homepageCars : visibleCars;
    }

    return visibleCars;
  } catch (error) {
    console.error("Cars load error:", error);
    return [];
  }
}
