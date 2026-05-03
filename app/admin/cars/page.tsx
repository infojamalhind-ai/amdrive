import { revalidatePath } from "next/cache";
import { getSupabaseAdmin } from "@/lib/supabase";
import {
  getCarBadgeLabel,
  getRecommendedMonthlyPlan,
  normalizeMonthlyPlans,
  parseCarDisplayConfig,
  serializeCarDisplayConfig,
  type CarBadgeMode,
  type MonthlyPlanConfig,
} from "@/lib/car-display";

export const dynamic = "force-dynamic";

const DEFAULT_MONTHLY_PLAN_KMS = [
  "1500 KM",
  "3000 KM",
  "5000 KM",
  "7500 KM",
];

type CarRecord = {
  id: number;
  slug: string;
  name: string;
  category: string;
  daily_price?: number | null;
  weekly_price?: number | null;
  monthly_price?: number | null;
  monthly_plans?: unknown;
  minimum_days?: number | null;
  no_deposit_fee?: number | null;
  stock?: number | null;
  badge_text?: string | null;
  is_available?: boolean | null;
  allow_no_deposit?: boolean | null;
  show_refundable_deposit?: boolean | null;
  sort_order?: number | null;
};

function buildMonthlyPlansFromCar(car: CarRecord) {
  const existingPlans = normalizeMonthlyPlans(car.monthly_plans);

  return DEFAULT_MONTHLY_PLAN_KMS.map((defaultKm, index) => {
    const existingPlan = existingPlans[index];

    return {
      km: existingPlan?.km || defaultKm,
      price:
        existingPlan?.price ??
        (index === 0 ? Number(car.monthly_price || 0) : 0),
      recommended: Boolean(existingPlan?.recommended),
      promoText: existingPlan?.promoText || "",
    };
  });
}

function revalidateCarPages(slug: string) {
  revalidatePath("/");
  revalidatePath("/vehicle");
  revalidatePath("/admin/cars");
  revalidatePath(`/booking/${slug}`);
  revalidatePath(`/booking/monthly/${slug}`);
}

async function updateCar(formData: FormData) {
  "use server";

  const supabase = getSupabaseAdmin();

  const slug = String(formData.get("slug") || "");
  const actionType = String(formData.get("action_type") || "save");

  if (!slug) return;

  if (actionType === "move_up") {
    await moveCarBySlug(slug, "up");
    return;
  }

  if (actionType === "move_down") {
    await moveCarBySlug(slug, "down");
    return;
  }

  const daily_price = Number(formData.get("daily_price") || 0);
  const weekly_price = Number(formData.get("weekly_price") || 0);
  const monthly_price = Number(formData.get("monthly_price") || 0);
  const minimum_days = Number(formData.get("minimum_days") || 1);
  const no_deposit_fee = Number(formData.get("no_deposit_fee") || 0);
  const stock = Number(formData.get("stock") || 0);
  const sort_order = Number(formData.get("sort_order") || 0);

  const is_available = formData.get("is_available") === "on";
  const allow_no_deposit = formData.get("allow_no_deposit") === "on";
  const show_refundable_deposit = formData.get("show_refundable_deposit") === "on";
  const show_on_website = formData.get("show_on_website") === "on";
  const show_on_homepage = formData.get("show_on_homepage") === "on";

  const badge_mode = String(formData.get("badge_mode") || "none") as CarBadgeMode;
  const custom_badge_text = String(formData.get("custom_badge_text") || "");
  const promo_text = String(formData.get("promo_text") || "");

  const recommendedMonthlyPlanIndex = Number(
    formData.get("recommended_monthly_plan") || 0
  );

  const monthly_plans = DEFAULT_MONTHLY_PLAN_KMS.map<MonthlyPlanConfig | null>((_, index) => {
    const km = String(formData.get(`monthly_plan_km_${index}`) || "").trim();
    const price = Number(formData.get(`monthly_plan_price_${index}`) || 0);
    const planPromoText = String(
      formData.get(`monthly_plan_promo_${index}`) || ""
    ).trim();

    if (!km) return null;

    return {
      km,
      price: Number.isFinite(price) ? price : 0,
      recommended: recommendedMonthlyPlanIndex === index,
      promoText: planPromoText,
    };
  }).filter((plan): plan is MonthlyPlanConfig => plan !== null);

  const badge_text = serializeCarDisplayConfig({
    badgeMode: badge_mode,
    badgeText: custom_badge_text,
    promoText: promo_text,
    showOnWebsite: show_on_website,
    showOnHomepage: show_on_homepage,
  });

  const { error } = await supabase
    .from("cars")
    .update({
      daily_price,
      weekly_price,
      monthly_price,
      monthly_plans,
      minimum_days,
      no_deposit_fee,
      stock,
      badge_text,
      sort_order,
      is_available,
      allow_no_deposit,
      show_refundable_deposit,
      updated_at: new Date().toISOString(),
    })
    .eq("slug", slug);

  if (error) {
    console.error("Update car error:", error);
    throw new Error("Failed to update car");
  }

  revalidateCarPages(slug);
}

