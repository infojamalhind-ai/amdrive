import { revalidatePath } from "next/cache";
import { getSupabaseAdmin } from "@/lib/supabase";

type MonthlyPlan = {
  km: string;
  price: number;
};

const DEFAULT_MONTHLY_PLAN_KMS = [
  "1500 KM",
  "3000 KM",
  "5000 KM",
  "7500 KM",
];

function normalizeMonthlyPlans(value: unknown): MonthlyPlan[] {
  const parsedValue =
    typeof value === "string"
      ? (() => {
          try {
            return JSON.parse(value);
          } catch {
            return [];
          }
        })()
      : value;

  if (!Array.isArray(parsedValue)) return [];

  return parsedValue
    .map((plan) => {
      if (!plan || typeof plan !== "object") return null;

      const km = String((plan as { km?: unknown }).km ?? "").trim();
      const price = Number((plan as { price?: unknown }).price ?? 0);

      if (!km) return null;

      return {
        km,
        price: Number.isFinite(price) ? price : 0,
      };
    })
    .filter((plan): plan is MonthlyPlan => Boolean(plan));
}

function buildMonthlyPlansFromCar(car: {
  monthly_plans?: unknown;
  monthly_price?: number | null;
}) {
  const existingPlans = normalizeMonthlyPlans(car.monthly_plans);

  return DEFAULT_MONTHLY_PLAN_KMS.map((defaultKm, index) => {
    const existingPlan = existingPlans[index];

    return {
      km: existingPlan?.km || defaultKm,
      price:
        existingPlan?.price ??
        (index === 0 ? Number(car.monthly_price || 0) : 0),
    };
  });
}

async function updateCar(formData: FormData) {
  "use server";

  const supabase = getSupabaseAdmin();

  const slug = String(formData.get("slug") || "");
  const daily_price = Number(formData.get("daily_price") || 0);
  const weekly_price = Number(formData.get("weekly_price") || 0);
  const monthly_price = Number(formData.get("monthly_price") || 0);
  const monthly_plans = DEFAULT_MONTHLY_PLAN_KMS.map((_, index) => {
    const km = String(formData.get(`monthly_plan_km_${index}`) || "").trim();
    const price = Number(formData.get(`monthly_plan_price_${index}`) || 0);

    if (!km) return null;

    return {
      km,
      price: Number.isFinite(price) ? price : 0,
    };
  }).filter((plan): plan is MonthlyPlan => Boolean(plan));
  const minimum_days = Number(formData.get("minimum_days") || 1);
  const no_deposit_fee = Number(formData.get("no_deposit_fee") || 0);
  const stock = Number(formData.get("stock") || 0);
  const badge_text = String(formData.get("badge_text") || "");
  const is_available = formData.get("is_available") === "on";

  if (!slug) return;

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
      is_available,
      updated_at: new Date().toISOString(),
    })
    .eq("slug", slug);

  if (error) {
    console.error("Update car error:", error);
    throw new Error("Failed to update car");
  }

  revalidatePath("/vehicle");
  revalidatePath("/admin/cars");
  revalidatePath(`/booking/${slug}`);
  revalidatePath(`/booking/monthly/${slug}`);
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

  return (
    <main className="min-h-screen bg-slate-100 px-4 py-8 md:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 rounded-3xl bg-slate-900 p-8 text-white">
          <h1 className="text-3xl font-bold">AMJDrive Admin Cars</h1>
          <p className="mt-2 text-sm text-slate-300">
            Update live prices, stock, availability, and booking rules.
          </p>
        </div>

        <div className="space-y-6">
          {(cars || []).map((car) => {
            const monthlyPlans = buildMonthlyPlansFromCar(car);

            return (
              <form
                key={car.slug}
                action={updateCar}
                className="rounded-3xl bg-white p-6 shadow-sm"
              >
                <input type="hidden" name="slug" value={car.slug} />

                <div className="mb-6 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="text-sm font-semibold text-purple-700">
                      {car.category}
                    </p>
                    <h2 className="text-2xl font-bold text-slate-900">
                      {car.name}
                    </h2>
                    <p className="text-sm text-slate-500">{car.slug}</p>
                  </div>

                  <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
                    <input
                      type="checkbox"
                      name="is_available"
                      defaultChecked={car.is_available}
                      className="h-4 w-4"
                    />
                    Available
                  </label>
                </div>

                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-slate-700">
                      Daily Price
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      name="daily_price"
                      defaultValue={car.daily_price}
                      className="w-full rounded-xl border border-slate-300 px-4 py-2.5"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-medium text-slate-700">
                      Weekly Price
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      name="weekly_price"
                      defaultValue={car.weekly_price}
                      className="w-full rounded-xl border border-slate-300 px-4 py-2.5"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-medium text-slate-700">
                      Base Monthly Price
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      name="monthly_price"
                      defaultValue={car.monthly_price}
                      className="w-full rounded-xl border border-slate-300 px-4 py-2.5"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-medium text-slate-700">
                      Stock
                    </label>
                    <input
                      type="number"
                      name="stock"
                      defaultValue={car.stock}
                      className="w-full rounded-xl border border-slate-300 px-4 py-2.5"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-medium text-slate-700">
                      Minimum Days
                    </label>
                    <input
                      type="number"
                      name="minimum_days"
                      defaultValue={car.minimum_days}
                      className="w-full rounded-xl border border-slate-300 px-4 py-2.5"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-medium text-slate-700">
                      No Deposit Fee
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      name="no_deposit_fee"
                      defaultValue={car.no_deposit_fee}
                      className="w-full rounded-xl border border-slate-300 px-4 py-2.5"
                    />
                  </div>

                  <div className="md:col-span-2 xl:col-span-2">
                    <label className="mb-1 block text-sm font-medium text-slate-700">
                      Badge Text
                    </label>
                    <input
                      type="text"
                      name="badge_text"
                      defaultValue={car.badge_text || ""}
                      className="w-full rounded-xl border border-slate-300 px-4 py-2.5"
                    />
                  </div>
                </div>

                <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <div className="mb-3">
                    <h3 className="text-lg font-bold text-slate-900">
                      Monthly Plans by Kilometer
                    </h3>
                    <p className="text-sm text-slate-500">
                      These prices are used on the monthly booking page.
                    </p>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                    {monthlyPlans.map((plan, index) => (
                      <div key={`${car.slug}-monthly-plan-${index}`}>
                        <input
                          type="hidden"
                          name={`monthly_plan_km_${index}`}
                          value={plan.km}
                        />
                        <label className="mb-1 block text-sm font-medium text-slate-700">
                          {plan.km}
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          name={`monthly_plan_price_${index}`}
                          defaultValue={plan.price}
                          className="w-full rounded-xl border border-slate-300 px-4 py-2.5"
                        />
                      </div>
                    ))}
                  </div>
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
            );
          })}
        </div>
      </div>
    </main>
  );
}
