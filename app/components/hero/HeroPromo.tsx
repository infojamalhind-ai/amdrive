export default function HeroPromo() {
  return (
    <div className="mb-5 text-center text-white md:mb-8">
      <div className="mx-auto flex min-h-[136px] max-w-6xl items-center justify-center rounded-[28px] border border-white/15 bg-gradient-to-r from-purple-950 via-purple-800 to-purple-950 px-3 pb-3 pt-2 shadow-2xl md:min-h-[150px] md:rounded-[36px] md:px-7 md:pb-4 md:pt-3">
        <div className="w-full rounded-[24px] bg-white px-3 py-3 text-center shadow-[0_8px_25px_rgba(255,215,0,0.12)] md:grid md:grid-cols-[1fr_0.8fr] md:items-center md:gap-6 md:rounded-[32px] md:px-8 md:py-4">
          <div>
            <p className="mx-auto inline-flex max-w-full items-center justify-center rounded-full bg-yellow-400 px-2.5 py-1 text-[9px] font-extrabold uppercase tracking-wide text-purple-950 md:px-5 md:py-1.5 md:text-sm">
              🔥 Eid Holiday Special
            </p>

            <h2 className="mt-2 whitespace-nowrap text-[1.38rem] font-extrabold leading-none text-purple-900 sm:text-4xl md:text-4xl">
              Minimum <span className="text-yellow-500">4 Day</span> Booking
            </h2>
          </div>

          <div>
            <div className="mx-auto mt-3 flex max-w-3xl items-center justify-center rounded-2xl border border-purple-100 bg-purple-50 px-3 py-2 text-sm font-black text-purple-950 sm:text-base md:mt-0 md:px-5 md:py-2.5 md:text-xl">
              <span className="hidden md:inline">Pickup&nbsp;</span>
              <span>26 May</span>
              <span className="mx-3 text-xl leading-none text-yellow-500 md:mx-5 md:text-3xl">
                →
              </span>
              <span className="hidden md:inline">Return&nbsp;</span>
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