async function moveCarBySlug(slug: string, direction: "up" | "down") {
  const supabase = getSupabaseAdmin();

  const { data: cars, error } = await supabase
    .from("cars")
    .select("slug, sort_order")
    .order("sort_order", { ascending: true });

  if (error || !cars) {
    console.error("Move car load error:", error);
    return;
  }

  const currentIndex = cars.findIndex((car) => car.slug === slug);

  if (currentIndex === -1) return;

  const targetIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;

  if (targetIndex < 0 || targetIndex >= cars.length) return;

  const currentCar = cars[currentIndex];
  const targetCar = cars[targetIndex];

  const currentOrder = Number(currentCar.sort_order || currentIndex + 1);
  const targetOrder = Number(targetCar.sort_order || targetIndex + 1);

  const { error: currentUpdateError } = await supabase
    .from("cars")
    .update({ sort_order: targetOrder, updated_at: new Date().toISOString() })
    .eq("slug", currentCar.slug);

  if (currentUpdateError) {
    console.error("Move car current update error:", currentUpdateError);
    return;
  }

  const { error: targetUpdateError } = await supabase
    .from("cars")
    .update({ sort_order: currentOrder, updated_at: new Date().toISOString() })
    .eq("slug", targetCar.slug);

  if (targetUpdateError) {
    console.error("Move car target update error:", targetUpdateError);
    return;
  }

  revalidateCarPages(slug);
  revalidateCarPages(targetCar.slug);
}

function fieldLabel(title: string, help?: string) {
  return (
    <div className="mb-1">
      <label className="block text-sm font-medium text-slate-700">{title}</label>
      {help ? <p className="mt-0.5 text-xs text-slate-500">{help}</p> : null}
    </div>
  );
}

