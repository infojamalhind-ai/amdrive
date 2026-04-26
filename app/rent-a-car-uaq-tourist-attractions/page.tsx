import type { Metadata } from "next";
import SeoLandingPage from "@/app/components/SeoLandingPage";
import { getCars } from "@/lib/cars";
import { getFeaturedVehicles } from "@/lib/landing-pages";

export const metadata: Metadata = {
  title:
    "Rent a Car Near UAQ Flamingo Beach, Khor Al Beidah & Dreamland | AMJDrive",
  description:
    "Affordable car rental near Umm Al Quwain tourist attractions including Flamingo Beach, Khor Al Beidah and Dreamland. No deposit options and delivery available.",
  alternates: {
    canonical: "/rent-a-car-uaq-tourist-attractions",
  },
  openGraph: {
    title:
      "Rent a Car Near UAQ Flamingo Beach, Khor Al Beidah & Dreamland | AMJDrive",
    description:
      "Affordable car rental near Umm Al Quwain tourist attractions including Flamingo Beach, Khor Al Beidah and Dreamland. No deposit options and delivery available.",
    url: "/rent-a-car-uaq-tourist-attractions",
    type: "website",
  },
};

export default async function RentACarUaqTouristAttractionsPage() {
  const cars = await getCars();
  const featuredVehicles = getFeaturedVehicles(cars, [
    "nissan-sunny",
    "nissan-magnite",
    "mitsubishi-xpander",
  ]).map((vehicle, index) => ({
    ...vehicle,
    tag: ["UAQ tourist sedan", "Beach trip SUV", "Family attraction car"][index],
    summary: [
      "Nissan Sunny is a practical car rental option for tourists visiting Flamingo Beach, UAQ Corniche, and Umm Al Quwain Fort & Museum.",
      "Nissan Magnite gives visitors SUV practicality for Khor Al Beidah, Mangrove Beach, and beach-day drives around Umm Al Quwain.",
      "Mitsubishi Xpander is useful when your Dreamland Aqua Park or family tourist trip needs 7 seats and extra luggage space.",
    ][index],
  }));

  return (
    <SeoLandingPage
      path="/rent-a-car-uaq-tourist-attractions"
      eyebrow="UAQ Tourist Car Rental"
      title="Car Rental Near Umm Al Quwain Tourist Attractions"
      description="Affordable car rental near Flamingo Beach, Khor Al Beidah, Dreamland Aqua Park, UAQ Corniche, Umm Al Quwain Fort & Museum, and Mangrove Beach with delivery available."
      intro="AMJDrive helps tourists and visitors rent cars near Umm Al Quwain attractions with no deposit options, delivery support, and daily, weekly, or monthly rental plans."
      heroImage={{
        src: "/vehicle/nissan-magnite.jpg",
        alt: "Nissan Magnite available for car rental near Umm Al Quwain tourist attractions at AMJDrive",
      }}
      highlights={[
        {
          title: "Delivery Available",
          description:
            "Delivery is available near Flamingo Beach, Khor Al Beidah, Dreamland Aqua Park, UAQ Corniche, and Mangrove Beach.",
        },
        {
          title: "No Deposit Options",
          description:
            "Choose supported AMJDrive vehicles with no deposit options for a simpler tourist rental in Umm Al Quwain.",
        },
        {
          title: "Family & Tourist Friendly Cars",
          description:
            "Compare economy cars, SUVs, and 7-seater vehicles for beach visits, family trips, and attraction hopping.",
        },
        {
          title: "Affordable Daily & Monthly Rentals",
          description:
            "Book daily rentals for quick trips or monthly plans for longer stays around Umm Al Quwain and nearby emirates.",
        },
      ]}
      sections={[
        {
          title: "Delivery available to tourist destinations",
          description:
            "AMJDrive supports delivery near Umm Al Quwain tourist destinations such as Flamingo Beach, Khor Al Beidah, Dreamland Aqua Park, UAQ Corniche, Umm Al Quwain Fort & Museum, and Mangrove Beach.",
        },
        {
          title: "No deposit rental options",
          description:
            "Supported AMJDrive vehicles include no deposit options, helping tourists and visitors rent more easily before beach plans, sightseeing, or family days out.",
        },
        {
          title: "Daily, weekly and monthly rentals",
          description:
            "Daily rentals work well for a short UAQ visit, weekly rentals suit holiday stays, and monthly rentals are available when you need a car for longer trips or regular driving.",
        },
        {
          title: "Family cars and SUVs for beach and tourist trips",
          description:
            "Choose economy sedans for affordable drives, SUVs for comfort on beach and mangrove trips, or 7-seater cars for families visiting Dreamland Aqua Park and other UAQ attractions.",
        },
      ]}
      featuredVehicles={featuredVehicles}
      faqTitle="UAQ tourist attraction car rental FAQs"
      faqs={[
        {
          question: "Can you deliver near Flamingo Beach?",
          answer:
            "Yes. AMJDrive can support delivery near Flamingo Beach. Message on WhatsApp to confirm the exact location, timing, and vehicle availability.",
        },
        {
          question: "Car rental near Dreamland Aqua Park?",
          answer:
            "Yes. You can rent a car near Dreamland Aqua Park with AMJDrive and choose from daily, weekly, and monthly options.",
        },
        {
          question: "Rent a car near Khor Al Beidah?",
          answer:
            "Yes. AMJDrive supports car rental near Khor Al Beidah and nearby Umm Al Quwain tourist areas, subject to delivery confirmation.",
        },
        {
          question: "Are tourist rentals available?",
          answer:
            "Yes. Tourists can rent when they provide the required documents, usually passport, visit visa, valid driving license, and entry stamp.",
        },
        {
          question: "Monthly rental in UAQ available?",
          answer:
            "Yes. AMJDrive offers monthly rental options in Umm Al Quwain for tourists, visitors, families, and longer stays.",
        },
      ]}
      ctaTitle="Need a car near UAQ tourist attractions?"
      ctaDescription="View AMJDrive cars online or message on WhatsApp to ask about attraction-area delivery, no deposit options, tourist documents, and daily or monthly rental plans."
      primaryCtaLabel="View Cars"
      whatsAppCtaLabel="WhatsApp Booking"
      quickLinks={[
        { href: "/vehicle", label: "View Cars" },
        { href: "/car-rental-uaq", label: "Car Rental UAQ" },
        { href: "/car-rental-ajman", label: "Car Rental Ajman" },
      ]}
    />
  );
}
