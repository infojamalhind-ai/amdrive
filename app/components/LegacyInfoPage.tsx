import Link from "next/link";
import type { Car } from "@/app/components/Vehicle";
import Footer from "@/app/components/Footer";
import Header from "@/app/components/Header";
import type { LegacyPageConfig } from "@/lib/legacy-seo";
import { findSeoCar, getFaqSchema, legacyProductSlugs } from "@/lib/legacy-seo";

const WHATSAPP_URL =
  "https://wa.me/971526959007?text=Hi, I want to book a car with AMJDrive";

function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

function MiniVehicle({ car }: { car: Car }) {
  const productSlug =
    car.slug === "mitsubishi-xpander" ? "mitsubishi-xpander-7-seater" : car.slug;
  const detailsHref = legacyProductSlugs.includes(
    productSlug as (typeof legacyProductSlugs)[number]
  )
    ? `/product/${productSlug}`
    : "/vehicle";

  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-sm font-semibold text-red-600">{car.category}</p>
      <h3 className="mt-1 text-xl font-bold text-slate-950">{car.name}</h3>
      <p className="mt-3 text-sm leading-6 text-slate-600">
        From AED {car.daily_price}/day or AED {car.monthly_price}/month.
      </p>
      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <Link
          href={`/booking/${car.slug}`}
          className="rounded-xl bg-red-600 px-4 py-3 text-center font-semibold text-white"
        >
          Book Now
        </Link>
        <Link
          href={detailsHref}
          className="rounded-xl border border-slate-300 px-4 py-3 text-center font-semibold text-slate-800"
        >
          Details
        </Link>
      </div>
    </article>
  );
}

export default function LegacyInfoPage({
  config,
  cars,
}: {
  config: LegacyPageConfig;
  cars: Car[];
}) {
  const featuredCars = config.featuredSlugs
    .map((slug) => findSeoCar(cars, slug))
    .filter((car): car is Car => Boolean(car));

  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "CarRental",
    name: "AMJDrive",
    url: "https://amjdrive.com",
    telephone: "+971582211457",
    areaServed: ["Sharjah", "Ajman", "Dubai", "Umm Al Quwain"],
    description: config.description,
  };

  return (
    <main className="min-h-screen bg-white text-slate-950">
      <Header />
      <JsonLd data={localBusinessSchema} />
      <JsonLd data={getFaqSchema(config.faqs)} />

      <section className="bg-slate-50 px-4 py-12 md:px-8 md:py-16">
        <div className="mx-auto max-w-7xl">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-red-600">
            {config.eyebrow}
          </p>
          <h1 className="mt-3 max-w-4xl text-4xl font-bold leading-tight text-slate-950 sm:text-5xl">
            {config.heading}
          </h1>
          <p className="mt-5 max-w-3xl text-base leading-8 text-slate-700 sm:text-lg">
            {config.intro}
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/vehicle"
              className="rounded-xl bg-red-600 px-6 py-4 text-center font-semibold text-white"
            >
              Browse Vehicles
            </Link>
            <Link
              href="/monthly-car-rental-sharjah"
              className="rounded-xl border border-slate-300 px-6 py-4 text-center font-semibold text-slate-800"
            >
              Monthly Rental
            </Link>
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-xl bg-green-500 px-6 py-4 text-center font-semibold text-white"
            >
              WhatsApp
            </a>
          </div>
        </div>
      </section>

      <section className="px-4 py-12 md:px-8">
        <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-3">
          {config.sections.map((section) => (
            <article
              key={section.title}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <h2 className="text-2xl font-bold text-slate-950">{section.title}</h2>
              <p className="mt-4 text-sm leading-7 text-slate-600 sm:text-base">
                {section.body}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-slate-50 px-4 py-12 md:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-red-600">
                Useful links
              </p>
              <h2 className="mt-2 text-3xl font-bold text-slate-950">
                Continue into live AMJDrive pages
              </h2>
            </div>
            <Link href="/vehicle" className="font-semibold text-red-600 hover:text-red-700">
              Full vehicle list
            </Link>
          </div>
          <div className="mt-8 grid gap-6 lg:grid-cols-3">
            {featuredCars.map((car) => (
              <MiniVehicle key={car.slug} car={car} />
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-12 md:px-8">
        <div className="mx-auto max-w-5xl">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-red-600">
            FAQ
          </p>
          <h2 className="mt-2 text-3xl font-bold text-slate-950">
            Common questions
          </h2>
          <div className="mt-8 space-y-4">
            {config.faqs.map((faq) => (
              <details
                key={faq.question}
                className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
              >
                <summary className="cursor-pointer list-none font-semibold text-slate-950">
                  <div className="flex items-center justify-between gap-4">
                    <span>{faq.question}</span>
                    <span className="text-xl text-red-600 transition group-open:rotate-45">
                      +
                    </span>
                  </div>
                </summary>
                <p className="mt-4 text-sm leading-7 text-slate-600 sm:text-base">
                  {faq.answer}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-slate-950 px-4 py-12 text-white md:px-8">
        <div className="mx-auto grid max-w-6xl gap-6 md:grid-cols-[1fr_auto] md:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-red-300">
              Book with AMJDrive
            </p>
            <h2 className="mt-2 text-3xl font-bold">Find the right rental car</h2>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
              Compare the fleet, open a current booking page, or contact AMJDrive
              for help with rent a car Sharjah, no deposit car rental, or monthly
              car rental questions.
            </p>
          </div>
          <Link
            href="/vehicle"
            className="rounded-xl bg-white px-6 py-4 text-center font-semibold text-slate-950"
          >
            Browse Vehicles
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  );
}