export default async function AdminCarsPage() {
  const supabase = getSupabaseAdmin();

  const { data: cars, error } = await supabase
    .from("cars")
    .select("*")
    .order("sort_order", { ascending: true });

  if (error) {
    return <div className="p-8">Error loading cars</div>;
  }

  const rows = (cars || []) as CarRecord[];

  return (
    <main className="min-h-screen bg-slate-100 px-4 py-8 md:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 rounded-3xl bg-slate-900 p-8 text-white">
          <h1 className="text-3xl font-bold">AMJDrive Admin Cars</h1>
          <p className="mt-2 text-sm text-slate-300">
            Manage pricing, ranking, visibility, and promotions for each car.
          </p>
        </div>

        <div className="space-y-6">
          {rows.map((car, index) => {
            const displayConfig = parseCarDisplayConfig(car.badge_text);
            const monthlyPlans = buildMonthlyPlansFromCar(car);
            const recommendedMonthlyPlan = getRecommendedMonthlyPlan(monthlyPlans);
            const recommendedMonthlyPlanIndex = Math.max(
              monthlyPlans.findIndex((plan) => plan.recommended),
              0
            );
            const badgePreview = getCarBadgeLabel(displayConfig, {
              allowNoDeposit: Boolean(car.allow_no_deposit),
            });

            return (
              <div
                key={car.slug}
                className="rounded-3xl bg-white p-6 shadow-sm"
              >
                <form action={updateCar}>
                  <input type="hidden" name="slug" value={car.slug} />

                <div className="mb-6 flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
                  <div>
                    <p className="text-sm font-semibold text-purple-700">
                      {car.category}
                    </p>
                    <h2 className="text-2xl font-bold text-slate-900">
                      {car.name}
                    </h2>
                    <p className="text-sm text-slate-500">{car.slug}</p>
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
                      <input
                        type="checkbox"
                        name="is_available"
                        defaultChecked={Boolean(car.is_available)}
                        className="h-4 w-4"
                      />
                      Available
                    </label>

                    <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
                      <input
                        type="checkbox"
                        name="show_on_website"
                        defaultChecked={displayConfig.showOnWebsite}
                        className="h-4 w-4"
                      />
                      Show on Website
                    </label>

                    <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
                      <input
                        type="checkbox"
                        name="show_on_homepage"
                        defaultChecked={displayConfig.showOnHomepage}
                        className="h-4 w-4"
                      />
                      Show on Homepage
                    </label>
                  </div>
                </div>

                <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
                  <div className="space-y-6">
                    <section className="rounded-2xl border border-slate-200 p-4">
                      <h3 className="text-lg font-bold text-slate-900">Pricing</h3>

                      <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                        <div>
                          {fieldLabel("Daily Price")}
                          <input
                            type="number"
                            step="0.01"
                            name="daily_price"
                            defaultValue={Number(car.daily_price || 0)}
                            className="w-full rounded-xl border border-slate-300 px-4 py-2.5"
                          />
                        </div>

                        <div>
                          {fieldLabel("Weekly Price")}
                          <input
                            type="number"
                            step="0.01"
                            name="weekly_price"
                            defaultValue={Number(car.weekly_price || 0)}
                            className="w-full rounded-xl border border-slate-300 px-4 py-2.5"
                          />
                        </div>

                        <div>
                          {fieldLabel("Base Monthly Price")}
                          <input
                            type="number"
                            step="0.01"
                            name="monthly_price"
                            defaultValue={Number(car.monthly_price || 0)}
                            className="w-full rounded-xl border border-slate-300 px-4 py-2.5"
                          />
                        </div>

                        <div>
                          {fieldLabel("Minimum Days")}
                          <input
                            type="number"
                            name="minimum_days"
                            defaultValue={Number(car.minimum_days || 1)}
                            className="w-full rounded-xl border border-slate-300 px-4 py-2.5"
                          />
                        </div>

                        <div>
                          {fieldLabel("Deposit Waiver Price")}
                          <input
                            type="number"
                            step="0.01"
                            name="no_deposit_fee"
                            defaultValue={Number(car.no_deposit_fee || 0)}
                            className="w-full rounded-xl border border-slate-300 px-4 py-2.5"
                          />
                        </div>

                        <div>
                          {fieldLabel("Stock")}
                          <input
                            type="number"
                            name="stock"
                            defaultValue={Number(car.stock || 0)}
                            className="w-full rounded-xl border border-slate-300 px-4 py-2.5"
                          />
                        </div>
                      </div>
                    </section>

                    <section className="rounded-2xl border border-slate-200 p-4">
                      <h3 className="text-lg font-bold text-slate-900">
                        Visibility & Ranking
                      </h3>

                      <div className="mt-4 grid gap-4 md:grid-cols-2">
                        <div>
                          {fieldLabel(
                            "Display Order",
                            "Lower number appears higher on the website."
                          )}
                          <input
                            type="number"
                            name="sort_order"
                            defaultValue={Number(car.sort_order || index + 1)}
                            className="w-full rounded-xl border border-slate-300 px-4 py-2.5"
                          />
                        </div>

                        <div className="rounded-2xl bg-slate-50 p-4">
                          <p className="text-sm font-medium text-slate-700">
                            Quick Ranking
                          </p>
                          <div className="mt-3 flex gap-2">
                            <button
                              type="submit"
                              name="action_type"
                              value="move_up"
                              className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 disabled:opacity-50"
                              disabled={index === 0}
                              formNoValidate
                            >
                              Move Up
                            </button>
                            <button
                              type="submit"
                              name="action_type"
                              value="move_down"
                              className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 disabled:opacity-50"
                              disabled={index === rows.length - 1}
                              formNoValidate
                            >
                              Move Down
                            </button>
                          </div>
                        </div>
                      </div>
                    </section>

                    <section className="rounded-2xl border border-slate-200 p-4">
                      <h3 className="text-lg font-bold text-slate-900">Promotion</h3>

                      <div className="mt-4 grid gap-4 md:grid-cols-2">
                        <div>
                          {fieldLabel("Badge Type")}
                          <select
                            name="badge_mode"
                            defaultValue={displayConfig.badgeMode}
                            className="w-full rounded-xl border border-slate-300 px-4 py-2.5"
                          >
                            <option value="none">No Badge</option>
                            <option value="recommended">Recommended</option>
                            <option value="no_deposit">No Deposit</option>
                            <option value="custom">Custom Badge</option>
                          </select>
                        </div>

                        <div>
                          {fieldLabel(
                            "Custom Badge Text",
                            "Example: Best Value, Hot Deal, Most Popular"
                          )}
                          <input
                            type="text"
                            name="custom_badge_text"
                            defaultValue={displayConfig.badgeText}
                            className="w-full rounded-xl border border-slate-300 px-4 py-2.5"
                          />
                        </div>

                        <div className="md:col-span-2">
                          {fieldLabel(
                            "Promo Text",
                            "Short sales line shown on the website card."
                          )}
                          <input
                            type="text"
                            name="promo_text"
                            defaultValue={displayConfig.promoText}
                            className="w-full rounded-xl border border-slate-300 px-4 py-2.5"
                          />
                        </div>

                        <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
                          <input
                            type="checkbox"
                            name="allow_no_deposit"
                            defaultChecked={Boolean(car.allow_no_deposit)}
                            className="h-4 w-4"
                          />
                          Enable No Deposit Option
                        </label>

                        <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
                          <input
                            type="checkbox"
                            name="show_refundable_deposit"
                            defaultChecked={Boolean(car.show_refundable_deposit)}
                            className="h-4 w-4"
                          />
                          Enable Refundable Deposit Option
                        </label>
                      </div>
                    </section>

                    <section className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                      <div className="mb-3">
                        <h3 className="text-lg font-bold text-slate-900">
                          Monthly Plans
                        </h3>
                        <p className="text-sm text-slate-500">
                          Set prices, choose one recommended plan, and add plan
                          promo text.
                        </p>
                      </div>

                      <div className="grid gap-4 xl:grid-cols-2">
                        {monthlyPlans.map((plan, planIndex) => (
                          <div
                            key={`${car.slug}-monthly-plan-${planIndex}`}
                            className="rounded-2xl border border-slate-200 bg-white p-4"
                          >
                            <input
                              type="hidden"
                              name={`monthly_plan_km_${planIndex}`}
                              value={plan.km}
                            />

                            <div className="flex items-start justify-between gap-4">
                              <div>
                                <p className="text-sm font-semibold text-slate-900">
                                  {plan.km}
                                </p>
                                <p className="text-xs text-slate-500">
                                  Monthly kilometer plan
                                </p>
                              </div>

                              <label className="flex items-center gap-2 text-sm font-medium text-purple-700">
                                <input
                                  type="radio"
                                  name="recommended_monthly_plan"
                                  value={planIndex}
                                  defaultChecked={recommendedMonthlyPlanIndex === planIndex}
                                  className="h-4 w-4"
                                />
                                Recommended
                              </label>
                            </div>

                            <div className="mt-4 grid gap-4">
                              <div>
                                {fieldLabel("Plan Price")}
                                <input
                                  type="number"
                                  step="0.01"
                                  name={`monthly_plan_price_${planIndex}`}
                                  defaultValue={plan.price}
                                  className="w-full rounded-xl border border-slate-300 px-4 py-2.5"
                                />
                              </div>

                              <div>
                                {fieldLabel(
                                  "Monthly Promo Text",
                                  "Example: Most popular monthly option"
                                )}
                                <input
                                  type="text"
                                  name={`monthly_plan_promo_${planIndex}`}
                                  defaultValue={plan.promoText || ""}
                                  className="w-full rounded-xl border border-slate-300 px-4 py-2.5"
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </section>
                  </div>

                  <aside className="self-start rounded-2xl border border-slate-200 bg-slate-50 p-4 xl:sticky xl:top-4">
                    <h3 className="text-lg font-bold text-slate-900">
                      Website Preview
                    </h3>

                    <div className="mt-4 overflow-hidden rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-sm text-purple-700">{car.category}</p>
                          <h4 className="text-xl font-bold text-slate-900">
                            {car.name}
                          </h4>
                        </div>

                        {badgePreview ? (
                          <span className="rounded-full bg-purple-100 px-3 py-1 text-xs font-semibold text-purple-800">
                            {badgePreview}
                          </span>
                        ) : null}
                      </div>

                      {displayConfig.promoText ? (
                        <p className="mt-3 text-sm text-slate-600">
                          {displayConfig.promoText}
                        </p>
                      ) : (
                        <p className="mt-3 text-sm text-slate-400">
                          Add promo text to highlight this car.
                        </p>
                      )}

                      <div className="mt-4 grid grid-cols-3 gap-2 text-center text-sm">
                        <div className="rounded-2xl bg-slate-50 px-3 py-3">
                          Daily
                          <div className="mt-1 font-bold text-slate-900">
                            AED {Number(car.daily_price || 0)}
                          </div>
                        </div>
                        <div className="rounded-2xl bg-slate-50 px-3 py-3">
                          Weekly
                          <div className="mt-1 font-bold text-slate-900">
                            AED {Number(car.weekly_price || 0)}
                          </div>
                        </div>
                        <div className="rounded-2xl bg-slate-50 px-3 py-3">
                          Monthly
                          <div className="mt-1 font-bold text-slate-900">
                            AED {Number(car.monthly_price || 0)}
                          </div>
                        </div>
                      </div>

                      {Boolean(car.allow_no_deposit) && Number(car.no_deposit_fee || 0) > 0 ? (
                        <p className="mt-4 text-sm font-semibold text-purple-700">
                          Deposit waiver: AED {Number(car.no_deposit_fee || 0)}
                        </p>
                      ) : null}

                      {recommendedMonthlyPlan ? (
                        <div className="mt-4 rounded-2xl bg-purple-50 p-4">
                          <p className="text-xs font-semibold uppercase tracking-wide text-purple-700">
                            Recommended Monthly Plan
                          </p>
                          <p className="mt-2 text-lg font-bold text-slate-900">
                            {recommendedMonthlyPlan.km} - AED {recommendedMonthlyPlan.price}
                          </p>
                          {recommendedMonthlyPlan.promoText ? (
                            <p className="mt-1 text-sm text-slate-600">
                              {recommendedMonthlyPlan.promoText}
                            </p>
                          ) : null}
                        </div>
                      ) : null}
                    </div>
                  </aside>
                </div>

                  <div className="mt-6">
                    <button
                      type="submit"
                      className="rounded-2xl bg-purple-700 px-5 py-3 text-sm font-bold text-white hover:bg-purple-800"
                    >
                      Save Changes
                    </button>
                  </div>
                </form>
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}
