import type { Metadata } from "next";
import type { Car } from "@/app/components/Vehicle";
import { vehicleData } from "@/app/vehicleData";
import { getCars } from "@/lib/cars";
import { getAbsoluteUrl } from "@/lib/site-url";

export const legacyProductSlugs = [
  "nissan-magnite",
  "mitsubishi-xpander-7-seater",
  "kia-seltos",
  "hyundai-creta",
] as const;

export type LegacyProductSlug = (typeof legacyProductSlugs)[number];

export type LegacyFaq = {
  question: string;
  answer: string;
};

type LegacyProductConfig = {
  slug: LegacyProductSlug;
  currentSlug?: string;
  name: string;
  title: string;
  description: string;
  intro: string;
  unavailable?: boolean;
  image: string;
  imageAlt: string;
  keyword: string;
  highlights: string[];
  useCases: string[];
  faqs: LegacyFaq[];
  relatedSlugs: string[];
};

export type LegacyPageConfig = {
  slug: string;
  path: string;
  title: string;
  description: string;
  eyebrow: string;
  heading: string;
  intro: string;
  sections: {
    title: string;
    body: string;
  }[];
  faqs: LegacyFaq[];
  featuredSlugs: string[];
};

function toCarFromStaticData(slug: string): Car | undefined {
  const car = vehicleData.find((item) => item.slug === slug);

  if (!car) {
    return undefined;
  }

  return {
    id: car.id,
    slug: car.slug,
    name: car.name,
    image: car.image,
    category: car.category,
    seats: car.seats,
    bags: car.bags,
    doors: car.doors,
    minimum_days: car.minimumDays,
    daily_price: car.dailyPrice,
    weekly_price: car.weeklyPrice,
    monthly_price: car.monthlyPrice,
    no_deposit_fee: car.noDepositFee,
    stock: 1,
    is_available: true,
    allow_no_deposit: car.allowNoDeposit,
    recommendedMonthlyPlan: car.monthlyPlans[0]
      ? {
          km: car.monthlyPlans[0].km,
          price: car.monthlyPlans[0].price,
        }
      : null,
  };
}

export async function getSeoCars() {
  const liveCars = await getCars();

  if (liveCars.length > 0) {
    return liveCars;
  }

  return vehicleData
    .map((item) => toCarFromStaticData(item.slug))
    .filter((car): car is Car => Boolean(car));
}

export function findSeoCar(cars: Car[], slug: string) {
  return cars.find((car) => car.slug === slug) ?? toCarFromStaticData(slug);
}

export function getRelatedCars(cars: Car[], slugs: string[]) {
  return slugs
    .map((slug) => findSeoCar(cars, slug))
    .filter((car): car is Car => Boolean(car))
    .slice(0, 3);
}

