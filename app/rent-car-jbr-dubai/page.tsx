import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { vehicleData } from "@/app/vehicleData";
import { getAbsoluteUrl } from "@/lib/site-url";

const pagePath = "/rent-car-jbr-dubai";
const pageTitle = "Rent a Car in JBR Dubai | No Deposit Car Rental & Delivery";
const pageDescription =
  "Rent a car in JBR Dubai with AMJ Drive. Daily, weekly and monthly car rental options with no-deposit choices and delivery to JBR, Dubai Marina, Bluewaters and nearby areas.";
const whatsappUrl =
  "https://wa.me/971526959007?text=Hi, I want to rent a car in JBR Dubai with AMJDrive";

export const metadata: Metadata = {
  title: pageTitle,
  description: pageDescription,
  alternates: {
    canonical: "https://amjdrive.com/rent-car-jbr-dubai",
  },
  openGraph: {
    title: pageTitle,
    description: pageDescription,
    url: pagePath,
    type: "website",
  },
};

const imageSections = [
  {
    title: "JBR Beach",
    alt: "Car rental near JBR Beach Dubai",
    image: "/destinations/jbr-beach.jpg",
    text: "Landing near JBR Beach and need a simple way to move around? A rental car gives you easy access to beach days, dinner plans, shopping runs and late-night returns without waiting for taxis during busy hours.",
  },
  {
    title: "The Walk JBR",
    alt: "Rent a car in JBR Dubai near The Walk",
    image: "/destinations/the-walk-jbr.jpg",
    text: "The Walk JBR is lively throughout the day, especially around cafes, hotels and residences. AMJ Drive can arrange fast delivery to your JBR hotel, apartment or residence so your booking starts close to where you are staying.",
  },
  {
    title: "Dubai Marina",
    alt: "Dubai Marina car rental delivery",
    image: "/destinations/dubai-marina-jbr.jpg",
    text: "Dubai Marina sits right beside JBR, which makes car rental useful for residents, tourists and families who want to move between Marina Mall, the tram area, towers, restaurants and nearby business districts.",
  },
  {
    title: "Bluewaters and Ain Dubai",
    alt: "Rent a car near Bluewaters Island and Ain Dubai",
    image: "/destinations/ain-dubai-bluewaters.jpg",
    text: "Bluewaters Island and Ain Dubai are a short drive from JBR. Renting a car helps when you want to visit Bluewaters, continue to Palm Jumeirah, or plan more than one Dubai stop in the same day.",
  },
];

const benefitItems = [
  "Fast delivery to JBR hotels, apartments, residences and nearby Dubai areas.",
  "Daily, weekly and monthly car rental plans for short visits or longer stays.",
  "No-deposit options available on supported cars, subject to booking terms.",
  "Practical economy, SUV and 7-seater choices for tourists and residents.",
];

const carOptions = [
  {
    slug: "nissan-sunny",
    summary:
      "A comfortable economy sedan for daily JBR drives, hotel stays, work commutes and budget-conscious monthly rental.",
  },
  {
    slug: "mitsubishi-attrage",
    summary:
      "A compact sedan that suits quick trips between JBR, Dubai Marina, JLT and nearby Dubai communities.",
  },
  {
    slug: "nissan-magnite",
    summary:
      "A compact SUV option for renters who want a higher seating position without moving into a large vehicle.",
  },
  {
    slug: "hyundai-creta",
    summary:
      "A practical SUV for couples, residents and small families staying around JBR, Marina or Palm Jumeirah.",
  },
  {
    slug: "mitsubishi-asx",
    summary:
      "A smooth SUV choice for weekly plans, sightseeing routes and regular Dubai driving from a JBR base.",
  },
  {
    slug: "mitsubishi-xpander",
    summary:
      "A 7-seater for families, visitors with luggage, group outings and monthly car rental in JBR.",
  },
];

const internalLinks = [
  { href: "/vehicle", label: "View Cars" },
  { href: "/fleet", label: "Fleet" },
  { href: "/booking/nissan-sunny", label: "Nissan Sunny" },
  { href: "/booking/nissan-magnite", label: "Nissan Magnite" },
  { href: "/booking/hyundai-creta", label: "Hyundai Creta" },
  { href: "/booking/mitsubishi-xpander", label: "Mitsubishi Xpander" },
];

