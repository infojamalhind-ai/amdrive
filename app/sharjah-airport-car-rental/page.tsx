import type { Metadata } from "next";
import SeoLandingPage from "@/app/components/SeoLandingPage";
import { getCars } from "@/lib/cars";
import { getFeaturedVehicles } from "@/lib/landing-pages";

export const metadata: Metadata = {
  title: "Sharjah Airport Car Rental | No Deposit Options | AMJDrive",
  description:
    "Book car rental near Sharjah Airport with no deposit options and fast delivery available. Daily, weekly and monthly rentals with AMJDrive.",
  alternates: {
    canonical: "/sharjah-airport-car-rental",
  },
  openGraph: {
    title: "Sharjah Airport Car Rental | No Deposit Options | AMJDrive",
    description:
      "Book car rental near Sharjah Airport with no deposit options and fast delivery available. Daily, weekly and monthly rentals with AMJDrive.",
    url: "/sharjah-airport-car-rental",
    type: "website",
  },
};

export default async function SharjahAirportCarRentalPage() {
  const cars = await getCars();
  const featuredVehicles = getFeaturedVehicles(cars, [
    "nissan-sunny",
    "nissan-magnite",
    "mitsubishi-xpander",
  ]).map((vehicle, index) => ({
    ...vehicle,
    tag: ["Airport sedan", "SUV airport rental", "7-seater option"][index],
    summary: [
      "Nissan Sunny is a practical car rental option near Sharjah Airport for visitors and residents who want an affordable no deposit sedan.",
      "Nissan Magnite suits renters who need SUV space near Sharjah Airport, University City, Al Rahmaniya, or Muwailih.",
      "Mitsubishi Xpander is useful when your airport-area rental needs 7 seats for family, luggage, or longer monthly use.",
    ][index],
  }));

  return (
    <SeoLandingPage
      path="/sharjah-airport-car-rental"
      eyebrow="Sharjah Airport Car Rental"
      title="Car Rental Near Sharjah Airport With No Deposit Options"
      description="Book car rental near Sharjah Airport with airport pickup convenience, delivery available to the Sharjah Airport area, and daily, weekly, and monthly rental plans from AMJDrive."
      intro="AMJDrive offers economy, SUV, and 7-seater car rental options near Sharjah Airport with no deposit options, fast delivery available, and flexible daily, weekly, and monthly rentals."
      heroImage={{
        src: "/vehicle/nissan-sunny.jpg",
        alt: "Nissan Sunny available for car rental near Sharjah Airport at AMJDrive",
      }}
      highlights={[
        {
          title: "Airport Pickup Convenience",
          description:
            "Start your rental near Sharjah Airport with a simple route to online booking and WhatsApp support.",
        },
        {
          title: "No Deposit Options",
          description:
            "Choose supported AMJDrive vehicles with no deposit options for a smoother airport-area rental.",
        },
        {
          title: "Fast Delivery Available",
          description:
            "Delivery is available to the Sharjah Airport area, including SAIF Zone, Al Dhaid Road, University City, Al Rahmaniya, and Muwailih.",
        },
        {
          title: "Brand New Cars, No Hidden Charges",
          description:
            "Compare AMJDrive economy cars, SUVs, and 7-seater rentals with clear daily, weekly, and monthly booking paths.",
        },
      ]}
      sections={[
        {
          title: "Car rental near Sharjah Airport",
          description:
            "AMJDrive helps renters looking around Sharjah Airport, Sharjah Airport Free Zone (SAIF Zone), Al Dhaid Road, University City, Al Rahmaniya, and Muwailih find practical cars without extra steps.",
        },
        {
          title: "Airport pickup and delivery support",
          description:
            "Whether you want airport pickup convenience or delivery available to the Sharjah Airport area, you can view cars online and confirm timing, documents, and location through WhatsApp before booking.",
        },
        {
          title: "Daily, weekly and monthly rentals",
          description:
            "Short airport trips, business visits, university-area errands, and longer stays can all use the same AMJDrive booking flow, with daily, weekly, and monthly rental options available.",
        },
      ]}
      featuredVehicles={featuredVehicles}
      faqTitle="Sharjah Airport car rental FAQs"
      faqs={[
        {
          question: "Can I rent a car near Sharjah Airport?",
          answer:
            "Yes. AMJDrive offers car rental options near Sharjah Airport with online vehicle pages and WhatsApp booking support.",
        },
        {
          question: "Do you deliver to Sharjah Airport?",
          answer:
            "Yes. Delivery is available to the Sharjah Airport area. Message AMJDrive on WhatsApp to confirm the exact pickup or delivery point and timing.",
        },
        {
          question: "Is no deposit available?",
          answer:
            "Yes. AMJDrive has no deposit options on supported vehicles, including economy, SUV, and 7-seater choices.",
        },
        {
          question: "Can tourists rent from Sharjah Airport?",
          answer:
            "Yes. Tourists can rent when they provide the required documents, such as passport, visit visa, valid driving license, and entry stamp.",
        },
        {
          question: "Monthly rental available near airport?",
          answer:
            "Yes. AMJDrive offers monthly rental options near Sharjah Airport, and you can compare vehicles online or ask on WhatsApp for monthly rental help.",
        },
      ]}
      ctaTitle="Need a rental near Sharjah Airport?"
      ctaDescription="View AMJDrive cars online or message on WhatsApp to ask about airport pickup, delivery availability, no deposit options, and monthly rental plans."
      primaryCtaLabel="View Cars"
      whatsAppCtaLabel="WhatsApp Booking"
      quickLinks={[
        { href: "/vehicle", label: "View Cars" },
        { href: "/car-rental-sharjah", label: "Car Rental Sharjah" },
        { href: "/car-rental-ajman", label: "Car Rental Ajman" },
      ]}
    />
  );
}
