import Link from "next/link";

type FooterProps = {
  hideContactSections?: boolean;
};

export default function Footer({ hideContactSections = false }: FooterProps) {
  return (
    <footer className="bg-[#4b1fa7] text-white">
      <div className="mx-auto max-w-7xl px-6 py-12 md:px-10">
        <div
          className={`grid gap-10 ${
            hideContactSections ? "md:grid-cols-2" : "md:grid-cols-4"
          }`}
        >
          <div>
            <h3 className="text-2xl font-bold">AMJDrive</h3>
            <p className="mt-3 text-sm leading-6 text-white/80">
              Trusted car rental service in Ajman, Sharjah, Dubai and UAQ. Fast
              booking, clean cars, no hidden charges.
            </p>
          </div>

          <div>
            <h4 className="text-lg font-semibold">Quick Links</h4>
            <ul className="mt-4 space-y-2 text-sm text-white/85">
              <li>
                <Link href="/#cars" className="hover:text-white">
                  Cars
                </Link>
              </li>
              <li>
                <Link href="/#faq" className="hover:text-white">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/#reviews" className="hover:text-white">
                  Reviews
                </Link>
              </li>
              <li>
                <Link
                  href="/car-rental-guides/no-deposit-car-rental-uae"
                  className="hover:text-white"
                >
                  Car Rental Guides
                </Link>
              </li>
              <li>
                <Link href="/car-rental-uaq" className="hover:text-white">
                  Car Rental UAQ
                </Link>
              </li>
              <li>
                <Link
                  href="/no-deposit-car-rental-uaq"
                  className="hover:text-white"
                >
                  No Deposit Car Rental UAQ
                </Link>
              </li>
              <li>
                <Link href="/monthly-car-rental-uaq" className="hover:text-white">
                  Monthly Car Rental UAQ
                </Link>
              </li>
              <li>
                <Link href="/#contact" className="hover:text-white">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-white">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-white">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/refund" className="hover:text-white">
                  Refund Policy
                </Link>
              </li>
            </ul>
          </div>

          {!hideContactSections && (
            <>
              <div>
                <h4 className="text-lg font-semibold">Contact</h4>
                <ul className="mt-4 space-y-2 text-sm text-white/85">
                  <li>Phone: 058 221 1457</li>
                  <li>WhatsApp: +971 52 695 9007</li>
                  <li>
                    Location: Al Majaz 2, Al Wahda Street, Dubai-Sharjah Border,
                    opposite Karachi Darbar Restaurant
                  </li>
                  <li>Service Area: Ajman, Sharjah, Dubai, UAQ</li>
                </ul>
              </div>

              <div>
                <h4 className="text-lg font-semibold">Book Your Car</h4>
                <p className="mt-3 text-sm leading-6 text-white/80">
                  Need a rental today? Call or WhatsApp us for quick booking.
                </p>

                <div className="mt-5 flex flex-col gap-3">
                  <a
                    href="tel:0582211457"
                    className="rounded-full bg-white px-5 py-3 text-center text-sm font-semibold text-[#4b1fa7] transition hover:scale-[1.02]"
                  >
                    Call Now
                  </a>

                  <a
                    href="https://wa.me/971526959007"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-full border border-white px-5 py-3 text-center text-sm font-semibold text-white transition hover:bg-white hover:text-[#4b1fa7]"
                  >
                    WhatsApp Us
                  </a>
                </div>
              </div>
            </>
          )}
        </div>

        <div className="mt-10 border-t border-white/20 pt-6 text-center text-sm text-white/70">
          (c) 2026 AMJDrive. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
