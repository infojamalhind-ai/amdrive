import Link from "next/link";

export default function HeroPromo() {
  return (
    <div className="mb-2 text-center text-white md:mb-8">
      <Link
        href="/booking/nissan-sunny"
        prefetch={false}
        className="group mx-auto block max-w-6xl rounded-2xl border border-white/15 bg-gradient-to-r from-purple-950 via-purple-800 to-fuchsia-800 p-1.5 shadow-2xl transition hover:scale-[1.01] focus:outline-none focus:ring-4 focus:ring-yellow-300/60 md:min-h-[150px] md:rounded-[36px] md:p-3"
        aria-label="Book Nissan Sunny summer special from AED 69 on weekly offer"
      >
        <div className="relative overflow-hidden rounded-xl border border-white/15 bg-[radial-gradient(circle_at_12%_20%,rgba(250,204,21,0.22),transparent_30%),linear-gradient(135deg,#4c067d_0%,#6d10b0_48%,#3b0764_100%)] px-3 py-2 text-left md:grid md:min-h-[126px] md:grid-cols-[0.8fr_1.2fr_0.8fr] md:items-center md:gap-5 md:rounded-[30px] md:px-7 md:py-4">
          <div className="pointer-events-none absolute -left-7 -top-8 h-24 w-24 rounded-full bg-yellow-300/20 blur-xl md:h-36 md:w-36" />
          <div className="pointer-events-none absolute right-4 top-3 text-4xl opacity-20 md:left-52 md:right-auto md:top-8 md:text-7xl">
            {"\u2600"}
          </div>

          <div
            className="relative hidden h-28 rounded-2xl bg-white bg-cover bg-center shadow-2xl transition duration-300 group-hover:scale-[1.03] md:block md:bg-[url('/vehicle/nissan-sunny.jpg')]"
            aria-hidden="true"
          />

          <div className="relative">
            <p className="inline-flex items-center rounded-full bg-yellow-400 px-3 py-1 text-[10px] font-extrabold uppercase text-purple-950 shadow-sm md:px-4 md:text-xs md:tracking-wide">
              {"\u2600"} Summer Special Offer
            </p>

            <h2 className="mt-1 text-2xl font-black leading-none text-white sm:text-3xl md:mt-2 md:text-5xl">
              Nissan Sunny
            </h2>

            <div className="mt-1 flex flex-wrap items-end gap-x-2 gap-y-1 md:mt-2 md:flex-nowrap">
              <span className="whitespace-nowrap text-xs font-black uppercase leading-none text-white md:text-lg">
                From AED
              </span>
              <span className="text-5xl font-black leading-[0.85] text-yellow-300 drop-shadow md:text-7xl">
                69
              </span>
              <span className="whitespace-nowrap pb-1 text-sm font-black leading-none text-white md:text-xl">
                (On Weekly Offer)
              </span>
            </div>

            <p className="mt-1 hidden text-xs font-semibold text-white/85 md:mt-2 md:block md:text-base">
              Daily <span className="text-yellow-300">{"\u2022"}</span>{" "}
              Weekly <span className="text-yellow-300">{"\u2022"}</span>{" "}
              Monthly Rental
            </p>
          </div>

          <p className="relative mt-1.5 text-center text-[10px] font-bold text-white/90 md:hidden">
            No Deposit <span className="text-yellow-300">{"\u2022"}</span>{" "}
            Delivery UAE <span className="text-yellow-300">{"\u2022"}</span>{" "}
            Brand New Cars
          </p>

          <div className="relative mt-2 hidden text-center md:mt-0 md:block md:space-y-2 md:border-l md:border-white/25 md:pl-6 md:text-left">
            {[
              "No Deposit",
              "Delivery UAE",
              "Brand New Cars",
            ].map((item) => (
              <div
                key={item}
                className="rounded-lg bg-white/10 px-2 py-1.5 text-[10px] font-bold leading-tight text-white ring-1 ring-white/10 md:rounded-xl md:px-3 md:py-2 md:text-sm"
              >
                {item}
              </div>
            ))}
          </div>
        </div>
      </Link>
    </div>
  );
}
