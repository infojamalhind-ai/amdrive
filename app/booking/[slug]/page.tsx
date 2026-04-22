import { notFound } from "next/navigation";
import BookingForm from "@/app/components/BookingForm";
import { getSupabaseAdmin } from "@/lib/supabase";
import { getCarBadgeLabel, parseCarDisplayConfig } from "@/lib/car-display";

type PageProps = {
  params: Promise<{
    slug: string;
  }>;
  searchParams?: Promise<{
    pickupLocation?: string;
    dropoffLocation?: string;
    pickupDate?: string;
    returnDate?: string;
    mode?: string;
  }>;
};

export default async function BookingPage({
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

  const pickupLocation = resolvedSearchParams?.pickupLocation || "Ajman";
  const dropoffLocation = resolvedSearchParams?.dropoffLocation || "Ajman";
  const pickupDate = resolvedSearchParams?.pickupDate || "";
  const returnDate = resolvedSearchParams?.returnDate || "";
  const displayConfig = parseCarDisplayConfig(car.badge_text);
  const badgeLabel = getCarBadgeLabel(displayConfig, {
    allowNoDeposit: Boolean(car.allow_no_deposit),
  });

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-6 md:px-8 md:py-10">
      <div className="mx-auto max-w-5xl">
        <div className="mb-6 rounded-3xl bg-white p-4 shadow-sm md:p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div>
              {badgeLabel ? (
                <div className="mb-3 inline-flex rounded-full bg-purple-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-purple-700">
                  {badgeLabel}
                </div>
              ) : null}
              <p className="text-sm font-semibold text-purple-700">
                {car.category}
              </p>
              <h1 className="mt-1 text-3xl font-bold text-slate-900">
                {car.name}
              </h1>
              {displayConfig.promoText ? (
                <p className="mt-3 text-sm text-slate-600">
                  {displayConfig.promoText}
                </p>
              ) : null}
            </div>

            <div className="grid grid-cols-2 gap-2 text-sm text-slate-600 md:grid-cols-4 md:gap-3">
              <div className="rounded-2xl bg-slate-50 px-3 py-2">
                <p className="text-xs text-slate-400">Pickup</p>
                <p className="font-semibold text-slate-900">{pickupLocation}</p>
              </div>

              <div className="rounded-2xl bg-slate-50 px-3 py-2">
                <p className="text-xs text-slate-400">Return</p>
                <p className="font-semibold text-slate-900">{dropoffLocation}</p>
              </div>

              <div className="rounded-2xl bg-slate-50 px-3 py-2">
                <p className="text-xs text-slate-400">Pickup Date</p>
                <p className="font-semibold text-slate-900">
                  {pickupDate || "Not selected"}
                </p>
              </div>

              <div className="rounded-2xl bg-slate-50 px-3 py-2">
                <p className="text-xs text-slate-400">Return Date</p>
                <p className="font-semibold text-slate-900">
                  {returnDate || "Not selected"}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6 rounded-2xl bg-slate-50 p-4">
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="rounded-2xl bg-white px-3 py-3">
                <p className="text-xs text-slate-500">Daily</p>
                <p className="mt-1 text-lg font-bold text-slate-900">
                  AED {car.daily_price}
                </p>
              </div>

              <div className="rounded-2xl bg-white px-3 py-3">
                <p className="text-xs text-slate-500">Weekly</p>
                <p className="mt-1 text-lg font-bold text-slate-900">
                  AED {car.weekly_price}
                </p>
              </div>

              <div className="rounded-2xl bg-white px-3 py-3">
                <p className="text-xs text-slate-500">Monthly</p>
                <p className="mt-1 text-lg font-bold text-slate-900">
                  AED {car.monthly_price}
                </p>
              </div>
            </div>
          </div>

          {Boolean(car.allow_no_deposit) && Number(car.no_deposit_fee || 0) > 0 ? (
            <p className="mt-4 text-sm font-semibold text-purple-700">
              Deposit waiver available for AED {Number(car.no_deposit_fee || 0)}.
            </p>
          ) : null}
        </div>

        <BookingForm
          car={{
            slug: car.slug,
            name: car.name,
            category: car.category,
            dailyPrice: Number(car.daily_price || 0),
            weeklyPrice: Number(car.weekly_price || 0),
            monthlyPrice: Number(car.monthly_price || 0),
            image: car.image,
            seats: Number(car.seats || 0),
            bags: Number(car.bags || 0),
            doors: Number(car.doors || 0),
            minimumDays: Number(car.minimum_days || 1),
            allowNoDeposit: Boolean(car.allow_no_deposit),
            noDepositFee: Number(car.no_deposit_fee || 0),
            showRefundableDeposit: Boolean(car.show_refundable_deposit),
          }}
        />
      </div>
    </main>
  );
}
