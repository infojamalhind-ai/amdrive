import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { vehicleData } from "@/app/vehicleData";
import { getAbsoluteUrl } from "@/lib/site-url";

const pagePath = "/electric-bike-jbr-dubai-marina";
const pageTitle =
  "Electric Bikes in JBR & Dubai Marina | Careem Bike, Scooters & Car Rental";
const pageDescription =
  "Guide to using electric bikes, Careem Bike and e-scooters in JBR and Dubai Marina, with route ideas, parking tips and AMJ Drive car rental for longer Dubai trips.";
const whatsappUrl =
  "https://wa.me/971526959007?text=Hi, I am in JBR or Dubai Marina and want to ask about car rental for longer trips";

export const metadata: Metadata = {
  title: pageTitle,
  description: pageDescription,
  alternates: {
    canonical: "https://amjdrive.com/electric-bike-jbr-dubai-marina",
  },
  openGraph: {
    title: pageTitle,
    description: pageDescription,
    url: pagePath,
    type: "article",
  },
};

const gallery = [
  {
    title: "E-scooters for short hops",
    image: "/destinations/the-walk-jbr.jpg",
    alt: "Electric scooter rental for short trips around JBR and Dubai Marina",
    text: "Good for a quick JBR or Marina-side move when the weather is kind and your route is short.",
  },
  {
    title: "Bike stations and app rentals",
    image: "/destinations/dubai-marina-jbr.jpg",
    alt: "Dubai Marina area for Careem Bike and app-based short rides",
    text: "Use the Careem app map to find nearby bike stations and available docks before you start riding.",
  },
  {
    title: "Dubai Marina routes",
    image: "/destinations/dubai-marina-jbr.jpg",
    alt: "Dubai Marina waterfront route for cycling and scooter trips",
    text: "Marina is one of the easiest Dubai areas to enjoy slowly, especially around the waterfront.",
  },
  {
    title: "JBR beachside plans",
    image: "/destinations/jbr-beach.jpg",
    alt: "JBR Beach area for electric bike and scooter travel",
    text: "JBR works beautifully for a relaxed beach day, a coffee stop, or a sunset ride nearby.",
  },
];

const shortRoutes = [
  {
    title: "JBR to Dubai Marina",
    distance: "Around 2-3 km depending on your start point",
    text: "Perfect for a relaxed bike or scooter ride if you are staying near The Walk JBR and want to reach Marina Mall, cafes or towers around the waterfront.",
  },
  {
    title: "JBR to Bluewaters",
    distance: "Around 1.5-2.5 km",
    text: "A beautiful short trip for photos, dinner, Ain Dubai views and an easy evening plan. Check parking and allowed riding areas before you start.",
  },
  {
    title: "Dubai Marina to JLT",
    distance: "Often 2-4 km",
    text: "Useful for residents and visitors moving between Marina, JLT clusters, cafes, gyms and offices without taking a taxi for every small errand.",
  },
  {
    title: "JBR to Palm Jumeirah",
    distance: "Better by car for most people",
    text: "It looks close on the map, but heat, roads, bridges and timing make a rental car or taxi much more comfortable for most visitors.",
  },
];

const bookingSteps = [
  "Open the Careem app and choose the Bike service when available in your area.",
  "Use the map to find a nearby bike station around Dubai Marina, JBR or a connected area.",
  "Choose a pass that fits your plan, such as a short ride, day pass or longer membership.",
  "Scan or unlock through the app, ride carefully, then return the bike to an approved station.",
  "For e-scooters, use an RTA-approved operator app such as Dott, Lime, Skurrt or Arnab where service is available.",
];

const carChoices = [
  {
    slug: "nissan-sunny",
    text: "Budget-friendly for daily errands, hotel stays and longer city drives after a beach or Marina morning.",
  },
  {
    slug: "nissan-magnite",
    text: "Compact SUV comfort for couples and small families who want easier Dubai movement.",
  },
  {
    slug: "hyundai-creta",
    text: "A comfortable SUV when your plan includes Palm Jumeirah, Downtown Dubai or several stops.",
  },
  {
    slug: "mitsubishi-xpander",
    text: "A 7-seater for families, guests, luggage and full-day Dubai sightseeing.",
  },
];

