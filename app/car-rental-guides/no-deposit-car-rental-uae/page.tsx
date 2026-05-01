import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";

const phoneDisplay = "058 221 1457";
const whatsAppDisplay = "+971 52 695 9007";
const phoneSchema = "+971582211457";
const address =
  "Al Majaz 2, Al Wahda Street, Dubai-Sharjah Border, opposite Karachi Darbar Restaurant";
const serviceAreas = ["Sharjah", "Ajman", "Dubai", "Umm Al Quwain"];

const faqs = [
  {
    question: "What does no-deposit car rental mean in the UAE?",
    answer:
      "It means you can rent a car without paying a separate refundable security deposit at the start. You still pay the rental price and remain responsible for agreed charges such as Salik, parking, fines, fuel, late return, and insurance excess.",
  },
  {
    question: "Is no-deposit rental the same as free rental?",
    answer:
      "No. No-deposit only refers to the security deposit. The daily, weekly, or monthly rental amount still applies, along with any charges clearly listed in the rental terms.",
  },
  {
    question: "Can UAE residents rent a car without a deposit?",
    answer:
      "Yes, if the selected car and booking terms allow it. Residents usually need Emirates ID and a valid UAE driving license before the vehicle is handed over.",
  },
  {
    question: "What documents do tourists need for UAE car rental?",
    answer:
      "Tourists normally need a passport, visit visa or UAE entry stamp, home country driving license, and an International Driving Permit when required for their license country.",
  },
  {
    question: "Does basic insurance cover everything?",
    answer:
      "No. Basic insurance often has an excess, which is the amount the renter may pay after covered damage. CDW or SCDW may reduce that exposure, but exclusions still apply.",
  },
  {
    question: "Are Salik and parking included in no-deposit rental?",
    answer:
      "Usually they are charged separately unless the rental agreement clearly says they are included. Ask how Salik, parking, and fine admin charges are handled before booking.",
  },
  {
    question: "What happens if a traffic fine appears after return?",
    answer:
      "Traffic fines can appear after the car is returned. If the fine belongs to your rental period, the renter is responsible for paying it even when no security deposit was collected upfront.",
  },
  {
    question: "Is no-deposit rental good for monthly car rental?",
    answer:
      "It can be useful because it lowers upfront cost. For monthly rental, compare the total monthly price, mileage, insurance terms, servicing support, and fine handling.",
  },
  {
    question: "How do I check AMJDrive no-deposit availability?",
    answer:
      "Browse the vehicle page or WhatsApp AMJDrive at +971 52 695 9007 with your dates, preferred vehicle size, and pickup or delivery area.",
  },
];

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((faq) => ({
    "@type": "Question",
    name: faq.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: faq.answer,
    },
  })),
};

const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "CarRental",
  name: "AMJDrive",
  url: "https://amjdrive.com",
  telephone: phoneSchema,
  address: {
    "@type": "PostalAddress",
    streetAddress: address,
    addressCountry: "AE",
  },
  areaServed: serviceAreas.map((area) => ({
    "@type": "City",
    name: area,
  })),
};

export const metadata: Metadata = {
  title: "No Deposit Car Rental UAE | AMJDrive Guide",
  description:
    "Learn how no-deposit car rental works in the UAE, including insurance, documents, Salik, fines, tourist rules and monthly rental options with AMJDrive.",
  alternates: {
    canonical: "/car-rental-guides/no-deposit-car-rental-uae",
  },
  openGraph: {
    title: "No Deposit Car Rental UAE | AMJDrive Guide",
    description:
      "Learn how no-deposit car rental works in the UAE, including insurance, documents, Salik, fines, tourist rules and monthly rental options with AMJDrive.",
    url: "/car-rental-guides/no-deposit-car-rental-uae",
    type: "article",
  },
};

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="scroll-mt-28">
      <h2 className="text-2xl font-bold text-slate-950">{title}</h2>
      <div className="mt-4 space-y-4 text-base leading-8 text-slate-700">
        {children}
      </div>
    </section>
  );
}

