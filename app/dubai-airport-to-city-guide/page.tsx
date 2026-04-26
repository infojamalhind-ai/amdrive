import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import { getAbsoluteUrl } from "@/lib/site-url";

const pagePath = "/dubai-airport-to-city-guide";
const pageTitle =
  "Dubai Airport (DXB) to City Guide: Metro, Bus, Taxi, JVC & Car Rental Tips";
const pageDescription =
  "Arriving at Dubai Airport? Learn how to reach Dubai city, JVC, Marina, Downtown, Sharjah and Ajman by metro, taxi, bus, ride apps or pre-booked car rental.";

export const metadata: Metadata = {
  title: "Dubai Airport to City Guide: Metro, Taxi, Bus, JVC & Car Rental",
  description: pageDescription,
  alternates: {
    canonical: pagePath,
  },
  openGraph: {
    title: "Dubai Airport to City Guide: Metro, Taxi, Bus, JVC & Car Rental",
    description: pageDescription,
    url: pagePath,
    type: "article",
  },
};

const quickAnswers = [
  ["Cheapest", "Metro or bus"],
  ["Easiest with luggage", "Taxi or ride app"],
  ["Best for families", "Pre-booked car rental or taxi"],
  ["Best for JVC", "Taxi direct, or metro + taxi"],
  ["Best if visiting Sharjah/Ajman also", "Rent a car"],
];

const areaRows = [
  {
    area: "Deira",
    advice: "Very close to DXB. Taxi is quick, and metro can be easy if your hotel is near a station.",
  },
  {
    area: "Downtown Dubai / Burj Khalifa",
    advice: "Metro works well for light luggage. Taxi is simpler if you are tired after the flight.",
  },
  {
    area: "Dubai Marina / JBR",
    advice: "Metro is possible but longer. Taxi or ride app is easier when you have bags.",
  },
  {
    area: "JVC",
    advice: "Taxi is the simplest. Metro plus taxi can save money, but JVC is not directly on the metro.",
  },
  {
    area: "Sharjah",
    advice: "Taxi or rental car is practical. Public transport is possible, but less comfortable with luggage.",
  },
  {
    area: "Ajman",
    advice: "Rental car or taxi is usually easier, especially if you will move around after arrival.",
  },
];

const mistakes = [
  "Not checking metro timing before landing late at night.",
  "Carrying too much luggage on the metro.",
  "Forgetting that metro and bus trips need a Nol card.",
  "Leaving car rental booking until the last minute.",
  "Forgetting Salik and other toll charges when driving.",
  "Not checking parking rules near hotels, apartments, and malls.",
  "Assuming JVC has a direct metro station.",
  "Not confirming documents needed for car rental.",
];

const faqs = [
  {
    question: "Is there metro from Dubai Airport to the city?",
    answer:
      "Yes. Dubai Metro Red Line connects DXB Terminal 1 and Terminal 3 with many parts of Dubai city. It is usually a good option if you have light luggage and your destination is near a metro station.",
  },
  {
    question: "Which DXB terminals have metro access?",
    answer:
      "Dubai Metro access is available from Terminal 1 and Terminal 3 on the Red Line. If you arrive at another terminal, check the airport transfer options before planning your trip.",
  },
  {
    question: "How do I get from Dubai Airport to JVC?",
    answer:
      "JVC is not directly on the metro. The simple choice is a taxi or ride app from DXB. A budget option is metro towards the city, then taxi from a convenient area.",
  },
  {
    question: "Is taxi available at Dubai Airport at night?",
    answer:
      "Yes. Dubai Taxi is available 24/7 from the official taxi ranks at DXB terminals.",
  },
  {
    question: "Is it cheaper to book a rental car before arriving?",
    answer:
      "Often it helps because you can compare prices calmly, choose the right car, and avoid last-minute airport stress. It also gives the rental company time to confirm documents and delivery timing.",
  },
  {
    question: "Can tourists rent a car in Dubai?",
    answer:
      "Yes, tourists can rent a car in Dubai if they have the right documents. Usually this means passport, visit visa or entry stamp, driving license, and an International Driving Permit depending on nationality.",
  },
  {
    question: "Do I need a Nol card from Dubai Airport?",
    answer:
      "You need a Nol card for Dubai Metro and RTA bus trips. It is useful to arrange this before entering the metro or bus system.",
  },
  {
    question: "Is JVC close to Dubai Airport?",
    answer:
      "JVC is not next to DXB. Travel time depends on traffic, and evening peak can make the drive longer. Taxi or rental car is usually the practical choice.",
  },
];

