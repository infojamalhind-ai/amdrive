import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Footer from "@/app/components/Footer";
import Header from "@/app/components/Header";
import { getAbsoluteUrl } from "@/lib/site-url";
import SafeBlogImage from "./SafeBlogImage";

const pagePath = "/blog/sharjah-paid-parking-guide";
const pageTitle =
  "Sharjah Paid Parking Guide: Blue Sign, Timings, SMS Payment & Common Mistakes";
const pageDescription =
  "A practical Sharjah paid parking guide for drivers, including blue sign timings, 5566 SMS payment format, extension reminders, and common parking mistakes.";

const sources = [
  {
    label: "Sharjah Municipality SMS parking FAQ",
    href: "https://ppd.shjmun.gov.ae/faq",
  },
  {
    label: "Sharjah Municipality SMS parking how it works",
    href: "https://ppd.shjmun.gov.ae/howitworks",
  },
  {
    label: "Khaleej Times report on Sharjah blue sign parking hours",
    href: "https://www.khaleejtimes.com/uae/transport/sharjah-announces-new-paid-parking-hours-for-7-day-zones",
  },
];

const faqs = [
  {
    question: "What are the normal Sharjah paid parking timings?",
    answer:
      "In many standard Sharjah paid parking areas, drivers commonly follow 8 AM to 10 PM. Always check the nearest parking board before leaving the car, because special zones can have different timings.",
  },
  {
    question: "What does the blue parking information sign mean in Sharjah?",
    answer:
      "Blue information sign zones are seven-day paid parking areas. They are paid from 8 AM to 12 midnight, including Fridays and public holidays.",
  },
  {
    question: "What number do I send Sharjah parking SMS to?",
    answer:
      "Send the Sharjah parking SMS to 5566. For a private UAE plate, the common format is plate source, plate number, and duration in hours.",
  },
  {
    question: "How do I extend Sharjah SMS parking?",
    answer:
      "Sharjah Municipality says a reminder is sent 10 minutes before expiry. To extend, send Y to 5566 before the current parking session expires.",
  },
];

const internalLinks = [
  {
    href: "/vehicle",
    label: "View available cars",
    text: "Browse AMJDrive vehicles for Sharjah, Ajman, Dubai, and UAQ trips.",
    image: "/vehicle/nissan-sunny.jpg",
    alt: "Nissan Sunny rental car available on AMJDrive",
  },
  {
    href: "/rent-a-car-sharjah",
    label: "Rent a car Sharjah",
    text: "Simple rental options for daily driving around Sharjah.",
    image: "/vehicle/mitsubishi-attrage.jpg",
    alt: "Mitsubishi Attrage rental car for Sharjah",
  },
  {
    href: "/rent-a-car-ajman",
    label: "Rent a car Ajman",
    text: "Car rental choices for nearby Ajman routes and errands.",
    image: "/vehicle/toyota-raize.jpg",
    alt: "Toyota Raize rental car for Ajman",
  },
  {
    href: "/rent-a-car-umm-al-quwain",
    label: "Rent a car Umm Al Quwain",
    text: "Comfortable rentals for longer UAE drives and UAQ visits.",
    image: "/vehicle/suzuki-ertiga.jpg",
    alt: "Suzuki Ertiga rental car for Umm Al Quwain",
  },
];

export const metadata: Metadata = {
  title: `${pageTitle} | AMJDrive`,
  description: pageDescription,
  alternates: {
    canonical: pagePath,
  },
  openGraph: {
    title: `${pageTitle} | AMJDrive`,
    description: pageDescription,
    url: pagePath,
    type: "article",
  },
};

