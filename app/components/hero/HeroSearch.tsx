"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

function formatDate(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
    2,
    "0"
  )}-${String(date.getDate()).padStart(2, "0")}`;
}

function addDays(date: Date, days: number) {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

export default function HeroSearch() {
  const router = useRouter();

  const today = useMemo(() => new Date(), []);
  const tomorrow = useMemo(() => addDays(new Date(), 1), []);

  const [pickupLocation, setPickupLocation] = useState("Ajman");
  const [dropoffLocation, setDropoffLocation] = useState("Ajman");
  const [pickupDate, setPickupDate] = useState(formatDate(today));
  const [returnDate, setReturnDate] = useState(formatDate(tomorrow));

  const minPickupDate = formatDate(today);
  const minReturnDate = pickupDate || formatDate(tomorrow);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();

    if (!pickupLocation || !dropoffLocation || !pickupDate || !returnDate) {
      alert("Please fill all search fields.");
      return;
    }

    if (returnDate < pickupDate) {
      alert("Return date cannot be before pickup date.");
      return;
    }

    const params = new URLSearchParams();
    params.set("pickupLocation", pickupLocation);
    params.set("dropoffLocation", dropoffLocation);
    params.set("pickupDate", pickupDate);
    params.set("returnDate", returnDate);
    params.set("mode", "daily");

    router.push(`/vehicle?${params.toString()}`);
  }

  const inputClassName =
    "h-11 w-full rounded-xl border border-slate-200 bg-white px-3.5 text-sm font-medium text-slate-800 outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-200 md:h-12 md:rounded-2xl md:px-4";
  const dateInputClassName = `${inputClassName} pr-12`;

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#5f169f] via-[#8d10d8] to-[#d000ff]">
      <div className="mx-auto max-w-7xl px-4 py-5 md:px-6 md:py-8">
        <div className="mx-auto max-w-6xl">
          <div className="rounded-[24px] bg-gradient-to-r from-[#020617] via-[#020b2f] to-[#15113b] px-4 py-5 shadow-2xl md:rounded-[32px] md:px-8 md:py-10">
            <div className="mx-auto max-w-4xl text-center">
              <p className="mb-2 inline-flex rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[10px] font-semibold tracking-[0.18em] text-white/80 backdrop-blur md:mb-4 md:px-4 md:py-1.5 md:text-xs">
                AMJDRIVE CAR RENTAL
              </p>

              <h1 className="text-3xl font-bold leading-tight text-white md:text-6xl">
                Find your car in minutes
              </h1>

              <p className="mx-auto mt-2 max-w-2xl text-sm text-white/75 md:mt-4 md:text-xl">
                Search once, choose your car, then complete booking on the final
                page.
              </p>
            </div>

            <form
              onSubmit={handleSearch}
              className="mx-auto mt-5 max-w-5xl rounded-[24px] bg-white p-4 shadow-lg md:mt-8 md:rounded-[30px] md:p-6"
            >
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-5">
                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-slate-800">
                    Pickup Location
                  </label>
                  <select
                    value={pickupLocation}
                    onChange={(e) => setPickupLocation(e.target.value)}
                    className={inputClassName}
                    required
                  >
                    <option>Ajman</option>
                    <option>Sharjah</option>
                    <option>Dubai</option>
                    <option>UAQ</option>
                  </select>
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-slate-800">
                    Return Location
                  </label>
                  <select
                    value={dropoffLocation}
                    onChange={(e) => setDropoffLocation(e.target.value)}
                    className={inputClassName}
                    required
                  >
                    <option>Ajman</option>
                    <option>Sharjah</option>
                    <option>Dubai</option>
                    <option>UAQ</option>
                  </select>
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-slate-800">
                    Pickup Date
                  </label>
                  <input
                    type="date"
                    value={pickupDate}
                    min={minPickupDate}
                    onChange={(e) => {
                      const newPickupDate = e.target.value;
                      setPickupDate(newPickupDate);

                      if (returnDate < newPickupDate) {
                        setReturnDate(newPickupDate);
                      }
                    }}
                    className={dateInputClassName}
                    required
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-slate-800">
                    Return Date
                  </label>
                  <input
                    type="date"
                    value={returnDate}
                    min={minReturnDate}
                    onChange={(e) => setReturnDate(e.target.value)}
                    className={dateInputClassName}
                    required
                  />
                </div>

                <div className="flex items-end">
                  <button
                    type="submit"
                    className="h-11 w-full rounded-xl bg-gradient-to-r from-purple-700 to-fuchsia-600 px-5 text-sm font-bold text-white shadow-md transition hover:opacity-95 md:h-12 md:rounded-2xl md:text-base"
                  >
                    Search Cars
                  </button>
                </div>
              </div>

              <div className="mt-3 hidden flex-wrap gap-2 md:flex">
                <span className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-700">
                  Brand New Cars
                </span>
                <span className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-700">
                  Delivery Available
                </span>
                <span className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-700">
                  Easy Online Booking
                </span>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
