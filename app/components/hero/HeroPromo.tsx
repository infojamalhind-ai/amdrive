export default function HeroPromo() {
  return (
    <div className="mb-2 text-center text-white md:mb-8">
      <div className="mx-auto max-w-6xl rounded-2xl border border-white/15 bg-white px-3 py-2 md:flex md:min-h-[150px] md:items-center md:justify-center md:rounded-[36px] md:bg-gradient-to-r md:from-purple-950 md:via-purple-800 md:to-purple-950 md:px-7 md:pb-4 md:pt-3 md:shadow-2xl">
        <div className="w-full text-center md:grid md:grid-cols-[1fr_0.8fr] md:items-center md:gap-6 md:rounded-[32px] md:bg-white md:px-8 md:py-4 md:shadow-[0_8px_25px_rgba(255,215,0,0.12)]">
          <div>
            <p className="mx-auto inline-flex max-w-full items-center justify-center rounded-full bg-yellow-400 px-2.5 py-1 text-[9px] font-extrabold uppercase text-purple-950 md:px-5 md:py-1.5 md:text-sm md:tracking-wide">
              {"\uD83D\uDD25"} Eid Mubarak Special
            </p>

            <h2 className="mt-1 whitespace-nowrap text-base font-extrabold leading-none text-purple-900 sm:text-2xl md:mt-1.5 md:text-4xl">
              Minimum <span className="text-yellow-500">3 Day</span> Booking
            </h2>
          </div>

          <div>
            <div className="mx-auto mt-1.5 flex max-w-3xl items-center justify-center rounded-xl border border-purple-100 bg-purple-50 px-2 py-1 text-[11px] font-black text-purple-950 sm:text-sm md:mt-0 md:rounded-2xl md:px-5 md:py-2.5 md:text-xl">
              <span>Pickup&nbsp;</span>
              <span>27 May</span>
              <span className="mx-2 text-sm leading-none text-yellow-500 md:mx-5 md:text-3xl">
                {"\u2192"}
              </span>
              <span>Return&nbsp;</span>
              <span>30 May</span>
            </div>

            <p className="mt-2 hidden text-sm font-semibold text-slate-600 md:block">
              Eid Holidays:{" "}
              <span className="font-extrabold text-yellow-500">
                27, 28, 29
              </span>{" "}
              May
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
