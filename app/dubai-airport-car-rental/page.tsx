import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import { vehicleData } from "@/app/vehicleData";
import { getAbsoluteUrl } from "@/lib/site-url";

const pagePath = "/dubai-airport-car-rental";
const pageTitle = "Dubai Airport Car Rental | Rent a Car at DXB Terminal 1, 2 & 3";
const pageDescription =
  "Rent a car near Dubai Airport with AMJ Drive. Tourist-friendly DXB car rental for Terminal 1, Terminal 2 and Terminal 3 with WhatsApp support, clear charges and selected no-deposit cars.";
const whatsappUrl =
  "https://wa.me/971526959007?text=Hi, I am arriving at Dubai Airport and want to rent a car with AMJ Drive";

export const metadata: Metadata = {
  title: pageTitle,
  description: pageDescription,
  alternates: {
    canonical: "https://amjdrive.com/dubai-airport-car-rental",
  },
  openGraph: {
    title: pageTitle,
    description: pageDescription,
    url: pagePath,
    type: "website",
    images: [
      {
        url: "/destinations/dubai-airport/dubai-airport-exterior.jpg",
        width: 1600,
        height: 900,
        alt: "Dubai Airport exterior for DXB airport car rental",
      },
    ],
  },
};

const terminalGuides = [
  {
    title: "Terminal 1 car rental guide",
    image: "/destinations/dubai-airport/dxb-terminal-1.jpg",
    alt: "Terminal 1 car rental near Dubai International Airport DXB",
    text: "Terminal 1 handles many international airlines, so it is common for tourists arriving from Europe, Asia, Africa and the wider region. If you are landing at Terminal 1, confirm your flight number and arrival time before booking. It helps the handover team understand whether you need a quick self pickup nearby or delivery after you clear immigration and collect luggage.",
  },
  {
    title: "Terminal 2 car rental guide",
    image: "/destinations/dubai-airport/dxb-terminal-2.jpg",
    alt: "Terminal 2 car rental near DXB Airport Dubai",
    text: "Terminal 2 is on a different side of DXB and often serves regional, budget and selected flydubai routes. Do not assume Terminal 2 pickup is beside Terminal 1 or Terminal 3. If your booking says Terminal 2, share that clearly on WhatsApp so the pickup point, waiting time and delivery plan are realistic.",
  },
  {
    title: "Terminal 3 car rental guide",
    image: "/destinations/dubai-airport/dxb-terminal-3.jpg",
    alt: "Terminal 3 car rental at Dubai Airport for Emirates passengers",
    text: "Terminal 3 is the main Emirates hub at Dubai International Airport. It is a busy arrival point for long-haul tourists, families and business visitors. If you are flying Emirates, Terminal 3 is usually the terminal to plan around, but always check your ticket because terminal information can change.",
  },
];

const driveTimes = [
  ["DXB to JBR", "35 to 50 minutes", "Best by car when you have luggage or a hotel in JBR."],
  ["DXB to Dubai Marina", "35 to 50 minutes", "Use Sheikh Zayed Road outside peak traffic where possible."],
  ["DXB to Downtown Dubai", "15 to 25 minutes", "Good route for Burj Khalifa, Dubai Mall and Business Bay hotels."],
  ["DXB to Sharjah", "25 to 45 minutes", "Traffic can change quickly near the Dubai-Sharjah border."],
];

const touristTips = [
  "Keep your passport, visit visa or entry stamp, driving license and International Driving Permit ready if your nationality requires one.",
  "Use Google Maps or Waze after buying a UAE tourist SIM or activating roaming. Airport Wi-Fi is useful, but you will want mobile data once you leave DXB.",
  "Drive on the right side of the road in the UAE and follow posted speed limits. Cameras are common on highways and city roads.",
  "Avoid stopping on airport roads unless you are in a permitted pickup, drop-off or parking area.",
  "Keep some extra time for your first drive if you are heading to JBR, Dubai Marina, Palm Jumeirah or Business Bay during evening traffic.",
];

const salikTips = [
  "Salik is Dubai's automatic toll system. If your route uses a toll gate, the charge is normally added to your rental bill.",
  "Common tourist routes from DXB to Dubai Marina, JBR and Palm Jumeirah may pass toll gates depending on the route.",
  "Airport parking is separate from Salik tolls. If you park at DXB, check the current terminal parking rate before leaving the car.",
  "For quick arrivals, delivery to a nearby agreed point can be easier than parking inside the terminal for a long wait.",
];

