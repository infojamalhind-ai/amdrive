"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const goToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
    setMobileMenuOpen(false);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 shadow-sm backdrop-blur">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex min-h-[82px] items-center justify-between gap-3 sm:min-h-[88px] md:min-h-[96px]">
          <button
            onClick={goToTop}
            aria-label="Go to top"
            className="flex shrink-0 items-center justify-start"
          >
            <div className="relative h-[88px] w-[88px] overflow-hidden rounded-full sm:h-[92px] sm:w-[92px] md:h-[96px] md:w-[96px] lg:h-[102px] lg:w-[102px]">
              <Image
                src="/amjdrive-logo-header.png"
                alt="AMJDrive Logo"
                fill
                priority
                sizes="(max-width: 640px) 88px, (max-width: 768px) 92px, (max-width: 1024px) 96px, 102px"
                className="object-cover"
              />
            </div>
          </button>

          <nav className="hidden flex-1 items-center justify-center gap-6 text-[17px] font-semibold text-slate-800 md:flex lg:gap-8">
            <button
              onClick={goToTop}
              className="whitespace-nowrap transition hover:text-purple-700"
            >
              Home
            </button>

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

          <div className="hidden shrink-0 items-center gap-3 md:flex lg:gap-4">
            <a
              href="tel:+971582211457"
              className="rounded-xl bg-red-500 px-5 py-3 font-bold text-white shadow-sm transition hover:opacity-90"
            >
              Call Now
            </a>

            <a
              href="https://wa.me/971582211457?text=Hi, I want to book a car with AMJDrive"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-xl bg-green-500 px-5 py-3 font-bold text-white shadow-sm transition hover:opacity-90"
            >
              WhatsApp
            </a>
          </div>

          <button
            type="button"
            aria-label="Toggle menu"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-800 shadow-sm transition hover:bg-slate-50 md:hidden"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              {mobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="border-t border-slate-200 pb-4 pt-4 md:hidden">
            <nav className="flex flex-col gap-2 text-base font-semibold text-slate-800">
              <button
                onClick={goToTop}
                className="rounded-xl px-4 py-3 text-left transition hover:bg-slate-50 hover:text-purple-700"
              >
                Home
              </button>

              <Link
                href="/#cars"
                onClick={closeMobileMenu}
                className="rounded-xl px-4 py-3 transition hover:bg-slate-50 hover:text-purple-700"
              >
                Car Rentals
              </Link>

              <Link
                href="/#location"
                onClick={closeMobileMenu}
                className="rounded-xl px-4 py-3 transition hover:bg-slate-50 hover:text-purple-700"
              >
                Location
              </Link>

              <Link
                href="/#contact"
                onClick={closeMobileMenu}
                className="rounded-xl px-4 py-3 transition hover:bg-slate-50 hover:text-purple-700"
              >
                Contact Us
              </Link>

              <Link
                href="/my-booking"
                onClick={closeMobileMenu}
                className="rounded-xl px-4 py-3 transition hover:bg-slate-50 hover:text-purple-700"
              >
                My Booking
              </Link>
            </nav>

            <div className="mt-4 grid grid-cols-1 gap-3">
              <a
                href="tel:+971582211457"
                className="rounded-xl bg-red-500 px-5 py-3 text-center font-bold text-white shadow-sm transition hover:opacity-90"
              >
                Call Now
              </a>

              <a
                href="https://wa.me/971582211457?text=Hi, I want to book a car with AMJDrive"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-xl bg-green-500 px-5 py-3 text-center font-bold text-white shadow-sm transition hover:opacity-90"
              >
                WhatsApp
              </a>
            </div>
          </div>
        )}
      </div>

      <div className="h-[3px] w-full bg-gradient-to-r from-purple-700 via-fuchsia-500 to-purple-700" />
    </header>
  );
}
