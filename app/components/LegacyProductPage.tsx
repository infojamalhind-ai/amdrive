import Image from "next/image";
import Link from "next/link";
import type { Car } from "@/app/components/Vehicle";
import Footer from "@/app/components/Footer";
import Header from "@/app/components/Header";
import type { LegacyFaq, LegacyProductSlug } from "@/lib/legacy-seo";
import {
  findSeoCar,
  getFaqSchema,
  getRelatedCars,
  legacyProductConfigs,
} from "@/lib/legacy-seo";
import { getAbsoluteUrl } from "@/lib/site-url";

const PHONE_NUMBER = "+971582211457";
const WHATSAPP_URL =
  "https://wa.me/971582211457?text=Hi, I want to book a car with AMJDrive";

function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

function FaqList({ faqs }: { faqs: LegacyFaq[] }) {
  return (
    <div className="space-y-4">
      {faqs.map((faq) => (
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
  );
}

function VehicleCard({ car }: { car: Car }) {
  return (
    <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="relative aspect-[4/3] bg-slate-100">
        <Image
          src={car.image}
          alt={car.name}
          fill
          sizes="(max-width: 1024px) 100vw, 30vw"
          className="object-contain p-6"
        />
      </div>
      <div className="p-5">
        <p className="text-sm font-semibold text-red-600">{car.category}</p>
        <h3 className="mt-1 text-xl font-bold text-slate-950">{car.name}</h3>
        <div className="mt-4 grid grid-cols-3 gap-2 text-center text-sm text-slate-600">
          <div className="rounded-xl bg-slate-50 px-2 py-2">{car.seats} seats</div>
          <div className="rounded-xl bg-slate-50 px-2 py-2">AED {car.daily_price}/day</div>
          <div className="rounded-xl bg-slate-50 px-2 py-2">AED {car.monthly_price}/mo</div>
        </div>
        <div className="mt-5 grid gap-3">
          <Link
            href={`/booking/${car.slug}`}
            className="rounded-xl bg-red-600 px-4 py-3 text-center font-semibold text-white transition hover:bg-red-700"
          >
            Book Now
          </Link>
          <Link
            href={`/booking/monthly/${car.slug}`}
            className="rounded-xl border border-slate-300 px-4 py-3 text-center font-semibold text-slate-800 transition hover:border-red-600 hover:text-red-600"
          >
            Monthly Rental
          </Link>
        </div>
      </div>
    </article>
  );
}

export default function LegacyProductPage({
  slug,
  cars,
}: {
  slug: LegacyProductSlug;
  cars: Car[];
}) {
  const config = legacyProductConfigs[slug];
  const currentCar = config.currentSlug ? findSeoCar(cars, config.currentSlug) : undefined;
  const relatedCars = getRelatedCars(cars, config.relatedSlugs);
  const bookHref = currentCar ? `/booking/${currentCar.slug}` : "/vehicle";
  const monthlyHref = currentCar ? `/booking/monthly/${currentCar.slug}` : "/monthly-car-rental-sharjah";
  const priceCar = currentCar ?? relatedCars[0];
  const pagePath = `/product/${slug}`;

  const productSchema = {
    "@context": "https://schema.org",
    "@type": config.unavailable ? "WebPage" : "Product",
    name: config.name,
    url: getAbsoluteUrl(pagePath),
    image: getAbsoluteUrl(config.image),
    description: config.description,
    brand: {
      "@type": "Brand",
      name: config.name.split(" ")[0],
    },
    offers:
      !config.unavailable && priceCar
        ? {
            "@type": "Offer",
            url: getAbsoluteUrl(bookHref),
            priceCurrency: "AED",
            price: priceCar.daily_price,
            availability: "https://schema.org/InStock",
          }
        : undefined,
  };

  return (
    <main className="min-h-screen bg-white text-slate-950">
      <Header />
      <JsonLd data={productSchema} />
      <JsonLd data={getFaqSchema(config.faqs)} />

      <section className="bg-slate-50 px-4 py-10 md:px-8 md:py-14">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1fr_440px] lg:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-red-600">
              AMJDrive legacy rental page
            </p>
            <h1 className="mt-3 max-w-4xl text-4xl font-bold leading-tight text-slate-950 sm:text-5xl">
              {config.name} rental
            </h1>
            {config.unavailable ? (
              <div className="mt-5 inline-flex rounded-full bg-amber-100 px-4 py-2 text-sm font-semibold text-amber-800">
                Currently unavailable - similar SUVs are available
              </div>
            ) : null}
            <p className="mt-5 max-w-3xl text-base leading-8 text-slate-700 sm:text-lg">
              {config.intro}
            </p>
            <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-600 sm:text-base">
              Built for searchers comparing {config.keyword}, rent a car Sharjah,
              no deposit car rental, and monthly car rental options.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href={bookHref}
                className="rounded-xl bg-red-600 px-6 py-4 text-center font-semibold text-white shadow-sm transition hover:bg-red-700"
              >
                Book Now
              </Link>
              <Link
                href={monthlyHref}
                className="rounded-xl border border-slate-300 px-6 py-4 text-center font-semibold text-slate-800 transition hover:border-red-600 hover:text-red-600"
              >
                Monthly Rental
              </Link>
              <Link
                href="/vehicle"
                className="rounded-xl border border-slate-300 px-6 py-4 text-center font-semibold text-slate-800 transition hover:border-red-600 hover:text-red-600"
              >
                Browse Fleet
              </Link>
            </div>
          </div>

          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="relative aspect-[4/3] bg-slate-100">
              <Image
                src={config.image}
                alt={config.imageAlt}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 440px"
                className="object-contain p-6"
              />
            </div>
            <div className="grid grid-cols-3 gap-2 p-4 text-center text-sm">
              <div className="rounded-xl bg-slate-50 px-3 py-3">
                <p className="text-slate-500">Daily</p>
                <p className="font-bold text-slate-950">
                  {priceCar ? `AED ${priceCar.daily_price}` : "Ask"}
                </p>
              </div>
              <div className="rounded-xl bg-slate-50 px-3 py-3">
                <p className="text-slate-500">Weekly</p>
                <p className="font-bold text-slate-950">
                  {priceCar ? `AED ${priceCar.weekly_price}` : "Ask"}
                </p>
              </div>
              <div className="rounded-xl bg-slate-50 px-3 py-3">
                <p className="text-slate-500">Monthly</p>
                <p className="font-bold text-slate-950">
                  {priceCar ? `AED ${priceCar.monthly_price}` : "Ask"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 py-12 md:px-8">
        <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-2">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-red-600">
              Why renters choose it
            </p>
            <h2 className="mt-2 text-3xl font-bold text-slate-950">
              Benefits and features
            </h2>
            <div className="mt-6 grid gap-3">
              {config.highlights.map((item) => (
                <div
                  key={item}
                  className="rounded-2xl border border-slate-200 bg-slate-50 p-5 text-sm leading-7 text-slate-700 sm:text-base"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-red-600">
              Best uses
            </p>
            <h2 className="mt-2 text-3xl font-bold text-slate-950">
              When this rental makes sense
            </h2>
            <div className="mt-6 grid gap-3">
              {config.useCases.map((item) => (
                <div
                  key={item}
                  className="rounded-2xl border border-slate-200 bg-white p-5 text-sm leading-7 text-slate-700 shadow-sm sm:text-base"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-slate-50 px-4 py-12 md:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-red-600">
                Related vehicles
              </p>
              <h2 className="mt-2 text-3xl font-bold text-slate-950">
                Similar AMJDrive cars to compare
              </h2>
            </div>
            <Link href="/vehicle" className="font-semibold text-red-600 hover:text-red-700">
              View all vehicles
            </Link>
          </div>

          <div className="mt-8 grid gap-6 lg:grid-cols-3">
            {relatedCars.map((car) => (
              <VehicleCard key={car.slug} car={car} />
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
            {config.name} rental FAQs
          </h2>
          <div className="mt-8">
            <FaqList faqs={config.faqs} />
          </div>
        </div>
      </section>

      <section className="bg-slate-950 px-4 py-12 text-white md:px-8">
        <div className="mx-auto grid max-w-6xl gap-6 md:grid-cols-[1fr_auto] md:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-red-300">
              Ready to continue
            </p>
            <h2 className="mt-2 text-3xl font-bold">Book through the current AMJDrive flow</h2>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
              This SEO page preserves the old URL, but booking still happens through
              AMJDrive live vehicle, monthly rental, and checkout pages. Call or
              WhatsApp {PHONE_NUMBER} if you want help before booking.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <Link
              href={bookHref}
              className="rounded-xl bg-white px-6 py-4 text-center font-semibold text-slate-950"
            >
              Book Now
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

      <Footer />
    </main>
  );
}
