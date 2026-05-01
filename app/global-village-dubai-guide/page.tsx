import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import { getAbsoluteUrl } from "@/lib/site-url";

const pagePath = "/global-village-dubai-guide";
const pageTitle =
  "Global Village Dubai Guide: How to Reach, What to See, Parking, Tips & Car Rental";
const pageDescription =
  "Planning to visit Global Village Dubai? Learn how to get there from JVC, Marina, Deira, Sharjah or Ajman, parking tips, toll advice and visitor tips.";

export const metadata: Metadata = {
  title: "Global Village Dubai Guide: How to Reach, Parking, Tips & Car Rental",
  description: pageDescription,
  alternates: {
    canonical: pagePath,
  },
  openGraph: {
    title: "Global Village Dubai Guide: How to Reach, Parking, Tips & Car Rental",
    description: pageDescription,
    url: pagePath,
    type: "article",
  },
};

const expectationItems = [
  "Country shopping pavilions with food, souvenirs, clothes, perfumes, sweets and gifts.",
  "Food from around the world, from small snacks to full meals.",
  "Games, carnival rides and family activities for different ages.",
  "Live shows, cultural performances and seasonal entertainment.",
  "A lively family atmosphere, especially in the evening.",
  "Cooler months are usually the nicest time to visit.",
];

const fromAreas = [
  {
    title: "Global Village from JVC",
    text: "From JVC, driving or taking a taxi is usually the simplest way. Public transport can involve more than one step, so families and groups often prefer going by car, especially when returning late in the evening.",
  },
  {
    title: "Global Village from Dubai Marina / JBR",
    text: "From Dubai Marina or JBR, taxi, ride app or driving is practical. Metro alone will not take you directly to the entrance, so check public transport carefully if you want to avoid driving.",
  },
  {
    title: "Global Village from Deira",
    text: "From Deira, the route can feel long during busy hours. Taxi or driving is more comfortable, while bus options may suit visitors who already know the RTA route and do not mind extra travel time.",
  },
  {
    title: "Global Village from Bur Dubai",
    text: "From Bur Dubai, driving or taxi is straightforward for most visitors. Public bus options may be available depending on the season and route updates, so check RTA before planning around it.",
  },
  {
    title: "Global Village from Sharjah",
    text: "For visitors coming from Sharjah, a rental car or taxi is often easier than coordinating public transport, especially for families. Traffic can vary a lot, so leave earlier on weekends.",
  },
  {
    title: "Global Village from Ajman",
    text: "From Ajman, going by car is usually the practical choice. It gives you more control over timing, especially if you want to combine Global Village with another Dubai stop on the same day.",
  },
];

const parkingTips = [
  "Arrive earlier on weekends and public holidays.",
  "Free parking is available, and paid premium parking options may exist.",
  "Save your parking location pin before walking to the entrance.",
  "Wear comfortable shoes because there is plenty of walking inside.",
  "Evening can be the busiest time, especially in cooler months.",
];

const faqs = [
  {
    question: "Is parking free at Global Village?",
    answer:
      "Global Village usually has large free parking areas. Paid premium parking options may also be available, depending on the season and setup.",
  },
  {
    question: "What is the best way to reach Global Village?",
    answer:
      "For many visitors, the easiest way is by car, taxi or ride app. Public bus options can be useful, but routes can change, so check the latest RTA information before travelling.",
  },
  {
    question: "Can I go from Sharjah or Ajman easily?",
    answer:
      "Yes, but it is usually easier by car or taxi. Families and groups coming from Sharjah or Ajman often prefer driving because it makes the return journey simpler.",
  },
  {
    question: "Is Global Village good for families?",
    answer:
      "Yes. It is one of Dubai's popular family evening attractions, with food, shopping, pavilions, games, rides and live shows in one place.",
  },
  {
    question: "Is rental car practical for visiting Global Village?",
    answer:
      "It can be practical if you are travelling with family, coming from Sharjah or Ajman, or combining Global Village with other attractions in one day.",
  },
  {
    question: "Can I avoid toll roads going there?",
    answer:
      "Sometimes you may be able to choose a lower-toll or no-toll route, but it depends on your starting point and traffic. Use a navigation app and check the route before you start.",
  },
];

