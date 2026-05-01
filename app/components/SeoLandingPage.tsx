import Image from "next/image";
import Link from "next/link";
import type { Car } from "@/app/components/Vehicle";
import Footer from "@/app/components/Footer";
import Header from "@/app/components/Header";
import { getAbsoluteUrl } from "@/lib/site-url";

type LandingFaq = {
  question: string;
  answer: string;
};

type LandingHighlight = {
  title: string;
  description: string;
};

type LandingSection = {
  title: string;
  description: string;
};

type LandingVehicle = {
  car: Car;
  dailyHref: string;
  monthlyHref: string;
  summary: string;
  tag: string;
};

type LandingLink = {
  href: string;
  label: string;
};

type SeoLandingPageProps = {
  path: string;
  eyebrow: string;
  title: string;
  description: string;
  intro: string;
  heroImage: {
    src: string;
    alt: string;
  };
  highlights: LandingHighlight[];
  sections: LandingSection[];
  featuredVehicles: LandingVehicle[];
  faqTitle: string;
  faqs: LandingFaq[];
  ctaTitle: string;
  ctaDescription: string;
  primaryCtaLabel?: string;
  whatsAppCtaLabel?: string;
  quickLinks?: LandingLink[];
};

const SERVICE_AREAS = ["Ajman", "Sharjah", "Dubai", "Umm Al Quwain"];
const PHONE_NUMBER = "+971582211457";
const WHATSAPP_URL =
  "https://wa.me/971526959007?text=Hi, I want to book a car with AMJDrive";