export default function DubaiAirportToCityGuidePage() {
  const pageUrl = getAbsoluteUrl(pagePath);
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: pageTitle,
    description: pageDescription,
    url: pageUrl,
    author: {
      "@type": "Organization",
      name: "AMJDrive",
    },
    publisher: {
      "@type": "Organization",
      name: "AMJDrive",
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
    <main className="min-h-screen bg-white text-slate-900">
      <Header />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <section className="border-b border-slate-200 bg-slate-950 px-4 py-14 text-white md:px-8 md:py-20">
        <div className="mx-auto max-w-6xl">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-purple-200">
            Dubai Airport Transport Guide
          </p>
          <h1 className="mt-5 max-w-4xl text-4xl font-bold leading-tight md:text-6xl">
            Dubai Airport (DXB) to City: Metro, Bus, Taxi & Car Rental Guide
          </h1>
          <p className="mt-6 max-w-3xl text-base leading-8 text-slate-200 md:text-lg">
            Arriving at Dubai International Airport can feel busy the first time,
            especially after a long flight. This guide explains the practical
            ways to reach Dubai city, JVC, Marina, Downtown, Deira, Sharjah and
            nearby areas without confusion.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/vehicle"
              className="rounded-xl bg-white px-5 py-3 font-semibold text-slate-950"
            >
              View Cars
            </Link>
            <a
              href="https://wa.me/971582211457?text=Hi, I am arriving at Dubai Airport and want to ask about car rental"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-xl bg-green-500 px-5 py-3 font-semibold text-white"
            >
              WhatsApp Us
            </a>
          </div>
        </div>
      </section>

      <section className="bg-slate-50 px-4 py-10 md:px-8">
        <div className="mx-auto max-w-6xl rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:p-7">
          <h2 className="text-2xl font-bold">Quick answer</h2>
          <div className="mt-5 grid gap-3 md:grid-cols-5">
            {quickAnswers.map(([label, value]) => (
              <div key={label} className="rounded-xl bg-slate-50 p-4">
                <p className="text-sm font-semibold text-purple-700">{label}</p>
                <p className="mt-2 text-sm leading-6 text-slate-700">{value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-12 md:px-8">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold">Transport options from DXB</h2>
          <div className="mt-7 grid gap-5 md:grid-cols-2">
            <article className="rounded-2xl border border-slate-200 p-5">
              <h3 className="text-xl font-bold">Dubai Metro</h3>
              <p className="mt-3 leading-7 text-slate-700">
                Dubai Metro Red Line connects DXB Terminal 1 and Terminal 3.
                It is clean, affordable, and useful if your hotel or apartment
                is near a metro station. You will need a Nol card for metro and
                bus travel. It is a good choice for light luggage, but not ideal
                if you are carrying many bags or travelling with tired children.
              </p>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                Dubai Airports says metro runs roughly Mon-Thu 5am-midnight,
                Friday 5am-1am, Saturday 5am-midnight, and Sunday
                8am-midnight. Timings can change, so check RTA before you
                travel.
              </p>
            </article>

            <article className="rounded-2xl border border-slate-200 p-5">
              <h3 className="text-xl font-bold">Taxi</h3>
              <p className="mt-3 leading-7 text-slate-700">
                Dubai Taxi is available 24/7 at the official DXB terminal taxi
                ranks. This is usually the easiest choice after a long flight,
                especially for families, late arrivals, or anyone with luggage.
                Airport taxi starting fare is around AED 25, then distance
                charges are added.
              </p>
            </article>

            <article className="rounded-2xl border border-slate-200 p-5">
              <h3 className="text-xl font-bold">RTA Bus</h3>
              <p className="mt-3 leading-7 text-slate-700">
                RTA buses are cheaper, but they can be slower and less simple
                after landing. You need a Nol card, and it is better if you
                already know your route and nearby stops. For first-time
                visitors with bags, taxi or metro is usually easier.
              </p>
            </article>

            <article className="rounded-2xl border border-slate-200 p-5">
              <h3 className="text-xl font-bold">Careem / Uber</h3>
              <p className="mt-3 leading-7 text-slate-700">
                Careem and Uber are easy ride app options from Dubai Airport.
                You can see the car type and estimated price in the app, but the
                price can change depending on time, traffic, and demand.
              </p>
            </article>

            <article className="rounded-2xl border border-slate-200 p-5">
              <h3 className="text-xl font-bold">Hotel shuttle</h3>
              <p className="mt-3 leading-7 text-slate-700">
                Some hotels provide airport pickup or shuttle service. If your
                hotel offers it, confirm the pickup point and timing before you
                arrive. It can be comfortable, but it is not available for every
                hotel or every booking.
              </p>
            </article>

            <article className="rounded-2xl border border-slate-200 p-5">
              <h3 className="text-xl font-bold">Pre-booked rental car</h3>
              <p className="mt-3 leading-7 text-slate-700">
                A rental car makes sense if you are staying more than a few
                days, going to JVC, Sharjah, Ajman, Abu Dhabi, or moving around
                daily. It is not always needed for a short hotel stay near the
                metro, but it can save time if your plans are spread across the
                UAE.
              </p>
            </article>
          </div>
        </div>
      </section>

      <section className="bg-slate-50 px-4 py-12 md:px-8">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold">How to reach popular areas from DXB</h2>
          <div className="mt-7 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {areaRows.map((row) => (
              <article
                key={row.area}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
              >
                <h3 className="text-xl font-bold">{row.area}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-700">
                  {row.advice}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-12 md:px-8">
        <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[1fr_0.85fr]">
          <article className="rounded-2xl border border-slate-200 p-6">
            <h2 className="text-3xl font-bold">How to reach JVC from Dubai Airport</h2>
            <p className="mt-4 leading-8 text-slate-700">
              JVC is not directly on the Dubai Metro line. If you are landing
              with luggage, the practical choice is usually a direct taxi or
              ride app from DXB. If you want to save some money, you can take
              the metro towards the city and then use a taxi from a convenient
              area. This can work, but after a long flight it may feel like more
              effort than it is worth.
            </p>
            <p className="mt-4 leading-8 text-slate-700">
              If you are staying in JVC and will move around Dubai often, a
              pre-booked rental car is worth considering. Travel time can change
              a lot with traffic, especially during the evening peak.
            </p>
          </article>

          <article className="rounded-2xl border border-purple-200 bg-purple-50 p-6">
            <h2 className="text-2xl font-bold">Should you book car rental before arriving?</h2>
            <p className="mt-4 leading-8 text-slate-700">
              Booking before arrival helps you compare prices calmly, choose the
              right car, avoid last-minute airport stress, and arrange delivery
              or pickup timing. Tourists usually need passport, visit visa or
              entry stamp, driving license, and an IDP depending on nationality.
              Residents normally need Emirates ID and UAE driving license.
            </p>
            <p className="mt-4 leading-8 text-slate-700">
              AMJDrive can arrange rental cars in Dubai, Sharjah and Ajman, but
              the main advice is simple: confirm the car, documents, delivery
              area, deposit terms, Salik, and parking before you travel.
            </p>
          </article>
        </div>
      </section>

      <section className="bg-slate-50 px-4 py-12 md:px-8">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold">Tourist mistakes to avoid after landing at DXB</h2>
          <div className="mt-7 grid gap-3 md:grid-cols-2">
            {mistakes.map((mistake) => (
              <div
                key={mistake}
                className="rounded-xl border border-slate-200 bg-white p-4 text-sm leading-6 text-slate-700"
              >
                {mistake}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-12 md:px-8">
        <div className="mx-auto max-w-6xl rounded-2xl bg-slate-950 p-6 text-white md:p-8">
          <h2 className="text-3xl font-bold">Planning to rent a car after landing?</h2>
          <p className="mt-4 max-w-3xl leading-8 text-slate-200">
            If you prefer to arrange your rental before arrival, AMJDrive can
            help with economy cars, sedans, SUVs and 7-seaters with delivery
            options depending on location. Keep it simple and transparent before
            you travel.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/vehicle" className="rounded-xl bg-white px-5 py-3 font-semibold text-slate-950">
              View Cars
            </Link>
            <a
              href="https://wa.me/971582211457?text=Hi, I want to arrange a rental car after landing in Dubai"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-xl bg-green-500 px-5 py-3 font-semibold text-white"
            >
              WhatsApp Us
            </a>
            <Link href="/monthly-car-rental-sharjah" className="rounded-xl border border-white/25 px-5 py-3 font-semibold text-white">
              Monthly Cars
            </Link>
            <Link href="/car-rental-sharjah" className="rounded-xl border border-white/25 px-5 py-3 font-semibold text-white">
              Sharjah
            </Link>
            <Link href="/car-rental-ajman" className="rounded-xl border border-white/25 px-5 py-3 font-semibold text-white">
              Ajman
            </Link>
          </div>
        </div>
      </section>

      <section className="px-4 pb-14 md:px-8">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-3xl font-bold">FAQ</h2>
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

      <Footer />
    </main>
  );
}