const faqs = [
  {
    question: "Can I use electric bikes in JBR and Dubai Marina?",
    answer:
      "Yes, bike and scooter options are commonly used for short trips around Dubai Marina and nearby waterfront areas, but you should always follow Dubai's approved riding zones, signs and app instructions.",
  },
  {
    question: "How do I book a Careem Bike in Dubai Marina?",
    answer:
      "Open the Careem app, choose Bike, find a nearby station on the map, select your pass, unlock the bike and return it to an approved station when you finish.",
  },
  {
    question: "Which e-scooter apps work in Dubai?",
    answer:
      "RTA-approved e-scooter operators include apps such as Dott, Lime, Skurrt and Arnab, depending on the area and availability. Check the app map before planning your ride.",
  },
  {
    question: "How far can I travel by electric bike or scooter around JBR?",
    answer:
      "They are best for short local trips, usually a few kilometres around JBR, Dubai Marina, Bluewaters or JLT. For longer routes, luggage, family plans or hot weather, a rental car is usually more comfortable.",
  },
  {
    question: "Where should I park a bike or scooter?",
    answer:
      "Use approved docks, parking points or app-marked parking zones. Avoid blocking walkways, entrances, ramps, roads or beach access paths.",
  },
  {
    question: "When should I book a rental car instead?",
    answer:
      "Book a car when your route includes Palm Jumeirah, Downtown Dubai, malls, airports, family travel, luggage, multiple stops or long distances outside the Marina and JBR area.",
  },
];

const imageCredits = [
  {
    label: "Dubai Marina / JBR",
    author: "Fabio Achilli",
    href: "https://commons.wikimedia.org/wiki/File:The_Walk_at_JBR,_Dubai_Marina,_Dubai_(9710295611).jpg",
    license: "CC BY 2.0",
  },
  {
    label: "JBR Beach",
    author: "Saaremees",
    href: "https://commons.wikimedia.org/wiki/File:JBR_Beach-Dubai_UAE-Andres_Larin.jpg",
    license: "CC BY-SA 4.0",
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
          <Link href="/rent-car-jbr-dubai" className="font-semibold text-slate-800">
            JBR Car Rental
          </Link>
          <Link href="/vehicle" className="font-semibold text-slate-800">
            View Cars
          </Link>
          <a href={whatsappUrl} className="font-semibold text-green-700">
            WhatsApp Booking
          </a>
        </div>
      </div>
    </footer>
  );
}

