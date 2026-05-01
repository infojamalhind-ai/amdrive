import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import { getAbsoluteUrl } from "@/lib/site-url";

const pagePath = "/dubai-mall-burj-khalifa-guide";
const pageTitle =
  "Dubai Mall & Burj Khalifa Visitor Guide: How to Reach, Things to Do, Shopping, Fountain Shows & Car Rental Tips";
const pageDescription =
  "Visiting Dubai Mall and Burj Khalifa? Learn how to get there from JVC, Dubai Marina or Bur Dubai, what to see nearby, and why renting a car can make sightseeing easier.";

export const metadata: Metadata = {
  title:
    "Dubai Mall & Burj Khalifa Guide | How to Reach, Attractions & Car Rental Tips",
  description: pageDescription,
  alternates: {
    canonical: pagePath,
  },
  openGraph: {
    title:
      "Dubai Mall & Burj Khalifa Guide | How to Reach, Attractions & Car Rental Tips",
    description: pageDescription,
    url: pagePath,
    type: "article",
  },
};

const expectationItems = [
  "One of the world's largest malls, so comfortable shoes help.",
  "Luxury brands, high-street stores, souvenirs, and budget-friendly shopping.",
  "Huge food choices, from quick bites to cafes and proper restaurants.",
  "Cinema, kids' activities, and family entertainment inside the mall.",
  "Dubai Aquarium & Underwater Zoo, one of the easiest indoor attractions to add.",
  "Dubai Fountain shows outside near Burj Lake.",
  "Burj Khalifa At The Top experience connected from the mall.",
  "Dubai Mall can easily become a full-day attraction, especially for families.",
];

const nearbyAttractions = [
  {
    title: "Burj Khalifa observation decks",
    text: "Book ahead if you want a specific sunset or evening slot. The entrance for At The Top is inside Dubai Mall.",
  },
  {
    title: "Dubai Fountain promenade",
    text: "A simple free stop outside the mall. Evening shows are popular, so arrive a little early for a better view.",
  },
  {
    title: "Dubai Aquarium",
    text: "You can see part of the aquarium from the mall, and paid tickets are available for the full experience.",
  },
  {
    title: "Souk Al Bahar",
    text: "A nice place for photos, coffee, restaurants, and a more traditional-style shopping feel beside the mall.",
  },
  {
    title: "Dubai Opera area",
    text: "Good for a walk if the weather is pleasant, with views around Downtown Dubai.",
  },
  {
    title: "Burj Park",
    text: "A calmer outdoor space nearby, useful for photos of Burj Khalifa and Downtown.",
  },
  {
    title: "Downtown boulevard walking area",
    text: "Easy to combine with the mall if you want cafes, city views, and a short walk.",
  },
  {
    title: "Museum of the Future",
    text: "This is better as another stop on the same day or a separate day, depending on timing and tickets.",
  },
];

const transportOptions = [
  {
    title: "Metro",
    text: "Take the Dubai Metro Red Line to Burj Khalifa/Dubai Mall station. From there, use the air-conditioned walkway to reach the mall. It is practical, but the walk can feel long if you have small children or many bags.",
  },
  {
    title: "Taxi",
    text: "Taxi is the easiest choice if you are coming from a hotel, airport, JVC, Marina, or another area not directly beside the metro. It is comfortable, but costs can add up if you take several rides in one day.",
  },
  {
    title: "Careem / Uber",
    text: "Ride apps are simple for tourists because you can choose the pickup point and see the estimated fare. Prices can change depending on traffic and demand.",
  },
  {
    title: "Driving and parking",
    text: "Dubai Mall has large parking areas, but remember where you park because the mall is big. During weekends, holidays, and evening fountain times, give yourself extra time.",
  },
  {
    title: "Rental car",
    text: "A rental car can be practical for families or multi-stop sightseeing, especially if you plan to visit Dubai Mall, Jumeirah, Marina, and old Dubai in one day.",
  },
];

const fromAreas = [
  {
    title: "JVC to Dubai Mall",
    text: "JVC is not directly on the metro, so taxi, ride app, or driving is usually the simplest. If you want a budget route, you can take a taxi to a convenient metro station and continue by Red Line, but with luggage or family it may not feel worth the extra step.",
  },
  {
    title: "Dubai Marina / JBR to Dubai Mall",
    text: "Metro is possible from the Marina side using the Red Line, but it takes time and includes walking. Taxi or driving is more direct, especially in the evening when you may want to continue to JBR after the fountain show.",
  },
  {
    title: "Bur Dubai to Dubai Mall",
    text: "Metro is a sensible option from many parts of Bur Dubai if you are near a station. Taxi is still easier door-to-door, and driving can work well if your plan includes more than one stop after Dubai Mall.",
  },
];