const imageCredits = [
  {
    label: "JBR Beach",
    author: "Saaremees",
    href: "https://commons.wikimedia.org/wiki/File:JBR_Beach-Dubai_UAE-Andres_Larin.jpg",
    license: "CC BY-SA 4.0",
  },
  {
    label: "The Walk JBR",
    author: "Aidan-dubai2024",
    href: "https://commons.wikimedia.org/wiki/File:The_Walk,_JBR.jpg",
    license: "CC BY-SA 4.0",
  },
  {
    label: "Dubai Marina / JBR",
    author: "Fabio Achilli",
    href: "https://commons.wikimedia.org/wiki/File:The_Walk_at_JBR,_Dubai_Marina,_Dubai_(9710295611).jpg",
    license: "CC BY 2.0",
  },
  {
    label: "Ain Dubai",
    author: "Priti.saksena",
    href: "https://commons.wikimedia.org/wiki/File:Ain_Dubai.jpg",
    license: "CC BY-SA 4.0",
  },
];

const faqs = [
  {
    question: "Do you deliver rental cars to JBR Dubai?",
    answer:
      "Yes. AMJ Drive offers fast rental car delivery to JBR hotels, apartments, residences and nearby areas including Dubai Marina, Bluewaters, JLT and Palm Jumeirah.",
  },
  {
    question: "Can I rent a car in JBR without deposit?",
    answer:
      "Yes, no-deposit car rental options are available on supported vehicles. You can check the vehicle page or message AMJ Drive on WhatsApp to confirm the current no-deposit choice for your JBR booking.",
  },
  {
    question: "What cars are available for JBR delivery?",
    answer:
      "Popular choices include Nissan Sunny, Mitsubishi Attrage, Nissan Magnite, Hyundai Creta, Mitsubishi ASX and Mitsubishi Xpander 7-seater, depending on availability.",
  },
  {
    question: "Can tourists rent a car in JBR?",
    answer:
      "Yes. Tourists staying in JBR can rent a car when they have the required documents, such as passport, visit visa details and a valid driving license accepted for UAE rental.",
  },
  {
    question: "Do you offer monthly car rental in JBR?",
    answer:
      "Yes. AMJ Drive offers monthly car rental in JBR for residents, long-stay guests, remote workers and families who need a car for several weeks or more.",
  },
  {
    question: "Is JBR close to Dubai Marina and Bluewaters?",
    answer:
      "Yes. JBR is beside Dubai Marina and close to Bluewaters Island, Ain Dubai, JLT and Palm Jumeirah, which makes it a convenient base for renting a car in Dubai.",
  },
];

function getVehicle(slug: string) {
  return vehicleData.find((vehicle) => vehicle.slug === slug);
}

function PageHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex min-h-20 max-w-7xl items-center justify-between gap-4 px-4 md:px-8">
        <Link href="/" className="flex items-center gap-3">
          <div className="relative h-14 w-14 overflow-hidden rounded-full">
            <Image
              src="/amjdrive-logo-header.png"
              alt="AMJ Drive logo"
              fill
              priority
              sizes="56px"
              className="object-cover"
            />
          </div>
          <span className="font-bold text-slate-950">AMJ Drive</span>
        </Link>

        <div className="flex items-center gap-2">
          <Link
            href="/vehicle"
            className="hidden rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-800 sm:inline-flex"
          >
            View Cars
          </Link>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-xl bg-green-500 px-4 py-3 text-sm font-semibold text-white"
          >
            WhatsApp
          </a>
        </div>
      </div>
    </header>
  );
}

function PageFooter() {
  return (
    <footer className="border-t border-slate-200 bg-white px-4 py-8 md:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 text-sm text-slate-600 md:flex-row md:items-center md:justify-between">
        <p>(c) 2026 AMJ Drive. All rights reserved.</p>
        <div className="flex flex-wrap gap-4">
          <Link href="/vehicle" className="font-semibold text-slate-800">
            View Cars
          </Link>
          <Link href="/fleet" className="font-semibold text-slate-800">
            Fleet
          </Link>
          <a href={whatsappUrl} className="font-semibold text-green-700">
            WhatsApp Booking
          </a>
        </div>
      </div>
    </footer>
  );
}