const faqs = [
  {
    question: "Which terminal is Emirates at Dubai Airport?",
    answer:
      "Emirates flights usually operate from Terminal 3 at Dubai International Airport. Still, check your ticket or airline app before travel because terminal details can change.",
  },
  {
    question: "Can tourists rent cars in Dubai?",
    answer:
      "Yes. Tourists can rent cars in Dubai when they have the required documents. Most visitors need a passport, visit visa or entry stamp, valid driving license and an International Driving Permit if required for their nationality.",
  },
  {
    question: "Is UAE driving easy for tourists?",
    answer:
      "Many tourists find UAE driving straightforward because main roads are well marked and navigation apps work well. The busy parts are airport roads, Sheikh Zayed Road, Downtown Dubai, JBR and Dubai Marina during peak traffic.",
  },
  {
    question: "Is parking available at Dubai Airport?",
    answer:
      "Yes. Dubai Airport has terminal parking areas for Terminal 1, Terminal 2 and Terminal 3. Rates and rules can change, so check the signs at the terminal or the official Dubai Airports information before parking for a long time.",
  },
  {
    question: "Best areas to stay after airport arrival?",
    answer:
      "Downtown Dubai and Business Bay are convenient for a short city stay. JBR, Dubai Marina and Palm Jumeirah suit beach holidays. Sharjah can be practical when your plan includes Sharjah or northern emirates.",
  },
  {
    question: "Can I rent a car near Dubai Airport Terminal 1?",
    answer:
      "Yes. You can arrange car rental near Terminal 1. Share your airline, flight number and arrival time so the pickup or delivery plan matches your terminal.",
  },
  {
    question: "Can I rent a car near Dubai Airport Terminal 2?",
    answer:
      "Yes. Terminal 2 car rental can be arranged, but it should be planned separately because Terminal 2 is not directly beside Terminal 1 and Terminal 3.",
  },
  {
    question: "Can I rent a car near Dubai Airport Terminal 3?",
    answer:
      "Yes. Terminal 3 is a common pickup area for Emirates passengers and long-haul tourists arriving at DXB. Pre-booking helps keep the handover smoother after luggage collection.",
  },
];

const airportCarSlugs = [
  "nissan-sunny",
  "mitsubishi-attrage",
  "nissan-magnite",
  "hyundai-creta",
  "mitsubishi-xpander",
  "suzuki-ertiga",
];

const airportCarNotes: Record<string, string> = {
  "nissan-sunny": "Economy sedan for tourists who want a simple airport-to-hotel car with low daily cost.",
  "mitsubishi-attrage": "Budget-friendly sedan for light luggage, short Dubai stays and easy city parking.",
  "nissan-magnite": "Compact SUV for airport arrivals heading to JBR, Dubai Marina or Palm Jumeirah.",
  "hyundai-creta": "Comfortable SUV for couples and small families planning longer Dubai drives.",
  "mitsubishi-xpander": "7-seater option for families arriving at DXB with luggage and children.",
  "suzuki-ertiga": "Family airport rental with 7 seats for hotel transfers and longer UAE stays.",
};
const relatedLinks = [
  {
    href: "/rent-car-jbr-dubai",
    label: "Rent a Car in JBR Dubai",
    text: "Useful if your hotel or apartment is near JBR Beach, The Walk or Dubai Marina.",
  },
  {
    href: "/monthly-car-rental-sharjah",
    label: "Monthly Car Rental Sharjah",
    text: "Good for longer stays or visitors heading from DXB toward Sharjah.",
  },
  {
    href: "/car-rental-guides/no-deposit-car-rental-uae",
    label: "No Deposit Car Rental UAE",
    text: "Understand how selected no-deposit car rental options work before booking.",
  },
  {
    href: "/vehicle",
    label: "View Available Cars",
    text: "Compare economy cars, SUVs and 7-seater options online.",
  },
];

const nearbyAreas = [
  "JBR",
  "Dubai Marina",
  "Downtown Dubai",
  "Business Bay",
  "Palm Jumeirah",
  "Sheikh Zayed Road",
];