const faqItems = [
  {
    question: "How do I reach Dubai Mall by metro?",
    answer:
      "Use the Dubai Metro Red Line and get off at Burj Khalifa/Dubai Mall station. From there, follow the air-conditioned walkway to the mall. It is easy, but allow extra time for the walk.",
  },
  {
    question: "Is Dubai Mall worth a full day?",
    answer:
      "Yes, for many tourists it is. Between shopping, food, Dubai Aquarium, Burj Khalifa, fountain shows, and nearby Downtown walks, Dubai Mall can easily take a full day.",
  },
  {
    question: "Can I visit Burj Khalifa and Aquarium same day?",
    answer:
      "Yes. Both are connected to Dubai Mall, so it is common to visit Burj Khalifa At The Top, Dubai Aquarium, lunch, shopping, and the fountain show in one day.",
  },
  {
    question: "How far is Dubai Mall from JVC?",
    answer:
      "Travel time depends on traffic, but JVC is not beside Downtown Dubai and it is not directly on the metro. Taxi, ride app, or rental car is usually the simplest way.",
  },
  {
    question: "Is it cheaper to rent a car than use taxis for sightseeing?",
    answer:
      "It depends on your route. If you only go from hotel to Dubai Mall and back, taxi may be fine. If you plan 4 or 5 stops in one day, an economy rental can sometimes work out better than repeated taxi rides.",
  },
  {
    question: "Is parking available at Dubai Mall?",
    answer:
      "Yes, Dubai Mall has large parking areas. The main tip is to remember your parking zone and allow extra time during busy evenings, weekends, and holidays.",
  },
];

