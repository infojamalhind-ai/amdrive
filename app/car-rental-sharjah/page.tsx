import type { Metadata } from "next";
import SeoLandingPage from "@/app/components/SeoLandingPage";
import { getCars } from "@/lib/cars";
import { getFeaturedVehicles } from "@/lib/landing-pages";

export const metadata: Metadata = {
  title: "Car Rental Sharjah",
  description:
    "Book car rental in Sharjah with AMJDrive. Browse daily, weekly, and flexible booking options, see real vehicles, and contact AMJDrive on WhatsApp for fast support.",
  alternates: {
    canonical: "/car-rental-sharjah",
  },
  openGraph: {
    title: "Car Rental Sharjah | AMJ Drive",
    description:
      "Book car rental in Sharjah with AMJDrive using real online vehicle pages and fast WhatsApp support.",
    url: "/car-rental-sharjah",
    type: "website",
  },
};

export default async function CarRentalSharjahPage() {
  const cars = await getCars();
  const featuredVehicles = getFeaturedVehicles(cars, [
    "nissan-sunny",
    "mitsubishi-attrage",
    "nissan-magnite",
  ]).map((vehicle, index) => ({
    ...vehicle,
    tag: ["Sharjah city driving", "Value daily rental", "Extra space"][index],
    summary: [
      "The Nissan Sunny is a practical option for Sharjah commutes, errands, and everyday driving with a straightforward daily and monthly booking path.",
      "The Mitsubishi Attrage fits drivers who want a simple economy rental with easy online booking and transparent AMJDrive pricing.",
      "The Nissan Magnite gives you more cabin and luggage room when your Sharjah rental needs a compact SUV instead of a sedan.",
    ][index],
  }));

  return (
    <SeoLandingPage
      path="/car-rental-sharjah"
      eyebrow="Sharjah Car Rental"
      title="Car rental in Sharjah with real online booking pages"
      description="AMJDrive serves Sharjah with bookable daily and monthly rental cars, WhatsApp support, and a live vehicle catalog you can browse before you commit."
      intro="This page is built for people comparing rental options in Sharjah and wanting a direct path to the actual AMJDrive booking pages. You can review real cars, jump to the full /vehicle listing, or go straight to a specific booking page such as Nissan Sunny."
      heroImage={{
        src: "/vehicle/nissan-sunny.jpg",
        alt: "Nissan Sunny available for Sharjah car rental at AMJDrive",
      }}
      highlights={[
        {
          title: "Service coverage",
          description:
            "AMJDrive serves Sharjah, Ajman, Dubai, and UAQ, so you can start in Sharjah and still book through the same main vehicle catalog.",
        },
        {
          title: "Direct booking paths",
          description:
            "Every CTA on this page leads to the real AMJDrive vehicle list or live booking routes rather than generic inquiry forms.",
        },
        {
          title: "Support on WhatsApp",
          description:
            "If you need help choosing a vehicle or confirming requirements, AMJDrive can be reached by phone at +971582211457 or WhatsApp at +971526959007.",
        },
      ]}
      sections={[
        {
          title: "Useful for Sharjah daily driving",
          description:
            "Sharjah renters often need a simple, reliable car for work, family pickup, or a few days of city driving. This page highlights practical AMJDrive options that keep the next step obvious: browse the full fleet, then continue to the exact booking page for the car you want.",
        },
        {
          title: "Built around real AMJDrive flow",
          description:
            "AMJDrive already has a working vehicle list and individual booking pages. Instead of repeating the same information in a thin city page, this landing page helps you compare suitable cars for Sharjah and then moves you into the existing booking flow without changing it.",
        },
        {
          title: "What to check before booking",
          description:
            "Review the car category, seating, minimum rental period, and whether the vehicle has a deposit waiver. Residents usually need Emirates ID and UAE driving license, while tourists usually need passport, visa, driving license, and entry stamp.",
        },
      ]}
      featuredVehicles={featuredVehicles}
      faqTitle="Sharjah car rental FAQs"
      faqs={[
        {
          question: "Does AMJDrive serve Sharjah?",
          answer:
            "Yes. AMJDrive lists Sharjah as one of its service areas alongside Ajman, Dubai, and UAQ.",
        },
        {
          question: "Can I go straight to the vehicle list from this page?",
          answer:
            "Yes. Use the Book Now button to open the live /vehicle page, then continue to the booking page for the car that fits your rental.",
        },
        {
          question: "Which cars are a practical match for Sharjah city use?",
          answer:
            "Economy sedans like Nissan Sunny and Mitsubishi Attrage are practical for straightforward city driving, while compact SUVs like Nissan Magnite add more room if you need it.",
        },
        {
          question: "Can I ask questions on WhatsApp before paying?",
          answer:
            "Yes. This page includes a direct WhatsApp CTA so you can confirm availability, documents, or delivery details with AMJDrive before moving ahead.",
        },
      ]}
      ctaTitle="Need a rental in Sharjah today?"
      ctaDescription="Open the vehicle catalog to compare available AMJDrive cars, or message on WhatsApp if you want help choosing between daily and monthly options."
      primaryCtaLabel="View Cars"
      whatsAppCtaLabel="WhatsApp Booking"
      quickLinks={[
        { href: "/no-deposit-car-rental-sharjah", label: "No Deposit Car Rental Sharjah" },
        { href: "/monthly-car-rental-sharjah", label: "Monthly Car Rental Sharjah" },
        { href: "/booking/nissan-sunny", label: "Nissan Sunny" },
        { href: "/booking/mitsubishi-attrage", label: "Mitsubishi Attrage" },
        { href: "/booking/hyundai-creta", label: "Hyundai Creta" },
        { href: "/booking/mitsubishi-xpander", label: "Mitsubishi Xpander" },
      ]}
    />
  );
}