const imageCredits = [
  {
    label: "Dubai Airport exterior",
    author: "EditQ",
    license: "CC0",
    href: "https://commons.wikimedia.org/wiki/File:Dubai_International_Airport_1.jpg",
  },
  {
    label: "DXB Terminal 1",
    author: "Vitorabdala",
    license: "CC BY-SA 4.0",
    href: "https://commons.wikimedia.org/wiki/File:DXB_T1.jpg",
  },
  {
    label: "Dubai Airport Terminal 2",
    author: "Ravi Dwivedi",
    license: "CC BY-SA 4.0",
    href: "https://commons.wikimedia.org/wiki/File:Dubai_Airport_Terminal_2.jpg",
  },
  {
    label: "Dubai Airport Terminal 3",
    author: "EditQ",
    license: "CC0",
    href: "https://commons.wikimedia.org/wiki/File:1_Dubai_International_Airport_Terminal_3.jpg",
  },
  {
    label: "Dubai airport road signs",
    author: "TheSwagger13",
    license: "CC BY-SA 4.0",
    href: "https://commons.wikimedia.org/wiki/File:Dubai_international_airport_exit.jpg",
  },
  {
    label: "DXB departures",
    author: "Hakan Dahlstrom",
    license: "CC BY 2.0",
    href: "https://commons.wikimedia.org/wiki/File:DXB_departures.jpg",
  },
];