export default function DubaiMallBurjKhalifaGuidePage() {
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
    mainEntity: faqItems.map((faq) => ({
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

      <section className="bg-slate-950 px-4 py-14 text-white md:px-8 md:py-20">
        <div className="mx-auto max-w-6xl">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-purple-200">
            Downtown Dubai Visitor Guide
          </p>
          <h1 className="mt-5 max-w-4xl text-4xl font-bold leading-tight md:text-6xl">
            Dubai Mall & Burj Khalifa Guide for Tourists
          </h1>
          <p className="mt-6 max-w-3xl text-base leading-8 text-slate-200 md:text-lg">
            If Dubai Mall is on your itinerary, you can easily spend a full day
            or even two here. From shopping and dining to the Dubai Fountain,
            Burj Khalifa views and nearby attractions, this guide covers what to
            expect and how to reach it easily.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="#how-to-reach"
              className="rounded-xl bg-white px-5 py-3 font-semibold text-slate-950"
            >
              How To Reach
            </a>
            <a
              href="#things-to-do"
              className="rounded-xl border border-white/25 px-5 py-3 font-semibold text-white"
            >
              Things To Do
            </a>
          </div>
        </div>
      </section>

      <section className="px-4 py-12 md:px-8">
        <div className="mx-auto grid max-w-6xl gap-7 lg:grid-cols-[0.95fr_1.05fr]">
          <article className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
            <h2 className="text-3xl font-bold">What to expect at Dubai Mall</h2>
            <p className="mt-4 leading-8 text-slate-700">
              Dubai Mall is not a quick shopping stop for most visitors. It is
              one of the world&apos;s largest malls, and many tourists combine 4 or 5
              nearby attractions in the same day. If you are visiting Burj
              Khalifa, the aquarium, the fountain show, and a few restaurants,
              plan your time calmly.
            </p>
            <p className="mt-4 leading-8 text-slate-700">
              For families, it helps to decide your main attractions before you
              arrive. The mall is huge, and walking from one area to another can
              take longer than expected.
            </p>
          </article>

          <div className="grid gap-3 sm:grid-cols-2">
            {expectationItems.map((item) => (
              <div
                key={item}
                className="rounded-xl border border-slate-200 bg-white p-4 text-sm leading-6 text-slate-700 shadow-sm"
              >
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="things-to-do" className="bg-slate-50 px-4 py-12 md:px-8">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold">
            Tourist attractions near Burj Khalifa
          </h2>
          <p className="mt-4 max-w-3xl leading-8 text-slate-700">
            The easiest part of visiting Downtown Dubai is that many famous
            attractions are close together. You can build a relaxed day around
            Dubai Mall, then step outside for Burj Khalifa and fountain views.
          </p>
          <div className="mt-7 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {nearbyAttractions.map((item) => (
              <article
                key={item.title}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
              >
                <h3 className="text-lg font-bold">{item.title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-700">
                  {item.text}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="how-to-reach" className="px-4 py-12 md:px-8">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold">How to reach Dubai Mall</h2>
          <p className="mt-4 max-w-3xl leading-8 text-slate-700">
            If you are searching for how to reach Dubai Mall, the best answer
            depends on where you are staying, how many people are travelling,
            and whether you want to visit other places on the same day.
          </p>
          <div className="mt-7 grid gap-5 md:grid-cols-2">
            {transportOptions.map((option) => (
              <article
                key={option.title}
                className="rounded-2xl border border-slate-200 p-5"
              >
                <h3 className="text-xl font-bold">{option.title}</h3>
                <p className="mt-3 leading-7 text-slate-700">{option.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-slate-50 px-4 py-12 md:px-8">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold">How to reach Dubai Mall from popular areas</h2>
          <div className="mt-7 grid gap-5 lg:grid-cols-3">
            {fromAreas.map((area) => (
              <article
                key={area.title}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
              >
                <h3 className="text-2xl font-bold">{area.title}</h3>
                <p className="mt-4 leading-8 text-slate-700">{area.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-12 md:px-8">
        <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[1fr_0.85fr]">
          <article className="rounded-2xl border border-slate-200 p-6">
            <h2 className="text-3xl font-bold">
              Why many visitors prefer renting a car for sightseeing
            </h2>
            <p className="mt-4 leading-8 text-slate-700">
              If you plan to visit several attractions in one day, for example
              Dubai Mall, Jumeirah, Marina and old Dubai, a rental car can save
              time compared with multiple taxis, especially in summer. It also
              gives you more control when travelling with family, shopping bags,
              or children who need breaks.
            </p>
            <p className="mt-4 leading-8 text-slate-700">
              Economy rentals from around AED 75/day plus a small no-deposit
              waiver fee where applicable can sometimes be cheaper than repeated
              taxi rides. It depends on your exact plan, but with a rental car
              you may cover 4 or 5 attractions in a day more comfortably.
            </p>
            <p className="mt-4 leading-8 text-slate-700">
              For more route planning, you can also read our{" "}
              <Link
                href="/dubai-airport-to-city-guide"
                className="font-semibold text-purple-700"
              >
                Dubai Airport to city guide
              </Link>
              , or compare current cars on the{" "}
              <Link href="/vehicle" className="font-semibold text-purple-700">
                AMJDrive vehicle page
              </Link>
              .
            </p>
          </article>

          <aside className="rounded-2xl border border-purple-200 bg-purple-50 p-6">
            <h2 className="text-2xl font-bold">Summer travel tip</h2>
            <p className="mt-4 leading-8 text-slate-700">
              In Dubai summer, air-conditioned travel and flexible stop-to-stop
              movement often make a rental car more practical for tourists. You
              can park, cool down, move to the next stop, and avoid waiting
              outside too long during the hottest hours.
            </p>
          </aside>
        </div>
      </section>

      <section className="bg-slate-50 px-4 py-12 md:px-8">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold">
            Suggested one-day Dubai sightseeing route
          </h2>
          <div className="mt-7 grid gap-5 md:grid-cols-3">
            <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-sm font-semibold uppercase tracking-[0.14em] text-purple-700">
                Morning
              </p>
              <h3 className="mt-2 text-2xl font-bold">Burj Khalifa & Dubai Mall</h3>
              <p className="mt-4 leading-7 text-slate-700">
                Start with Burj Khalifa if you booked an early slot, then spend
                time walking through Dubai Mall before it gets very busy.
              </p>
            </article>
            <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-sm font-semibold uppercase tracking-[0.14em] text-purple-700">
                Afternoon
              </p>
              <h3 className="mt-2 text-2xl font-bold">Aquarium & lunch</h3>
              <p className="mt-4 leading-7 text-slate-700">
                Visit Dubai Aquarium & Underwater Zoo, then choose lunch or
                coffee inside the mall. This is a good time to avoid outdoor
                heat.
              </p>
            </article>
            <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-sm font-semibold uppercase tracking-[0.14em] text-purple-700">
                Evening
              </p>
              <h3 className="mt-2 text-2xl font-bold">Fountain, Marina or JBR</h3>
              <p className="mt-4 leading-7 text-slate-700">
                Watch the Dubai Fountain show, then continue to Dubai Marina or
                JBR if you still have energy and transport arranged.
              </p>
            </article>
          </div>
        </div>
      </section>

      <section className="px-4 py-12 md:px-8">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-3xl font-bold">FAQ</h2>
          <div className="mt-7 space-y-4">
            {faqItems.map((faq) => (
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

      <section className="px-4 pb-12 md:px-8">
        <div className="mx-auto max-w-6xl rounded-2xl bg-slate-950 p-6 text-white md:p-8">
          <h2 className="text-3xl font-bold">Planning to explore Dubai by car?</h2>
          <p className="mt-4 max-w-3xl leading-8 text-slate-200">
            AMJDrive offers economy cars, sedans and SUVs for visitors who want
            flexible sightseeing around Dubai, Sharjah and Ajman. If a rental
            car makes sense for your plan, keep the booking simple, check the
            documents, and confirm delivery or pickup timing before you travel.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/vehicle"
              className="rounded-xl bg-white px-5 py-3 font-semibold text-slate-950"
            >
              View Cars
            </Link>
            <a
              href="https://wa.me/971526959007?text=Hi, I want to ask about car rental for Dubai sightseeing"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-xl bg-green-500 px-5 py-3 font-semibold text-white"
            >
              WhatsApp Booking
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