export default function SeoLandingPage({
  path,
  eyebrow,
  title,
  description,
  intro,
  heroImage,
  highlights,
  sections,
  featuredVehicles,
  faqTitle,
  faqs,
  ctaTitle,
  ctaDescription,
  primaryCtaLabel = "Book Now",
  whatsAppCtaLabel = "WhatsApp",
  quickLinks,
}: SeoLandingPageProps) {
  const pageUrl = getAbsoluteUrl(path);
  const schemaImage = getAbsoluteUrl(heroImage.src);
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CarRental",
    name: "AMJDrive",
    url: pageUrl,
    image: schemaImage,
    description,
    telephone: PHONE_NUMBER,
    areaServed: SERVICE_AREAS,
    brand: {
      "@type": "Brand",
      name: "AMJDrive",
    },
    makesOffer: featuredVehicles.map((vehicle) => ({
      "@type": "Offer",
      itemOffered: {
        "@type": "Car",
        name: vehicle.car.name,
        url: getAbsoluteUrl(vehicle.dailyHref),
        vehicleSeatingCapacity: vehicle.car.seats,
      },
    })),
  };

  const faqStructuredData = {
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

  return (
    <main className="min-h-screen bg-white text-slate-900">
      <Header />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqStructuredData) }}
      />

      <section className="bg-gradient-to-br from-slate-950 via-purple-950 to-fuchsia-900 px-4 py-12 text-white md:px-8 md:py-16">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div>
            <p className="inline-flex rounded-full bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-purple-100">
              {eyebrow}
            </p>
            <h1 className="mt-5 max-w-3xl text-4xl font-bold leading-tight sm:text-5xl">
              {title}
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-purple-50 sm:text-lg">
              {description}
            </p>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-purple-100 sm:text-base">
              {intro}
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/vehicle"
                className="rounded-2xl bg-white px-6 py-4 text-center font-semibold text-purple-800 shadow-lg transition hover:scale-[1.01]"
              >
                {primaryCtaLabel}
              </Link>
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-2xl bg-green-500 px-6 py-4 text-center font-semibold text-white shadow-lg transition hover:scale-[1.01] hover:bg-green-600"
              >
                {whatsAppCtaLabel}
              </a>
            </div>

            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              {highlights.map((highlight) => (
                <div
                  key={highlight.title}
                  className="rounded-3xl border border-white/15 bg-white/10 p-4 backdrop-blur"
                >
                  <p className="font-semibold">{highlight.title}</p>
                  <p className="mt-2 text-sm leading-6 text-purple-100">
                    {highlight.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative overflow-hidden rounded-[32px] border border-white/15 bg-white/10 p-4 shadow-2xl backdrop-blur">
            <div className="relative aspect-[4/3] overflow-hidden rounded-[24px] bg-white">
              <Image
                src={heroImage.src}
                alt={heroImage.alt}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 42vw"
                className="object-contain p-6"
              />
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl bg-white/10 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-purple-100">
                  Service Areas
                </p>
                <p className="mt-2 text-sm leading-6 text-white">
                  Ajman, Sharjah, Dubai and UAQ.
                </p>
              </div>
              <div className="rounded-2xl bg-white/10 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-purple-100">
                  Contact
                </p>
                <p className="mt-2 text-sm leading-6 text-white">
                  Call {PHONE_NUMBER} or WhatsApp +971526959007 for booking help.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white px-4 py-12 md:px-8">
        <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-3">
          {sections.map((section) => (
            <article
              key={section.title}
              className="rounded-[28px] border border-slate-200 bg-slate-50 p-6 shadow-sm"
            >
              <h2 className="text-2xl font-bold text-slate-900">
                {section.title}
              </h2>
              <p className="mt-4 text-sm leading-7 text-slate-600 sm:text-base">
                {section.description}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-slate-50 px-4 py-12 md:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-purple-700">
                Featured Cars
              </p>
              <h2 className="mt-2 text-3xl font-bold text-slate-900">
                Real AMJDrive vehicles you can book online
              </h2>
            </div>
            <Link
              href="/vehicle"
              className="font-semibold text-purple-700 transition hover:text-purple-800"
            >
              Browse all vehicles
            </Link>
          </div>

          <div className="mt-8 grid gap-6 lg:grid-cols-3">
            {featuredVehicles.map((vehicle) => (
              <article
                key={vehicle.car.slug}
                className="overflow-hidden rounded-[30px] border border-slate-200 bg-white shadow-sm"
              >
                <div className="relative aspect-[4/3] bg-slate-100">
                  <Image
                    src={vehicle.car.image}
                    alt={vehicle.car.name}
                    fill
                    sizes="(max-width: 1024px) 100vw, 30vw"
                    className="object-contain p-6"
                  />
                </div>
                <div className="p-6">
                  <p className="inline-flex rounded-full bg-purple-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-purple-700">
                    {vehicle.tag}
                  </p>
                  <h3 className="mt-4 text-2xl font-bold text-slate-900">
                    {vehicle.car.name}
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-slate-600">
                    {vehicle.summary}
                  </p>

                  <div className="mt-4 grid grid-cols-3 gap-2 text-sm text-slate-600">
                    <div className="rounded-2xl bg-slate-50 px-3 py-2 text-center">
                      {vehicle.car.seats} Seats
                    </div>
                    <div className="rounded-2xl bg-slate-50 px-3 py-2 text-center">
                      AED {vehicle.car.daily_price}/day
                    </div>
                    <div className="rounded-2xl bg-slate-50 px-3 py-2 text-center">
                      AED {vehicle.car.monthly_price}/month
                    </div>
                  </div>

                  <div className="mt-5 flex flex-col gap-3">
                    <Link
                      href={vehicle.dailyHref}
                      className="rounded-2xl bg-purple-700 px-4 py-3 text-center font-semibold text-white"
                    >
                      Book {vehicle.car.name}
                    </Link>
                    <Link
                      href={vehicle.monthlyHref}
                      className="rounded-2xl border border-purple-700 px-4 py-3 text-center font-semibold text-purple-700"
                    >
                      Monthly Booking
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white px-4 py-12 md:px-8">
        <div className="mx-auto max-w-5xl rounded-[32px] border border-slate-200 bg-slate-50 p-6 shadow-sm md:p-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-purple-700">
                Quick Links
              </p>
              <h2 className="mt-2 text-3xl font-bold text-slate-900">
                Start from the page that fits your booking
              </h2>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              {(quickLinks ?? [
                { href: "/booking/nissan-sunny", label: "Nissan Sunny Daily" },
                {
                  href: "/booking/monthly/nissan-sunny",
                  label: "Nissan Sunny Monthly",
                },
              ]).map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="rounded-2xl bg-white px-5 py-3 text-center font-semibold text-purple-700 shadow-sm ring-1 ring-slate-200"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white px-4 py-12 md:px-8">
        <div className="mx-auto max-w-5xl">
          <div className="mb-8">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-purple-700">
              FAQ
            </p>
            <h2 className="mt-2 text-3xl font-bold text-slate-900">
              {faqTitle}
            </h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq) => (
              <details
                key={faq.question}
                className="group rounded-2xl border border-slate-200 bg-slate-50 p-5"
              >
                <summary className="cursor-pointer list-none font-semibold text-slate-900">
                  <div className="flex items-center justify-between gap-4">
                    <span>{faq.question}</span>
                    <span className="text-xl text-purple-600 transition group-open:rotate-45">
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

      <section className="bg-gradient-to-r from-purple-700 to-indigo-700 px-4 py-12 text-white md:px-8">
        <div className="mx-auto max-w-6xl rounded-[32px] bg-white/10 p-8 backdrop-blur">
          <div className="grid gap-8 md:grid-cols-[1fr_auto] md:items-center">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-purple-100">
                Ready To Book
              </p>
              <h2 className="mt-2 text-3xl font-bold">{ctaTitle}</h2>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-purple-50 sm:text-base">
                {ctaDescription}
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                href="/vehicle"
                className="rounded-2xl bg-white px-6 py-4 text-center font-semibold text-purple-700 shadow-lg"
              >
                {primaryCtaLabel}
              </Link>
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-2xl bg-green-500 px-6 py-4 text-center font-semibold text-white shadow-lg"
              >
                {whatsAppCtaLabel}
              </a>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