export const legacyProductConfigs: Record<LegacyProductSlug, LegacyProductConfig> = {
  "nissan-magnite": {
    slug: "nissan-magnite",
    currentSlug: "nissan-magnite",
    name: "Nissan Magnite",
    title: "Nissan Magnite Rental in Sharjah | AMJ Drive",
    description:
      "Book Nissan Magnite rental with AMJDrive for daily, weekly, or monthly car rental in Sharjah, Ajman, Dubai, and UAQ. No deposit options may be available.",
    intro:
      "The Nissan Magnite is a compact SUV for drivers who want easy city handling with more cabin height and luggage space than a small sedan. This legacy AMJDrive page keeps the old WordPress URL active while sending renters into the current booking system.",
    image: "/vehicle/nissan-magnite.jpg",
    imageAlt: "Nissan Magnite rental car at AMJDrive",
    keyword: "nissan magnite rental",
    highlights: [
      "Compact SUV size for Sharjah, Ajman, and Dubai driving.",
      "Automatic petrol vehicle with 5 seats and practical luggage space.",
      "Daily, weekly, and monthly booking paths stay connected to the live AMJDrive flow.",
      "No deposit car rental option may be available depending on selected terms.",
    ],
    useCases: [
      "Good fit for renters comparing a small SUV against economy sedans.",
      "Useful for airport, hotel, family, or work trips where a little extra space matters.",
      "A sensible choice for monthly car rental when you want SUV comfort without moving into a larger 7-seater.",
    ],
    faqs: [
      {
        question: "Can I book the Nissan Magnite online?",
        answer:
          "Yes. Use the Book Now button on this page to continue to the current AMJDrive Nissan Magnite booking route.",
      },
      {
        question: "Is the Nissan Magnite suitable for Sharjah driving?",
        answer:
          "Yes. The Magnite is compact enough for city driving while giving you SUV-style seating and more room than many small cars.",
      },
      {
        question: "Does AMJDrive offer no deposit car rental for the Magnite?",
        answer:
          "The vehicle data may show a deposit waiver option when available. Check the booking page for the latest deposit and waiver details.",
      },
    ],
    relatedSlugs: ["hyundai-creta", "mitsubishi-asx", "toyota-raize"],
  },
  "mitsubishi-xpander-7-seater": {
    slug: "mitsubishi-xpander-7-seater",
    currentSlug: "mitsubishi-xpander",
    name: "Mitsubishi Xpander 7 Seater",
    title: "Mitsubishi Xpander 7 Seater Rental | AMJ Drive",
    description:
      "Rent a Mitsubishi Xpander 7 seater with AMJDrive for family trips, daily rental, or monthly car rental in Sharjah, Ajman, Dubai, and UAQ.",
    intro:
      "The Mitsubishi Xpander is built for renters who need a real 7 seater rental without moving into a bulky van. This page preserves the legacy Xpander WordPress URL and points traffic to the current AMJDrive Mitsubishi Xpander booking pages.",
    image: "/vehicle/mitsubishi-xpander.jpg",
    imageAlt: "Mitsubishi Xpander 7 seater rental car at AMJDrive",
    keyword: "7 seater rental",
    highlights: [
      "Seven seats for family, staff, visitors, or group travel.",
      "Automatic petrol vehicle with flexible daily and monthly booking links.",
      "Useful for Sharjah and Ajman renters who need more passenger space.",
      "Clear route into the current AMJDrive booking and monthly rental pages.",
    ],
    useCases: [
      "Family rentals where 5 seats are not enough.",
      "Airport pickups, visitor transport, and longer UAE stays.",
      "Monthly car rental when capacity matters more than compact size.",
    ],
    faqs: [
      {
        question: "Is the Mitsubishi Xpander a 7 seater?",
        answer:
          "Yes. AMJDrive lists the Mitsubishi Xpander as a 7-seater option with space for passengers and luggage.",
      },
      {
        question: "Can I book the Xpander monthly?",
        answer:
          "Yes. This page links to the current monthly Mitsubishi Xpander booking route where monthly plans can be selected.",
      },
      {
        question: "Who should choose a 7 seater rental?",
        answer:
          "Choose a 7 seater if you are carrying family, guests, or a small group and want one vehicle instead of splitting into two cars.",
      },
    ],
    relatedSlugs: ["suzuki-ertiga", "hyundai-creta", "mitsubishi-asx"],
  },
  "kia-seltos": {
    slug: "kia-seltos",
    name: "Kia Seltos",
    title: "Kia Seltos Rental Alternatives | AMJ Drive",
    description:
      "Kia Seltos rental is currently unavailable at AMJDrive. Compare similar SUV options including Hyundai Creta, Mitsubishi ASX, and Nissan Magnite.",
    intro:
      "The old Kia Seltos URL still has search value, so this page remains active instead of returning a 404. The Kia Seltos is currently unavailable, but AMJDrive offers similar compact SUV choices that fit the same rental intent.",
    unavailable: true,
    image: "/vehicle/hyundai-creta.jpg",
    imageAlt: "Hyundai Creta SUV rental alternative at AMJDrive",
    keyword: "kia seltos rental",
    highlights: [
      "Kia Seltos is currently unavailable, so this page suggests live SUV alternatives.",
      "Hyundai Creta, Mitsubishi ASX, and Nissan Magnite cover similar compact SUV needs.",
      "Renters can still continue to real AMJDrive booking pages instead of hitting a dead page.",
      "Useful for people comparing SUV options for rent a car Sharjah searches.",
    ],
    useCases: [
      "Choose Hyundai Creta if you want a comfortable compact SUV.",
      "Choose Mitsubishi ASX if you want a slightly larger SUV feel.",
      "Choose Nissan Magnite if you want a value-focused compact SUV rental.",
    ],
    faqs: [
      {
        question: "Is Kia Seltos available at AMJDrive?",
        answer:
          "Kia Seltos is currently unavailable. This page remains live to help you compare similar AMJDrive SUV rentals.",
      },
      {
        question: "What is the closest Kia Seltos alternative?",
        answer:
          "Hyundai Creta, Mitsubishi ASX, and Nissan Magnite are the closest AMJDrive alternatives for compact SUV rental needs.",
      },
      {
        question: "Can I still book a similar SUV online?",
        answer:
          "Yes. Use the related vehicle links to continue to the current AMJDrive booking page for an available SUV.",
      },
    ],
    relatedSlugs: ["hyundai-creta", "mitsubishi-asx", "nissan-magnite"],
  },
  "hyundai-creta": {
    slug: "hyundai-creta",
    currentSlug: "hyundai-creta",
    name: "Hyundai Creta",
    title: "Hyundai Creta Rental in Sharjah | AMJ Drive",
    description:
      "Book Hyundai Creta rental with AMJDrive for SUV daily rental or monthly car rental in Sharjah, Ajman, Dubai, and UAQ.",
    intro:
      "The Hyundai Creta is a comfortable compact SUV for renters who want a higher seating position, practical space, and easy online booking. This legacy page preserves the old WordPress URL while connecting visitors to AMJDrive's current Creta booking route.",
    image: "/vehicle/hyundai-creta.jpg",
    imageAlt: "Hyundai Creta rental car at AMJDrive",
    keyword: "hyundai creta rental",
    highlights: [
      "Compact SUV with 5 seats, automatic transmission, and daily or monthly rental paths.",
      "A strong fit for rent a car Sharjah users who want comfort and flexible space.",
      "Direct Book Now button sends users to the current AMJDrive booking page.",
      "Monthly car rental links are included for longer stays and regular driving.",
    ],
    useCases: [
      "Daily SUV rental for errands, meetings, and visitor transport.",
      "Monthly rental for work routines, family use, or longer UAE stays.",
      "Alternative to Kia Seltos or Nissan Magnite when you want a roomier SUV.",
    ],
    faqs: [
      {
        question: "Can I rent the Hyundai Creta monthly?",
        answer:
          "Yes. AMJDrive provides a monthly Hyundai Creta booking path from this page and from the main vehicle listing.",
      },
      {
        question: "Is the Hyundai Creta good for family use?",
        answer:
          "Yes. It has 5 seats, SUV-style comfort, and practical luggage space for family or visitor trips.",
      },
      {
        question: "How do I book Hyundai Creta rental?",
        answer:
          "Use the Book Now button to open the current AMJDrive Hyundai Creta booking page and continue through the standard booking flow.",
      },
    ],
    relatedSlugs: ["nissan-magnite", "mitsubishi-asx", "toyota-raize"],
  },
};