export default function ElectricBikeJbrDubaiMarinaPage() {
  const pageUrl = getAbsoluteUrl(pagePath);
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: pageTitle,
    description: pageDescription,
    url: pageUrl,
    author: {
      "@type": "Organization",
      name: "AMJ Drive",
    },
    publisher: {
      "@type": "Organization",
      name: "AMJ Drive",
    },
    mainEntityOfPage: pageUrl,
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
    <main className="min-h-screen bg-white text-slate-950">
      <PageHeader />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <section className="bg-emerald-950 px-4 py-14 text-white md:px-8 md:py-20">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1fr_0.9fr] lg:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-emerald-200">
              JBR & Dubai Marina Travel Guide
            </p>
            <h1 className="mt-5 max-w-4xl text-4xl font-bold leading-tight md:text-6xl">
              Electric Bikes in JBR and Dubai Marina: Ride Small, Explore Big
            </h1>
            <p className="mt-6 max-w-3xl text-base leading-8 text-emerald-50 md:text-lg">
              There is a special kind of Dubai morning when the Marina water is
              calm, JBR is waking up, and the best plan is not to rush. An
              electric bike, Careem Bike or e-scooter can turn a simple trip
              from your hotel to coffee, beach, Bluewaters or Marina Mall into a
              small adventure. You move slowly enough to notice the city, but
              fast enough to feel free.
            </p>
            <p className="mt-4 max-w-3xl leading-8 text-emerald-100">
              This guide explains how to book, where it works best, what kind
              of distance makes sense, and when a rental car from AMJ Drive is
              the smarter choice for longer Dubai travel.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a
                href="#how-to-book"
                className="rounded-xl bg-white px-6 py-4 text-center font-semibold text-emerald-950"
              >
                How To Book
              </a>
              <Link
                href="/rent-car-jbr-dubai"
                className="rounded-xl border border-white/30 px-6 py-4 text-center font-semibold text-white"
              >
                JBR Car Rental
              </Link>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-4">
            <div className="relative aspect-[4/3] overflow-hidden rounded-xl">
              <Image
                src="/destinations/dubai-marina-jbr.jpg"
                alt="Dubai Marina waterfront for electric bike and scooter travel"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 42vw"
                className="object-cover"
              />
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl bg-white/10 p-4">
                <p className="font-semibold">Best For</p>
                <p className="mt-2 text-sm leading-6 text-emerald-50">
                  Short waterfront rides, coffee stops, beach plans and Marina
                  errands.
                </p>
              </div>
              <div className="rounded-xl bg-white/10 p-4">
                <p className="font-semibold">Book A Car When</p>
                <p className="mt-2 text-sm leading-6 text-emerald-50">
                  You have luggage, family, heat, long distance or multiple
                  Dubai stops.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 py-12 md:px-8">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-3xl font-bold">
            What you will see around JBR and Marina
          </h2>
          <p className="mt-4 max-w-3xl leading-8 text-slate-700">
            Search images for electric bikes in JBR or Dubai Marina and the
            story is clear: small wheels, waterfront views, rental stations,
            docked bikes, e-scooters and people moving between towers, hotels,
            cafes and the beach. These rides are not only transport. They are a
            way to make a normal Dubai afternoon feel lighter.
          </p>
          <div className="mt-7 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {gallery.map((item) => (
              <article
                key={item.title}
                className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
              >
                <div className="relative aspect-[4/3] bg-slate-100">
                  <Image
                    src={item.image}
                    alt={item.alt}
                    fill
                    sizes="(max-width: 768px) 100vw, 25vw"
                    className="object-cover"
                  />
                </div>
                <div className="p-5">
                  <h3 className="text-xl font-bold">{item.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-slate-700">
                    {item.text}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="how-to-book" className="bg-slate-50 px-4 py-12 md:px-8">
        <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-3xl font-bold">
              How to book Careem Bike or an e-scooter
            </h2>
            <p className="mt-4 leading-8 text-slate-700">
              For Careem Bike, the normal starting point is the Careem app. Open
              the app, choose Bike, check the map, pick a nearby station, unlock
              the bike and return it to an approved station. It works best when
              your start and end points are both close to docks.
            </p>
            <p className="mt-4 leading-8 text-slate-700">
              For e-scooters, Dubai uses approved operator apps. The public RTA
              guidance lists operators such as Dott, Lime, Skurrt and Arnab, and
              e-scooters must be used only in permitted areas and routes. Before
              you ride, check the app map, read the parking instructions and
              follow posted signs in the area.
            </p>
          </article>

          <div className="grid gap-3">
            {bookingSteps.map((step, index) => (
              <div
                key={step}
                className="rounded-xl border border-slate-200 bg-white p-4 leading-7 text-slate-700 shadow-sm"
              >
                <span className="mr-3 inline-flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 font-bold text-emerald-800">
                  {index + 1}
                </span>
                {step}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-12 md:px-8">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold">
            Distances that feel fun, and distances that feel like work
          </h2>
          <p className="mt-4 max-w-3xl leading-8 text-slate-700">
            Electric bikes and scooters are brilliant when the trip is short,
            scenic and simple. They are less charming when you are tired, the
            sun is sharp, you are carrying bags, or your destination is across
            bigger roads. Keep the ride playful. Let cars handle the heavy
            travel.
          </p>
          <div className="mt-7 grid gap-5 md:grid-cols-2">
            {shortRoutes.map((route) => (
              <article
                key={route.title}
                className="rounded-2xl border border-slate-200 p-6"
              >
                <h3 className="text-2xl font-bold">{route.title}</h3>
                <p className="mt-2 font-semibold text-emerald-700">
                  {route.distance}
                </p>
                <p className="mt-4 leading-8 text-slate-700">{route.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-slate-50 px-4 py-12 md:px-8">
        <div className="mx-auto grid max-w-6xl gap-7 lg:grid-cols-[1fr_0.9fr]">
          <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-3xl font-bold">
              Riding rules that keep the day easy
            </h2>
            <div className="mt-4 space-y-4 leading-8 text-slate-700">
              <p>
                Use the lane, track or permitted path shown by the app and local
                signs. Do not ride through crowded pedestrian spaces just
                because the view is nice. Slow down near families, crossings,
                hotel entrances and beach access points.
              </p>
              <p>
                Parking matters too. A scooter left badly can block a wheelchair
                ramp, building entrance or walkway. Use approved docks, painted
                areas or parking zones in the app. Good riding is not only about
                where you go; it is also about leaving the city easy for the
                next person.
              </p>
            </div>
          </article>

          <aside className="rounded-2xl border border-emerald-200 bg-white p-6 shadow-sm">
            <h2 className="text-3xl font-bold">
              When AMJ Drive makes more sense
            </h2>
            <p className="mt-4 leading-8 text-slate-700">
              Book a car when your day moves beyond the waterfront: Palm
              Jumeirah, Downtown Dubai, Dubai Mall, airports, family visits,
              luggage, business meetings or late-night returns. A bike makes a
              short ride memorable. A rental car makes a full Dubai day
              realistic.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/vehicle"
                className="rounded-xl bg-slate-950 px-5 py-3 text-center font-semibold text-white"
              >
                View Cars
              </Link>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-xl bg-green-500 px-5 py-3 text-center font-semibold text-white"
              >
                WhatsApp Booking
              </a>
            </div>
          </aside>
        </div>
      </section>

      <section className="px-4 py-12 md:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-emerald-700">
                Longer Trips
              </p>
              <h2 className="mt-2 text-3xl font-bold">
                AMJ Drive cars for distance, comfort and family plans
              </h2>
            </div>
            <Link href="/rent-car-jbr-dubai" className="font-semibold text-emerald-700">
              JBR delivery guide
            </Link>
          </div>

          <div className="mt-7 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {carChoices.map((choice) => {
              const vehicle = getVehicle(choice.slug);

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
                      alt={`${vehicle.name} rental car for longer Dubai trips from JBR and Marina`}
                      fill
                      sizes="(max-width: 1024px) 100vw, 25vw"
                      className="object-contain p-6"
                    />
                  </div>
                  <div className="p-5">
                    <h3 className="text-xl font-bold">{vehicle.name}</h3>
                    <p className="mt-3 text-sm leading-7 text-slate-700">
                      {choice.text}
                    </p>
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

      <section className="bg-slate-50 px-4 py-12 md:px-8">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-3xl font-bold">
            Electric bike and car rental FAQs
          </h2>
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
        <div className="mx-auto max-w-6xl rounded-2xl bg-emerald-950 p-6 text-white md:p-8">
          <h2 className="text-3xl font-bold">
            Enjoy the small ride. Book the car for the big day.
          </h2>
          <p className="mt-4 max-w-3xl leading-8 text-emerald-50">
            Use an electric bike or scooter when JBR and Dubai Marina are your
            playground. When the plan becomes bigger, AMJ Drive can help with
            fast car delivery, no-deposit options on supported cars, and daily,
            weekly or monthly rental plans.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/vehicle"
              className="rounded-xl bg-white px-6 py-4 text-center font-semibold text-emerald-950"
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
        <div className="mx-auto max-w-6xl space-y-3 text-xs leading-6 text-slate-500">
          <div>
            <p className="font-semibold text-slate-700">Helpful official links</p>
            <p className="mt-1">
              Check the latest{" "}
              <a
                href="https://www.rta.ae/wps/portal/rta/ae/home/promotion/rta-escooters"
                target="_blank"
                rel="noopener noreferrer"
                className="underline"
              >
                RTA e-scooter guidance
              </a>{" "}
              and{" "}
              <a
                href="https://www.careem.com/en-ae/careem-bike/"
                target="_blank"
                rel="noopener noreferrer"
                className="underline"
              >
                Careem Bike information
              </a>{" "}
              before planning around app availability.
            </p>
          </div>
          <div>
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
        </div>
      </section>

      <PageFooter />
    </main>
  );
}
