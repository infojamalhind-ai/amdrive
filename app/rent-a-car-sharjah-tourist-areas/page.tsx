import type { Metadata } from "next";
import SeoLandingPage from "@/app/components/SeoLandingPage";
import { getCars } from "@/lib/cars";
import { getFeaturedVehicles } from "@/lib/landing-pages";

export const metadata: Metadata = {
  title: "Rent a Car Near Sharjah Museums, Gold Souk & Al Qasba | AMJDrive",
  description:
    "Affordable car rental near Sharjah Museum, Gold Souk, Al Qasba and major Sharjah attractions. No deposit options and delivery available.",
  alternates: {
    canonical: "/rent-a-car-sharjah-tourist-areas",
  },
  openGraph: {
    title: "Rent a Car Near Sharjah Museums, Gold Souk & Al Qasba | AMJDrive",
    description:
      "Affordable car rental near Sharjah Museum, Gold Souk, Al Qasba and major Sharjah attractions. No deposit options and delivery available.",
    url: "/rent-a-car-sharjah-tourist-areas",
    type: "website",
  },
};

export default async function RentACarSharjahTouristAreasPage() {
  const cars = await getCars();
  const featuredVehicles = getFeaturedVehicles(cars, [
    "nissan-sunny",
    "suzuki-ciaz",
    "mitsubishi-xpander",
  ]).map((vehicle, index) => ({
    ...vehicle,
    tag: ["Tourist area sedan", "Comfort sedan", "Family rental"][index],
    summary: [
      "Nissan Sunny is a practical choice for affordable car rental near Sharjah Museum, Gold Souk, Al Qasba, and Sharjah Corniche.",
      "Suzuki Ciaz gives tourists, residents, and visitors extra sedan comfort when driving between Al Majaz Waterfront and other Sharjah landmarks.",
      "Mitsubishi Xpander is useful when your Sharjah tourist-area rental needs family space, luggage room, or monthly rental flexibility.",
    ][index],
  }));

  return (
    <SeoLandingPage
      path="/rent-a-car-sharjah-tourist-areas"
      eyebrow="Sharjah Tourist Area Car Rental"
      title="Car Rental Near Sharjah Tourist Attractions With Delivery Available"
      description="Affordable car rental near Sharjah Museum, Gold Souk, Al Qasba, Al Majaz Waterfront, Sharjah Corniche, and major Sharjah attractions with no deposit options and delivery available."
      intro="AMJDrive is a convenient choice for tourists, residents, and visitors needing car rental near Sharjah landmarks, with daily, weekly, and monthly plans plus WhatsApp booking support."
      heroImage={{
        src: "/vehicle/suzuki-ciaz.jpg",
        alt: "Suzuki Ciaz available for car rental near Sharjah tourist attractions at AMJDrive",
      }}
      highlights={[
        {
          title: "Delivery Available To Tourist Areas",
          description:
            "Delivery is available near Sharjah Museum area, Sharjah Gold Souk, Al Qasba, Al Majaz Waterfront, and Sharjah Corniche.",
        },
        {
          title: "No Deposit Options",
          description:
            "Choose supported AMJDrive vehicles with no deposit options for a simpler Sharjah landmark-area rental.",
        },
        {
          title: "Daily, Weekly And Monthly Rentals",
          description:
            "Book short tourist trips, weekly stays, or monthly rentals through the same AMJDrive booking flow.",
        },
        {
          title: "Economy And Family Cars Available",
          description:
            "Compare economy cars, comfortable sedans, SUVs, and family-friendly 7-seater options online.",
        },
      ]}
      sections={[
        {
          title: "Rental cars near Sharjah landmarks",
          description:
            "AMJDrive helps tourists, residents, and visitors rent near the Sharjah Museum area, Sharjah Gold Souk, Al Qasba, Al Majaz Waterfront, and Sharjah Corniche without a long search process.",
        },
        {
          title: "Delivery available to tourist areas",
          description:
            "If you are staying near a museum, souk, waterfront, hotel, or family attraction in Sharjah, use WhatsApp to confirm delivery availability, timing, and the best pickup point before booking.",
        },
        {
          title: "Flexible plans for visitors and residents",
          description:
            "Daily rentals fit sightseeing and short errands, weekly rentals work for temporary stays, and monthly rentals are useful when you need regular transport around Sharjah attractions and nearby emirates.",
        },
      ]}
      featuredVehicles={featuredVehicles}
      faqTitle="Sharjah tourist area car rental FAQs"
      faqs={[
        {
          question: "Can you deliver near Sharjah Museum?",
          answer:
            "Yes. AMJDrive can support delivery near the Sharjah Museum area. Message on WhatsApp to confirm the exact location and timing.",
        },
        {
          question: "Car rental near Gold Souk?",
          answer:
            "Yes. You can book car rental near Sharjah Gold Souk and use WhatsApp to confirm pickup or delivery details before the rental starts.",
        },
        {
          question: "Delivery available in Al Qasba?",
          answer:
            "Yes. Delivery is available around Al Qasba and nearby Sharjah tourist areas, subject to confirmation with AMJDrive.",
        },
        {
          question: "Tourist documents accepted?",
          answer:
            "Yes. Tourists can rent when they provide the required documents, usually passport, visit visa, valid driving license, and entry stamp.",
        },
        {
          question: "Monthly rental available?",
          answer:
            "Yes. AMJDrive offers monthly rental options for tourists, residents, and visitors who need a car near Sharjah landmarks for longer stays.",
        },
      ]}
      ctaTitle="Need a car near Sharjah attractions?"
      ctaDescription="View available AMJDrive cars or message on WhatsApp to ask about delivery, no deposit options, tourist documents, and daily, weekly, or monthly plans."
      primaryCtaLabel="View Cars"
      whatsAppCtaLabel="WhatsApp Booking"
      quickLinks={[
        { href: "/vehicle", label: "View Cars" },
        { href: "/car-rental-sharjah", label: "Car Rental Sharjah" },
        {
          href: "/sharjah-airport-car-rental",
          label: "Sharjah Airport Car Rental",
        },
      ]}
    />
  );
}