function JsonLd({ data }: { data: unknown }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export default function DubaiAirportCarRentalPage() {
  const pageUrl = getAbsoluteUrl(pagePath);
  const lastUpdated = new Intl.DateTimeFormat("en-AE", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date());

  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "CarRental",
    name: "AMJ Drive",
    url: pageUrl,
    image: getAbsoluteUrl("/destinations/dubai-airport/dubai-airport-exterior.jpg"),
    telephone: "+971582211457",
    description: pageDescription,
    areaServed: [
      "Dubai International Airport (DXB)",
      "JBR",
      "Dubai Marina",
      "Downtown Dubai",
      "Business Bay",
      "Palm Jumeirah",
      "Sharjah",
    ],
    makesOffer: [
      "Dubai airport car rental",
      "DXB airport car rental",
      "Terminal 1 car rental",
      "Terminal 2 car rental",
      "Terminal 3 car rental",
    ],
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

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: getAbsoluteUrl("/"),
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Dubai Airport Car Rental",
        item: pageUrl,
      },
    ],
  };

  return (
    <main className="min-h-screen bg-white text-slate-900">
      <Header />
      <JsonLd data={localBusinessSchema} />
      <JsonLd data={faqSchema} />
      <JsonLd data={breadcrumbSchema} />

      <section className="bg-gradient-to-r from-purple-950 via-purple-900 to-fuchsia-900 px-4 py-4 text-white md:px-8">
        <nav
          aria-label="Breadcrumb"
          className="mx-auto flex max-w-7xl flex-wrap items-center gap-2 text-sm text-slate-300"
        >
          <Link href="/" className="hover:text-white">
            Home
          </Link>
          <span>/</span>
          <span className="text-white">Dubai Airport Car Rental</span>
        </nav>
      </section>

      <section className="bg-gradient-to-br from-purple-950 via-purple-900 to-fuchsia-900 px-4 pb-14 text-white md:px-8 md:pb-20">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1fr_0.92fr] lg:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-purple-100">
              DXB Airport Car Rental
            </p>
            <h1 className="mt-5 max-w-4xl text-4xl font-bold leading-tight md:text-6xl">
              Dubai Airport Car Rental for Tourists Arriving at DXB
            </h1>
            <p className="mt-6 max-w-3xl text-base leading-8 text-slate-200 md:text-lg">
              Landing at Dubai International Airport (DXB) and want your own car
              without figuring everything out at the counter? AMJ Drive helps
              tourists arrange practical car rental near Dubai Airport, including
              Terminal 1, Terminal 2 and Terminal 3 pickup or delivery support.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/vehicle"
                className="rounded-xl bg-white px-6 py-4 text-center font-semibold text-slate-950"
              >
                Book Online
              </Link>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-xl bg-green-500 px-6 py-4 text-center font-semibold text-white"
              >
                WhatsApp Support
              </a>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5">
            <div className="relative aspect-[16/11]">
              <Image
                src="/destinations/dubai-airport/dubai-airport-exterior.jpg"
                alt="Dubai airport car rental at Dubai International Airport DXB exterior"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 44vw"
                className="object-cover"
              />
            </div>
            <div className="grid gap-3 p-4 sm:grid-cols-3">
              {["No hidden charges", "Selected no-deposit cars", "Daily and monthly options"].map(
                (item) => (
                  <div key={item} className="rounded-xl bg-white/10 p-4 text-sm font-semibold">
                    {item}
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-slate-50 px-4 py-10 md:px-8">
        <div className="mx-auto grid max-w-7xl gap-4 md:grid-cols-2 lg:grid-cols-4">
          {driveTimes.map(([route, time, note]) => (
            <article key={route} className="rounded-xl border border-slate-200 bg-white p-5">
              <h2 className="text-lg font-bold">{route}</h2>
              <p className="mt-2 text-2xl font-bold text-purple-700">{time}</p>
              <p className="mt-3 text-sm leading-6 text-slate-700">{note}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="px-4 py-12 md:px-8">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1fr_0.85fr]">
          <article>
            <h2 className="text-3xl font-bold">Dubai Airport overview for rental car pickup</h2>
            <div className="mt-5 space-y-4 leading-8 text-slate-700">
              <p>
                Dubai International Airport is the main arrival point for many
                first-time UAE visitors. It is close to Deira, Garhoud, Downtown
                Dubai and Business Bay, while beach areas like JBR, Dubai Marina
                and Palm Jumeirah sit further along Sheikh Zayed Road.
              </p>
              <p>
                For tourists, the main thing is planning the handover properly.
                DXB is busy, terminals are not all in the same place, and the
                best option depends on luggage, landing time, family size and
                where you are staying after arrival.
              </p>
            </div>
          </article>
          <aside className="rounded-2xl border border-purple-200 bg-purple-50 p-6">
            <h2 className="text-2xl font-bold">Self pickup or delivery?</h2>
            <p className="mt-4 leading-8 text-slate-700">
              Self pickup can work if you are comfortable meeting at an agreed
              airport-area location. Delivery is better when you are travelling
              with children, large bags or a late-night arrival. Share your
              terminal, flight number and WhatsApp contact so timing stays clear.
            </p>
          </aside>
        </div>
      </section>

      <section className="bg-slate-50 px-4 py-12 md:px-8">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-3xl font-bold">Terminal 1, Terminal 2 and Terminal 3 car rental</h2>
          <div className="mt-7 grid gap-5 lg:grid-cols-3">
            {terminalGuides.map((terminal) => (
              <article
                key={terminal.title}
                className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
              >
                <div className="relative aspect-[16/10] bg-slate-100">
                  <Image
                    src={terminal.image}
                    alt={terminal.alt}
                    fill
                    sizes="(max-width: 1024px) 100vw, 33vw"
                    className="object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-2xl font-bold">{terminal.title}</h3>
                  <p className="mt-3 leading-7 text-slate-700">{terminal.text}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-12 md:px-8">
        <div className="mx-auto grid max-w-7xl gap-7 lg:grid-cols-[0.9fr_1fr] lg:items-center">
          <div className="relative aspect-[16/11] overflow-hidden rounded-2xl bg-slate-100">
            <Image
              src="/destinations/dubai-airport/dxb-road-signs.jpg"
              alt="Dubai airport road signs for rent a car near Dubai airport"
              fill
              loading="lazy"
              sizes="(max-width: 1024px) 100vw, 44vw"
              className="object-cover"
            />
          </div>
          <article>
            <h2 className="text-3xl font-bold">How to reach Marina, JBR and Downtown after pickup</h2>
            <p className="mt-5 leading-8 text-slate-700">
              If your first stop is Downtown Dubai or Business Bay, the drive is
              usually short outside heavy traffic. For JBR, Dubai Marina or Palm
              Jumeirah, expect a longer route along Sheikh Zayed Road. A rental
              car is useful when your hotel is not directly beside the metro, or
              when you plan to visit beaches, malls and restaurants across more
              than one part of Dubai.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              {nearbyAreas.map((area) => (
                <span key={area} className="rounded-xl bg-slate-100 px-4 py-3 font-semibold">
                  {area}
                </span>
              ))}
            </div>
          </article>
        </div>
      </section>

      <section className="bg-slate-50 px-4 py-12 md:px-8">
        <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-3">
          <article className="rounded-2xl border border-slate-200 bg-white p-6">
            <h2 className="text-2xl font-bold">Why tourists rent from the airport</h2>
            <p className="mt-4 leading-8 text-slate-700">
              Airport rental makes sense when you are staying several days,
              travelling with luggage, visiting more than one emirate, or
              planning routes from DXB to JBR, Dubai Marina, Downtown Dubai,
              Business Bay, Sharjah or Palm Jumeirah.
            </p>
          </article>
          <article className="rounded-2xl border border-slate-200 bg-white p-6">
            <h2 className="text-2xl font-bold">Taxi vs rental car</h2>
            <p className="mt-4 leading-8 text-slate-700">
              Taxi is simple for one airport transfer. A rental car becomes more
              useful when you need daily movement, family comfort, late returns,
              shopping trips or flexible travel outside metro areas.
            </p>
          </article>
          <article className="rounded-2xl border border-slate-200 bg-white p-6">
            <h2 className="text-2xl font-bold">SIM and navigation advice</h2>
            <p className="mt-4 leading-8 text-slate-700">
              Buy a tourist SIM or activate roaming before leaving the airport.
              Keep navigation running for your first drive, especially around
              terminal exits and Sheikh Zayed Road interchanges.
            </p>
          </article>
        </div>
      </section>

      <section className="px-4 py-12 md:px-8">
        <div className="mx-auto grid max-w-7xl gap-7 lg:grid-cols-2">
          <article>
            <h2 className="text-3xl font-bold">Salik and parking tips for tourists</h2>
            <div className="mt-6 grid gap-3">
              {salikTips.map((tip) => (
                <p key={tip} className="rounded-xl border border-slate-200 bg-white p-4 leading-7 text-slate-700">
                  {tip}
                </p>
              ))}
            </div>
          </article>
          <article>
            <h2 className="text-3xl font-bold">Tourist driving tips in the UAE</h2>
            <div className="mt-6 grid gap-3">
              {touristTips.map((tip) => (
                <p key={tip} className="rounded-xl border border-slate-200 bg-white p-4 leading-7 text-slate-700">
                  {tip}
                </p>
              ))}
            </div>
          </article>
        </div>
      </section>

      <section className="bg-slate-50 px-4 py-12 md:px-8">
        <div className="mx-auto grid max-w-7xl gap-7 lg:grid-cols-[1fr_0.9fr] lg:items-center">
          <article>
            <h2 className="text-3xl font-bold">Airport arrivals, departure areas and handover timing</h2>
            <p className="mt-5 leading-8 text-slate-700">
              After landing at DXB, give yourself time for immigration, baggage
              and customs. A tourist with checked bags may take longer than a
              passenger with cabin luggage only. That is why WhatsApp support is
              helpful: you can update your timing after landing instead of
              guessing before the flight.
            </p>
          </article>
          <div className="relative aspect-[16/11] overflow-hidden rounded-2xl bg-slate-100">
            <Image
              src="/destinations/dubai-airport/dxb-arrivals-departures.jpg"
              alt="Dubai Airport departures and arrivals area for DXB car rental planning"
              fill
              loading="lazy"
              sizes="(max-width: 1024px) 100vw, 44vw"
              className="object-cover"
            />
          </div>
        </div>
      </section>

      <section className="px-4 py-12 md:px-8">
        <div className="mx-auto max-w-7xl rounded-2xl bg-gradient-to-r from-purple-800 to-fuchsia-700 p-6 text-white md:p-8">
          <h2 className="text-3xl font-bold">Book Dubai Airport car rental before you land</h2>
          <p className="mt-4 max-w-3xl leading-8 text-slate-200">
            Choose your car online, send your flight details on WhatsApp and ask
            about selected no-deposit options. AMJ Drive keeps airport bookings
            clear with no hidden charges, practical cars and support for tourists
            arriving at Terminal 1, Terminal 2 or Terminal 3.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Link href="/vehicle" className="rounded-xl bg-white px-6 py-4 text-center font-semibold text-slate-950">
              Book Online
            </Link>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-xl bg-green-500 px-6 py-4 text-center font-semibold text-white"
            >
              WhatsApp Support
            </a>
          </div>
        </div>
      </section>

      <section className="px-4 py-12 md:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-purple-700">
                Airport Rental Cars
              </p>
              <h2 className="mt-2 text-3xl font-bold">Popular cars for Dubai Airport pickup</h2>
              <p className="mt-4 max-w-3xl leading-8 text-slate-700">
                These cars suit tourists arriving at DXB who want a practical vehicle for hotel transfers,
                Dubai city driving, JBR, Dubai Marina, Downtown Dubai, Business Bay or longer UAE stays.
              </p>
            </div>
            <Link href="/vehicle" className="font-semibold text-purple-700 hover:text-purple-900">
              View all cars
            </Link>
          </div>

          <div className="mt-7 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {airportCarSlugs.map((slug) => {
              const car = vehicleData.find((item) => item.slug === slug);

              if (!car) {
                return null;
              }

              return (
                <article
                  key={car.slug}
                  className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
                >
                  <div className="relative aspect-[4/3] bg-slate-50">
                    <Image
                      src={car.image}
                      alt={`${car.name} for Dubai Airport car rental pickup at DXB`}
                      fill
                      loading="lazy"
                      sizes="(max-width: 1024px) 100vw, 33vw"
                      className="object-contain p-6"
                    />
                  </div>
                  <div className="p-6">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-lg bg-purple-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-purple-700">
                        {car.category}
                      </span>
                      {car.allowNoDeposit ? (
                        <span className="rounded-lg bg-green-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-green-700">
                          No deposit option
                        </span>
                      ) : null}
                    </div>
                    <h3 className="mt-4 text-2xl font-bold">{car.name}</h3>
                    <p className="mt-3 text-sm leading-7 text-slate-700">
                      {airportCarNotes[car.slug]}
                    </p>
                    <div className="mt-4 grid grid-cols-3 gap-2 text-center text-sm text-slate-700">
                      <span className="rounded-lg bg-slate-50 px-2 py-2">
                        AED {car.dailyPrice}/day
                      </span>
                      <span className="rounded-lg bg-slate-50 px-2 py-2">
                        AED {car.weeklyPrice}/week
                      </span>
                      <span className="rounded-lg bg-slate-50 px-2 py-2">
                        AED {car.monthlyPrice}/month
                      </span>
                    </div>
                    <div className="mt-5 grid gap-3 sm:grid-cols-2">
                      <Link
                        href={`/booking/${car.slug}`}
                        className="rounded-xl bg-purple-700 px-4 py-3 text-center font-semibold text-white"
                      >
                        Book Now
                      </Link>
                      <a
                        href={`${whatsappUrl}%20-%20${encodeURIComponent(car.name)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded-xl bg-green-500 px-4 py-3 text-center font-semibold text-white"
                      >
                        WhatsApp
                      </a>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>
      <section className="bg-slate-50 px-4 py-12 md:px-8">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-3xl font-bold">Related guides and nearby Dubai areas</h2>
          <div className="mt-7 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {relatedLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-2xl border border-slate-200 bg-white p-5 transition hover:border-purple-500"
              >
                <h3 className="text-lg font-bold text-slate-950">{link.label}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-700">{link.text}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-12 md:px-8">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-3xl font-bold">Dubai airport car rental FAQs</h2>
          <div className="mt-7 space-y-4">
            {faqs.map((faq) => (
              <details key={faq.question} className="rounded-2xl border border-slate-200 bg-white p-5">
                <summary className="cursor-pointer list-none font-semibold">
                  {faq.question}
                </summary>
                <p className="mt-4 leading-7 text-slate-700">{faq.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 pb-8 md:px-8">
        <div className="mx-auto max-w-7xl text-sm text-slate-600">
          <p>
            Last Updated: <span className="font-semibold text-slate-800">{lastUpdated}</span>
          </p>
          <p className="mt-4 text-xs font-semibold text-slate-700">Image credits</p>
          <p className="mt-1 text-xs leading-6">
            {imageCredits.map((credit, index) => (
              <span key={credit.href}>
                <a href={credit.href} target="_blank" rel="noopener noreferrer" className="underline">
                  {credit.label}
                </a>{" "}
                by {credit.author}, {credit.license}
                {index < imageCredits.length - 1 ? "; " : "."}
              </span>
            ))}
          </p>
        </div>
      </section>

      <Footer />
    </main>
  );
}
