import Image from "next/image";
import Link from "next/link";

export type Car = {
  id: number;
  slug: string;
  name: string;
  image: string;
  category: string;
  seats: number;
  bags: number;
  doors: number;
  minimum_days: number;
  daily_price: number;
  weekly_price: number;
  monthly_price: number;
  no_deposit_fee: number;
  stock: number;
  is_available: boolean;
};

type SearchParamValue = string | string[] | undefined;

type VehicleProps = {
  cars: Car[];
  searchParams?: Record<string, SearchParamValue>;
};

function getParamValue(value: SearchParamValue, fallback = "") {
  if (Array.isArray(value)) {
    return value[0] ?? fallback;
  }

  return value ?? fallback;
}

export default function Vehicle({ cars, searchParams = {} }: VehicleProps) {
  const pickupLocation = getParamValue(searchParams.pickupLocation, "Ajman");
  const dropoffLocation = getParamValue(searchParams.dropoffLocation, "Ajman");
  const pickupDate = getParamValue(searchParams.pickupDate);
  const returnDate = getParamValue(searchParams.returnDate);
  const mode = getParamValue(searchParams.mode, "daily");

  const dailyQuery = new URLSearchParams();
  dailyQuery.set("pickupLocation", pickupLocation);
  dailyQuery.set("dropoffLocation", dropoffLocation);
  dailyQuery.set("pickupDate", pickupDate);
  dailyQuery.set("returnDate", returnDate);
  dailyQuery.set("mode", mode);

  const monthlyQuery = new URLSearchParams();
  monthlyQuery.set("pickupLocation", pickupLocation);
  monthlyQuery.set("dropoffLocation", dropoffLocation);
  monthlyQuery.set("pickupDate", pickupDate);
  monthlyQuery.set("mode", "monthly");

  return (
    <section className="bg-slate-50 px-4 py-6 md:px-8 md:py-8">
      <div className="mx-auto max-w-7xl">
        {cars.length === 0 ? (
          <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center text-slate-600 shadow-sm">
            No cars available right now.
          </div>
        ) : (
          <div className="space-y-5">
            {cars.map((car) => {
              const isOutOfStock = car.stock <= 0 || !car.is_available;
              const dailyBookingHref = `/booking/${car.slug}?${dailyQuery}`;

              return (
                <div
                  key={car.id}
                  className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm"
                >
                  <div className="grid lg:grid-cols-[320px_1fr_260px]">
                    {/* IMAGE */}
                    <div className="flex items-center justify-center bg-slate-100 p-3 sm:p-4 lg:p-5">
                      {isOutOfStock ? (
                        <div className="relative aspect-square w-full max-w-[290px] overflow-hidden rounded-3xl bg-white ring-1 ring-slate-200 sm:max-w-[320px] lg:max-w-none">
                          <Image
                            src={car.image}
                            alt={car.name}
                            fill
                            sizes="(max-width: 640px) 290px, (max-width: 1024px) 320px, 320px"
                            quality={75}
                            className="object-contain p-2 sm:p-3"
                          />
                        </div>
                      ) : (
                        <Link
                          href={dailyBookingHref}
                          className="block w-full max-w-[290px] rounded-3xl transition hover:scale-[1.01] sm:max-w-[320px] lg:max-w-none"
                          aria-label={`Book ${car.name}`}
                        >
                          <div className="relative aspect-square overflow-hidden rounded-3xl bg-white ring-1 ring-slate-200">
                            <Image
                              src={car.image}
                              alt={car.name}
                              fill
                              sizes="(max-width: 640px) 290px, (max-width: 1024px) 320px, 320px"
                              quality={75}
                              className="object-contain p-2 sm:p-3"
                            />
                          </div>
                        </Link>
                      )}
                    </div>

                    {/* DETAILS */}
                    <div className="p-4 md:p-6">
                      <div className="flex justify-between">
                        <div>
                          <p className="text-sm text-purple-700">
                            {car.category}
                          </p>
                          <h3 className="text-2xl font-bold">{car.name}</h3>
                        </div>

                        <div className="flex gap-2">
                          {isOutOfStock ? (
                            <div className="rounded-xl bg-red-100 px-3 py-2 text-sm font-semibold text-red-700">
                              Not Available
                            </div>
                          ) : (
                            <div className="rounded-xl bg-green-100 px-3 py-2 text-sm font-semibold text-green-700">
                              Available
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="mt-5 grid grid-cols-3 gap-3">
                        <div className="rounded-xl bg-slate-50 p-3 text-center">
                          {car.seats} Seats
                        </div>
                        <div className="rounded-xl bg-slate-50 p-3 text-center">
                          {car.bags} Bags
                        </div>
                        <div className="rounded-xl bg-slate-50 p-3 text-center">
                          {car.doors} Doors
                        </div>
                      </div>

                      <div className="mt-4 text-sm">
                        Min rental: {car.minimum_days} day
                      </div>

                      {car.no_deposit_fee > 0 && (
                        <div className="mt-2 font-semibold text-purple-700">
                          AED {car.no_deposit_fee} waiver fee
                        </div>
                      )}
                    </div>

                    {/* PRICE + BUTTON */}
                    <div className="border-l p-4">
                      <div className="space-y-2 text-center">
                        <div>Daily: AED {car.daily_price}</div>
                        <div>Weekly: AED {car.weekly_price}</div>
                        <div>Monthly: AED {car.monthly_price}</div>
                      </div>

                      <div className="mt-5 space-y-2">
                        {!isOutOfStock && (
                          <>
                            <Link
                              href={dailyBookingHref}
                              className="block rounded-xl bg-purple-700 py-2 text-center text-white"
                            >
                              Book Daily
                            </Link>

                            <Link
                              href={`/booking/monthly/${car.slug}?${monthlyQuery}`}
                              className="block rounded-xl border border-purple-700 py-2 text-center text-purple-700"
                            >
                              Book Monthly
                            </Link>
                          </>
                        )}

                        {isOutOfStock && (
                          <div className="text-center font-semibold text-red-600">
                            Currently not available
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
