import type { Metadata } from "next";
import SeoLandingPage from "@/app/components/SeoLandingPage";
import { getCars } from "@/lib/cars";
import { getFeaturedVehicles } from "@/lib/landing-pages";

export const metadata: Metadata = {
  title: "Car Rental Ajman",
  description:
    "Explore AMJDrive car rental in Ajman with daily, weekly, and monthly options, real vehicle pages, and direct links to book online or contact on WhatsApp.",
  alternates: {
    canonical: "/car-rental-ajman",
  },
  openGraph: {
    title: "Car Rental Ajman | AMJ Drive",
    description:
      "Browse AMJDrive rental cars for Ajman and continue directly to the live vehicle and booking pages.",
    url: "/car-rental-ajman",
    type: "website",
  },
};

export default async function CarRentalAjmanPage() {
  const cars = await getCars();
  const featuredVehicles = getFeaturedVehicles(cars, [
    "nissan-sunny",
    "suzuki-ciaz",
    "toyota-raize",
  ]).map((vehicle, index) => ({
    ...vehicle,
    tag: ["Ajman daily rental", "Longer drives", "Compact SUV"][index],
    summary: [
      "Nissan Sunny is one of the clearest starting points for Ajman renters who want a budget-friendly sedan with an easy next step into the booking page.",
      "Suzuki Ciaz offers more cabin and baggage room for renters in Ajman who still want a sedan and a straightforward daily or monthly booking option.",
      "Toyota Raize works well for renters who want SUV practicality while still keeping the car compact for regular driving around Ajman and nearby emirates.",
    ][index],
  }));

  return (
    <SeoLandingPage
      path="/car-rental-ajman"
      eyebrow="Ajman Car Rental"
      title="Car rental in Ajman with clear routes to live AMJDrive bookings"
      description="Use this page to compare useful AMJDrive rental options for Ajman, understand what to prepare before booking, and move into the real vehicle and booking pages without extra steps."
      intro="AMJDrive serves Ajman and the wider nearby area. The goal here is not to repeat the homepage, but to help Ajman renters get to the right next action faster: view suitable cars, jump to the general vehicle list, or open a direct booking page like Nissan Sunny."
      heroImage={{
        src: "/vehicle/suzuki-ciaz.jpg",
        alt: "Suzuki Ciaz available for Ajman car rental at AMJDrive",
      }}
      highlights={[
        {
          title: "Ajman-friendly starting point",
          description:
            "The booking flow already defaults common search values to Ajman, which makes it a natural starting point for local renters.",
        },
        {
          title: "Free self-pickup info",
          description:
            "AMJDrive terms state that free self-pickup is available in Ajman and Sharjah, with delivery and collection charges depending on location.",
        },
        {
          title: "Real pricing structure",
          description:
            "Vehicle pages show daily, weekly, and monthly rates, plus deposit waiver details on supported cars.",
        },
      ]}
      sections={[
        {
          title: "Good for short and flexible rentals",
          description:
            "If you need a car in Ajman for a day, a work week, or a longer stay, AMJDrive gives you a visible path from vehicle discovery to booking. That makes this page useful for renters who want context first and then a clean route into the actual order flow.",
        },
        {
          title: "How to choose the right category",
          description:
            "Economy sedans are a practical fit when cost and simplicity matter most. If you need more luggage room or a higher driving position, a compact SUV can be the better match. Use the featured car cards below as quick entry points, then compare the rest on the main vehicle page.",
        },
        {
          title: "Documents and booking support",
          description:
            "AMJDrive states that residents usually need Emirates ID and UAE driving license, while tourists usually need passport, visit visa, driving license, and entry stamp. If you want to confirm your case before booking, the WhatsApp CTA is the fastest way to ask.",
        },
      ]}
      featuredVehicles={featuredVehicles}
      faqTitle="Ajman car rental FAQs"
      faqs={[
        {
          question: "Is this page only for people staying in Ajman?",
          answer:
            "No. It is written for renters who want a car in Ajman, but AMJDrive also serves Sharjah, Dubai, and UAQ through the same website and booking system.",
        },
        {
          question: "Can I book a sedan directly from here?",
          answer:
            "Yes. Use one of the direct links such as /booking/nissan-sunny, or open /vehicle to compare more cars first.",
        },
        {
          question: "Does AMJDrive offer monthly options from Ajman pages too?",
          answer:
            "Yes. Every featured vehicle on this page includes a monthly booking link in addition to the standard booking link.",
        },
        {
          question: "Where should I ask about delivery or collection charges?",
          answer:
            "The quickest option is the WhatsApp CTA on this page. AMJDrive terms note that delivery and collection charges can vary by location.",
        },
      ]}
      ctaTitle="Ready to book your Ajman rental?"
      ctaDescription="Go to the live AMJDrive vehicle list for a wider comparison, or open one of the direct booking pages if you already know which car you want."
      primaryCtaLabel="View Cars"
      secondaryCtaLabel="Check Monthly Plans"
      secondaryCtaHref="/monthly-car-rental-ajman"
      whatsAppCtaLabel="WhatsApp Booking"
      quickLinks={[
        { href: "/monthly-car-rental-ajman", label: "Monthly Car Rental Ajman" },
        { href: "/booking/nissan-sunny", label: "Nissan Sunny" },
        { href: "/booking/mitsubishi-attrage", label: "Mitsubishi Attrage" },
        { href: "/booking/hyundai-creta", label: "Hyundai Creta" },
        { href: "/booking/mitsubishi-xpander", label: "Mitsubishi Xpander" },
      ]}
    />
  );
}