export default function NoDepositCarRentalUaePage() {
  return (
    <main className="min-h-screen bg-white text-slate-900">
      <Header />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
      />

      <section className="bg-slate-950 px-4 py-12 text-white md:px-8 md:py-16">
        <div className="mx-auto max-w-5xl">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-purple-200">
            AMJDrive UAE Car Rental Guide
          </p>
          <h1 className="mt-4 text-4xl font-bold leading-tight sm:text-5xl">
            No Deposit Car Rental in UAE: How It Works, Fees, Insurance &
            Tourist Rules
          </h1>
          <p className="mt-5 max-w-3xl text-base leading-7 text-slate-200 sm:text-lg">
            A practical guide for residents and tourists who want to understand
            no-deposit rentals before choosing a daily, weekly, or monthly car
            in the UAE.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/vehicle"
              className="rounded-xl bg-white px-5 py-3 text-center font-semibold text-purple-800"
            >
              Browse AMJDrive Vehicles
            </Link>
            <a
              href="https://wa.me/971526959007?text=Hi, I want to ask about no-deposit car rental with AMJDrive"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-xl bg-green-500 px-5 py-3 text-center font-semibold text-white"
            >
              WhatsApp AMJDrive
            </a>
          </div>
        </div>
      </section>

      <article className="px-4 py-10 md:px-8">
        <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[minmax(0,1fr)_280px]">
          <div className="space-y-9">
            <section className="rounded-2xl border border-purple-100 bg-purple-50 p-6">
              <h2 className="text-2xl font-bold text-slate-950">
                Quick answer: what no-deposit car rental means
              </h2>
              <p className="mt-3 text-base leading-8 text-slate-700">
                No-deposit car rental in the UAE means you can rent a car
                without paying a separate refundable security deposit upfront.
                You still pay the rental price, and you are still responsible
                for agreed charges such as Salik, parking, fines, fuel, late
                return, and insurance excess if they apply.
              </p>
            </section>

            <Section title="How no-deposit rental works in UAE">
              <p>
                In a normal UAE rental, the company may collect or block a
                security deposit to cover later charges. That deposit can be
                held while traffic fines, tolls, and vehicle condition are
                checked after return.
              </p>
              <p>
                With a no-deposit rental, that upfront block is removed. The
                rental company still checks your documents, records the vehicle
                condition, and keeps the rental agreement active for charges
                linked to your rental period. It is easier on cash flow, but it
                is not a way to avoid fines, tolls, or damage responsibility.
              </p>
            </Section>

            <Section title="Deposit vs no-deposit comparison table">
              <div className="overflow-x-auto rounded-2xl border border-slate-200">
                <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
                  <thead className="bg-slate-100 text-slate-900">
                    <tr>
                      <th className="px-4 py-3 font-semibold">Point</th>
                      <th className="px-4 py-3 font-semibold">With deposit</th>
                      <th className="px-4 py-3 font-semibold">
                        No-deposit rental
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 bg-white text-slate-700">
                    {[
                      [
                        "Upfront payment",
                        "Rental price plus refundable security deposit",
                        "Rental price without a separate deposit block",
                      ],
                      [
                        "Fine handling",
                        "Fines may be deducted from the deposit",
                        "Fines are billed separately if they appear later",
                      ],
                      [
                        "Cash flow",
                        "Money or card limit may be held after return",
                        "Lower amount needed at pickup or delivery",
                      ],
                      [
                        "Damage excess",
                        "May be deducted depending on the rental terms",
                        "Still payable if damage falls under renter responsibility",
                      ],
                      [
                        "Best fit",
                        "Renters comfortable with a temporary hold",
                        "Tourists, residents, and monthly renters who want simpler upfront cost",
                      ],
                    ].map((row) => (
                      <tr key={row[0]}>
                        {row.map((cell) => (
                          <td key={cell} className="px-4 py-3 align-top leading-6">
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Section>

            <Section title="Documents needed for UAE residents">
              <ul className="list-disc space-y-2 pl-5">
                <li>Valid Emirates ID.</li>
                <li>Valid UAE driving license.</li>
                <li>Mobile number for booking updates and WhatsApp support.</li>
                <li>Accepted payment method for the rental amount.</li>
              </ul>
            </Section>

            <Section title="Documents needed for tourists">
              <ul className="list-disc space-y-2 pl-5">
                <li>Passport copy.</li>
                <li>Visit visa or UAE entry stamp.</li>
                <li>Home country driving license.</li>
                <li>
                  International Driving Permit if required for your license
                  country.
                </li>
              </ul>
            </Section>

            <Section title="Insurance, excess, CDW and SCDW explained clearly">
              <p>
                Basic insurance usually covers the vehicle under standard UAE
                rental conditions, but it often comes with an excess. The excess
                is the amount the renter may have to pay if the car is damaged
                and the insurance claim is accepted.
              </p>
              <p>
                CDW means Collision Damage Waiver. It can reduce your financial
                exposure for covered collision damage. SCDW, or Super Collision
                Damage Waiver, may reduce it further. These waivers still have
                rules, so check police-report requirements, unauthorised-driver
                exclusions, tyre or underbody exclusions, off-road use, and
                negligence clauses before you book.
              </p>
            </Section>

            <Section title="Salik, parking, fines and hidden fees explained">
              <p>
                Salik is Dubai&apos;s toll system. If your route passes through
                a Dubai toll gate, the charge is usually added separately unless
                your agreement says it is included. Parking is also separate in
                many areas and depends on the emirate, zone, timing, and payment
                method.
              </p>
              <p>
                Traffic fines can appear after the car is returned. Before
                booking, ask how later fines are handled and whether there are
                admin fees, late-return charges, mileage limits, delivery fees,
                cleaning fees, fuel refill charges, or insurance upgrade costs.
                Clear rental pricing should make these items easy to understand.
              </p>
            </Section>

            <Section title="Best use cases: daily, weekly, monthly rental">
              <p>
                Daily no-deposit rental is useful when your own car is
                unavailable, guests are visiting, or you need short-term
                transport between Sharjah, Ajman, Dubai, and UAQ. Weekly rental
                works well for temporary work, family visits, and short projects.
              </p>
              <p>
                Monthly rental is often the better fit for longer stays, new UAE
                residents, and people who need regular transport without buying a
                car. Compare the monthly price, mileage, insurance, service
                support, and replacement-car policy rather than only the
                headline rate.
              </p>
            </Section>

            <Section title="Why AMJDrive is different">
              <p>
                AMJDrive focuses on clear pricing, no hidden charges, practical
                daily and monthly options, and fast WhatsApp support. The
                service area covers Sharjah, Ajman, Dubai, and Umm Al Quwain,
                which is useful when you live in one emirate and drive across
                another.
              </p>
              <p>
                You can start from the{" "}
                <Link href="/vehicle" className="font-semibold text-purple-700">
                  AMJDrive vehicle page
                </Link>{" "}
                to compare available cars. If a simple sedan fits, the{" "}
                <Link
                  href="/booking/nissan-sunny"
                  className="font-semibold text-purple-700"
                >
                  Nissan Sunny daily booking page
                </Link>{" "}
                and{" "}
                <Link
                  href="/booking/monthly/nissan-sunny"
                  className="font-semibold text-purple-700"
                >
                  Nissan Sunny monthly booking page
                </Link>{" "}
                are natural starting points.
              </p>
            </Section>

            <section id="faq" className="scroll-mt-28">
              <h2 className="text-3xl font-bold text-slate-950">FAQ</h2>
              <div className="mt-5 space-y-4">
                {faqs.map((faq) => (
                  <details
                    key={faq.question}
                    className="rounded-2xl border border-slate-200 bg-slate-50 p-5"
                  >
                    <summary className="cursor-pointer font-semibold text-slate-950">
                      {faq.question}
                    </summary>
                    <p className="mt-3 text-sm leading-7 text-slate-700">
                      {faq.answer}
                    </p>
                  </details>
                ))}
              </div>
            </section>
          </div>

          <aside className="lg:sticky lg:top-28 lg:self-start">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <h2 className="text-lg font-bold text-slate-950">
                AMJDrive contact
              </h2>
              <div className="mt-4 space-y-3 text-sm leading-6 text-slate-700">
                <p>Phone: {phoneDisplay}</p>
                <p>WhatsApp: {whatsAppDisplay}</p>
                <p>Address: {address}</p>
                <p>Service areas: Sharjah, Ajman, Dubai, UAQ.</p>
              </div>
              <Link
                href="/vehicle"
                className="mt-5 block rounded-xl bg-purple-700 px-4 py-3 text-center font-semibold text-white"
              >
                Browse cars
              </Link>
            </div>
          </aside>
        </div>
      </article>

      <Footer />
    </main>
  );
}
