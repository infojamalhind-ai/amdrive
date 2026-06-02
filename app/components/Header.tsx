import Link from "next/link";
import Image from "next/image";
import MobileHeaderMenu from "./MobileHeaderMenu";

type HeaderProps = {
  hideContactActions?: boolean;
};

export default function Header({ hideContactActions = false }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 shadow-sm backdrop-blur relative">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex min-h-[82px] items-center justify-between gap-3 sm:min-h-[88px] md:min-h-[96px]">
          <Link
            href="/"
            aria-label="Go to home"
            className="flex shrink-0 items-center justify-start"
          >
            <div className="relative h-[88px] w-[88px] overflow-hidden rounded-full sm:h-[92px] sm:w-[92px] md:h-[96px] md:w-[96px] lg:h-[102px] lg:w-[102px]">
              <Image
                src="/amjdrive-logo-header-320.webp"
                alt="AMJDrive Logo"
                fill
                priority
                sizes="(max-width: 640px) 88px, (max-width: 768px) 92px, (max-width: 1024px) 96px, 102px"
                className="object-cover"
              />
            </div>
          </Link>

          <nav className="hidden flex-1 items-center justify-center gap-6 text-[17px] font-semibold text-slate-800 md:flex lg:gap-8">
            <Link
              href="/"
              className="whitespace-nowrap transition hover:text-purple-700"
            >
              Home
            </Link>

            <Link
              href="/#cars"
              className="whitespace-nowrap transition hover:text-purple-700"
            >
              Car Rentals
            </Link>

            <Link
              href="/#location"
              className="whitespace-nowrap transition hover:text-purple-700"
            >
              Location
            </Link>

            <Link
              href="/#contact"
              className="whitespace-nowrap transition hover:text-purple-700"
            >
              Contact Us
            </Link>

            <Link
              href="/my-booking"
              className="whitespace-nowrap transition hover:text-purple-700"
            >
              My Booking
            </Link>
          </nav>

          {!hideContactActions && (
            <div className="hidden shrink-0 items-center gap-3 md:flex lg:gap-4">
              <a
                href="tel:+971582211457"
                className="rounded-xl bg-red-500 px-5 py-3 font-bold text-white shadow-sm transition hover:opacity-90"
              >
                Call Now
              </a>

              <a
                href="https://wa.me/971526959007?text=Hi, I want to book a car with AMJDrive"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-xl bg-green-500 px-5 py-3 font-bold text-white shadow-sm transition hover:opacity-90"
              >
                WhatsApp
              </a>
            </div>
          )}

          <MobileHeaderMenu hideContactActions={hideContactActions} />
        </div>
      </div>

      <div className="h-[3px] w-full bg-gradient-to-r from-purple-700 via-fuchsia-500 to-purple-700" />
    </header>
  );
}