export default function RentCarJbrDubaiPage() {
  const pageUrl = getAbsoluteUrl(pagePath);
  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Rent a Car in JBR Dubai",
    serviceType: "Car rental delivery in JBR Dubai",
    provider: {
      "@type": "LocalBusiness",
      name: "AMJ Drive",
      url: getAbsoluteUrl("/"),
      telephone: "+971582211457",
    },
    areaServed: [
      "JBR Dubai",
      "Dubai Marina",
      "Bluewaters Island",
      "JLT",
      "Palm Jumeirah",
    ],
    url: pageUrl,
    description: pageDescription,
    offers: carOptions.map((item) => {
      const vehicle = getVehicle(item.slug);

      return {
        "@type": "Offer",
        itemOffered: {
          "@type": "Car",
          name: vehicle?.name ?? item.slug,
          url: getAbsoluteUrl(`/booking/${item.slug}`),
        },
      };
    }),
  };

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

  return (
    <main className="min-h-screen bg-white text-slate-900">
      <PageHeader />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <section className="bg-slate-950 px-4 py-14 text-white md:px-8 md:py-20">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1fr_0.9fr] lg:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-cyan-200">
              JBR Dubai Car Rental
            </p>
            <h1 className="mt-5 max-w-4xl text-4xl font-bold leading-tight md:text-6xl">
              Rent a Car in JBR Dubai with Fast Delivery
            </h1>
            <p className="mt-6 max-w-3xl text-base leading-8 text-slate-200 md:text-lg">
              Looking to rent a car in JBR Dubai without wasting half your day
              arranging transport? AMJ Drive helps tourists, residents and
              long-stay guests book practical cars with delivery to JBR hotels,
              apartments, residences and nearby Dubai areas. Whether you are
              staying near JBR Beach, walking around The Walk JBR, heading to
              Dubai Marina or planning a day around Bluewaters Island and Ain
              Dubai, you can choose a car that fits your route and schedule.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/vehicle"
                className="rounded-xl bg-white px-6 py-4 text-center font-semibold text-slate-950"
              >
                View Cars
              </Link>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-xl bg-green-500 px-6 py-4 text-center font-semibold text-white"
              >
                WhatsApp Booking
              </a>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-4">
            <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-white">
              <Image
                src="/destinations/jbr-beach.jpg"
                alt="Car rental near JBR Beach Dubai"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 42vw"
                className="object-cover"
              />
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl bg-white/10 p-4">
                <p className="font-semibold">Delivery Areas</p>
                <p className="mt-2 text-sm leading-6 text-slate-200">
                  JBR, Dubai Marina, Bluewaters, JLT, Palm Jumeirah and nearby
                  Dubai locations.
                </p>
              </div>
              <div className="rounded-xl bg-white/10 p-4">
                <p className="font-semibold">Rental Plans</p>
                <p className="mt-2 text-sm leading-6 text-slate-200">
                  Daily, weekly and monthly options with no-deposit choices on
                  supported cars.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 py-12 md:px-8">
        <div className="mx-auto grid max-w-6xl gap-4 md:grid-cols-2 lg:grid-cols-4">
          {benefitItems.map((item) => (
            <div
              key={item}
              className="rounded-xl border border-slate-200 bg-slate-50 p-5 text-sm leading-7 text-slate-700"
            >
              {item}
            </div>
          ))}
        </div>
      </section>

      <section className="bg-slate-50 px-4 py-12 md:px-8">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold">
            Car rental in JBR for beach days, city plans and daily life
          </h2>
          <div className="mt-6 grid gap-7 lg:grid-cols-[1fr_0.9fr]">
            <div className="space-y-4 leading-8 text-slate-700">
              <p>
                JBR is one of Dubai&apos;s easiest places to enjoy without a car
                for a few hours, but it becomes a different story when your day
                includes luggage, shopping bags, children, meetings or more than
                one stop. A visitor may want to start near JBR Beach, have lunch
                around The Walk JBR, continue to Dubai Marina, then drive to
                Palm Jumeirah for the evening. A resident may need a reliable
                car for school runs, work trips, grocery runs, appointments or a
                monthly replacement while their own car is unavailable.
              </p>
              <p>
                AMJ Drive keeps the process simple for JBR Dubai customers:
                choose from economy cars, compact SUVs and family-friendly
                7-seaters, confirm your timing, and arrange delivery to the
                place that works for you. Daily rentals are useful for a quick
                Dubai stay or a busy weekend. Weekly rentals fit short business
                trips, visiting family and temporary transport needs. Monthly
                car rental in JBR is the sensible choice when you are staying
                longer and want predictable transport without depending on
                taxis every day.
              </p>
              <p>
                If you searched for rent a car JBR Dubai, car rental JBR, rent
                car Dubai Marina or no deposit car rental JBR, the main thing is
                convenience. You want the right car, clear pricing and a handover
                close to your building, hotel or residence. AMJ Drive can help
                with fast delivery around JBR, Dubai Marina, Bluewaters, JLT,
                Palm Jumeirah and nearby Dubai areas.
              </p>
            </div>
            <aside className="rounded-2xl border border-cyan-200 bg-white p-6 shadow-sm">
              <h3 className="text-2xl font-bold">
                No-deposit options for JBR bookings
              </h3>
              <p className="mt-4 leading-8 text-slate-700">
                Some renters prefer not to block a large refundable deposit,
                especially tourists on a short stay or residents managing
                monthly costs. AMJ Drive offers no-deposit options on supported
                cars, so you can ask what is available for your dates before
                confirming the booking.
              </p>
            </aside>
          </div>
        </div>
      </section>

      <section className="px-4 py-12 md:px-8">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold">
            Popular JBR places where a rental car helps
          </h2>
          <div className="mt-7 grid gap-5 md:grid-cols-2">
            {imageSections.map((item) => (
              <article
                key={item.title}
                className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
              >
                <div className="relative aspect-[16/10] bg-slate-100">
                  <Image
                    src={item.image}
                    alt={item.alt}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-2xl font-bold">{item.title}</h3>
                  <p className="mt-3 leading-7 text-slate-700">{item.text}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-slate-50 px-4 py-12 md:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-cyan-700">
                Car Options
              </p>
              <h2 className="mt-2 text-3xl font-bold">
                Cars available for JBR, Marina and nearby delivery
              </h2>
            </div>
            <Link href="/fleet" className="font-semibold text-cyan-700">
              Browse fleet
            </Link>
          </div>

          <div className="mt-7 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {carOptions.map((item) => {
              const vehicle = getVehicle(item.slug);

              if (!vehicle) {
                return null;
              }

              return (
                <article
                  key={vehicle.slug}
                  className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
                >
                  <div className="relative aspect-[4/3] bg-slate-100">
                    <Image
                      src={vehicle.image}
                      alt={`${vehicle.name} rental car for JBR Dubai delivery`}
                      fill
                      sizes="(max-width: 1024px) 100vw, 33vw"
                      className="object-contain p-6"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-2xl font-bold">{vehicle.name}</h3>
                    <p className="mt-3 text-sm leading-7 text-slate-700">
                      {item.summary}
                    </p>
                    <div className="mt-4 grid grid-cols-3 gap-2 text-center text-sm text-slate-700">
                      <span className="rounded-lg bg-slate-50 px-2 py-2">
                        AED {vehicle.dailyPrice}/day
                      </span>
                      <span className="rounded-lg bg-slate-50 px-2 py-2">
                        AED {vehicle.weeklyPrice}/week
                      </span>
                      <span className="rounded-lg bg-slate-50 px-2 py-2">
                        AED {vehicle.monthlyPrice}/month
                      </span>
                    </div>
                    <Link
                      href={`/booking/${vehicle.slug}`}
                      className="mt-5 block rounded-xl bg-slate-950 px-4 py-3 text-center font-semibold text-white"
                    >
                      Book {vehicle.name}
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="px-4 py-12 md:px-8">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold">
            Helpful pages for JBR car rental customers
          </h2>
          <div className="mt-6 flex flex-wrap gap-3">
            {internalLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-xl border border-slate-200 px-4 py-3 font-semibold text-slate-800 transition hover:border-cyan-500 hover:text-cyan-700"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-slate-50 px-4 py-12 md:px-8">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-3xl font-bold">JBR car rental FAQs</h2>
          <div className="mt-7 space-y-4">
            {faqs.map((faq) => (
              <details
                key={faq.question}
                className="rounded-2xl border border-slate-200 bg-white p-5"
              >
                <summary className="cursor-pointer list-none font-semibold">
                  {faq.question}
                </summary>
                <p className="mt-4 leading-7 text-slate-700">{faq.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-12 md:px-8">
        <div className="mx-auto max-w-6xl rounded-2xl bg-slate-950 p-6 text-white md:p-8">
          <h2 className="text-3xl font-bold">
            Book car rental delivery to JBR Dubai
          </h2>
          <p className="mt-4 max-w-3xl leading-8 text-slate-200">
            Tell AMJ Drive your JBR location, preferred car, rental dates and
            delivery time. You can book a daily car for a short visit, a weekly
            rental for a busy stay, or a monthly car rental in JBR if you need
            reliable transport for longer.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/vehicle"
              className="rounded-xl bg-white px-6 py-4 text-center font-semibold text-slate-950"
            >
              View Cars
            </Link>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-xl bg-green-500 px-6 py-4 text-center font-semibold text-white"
            >
              WhatsApp Booking
            </a>
          </div>
        </div>
      </section>

      <section className="px-4 pb-8 md:px-8">
        <div className="mx-auto max-w-6xl text-xs leading-6 text-slate-500">
          <p className="font-semibold text-slate-700">Image credits</p>
          <p className="mt-1">
            {imageCredits.map((credit, index) => (
              <span key={credit.href}>
                <a
                  href={credit.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline"
                >
                  {credit.label}
                </a>{" "}
                by {credit.author}, {credit.license}
                {index < imageCredits.length - 1 ? "; " : "."}
              </span>
            ))}
          </p>
        </div>
      </section>

      <PageFooter />
    </main>
  );
}