export default function GlobalVillageDubaiGuidePage() {
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

      <section className="bg-slate-950 px-4 py-14 text-white md:px-8 md:py-20">
        <div className="mx-auto max-w-6xl">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-purple-200">
            Seasonal Dubai Attraction Guide
          </p>
          <h1 className="mt-5 max-w-4xl text-4xl font-bold leading-tight md:text-6xl">
            Global Village Dubai Visitor Guide
          </h1>
          <p className="mt-6 max-w-3xl text-base leading-8 text-slate-200 md:text-lg">
            Global Village is one of Dubai&apos;s most popular seasonal
            attractions, combining food, shopping, country pavilions, rides,
            shows and family entertainment in one place. This guide explains
            how to reach it, what to expect, parking tips and why many visitors
            prefer going by car.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="#how-to-reach"
              className="rounded-xl bg-white px-5 py-3 font-semibold text-slate-950"
            >
              How To Reach
            </a>
            <a
              href="#parking"
              className="rounded-xl border border-white/25 px-5 py-3 font-semibold text-white"
            >
              Parking Tips
            </a>
          </div>
        </div>
      </section>

      <section className="px-4 py-12 md:px-8">
        <div className="mx-auto grid max-w-6xl gap-7 lg:grid-cols-[0.95fr_1.05fr]">
          <article className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
            <h2 className="text-3xl font-bold">What is Global Village?</h2>
            <p className="mt-4 leading-8 text-slate-700">
              Global Village is a large outdoor seasonal attraction where people
              can explore products, food and culture from many countries in one
              trip. You walk through pavilions representing different countries,
              try street food, watch cultural shows, shop for gifts, and enjoy
              carnival rides and games.
            </p>
            <p className="mt-4 leading-8 text-slate-700">
              It is especially popular with families and evening visitors. Many
              people spend half a day or a full evening there, because once you
              start walking through the pavilions, time goes quickly.
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

      <section id="how-to-reach" className="bg-slate-50 px-4 py-12 md:px-8">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold">How to reach Global Village</h2>
          <p className="mt-4 max-w-3xl leading-8 text-slate-700">
            The best way to visit Global Village depends on your starting point,
            your group size, and whether you plan to stay until late. Traffic
            can change a lot, especially on weekends, so leave some extra time.
          </p>

          <div className="mt-7 grid gap-5 md:grid-cols-2">
            <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <h3 className="text-xl font-bold">By car</h3>
              <p className="mt-3 leading-7 text-slate-700">
                For many visitors, going by car is the easiest choice. Global
                Village has large free parking areas, and paid premium parking
                options may exist. Driving is especially useful for families,
                groups, or anyone carrying shopping bags at the end of the
                night.
              </p>
            </article>

            <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <h3 className="text-xl font-bold">Taxi / ride apps</h3>
              <p className="mt-3 leading-7 text-slate-700">
                Taxi, Careem and Uber are simple options if you do not want to
                drive. The only thing to remember is that return demand can be
                high after shows or late evening, so waiting time and fares can
                change.
              </p>
            </article>

            <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <h3 className="text-xl font-bold">Public bus options</h3>
              <p className="mt-3 leading-7 text-slate-700">
                Public bus options may be available during the Global Village
                season, but routes and timings can change. Check the latest RTA
                information before you plan your trip around the bus.
              </p>
            </article>

            <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <h3 className="text-xl font-bold">Why many families prefer driving</h3>
              <p className="mt-3 leading-7 text-slate-700">
                Families usually want flexibility: arrive when children are
                ready, leave when everyone is tired, and keep shopping bags in
                the car. That is why driving often feels more comfortable than
                coordinating taxis or public transport.
              </p>
            </article>
          </div>
        </div>
      </section>

      <section className="px-4 py-12 md:px-8">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold">
            How to reach Global Village from popular areas
          </h2>
          <div className="mt-7 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {fromAreas.map((area) => (
              <article
                key={area.title}
                className="rounded-2xl border border-slate-200 p-6"
              >
                <h3 className="text-2xl font-bold">{area.title}</h3>
                <p className="mt-4 leading-8 text-slate-700">{area.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-slate-50 px-4 py-12 md:px-8">
        <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-3xl font-bold">Avoiding tolls when driving</h2>
            <p className="mt-4 leading-8 text-slate-700">
              Some routes to Global Village may include Salik toll roads,
              depending on where you start and which road your navigation app
              chooses. It is helpful to check the route before leaving, because
              a small change can sometimes reduce tolls.
            </p>
            <p className="mt-4 leading-8 text-slate-700">
              Navigation apps can help you choose lower-toll or no-toll routes
              when possible, but it is better not to assume a no-toll route will
              always be practical. Traffic, road closures and your starting
              point all matter.
            </p>
          </article>

          <article className="rounded-2xl border border-purple-200 bg-purple-50 p-6">
            <h2 className="text-3xl font-bold">
              Why many visitors prefer rental car for Global Village
            </h2>
            <p className="mt-4 leading-8 text-slate-700">
              For families, groups or people coming from Sharjah and Ajman, a
              rental car can be easier than coordinating taxis or public
              transport. It also helps if you are planning more than one stop in
              the same day.
            </p>
            <p className="mt-4 leading-8 text-slate-700">
              Economy rentals from around AED 75/day plus a small no-deposit
              waiver fee where applicable may sometimes cost less than multiple
              rides, especially if you combine Global Village, Miracle Garden
              and other Dubai attractions in one day.
            </p>
            <p className="mt-4 leading-8 text-slate-700">
              You can compare available options on our{" "}
              <Link href="/vehicle" className="font-semibold text-purple-700">
                vehicle page
              </Link>
              , or read our{" "}
              <Link
                href="/dubai-mall-burj-khalifa-guide"
                className="font-semibold text-purple-700"
              >
                Dubai Mall and Burj Khalifa guide
              </Link>
              {" "}if you are planning a longer sightseeing day.
            </p>
          </article>
        </div>
      </section>

      <section className="px-4 py-12 md:px-8">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold">One-day outing idea</h2>
          <div className="mt-7 grid gap-5 md:grid-cols-3">
            <article className="rounded-2xl border border-slate-200 p-6">
              <p className="text-sm font-semibold uppercase tracking-[0.14em] text-purple-700">
                Afternoon
              </p>
              <h3 className="mt-2 text-2xl font-bold">
                Miracle Garden or city outing
              </h3>
              <p className="mt-4 leading-7 text-slate-700">
                If the season is right, many visitors combine Miracle Garden
                with Global Village because both are outdoor attractions and can
                fit into the same relaxed day.
              </p>
            </article>

            <article className="rounded-2xl border border-slate-200 p-6">
              <p className="text-sm font-semibold uppercase tracking-[0.14em] text-purple-700">
                Evening
              </p>
              <h3 className="mt-2 text-2xl font-bold">Global Village dinner</h3>
              <p className="mt-4 leading-7 text-slate-700">
                Arrive before it gets too crowded, walk through a few pavilions,
                then choose dinner from the many street food and restaurant
                options.
              </p>
            </article>

            <article className="rounded-2xl border border-slate-200 p-6">
              <p className="text-sm font-semibold uppercase tracking-[0.14em] text-purple-700">
                Night
              </p>
              <h3 className="mt-2 text-2xl font-bold">Shows, rides and shopping</h3>
              <p className="mt-4 leading-7 text-slate-700">
                Leave time for live shows, carnival rides, shopping, and a slow
                walk back to the car or pickup area after the evening rush.
              </p>
            </article>
          </div>
        </div>
      </section>

      <section id="parking" className="bg-slate-50 px-4 py-12 md:px-8">
        <div className="mx-auto max-w-6xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
          <h2 className="text-3xl font-bold">Global Village parking tips</h2>
          <div className="mt-7 grid gap-3 md:grid-cols-2">
            {parkingTips.map((tip) => (
              <div
                key={tip}
                className="rounded-xl bg-slate-50 p-4 text-sm leading-6 text-slate-700"
              >
                {tip}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-12 md:px-8">
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

      <section className="px-4 pb-12 md:px-8">
        <div className="mx-auto max-w-6xl rounded-2xl bg-slate-950 p-6 text-white md:p-8">
          <h2 className="text-3xl font-bold">
            Planning to explore Dubai attractions by car?
          </h2>
          <p className="mt-4 max-w-3xl leading-8 text-slate-200">
            AMJDrive can help with economy cars, sedans, SUVs and 7-seaters for
            city sightseeing and family trips. If you are visiting Global
            Village from Dubai, Sharjah or Ajman, it is worth comparing the
            total cost and comfort before deciding between taxi, bus or rental
            car.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/vehicle"
              className="rounded-xl bg-white px-5 py-3 font-semibold text-slate-950"
            >
              View Cars
            </Link>
            <a
              href="https://wa.me/971526959007?text=Hi, I want to ask about car rental for visiting Global Village"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-xl bg-green-500 px-5 py-3 font-semibold text-white"
            >
              WhatsApp Us
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