export const legacyPageConfigs: Record<string, LegacyPageConfig> = {
  brands: {
    slug: "brands",
    path: "/brands",
    title: "Car Rental Brands in UAE | AMJ Drive",
    description:
      "Browse AMJDrive rental car brands including Nissan, Mitsubishi, Hyundai, Suzuki, and Toyota with daily and monthly booking options.",
    eyebrow: "Rental Brands",
    heading: "Car rental brands available through AMJDrive",
    intro:
      "Use this legacy brands page to compare the main makes in the AMJDrive fleet and move into the live vehicle or booking pages. It supports renters searching for rent a car Sharjah, no deposit car rental, and monthly car rental options by brand.",
    featuredSlugs: ["nissan-magnite", "hyundai-creta", "mitsubishi-xpander"],
    sections: [
      {
        title: "Nissan rentals",
        body:
          "Nissan options such as Sunny and Magnite cover economy sedan and compact SUV needs, with direct paths to daily and monthly booking pages.",
      },
      {
        title: "Mitsubishi rentals",
        body:
          "Mitsubishi choices include Attrage for value driving, ASX for SUV comfort, and Xpander for 7 seater rental needs.",
      },
      {
        title: "Hyundai, Suzuki, and Toyota",
        body:
          "Hyundai Creta, Suzuki Ciaz, Suzuki Ertiga, and Toyota Raize add more choices across sedan, SUV, and family rental use cases.",
      },
    ],
    faqs: [
      {
        question: "Which brands does AMJDrive rent?",
        answer:
          "AMJDrive commonly lists Nissan, Mitsubishi, Hyundai, Suzuki, and Toyota vehicles, depending on current availability.",
      },
      {
        question: "Can I book by brand?",
        answer:
          "Yes. Open the vehicle page and select the brand or model that fits your rental, then continue to the current booking page.",
      },
    ],
  },
  fleet: {
    slug: "fleet",
    path: "/fleet",
    title: "AMJDrive Fleet | Rent a Car Sharjah",
    description:
      "Explore the AMJDrive fleet for daily, weekly, and monthly car rental in Sharjah, Ajman, Dubai, and UAQ.",
    eyebrow: "Fleet",
    heading: "AMJDrive fleet for daily and monthly rental",
    intro:
      "This legacy fleet page keeps the old URL indexable while acting as a useful guide into the live /vehicle catalog. Compare sedans, SUVs, and 7-seater rentals, then continue to the exact booking page for the car you want.",
    featuredSlugs: ["nissan-sunny", "nissan-magnite", "mitsubishi-xpander"],
    sections: [
      {
        title: "Sedans for value rentals",
        body:
          "Sedans such as Nissan Sunny, Mitsubishi Attrage, and Suzuki Ciaz are practical for city driving, short trips, and budget-aware monthly car rental.",
      },
      {
        title: "SUVs for extra space",
        body:
          "Nissan Magnite, Hyundai Creta, Toyota Raize, and Mitsubishi ASX offer higher seating and more flexible luggage room for UAE driving.",
      },
      {
        title: "7 seaters for families",
        body:
          "Mitsubishi Xpander and Suzuki Ertiga support renters who need 7 seater rental options for family, guests, or group movement.",
      },
    ],
    faqs: [
      {
        question: "Where can I see all available cars?",
        answer:
          "Use the Browse All Vehicles link on this page to open the live AMJDrive /vehicle catalog.",
      },
      {
        question: "Does AMJDrive offer monthly car rental?",
        answer:
          "Yes. Many vehicles have monthly booking routes and plan options linked from the vehicle cards and landing pages.",
      },
    ],
  },
  faqs: {
    slug: "faqs",
    path: "/faqs",
    title: "Car Rental FAQs | AMJ Drive",
    description:
      "Answers to AMJDrive car rental questions about documents, deposits, no deposit car rental, fines, Salik, insurance, and monthly rental.",
    eyebrow: "FAQs",
    heading: "Car rental questions before you book",
    intro:
      "This page gives searchers and returning WordPress visitors a helpful FAQ hub before they enter the current AMJDrive booking flow.",
    featuredSlugs: ["nissan-sunny", "hyundai-creta", "mitsubishi-xpander"],
    sections: [
      {
        title: "Documents",
        body:
          "Residents usually need Emirates ID and UAE driving license. Tourists usually need passport, visit visa, driving license, and entry stamp.",
      },
      {
        title: "Deposit and waiver",
        body:
          "Some vehicles may support no deposit car rental or a deposit waiver. The booking page shows the latest vehicle-specific deposit details.",
      },
      {
        title: "Fines, Salik, and insurance",
        body:
          "Traffic fines, Salik, and post-rental charges are checked after the rental period. Basic insurance is included, with optional upgrades when available.",
      },
    ],
    faqs: [
      {
        question: "What documents are required to rent a car?",
        answer:
          "Residents usually need Emirates ID and UAE driving license. Tourists usually need passport, visit visa, driving license, and entry stamp.",
      },
      {
        question: "Do you offer no deposit car rental?",
        answer:
          "Selected vehicles may offer no deposit rental or a deposit waiver. Check the vehicle booking page for the latest terms.",
      },
      {
        question: "Can I book a monthly car rental?",
        answer:
          "Yes. AMJDrive has monthly booking routes for eligible vehicles, including sedans, SUVs, and 7-seater options.",
      },
      {
        question: "Which areas does AMJDrive serve?",
        answer:
          "AMJDrive serves Sharjah, Ajman, Dubai, and Umm Al Quwain, subject to availability and delivery arrangements.",
      },
    ],
  },
  "contact-us": {
    slug: "contact-us",
    path: "/contact-us",
    title: "Contact AMJDrive | Car Rental Sharjah",
    description:
      "Contact AMJDrive for rent a car Sharjah, no deposit car rental, daily rental, and monthly car rental support.",
    eyebrow: "Contact",
    heading: "Contact AMJDrive for rental help",
    intro:
      "Use this legacy contact page to reach AMJDrive before or during booking. You can call, WhatsApp, browse vehicles, or continue directly to daily and monthly car rental pages.",
    featuredSlugs: ["nissan-magnite", "hyundai-creta", "nissan-sunny"],
    sections: [
      {
        title: "Call or WhatsApp",
        body:
          "For fast help, call +971582211457 or WhatsApp +971526959007 to ask about availability, documents, delivery areas, or no deposit car rental options.",
      },
      {
        title: "Browse before contacting",
        body:
          "The live /vehicle page shows current AMJDrive cars and prices, so you can compare models before speaking with the team.",
      },
      {
        title: "Booking support",
        body:
          "If you already know the car you want, use the product or fleet links to move directly into the existing booking system.",
      },
    ],
    faqs: [
      {
        question: "What is the AMJDrive phone number?",
        answer:
          "You can call AMJDrive at +971582211457 or WhatsApp +971526959007 for booking support.",
      },
      {
        question: "Can I ask about availability before booking?",
        answer:
          "Yes. Contact AMJDrive before checkout if you want to confirm vehicle availability, documents, or delivery details.",
      },
    ],
  },
  "about-us": {
    slug: "about-us",
    path: "/about-us",
    title: "About AMJDrive | UAE Car Rental",
    description:
      "Learn about AMJDrive car rental services for Sharjah, Ajman, Dubai, and UAQ, including daily, weekly, and monthly rentals.",
    eyebrow: "About",
    heading: "AMJDrive car rental in the UAE",
    intro:
      "AMJDrive helps customers book practical rental cars online for daily, weekly, and monthly use. This legacy about page keeps old search equity active while explaining how the current Next.js booking experience works.",
    featuredSlugs: ["nissan-sunny", "hyundai-creta", "mitsubishi-xpander"],
    sections: [
      {
        title: "Built around real booking pages",
        body:
          "AMJDrive pages lead into active vehicle and booking routes instead of generic lead forms, helping renters make a clear choice.",
      },
      {
        title: "Practical vehicle mix",
        body:
          "The fleet covers economy sedans, compact SUVs, and 7-seater rental options for work, family, visitor, and monthly driving needs.",
      },
      {
        title: "Service areas",
        body:
          "AMJDrive serves Sharjah, Ajman, Dubai, and Umm Al Quwain, with support available by phone or WhatsApp.",
      },
    ],
    faqs: [
      {
        question: "What does AMJDrive offer?",
        answer:
          "AMJDrive offers daily, weekly, and monthly car rental options with online booking routes for eligible vehicles.",
      },
      {
        question: "Where does AMJDrive operate?",
        answer:
          "AMJDrive serves Sharjah, Ajman, Dubai, and Umm Al Quwain, subject to vehicle availability and booking details.",
      },
    ],
  },
};

export function getFaqSchema(faqs: LegacyFaq[]) {
  return {
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
}

export function getMetadata({
  title,
  description,
  path,
  image,
}: {
  title: string;
  description: string;
  path: string;
  image?: string;
}): Metadata {
  return {
    title,
    description,
    alternates: {
      canonical: path,
    },
    openGraph: {
      title,
      description,
      url: path,
      type: "website",
      images: image
        ? [
            {
              url: getAbsoluteUrl(image),
            },
          ]
        : undefined,
    },
  };
}

