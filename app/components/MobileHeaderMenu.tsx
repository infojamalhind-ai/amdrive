"use client";

import { useState } from "react";
import Link from "next/link";

type MobileHeaderMenuProps = {
  hideContactActions?: boolean;
};

export default function MobileHeaderMenu({
  hideContactActions = false,
}: MobileHeaderMenuProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <>
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

      {mobileMenuOpen && (
        <div className="absolute left-0 right-0 top-full border-t border-slate-200 bg-white px-4 pb-4 pt-4 shadow-sm md:hidden">
          <nav className="mx-auto flex max-w-7xl flex-col gap-2 text-base font-semibold text-slate-800">
            <Link
              href="/"
              onClick={closeMobileMenu}
              className="rounded-xl px-4 py-3 text-left transition hover:bg-slate-50 hover:text-purple-700"
            >
              Home
            </Link>

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

          {!hideContactActions && (
            <div className="mx-auto mt-4 grid max-w-7xl grid-cols-1 gap-3">
              <a
                href="tel:+971582211457"
                className="rounded-xl bg-red-500 px-5 py-3 text-center font-bold text-white shadow-sm transition hover:opacity-90"
              >
                Call Now
              </a>

              <a
                href="https://wa.me/971526959007?text=Hi, I want to book a car with AMJDrive"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-xl bg-green-500 px-5 py-3 text-center font-bold text-white shadow-sm transition hover:opacity-90"
              >
                WhatsApp
              </a>
            </div>
          )}
        </div>
      )}
    </>
  );
}
