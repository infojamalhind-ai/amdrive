import Link from "next/link";
import { notFound } from "next/navigation";
import { getSupabaseAdmin } from "@/lib/supabase";
import MonthlyBookingForm from "@/app/components/MonthlyBookingForm";
import {
  getCarBadgeLabel,
  getRecommendedMonthlyPlan,
  normalizeMonthlyPlans,
  parseCarDisplayConfig,
} from "@/lib/car-display";

type MonthlyPlan = {
  km: string;
  price: number;
  recommended?: boolean;
  promoText?: string;
};

type PageProps = {
  params: Promise<{
    slug: string;
  }>;
  searchParams?: Promise<{
    plan?: string;
    km?: string;
    pickupLocation?: string;
    dropoffLocation?: string;
    pickupDate?: string;
    mode?: string;
  }>;
};

export default async function MonthlyBookingPage({
  params,
  searchParams,
}: PageProps) {
  const { slug } = await params;
  const resolvedSearchParams = searchParams ? await searchParams : undefined;

  const supabase = getSupabaseAdmin();

  const { data: car, error } = await supabase
    .from("cars")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error || !car) {
    notFound();
  }

  const monthlyPlans: MonthlyPlan[] = normalizeMonthlyPlans(car.monthly_plans);
  const displayConfig = parseCarDisplayConfig(car.badge_text);
  const badgeLabel = getCarBadgeLabel(displayConfig, {
    allowNoDeposit: Boolean(car.allow_no_deposit),
  });

  const selectedValue = resolvedSearchParams?.plan || resolvedSearchParams?.km || "";

  const normalizedSelectedValue = selectedValue
    .toString()
    .replace(/\s*km/i, "")
    .trim()
    .toLowerCase();

  const selectedPlan =
    monthlyPlans.find((plan) => {
      const planKmNormalized = plan.km
        .replace(/\s*km/i, "")
        .trim()
        .toLowerCase();

      return (
        plan.km.toLowerCase() === selectedValue.toLowerCase() ||
        planKmNormalized === normalizedSelectedValue
      );
    }) || monthlyPlans[0];

  if (!selectedPlan) {
    notFound();
  }

  const pickupLocation = resolvedSearchParams?.pickupLocation || "Ajman";
  const dropoffLocation = resolvedSearchParams?.dropoffLocation || "Ajman";
  const pickupDate = resolvedSearchParams?.pickupDate || "";

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10 md:px-8">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 rounded-3xl bg-white p-6 shadow-sm">
          {badgeLabel ? (
            <div className="mb-3 inline-flex rounded-full bg-purple-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-purple-700">
              {badgeLabel}
            </div>
          ) : null}
          <p className="text-sm text-purple-700">{car.category}</p>
          <h1 className="mt-2 text-3xl font-bold text-slate-900">{car.name}</h1>
          {displayConfig.promoText ? (
            <p className="mt-3 text-sm text-slate-600">{displayConfig.promoText}</p>
          ) : null}

          <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-5">
            <div className="mb-4 flex items-center justify-between">
              <p className="text-sm font-semibold text-slate-700">
                Choose Monthly Plan
              </p>

              <Link
                href={`/vehicle?pickupLocation=${encodeURIComponent(
                  pickupLocation
                )}&dropoffLocation=${encodeURIComponent(
                  dropoffLocation
                )}&pickupDate=${encodeURIComponent(
                  pickupDate
                )}&mode=monthly`}
                className="text-sm font-semibold text-purple-700 hover:text-purple-800"
              >
                Back to vehicles
              </Link>
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              {monthlyPlans.map((plan) => {
                const kmValue = plan.km.replace(/\s*KM/i, "").trim();

                const href = `/booking/monthly/${car.slug}?pickupLocation=${encodeURIComponent(
                  pickupLocation
                )}&dropoffLocation=${encodeURIComponent(
                  dropoffLocation
                )}&pickupDate=${encodeURIComponent(
                  pickupDate
                )}&mode=monthly&plan=${encodeURIComponent(kmValue)}`;

                const isActive =
                  selectedPlan.km.toLowerCase() === plan.km.toLowerCase();

                return (
                  <Link
                    key={`${car.slug}-${plan.km}`}
                    href={href}
                    className={`rounded-2xl border p-4 transition ${
                      isActive
                        ? "border-purple-300 bg-purple-50"
                        : "border-slate-200 bg-white hover:border-purple-300 hover:bg-purple-50"
                    }`}
                  >
                    {plan.recommended ? (
                      <div className="mb-3 inline-flex rounded-full bg-purple-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-purple-700">
                        Recommended
                      </div>
                    ) : null}
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="text-sm text-slate-500">Monthly Price</p>
                        <p className="text-2xl font-bold text-slate-900">
                          AED {plan.price}
                        </p>
                      </div>

                      <div className="text-right">
                        <p className="text-sm text-slate-500">Kilometers</p>
                        <p className="text-lg font-semibold text-slate-900">
                          {plan.km}
                        </p>
                      </div>
                    </div>
                    {plan.promoText ? (
                      <p className="mt-3 text-sm text-slate-600">{plan.promoText}</p>
                    ) : null}
                  </Link>
                );
              })}
            </div>
          </div>

          {getRecommendedMonthlyPlan(monthlyPlans)?.promoText ? (
            <p className="mt-4 text-sm font-medium text-purple-700">
              {getRecommendedMonthlyPlan(monthlyPlans)?.promoText}
            </p>
          ) : null}
        </div>

        <MonthlyBookingForm
          car={{
            slug: car.slug,
            name: car.name,
            category: car.category,
            monthlyPlans,
          }}
          selectedPlan={selectedPlan}
        />
      </div>
    </main>
  );
}