export default function SharjahPaidParkingGuidePage() {
  const articleStructuredData = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: pageTitle,
    description: pageDescription,
    url: getAbsoluteUrl(pagePath),
    datePublished: "2026-05-06",
    dateModified: "2026-05-06",
    publisher: {
      "@type": "Organization",
      name: "AMJDrive",
      url: getAbsoluteUrl("/"),
    },
    image: [
      getAbsoluteUrl("/blog/sharjah-blue-parking-sign.jpg"),
      getAbsoluteUrl("/blog/sharjah-parking-meter.jpg"),
      getAbsoluteUrl("/blog/sharjah-sms-parking-example.avif"),
    ],
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleStructuredData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqStructuredData) }}
      />

      <article>
        <section className="bg-[#f7c600] px-4 py-12 text-slate-950 md:px-8 md:py-16">
          <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[minmax(0,1fr)_420px] lg:items-center">
            <div>
              <p className="inline-flex bg-slate-950 px-4 py-2 text-sm font-semibold uppercase tracking-[0.18em] text-white">
                Sharjah Parking Guide
              </p>
              <h1 className="mt-4 text-4xl font-bold leading-tight sm:text-5xl">
                Sharjah Paid Parking Guide: Blue Sign, Timings, SMS Payment &
                Common Mistakes
              </h1>
              <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-900">
                Parking in Sharjah is simple once you know one small detail: not
                every paid parking sign follows the same timing. The regular
                street may finish earlier, but the blue information sign zone can
                keep charging until midnight.
              </p>

              <div className="mt-8 grid gap-4 sm:grid-cols-3">
                <div className="border-2 border-slate-950 bg-white p-5 shadow-[6px_6px_0_#0f172a]">
                  <p className="text-sm font-semibold text-slate-600">Standard timing</p>
                  <p className="mt-2 text-2xl font-bold">8 AM to 10 PM</p>
                </div>
                <div className="border-2 border-slate-950 bg-[#0877ad] p-5 text-white shadow-[6px_6px_0_#0f172a]">
                  <p className="text-sm font-semibold text-sky-100">Blue sign zones</p>
                  <p className="mt-2 text-2xl font-bold">8 AM to 12 midnight</p>
                </div>
                <div className="border-2 border-slate-950 bg-white p-5 shadow-[6px_6px_0_#0f172a]">
                  <p className="text-sm font-semibold text-slate-600">SMS parking number</p>
                  <p className="mt-2 text-2xl font-bold">5566</p>
                </div>
              </div>
            </div>

            <div className="border-4 border-slate-950 bg-white p-4 text-slate-950 shadow-[10px_10px_0_#0f172a]">
              <div className="bg-sky-700 p-6 text-white">
                <p className="text-sm font-bold uppercase tracking-[0.2em]">
                  Blue Sign Zone
                </p>
                <p className="mt-3 text-4xl font-black">8 AM - 12 Midnight</p>
                <p className="mt-3 text-lg font-semibold">
                  Paid seven days, including Fridays and public holidays
                </p>
              </div>
              <div className="grid grid-cols-2 gap-3 bg-slate-100 p-4">
                <div className="bg-white p-4 shadow-sm">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Pay By SMS
                  </p>
                  <p className="mt-1 text-2xl font-black">5566</p>
                </div>
                <div className="bg-white p-4 shadow-sm">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Example
                  </p>
                  <p className="mt-1 font-mono text-xl font-black">
                    SHJ 12345 2
                  </p>
                </div>
              </div>
              <p className="p-4 text-sm leading-6 text-slate-600">
                Quick visual summary for Sharjah paid parking timings and SMS
                payment.
              </p>
            </div>
          </div>
        </section>

        <section className="px-4 py-10 md:px-8">
          <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[minmax(0,1fr)_300px]">
            <div className="space-y-10">
              <figure className="overflow-hidden border border-slate-200 bg-white shadow-sm">
                <SafeBlogImage
                  src="/blog/sharjah-blue-parking-sign.jpg"
                  alt="Sharjah blue parking sign paid until midnight"
                  label="Sharjah blue parking sign paid until midnight"
                />
                <figcaption className="border-t border-slate-200 p-4 text-sm leading-6 text-slate-600">
                  User-provided Sharjah paid parking sign image. Timing
                  information is referenced from official/source pages listed
                  below.
                </figcaption>
              </figure>

              <section className="prose prose-slate max-w-none">
                <h2>First, Check Which Sharjah Parking Zone You Are In</h2>
                <p>
                  Most drivers in Sharjah are used to paid parking being around
                  8 AM to 10 PM. That is the standard timing people normally
                  remember when they park near offices, shops, clinics, or busy
                  residential streets.
                </p>
                <p>
                  The mistake happens when the driver parks in a blue
                  information sign area and assumes the same timing. According
                  to the Khaleej Times report, Sharjah seven-day zones are
                  identified by blue parking information signs, and the revised
                  paid timing is from 8 AM to midnight. These zones operate all
                  week, including Fridays and public holidays.
                </p>
                <p>
                  In local words: before you walk away, look at the board. If it
                  is a blue sign zone, do not treat Friday night or a public
                  holiday like free parking.
                </p>
              </section>

              <figure className="overflow-hidden border border-slate-200 bg-white shadow-sm">
                <SafeBlogImage
                  src="/blog/sharjah-parking-meter.jpg"
                  alt="Sharjah paid parking meter"
                  label="Sharjah paid parking meter"
                />
                <figcaption className="border-t border-slate-200 p-4 text-sm leading-6 text-slate-600">
                  Placeholder for your own real Sharjah parking meter photo. No
                  third-party web image is copied into this page.
                </figcaption>
              </figure>

              <section className="prose prose-slate max-w-none">
                <h2>How To Pay Sharjah Parking By SMS</h2>
                <p>
                  Sharjah Municipality explains that UAE private plate drivers
                  can send an SMS to 5566 using the plate source, plate number,
                  and parking duration in hours. The page gives examples for
                  1, 2, 3, and 5 hours.
                </p>
                <div className="not-prose my-6 border-l-4 border-cyan-500 bg-cyan-50 p-5">
                  <p className="text-sm font-semibold uppercase tracking-[0.16em] text-cyan-800">
                    SMS Example
                  </p>
                  <p className="mt-2 font-mono text-2xl font-bold text-slate-950">
                    SHJ 12345 2
                  </p>
                  <p className="mt-3 text-sm leading-6 text-slate-700">
                    This means Sharjah plate source, plate number 12345, for 2
                    hours. Replace the plate number and duration with your own
                    details.
                  </p>
                </div>
                <p>
                  After you send the SMS, wait for the confirmation message.
                  Sharjah Municipality says the confirmation includes the
                  virtual permit details. Do not leave the car and assume it
                  worked if you have not received confirmation.
                </p>
              </section>

              <figure className="overflow-hidden border border-slate-200 bg-white shadow-sm">
                <SafeBlogImage
                  src="/blog/sharjah-sms-parking-example.avif"
                  alt="Sharjah SMS parking payment example 5566"
                  label="Sharjah SMS parking payment example 5566"
                />
                <figcaption className="border-t border-slate-200 p-4 text-sm leading-6 text-slate-600">
                  User-provided SMS parking visual for explaining the 5566
                  payment format.
                </figcaption>
              </figure>

              <section className="prose prose-slate max-w-none">
                <h2>How To Extend Before The Parking Expires</h2>
                <p>
                  Sharjah Municipality says a reminder SMS is sent 10 minutes
                  before the parking ticket expires. If you want to extend for
                  another hour, send Y to 5566.
                </p>
                <p>
                  The important part is timing. Send the extension before your
                  current parking session expires. If you remember after expiry,
                  do not assume the old ticket is still protecting you.
                </p>

                <h2>Common Sharjah Parking Mistakes</h2>
                <ul>
                  <li>
                    Parking in a blue sign zone and thinking payment stops at
                    10 PM.
                  </li>
                  <li>
                    Forgetting that blue sign zones are paid on Fridays and
                    public holidays.
                  </li>
                  <li>
                    Typing the wrong plate number, wrong plate source, or wrong
                    duration.
                  </li>
                  <li>
                    Walking away before the SMS confirmation arrives.
                  </li>
                  <li>
                    Trying to extend after the permit has already expired.
                  </li>
                  <li>
                    Looking at another street timing instead of the sign near
                    your own car.
                  </li>
                </ul>

                <h2>Quick Tip For Rental Car Drivers</h2>
                <p>
                  If you are driving a rental car in Sharjah, save the plate
                  source and plate number in your phone notes before your first
                  stop. When you park near busy areas like Al Majaz, Rolla, Al
                  Khan, university areas, clinics, or government offices, pay
                  first and then continue your work. It takes less than a minute
                  and avoids a headache later.
                </p>
              </section>

              <section className="border-4 border-slate-950 bg-[#f7c600] p-6 text-slate-950 shadow-[8px_8px_0_#0f172a]">
                <h2 className="text-2xl font-bold text-slate-900">
                  Useful AMJDrive Links
                </h2>
                <p className="mt-2 text-sm leading-6 text-slate-800">
                  Need a car for Sharjah, Ajman, or nearby UAE trips? Start
                  from these AMJDrive pages.
                </p>
                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  {internalLinks.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="group overflow-hidden bg-white text-slate-950 shadow-sm"
                    >
                      <div className="relative aspect-[16/10] bg-slate-100">
                        <Image
                          src={item.image}
                          alt={item.alt}
                          fill
                          sizes="(max-width: 768px) 100vw, 380px"
                          className="object-contain p-4 transition duration-300 group-hover:scale-[1.03]"
                        />
                      </div>
                      <div className="p-5">
                        <p className="text-lg font-bold text-cyan-800">
                          {item.label}
                        </p>
                        <p className="mt-2 text-sm leading-6 text-slate-600">
                          {item.text}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>

              <section>
                <h2 className="text-3xl font-bold text-slate-900">
                  Sharjah Parking FAQs
                </h2>
                <div className="mt-5 space-y-4">
                  {faqs.map((faq) => (
                    <details
                      key={faq.question}
                      className="border border-slate-200 bg-white p-5"
                    >
                      <summary className="cursor-pointer font-semibold text-slate-950">
                        {faq.question}
                      </summary>
                      <p className="mt-3 leading-7 text-slate-700">
                        {faq.answer}
                      </p>
                    </details>
                  ))}
                </div>
              </section>
            </div>

            <aside className="h-fit border border-slate-200 bg-slate-50 p-5 lg:sticky lg:top-28">
              <h2 className="text-lg font-bold text-slate-950">At a glance</h2>
              <dl className="mt-4 space-y-4 text-sm">
                <div>
                  <dt className="font-semibold text-slate-950">
                    Regular paid parking
                  </dt>
                  <dd className="mt-1 text-slate-700">Usually 8 AM to 10 PM</dd>
                </div>
                <div>
                  <dt className="font-semibold text-slate-950">
                    Blue sign zones
                  </dt>
                  <dd className="mt-1 text-slate-700">
                    8 AM to 12 midnight, seven days a week
                  </dd>
                </div>
                <div>
                  <dt className="font-semibold text-slate-950">SMS number</dt>
                  <dd className="mt-1 text-slate-700">5566</dd>
                </div>
                <div>
                  <dt className="font-semibold text-slate-950">
                    Extension SMS
                  </dt>
                  <dd className="mt-1 text-slate-700">
                    Send Y to 5566 before expiry
                  </dd>
                </div>
              </dl>

              <div className="mt-6 border-t border-slate-200 pt-5">
                <h2 className="text-lg font-bold text-slate-950">Sources</h2>
                <ul className="mt-3 space-y-3 text-sm leading-6">
                  {sources.map((source) => (
                    <li key={source.href}>
                      <a
                        href={source.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-semibold text-cyan-800 underline-offset-4 hover:underline"
                      >
                        {source.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </aside>
          </div>
        </section>
      </article>

      <Footer />
    </main>
  );
}
