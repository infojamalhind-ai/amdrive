import type { Metadata } from "next";
import SeoLandingPage from "@/app/components/SeoLandingPage";
import { getCars } from "@/lib/cars";
import { getFeaturedVehicles } from "@/lib/landing-pages";

export const metadata: Metadata = {
  title: "Car Rental UAQ No Deposit | Delivery Available | AMJDrive",
  description:
    "Affordable no deposit car rental in Umm Al Quwain with delivery available. Daily, weekly and monthly rentals from AMJDrive.",
  alternates: {
    canonical: "/car-rental-uaq",
  },
  openGraph: {
    title: "Car Rental UAQ No Deposit | Delivery Available | AMJDrive",
    description:
      "Affordable no deposit car rental in Umm Al Quwain with delivery available. Daily, weekly and monthly rentals from AMJDrive.",
    url: "/car-rental-uaq",
    type: "website",
  },
};

export default async function CarRentalUaqPage() {
  const cars = await getCars();
  const featuredVehicles = getFeaturedVehicles(cars, [
    "nissan-sunny",
    "nissan-magnite",
    "mitsubishi-xpander",
  ]).map((vehicle, index) => ({
    ...vehicle,
    tag: ["No deposit sedan", "UAQ SUV option", "7-seater rental"][index],
    summary: [
      "Nissan Sunny is a practical no deposit car rental option for Umm Al Quwain drivers who want an affordable daily, weekly, or monthly sedan.",
      "Nissan Magnite gives UAQ renters SUV space with a compact footprint for errands, family trips, and delivery-supported bookings.",
      "Mitsubishi Xpander is useful when your Umm Al Quwain rental needs 7 seats for family plans, visitors, or longer monthly use.",
    ][index],
  }));

  return (
    <SeoLandingPage
      path="/car-rental-uaq"
      eyebrow="No Deposit UAQ Car Rental"
      title="No Deposit Car Rental in Umm Al Quwain with Delivery Available"
      description="Affordable no deposit car rental in Umm Al Quwain with delivery available. Daily, weekly and monthly rentals from AMJDrive."
      intro="AMJDrive offers affordable car rental in Umm Al Quwain with no deposit options, daily, weekly and monthly plans, and delivery available across UAQ."
      heroImage={{
        src: "/vehicle/nissan-magnite.jpg",
        alt: "Nissan Magnite available for car rental in Umm Al Quwain at AMJDrive",
      }}
      highlights={[
        {
          title: "No Deposit Options",
          description:
            "Choose supported AMJDrive vehicles with no deposit options for a simpler UAQ rental start.",
        },
        {
          title: "Delivery Available in UAQ",
          description:
            "Delivery is available across Umm Al Quwain, including Al Salamah, Al Raas, Al Riqqah, UAQ Corniche, and the Dreamland area.",
        },
        {
          title: "Daily, Weekly & Monthly Rentals",
          description:
            "Book for a short visit, a full week, or a monthly rental plan through the same AMJDrive vehicle pages.",
        },
        {
          title: "Economy, Sedan, SUV & 7-Seater Cars",
          description:
            "Compare affordable economy cars, sedans, SUVs, and 7-seater options before booking online or on WhatsApp.",
        },
      ]}
      sections={[
        {
          title: "Car rental across Umm Al Quwain",
          description:
            "AMJDrive helps renters in Al Salamah, Al Raas, Al Riqqah, UAQ Corniche, and the Dreamland area find practical cars with a clear route to online booking and WhatsApp support.",
        },
        {
          title: "No deposit and delivery support",
          description:
            "Many AMJDrive vehicles show no deposit options, making it easier to rent without tying up extra cash. Delivery availability can be confirmed on WhatsApp before you continue with your UAQ booking.",
        },
        {
          title: "Choose the right rental plan",
          description:
            "Daily rentals work well for quick errands and visits, weekly rentals fit short stays, and monthly rentals are useful when you need regular transport in Umm Al Quwain or nearby emirates.",
        },
      ]}
      featuredVehicles={featuredVehicles}
      faqTitle="Umm Al Quwain car rental FAQs"
      faqs={[
        {
          question: "Do you offer car rental delivery in UAQ?",
          answer:
            "Yes. AMJDrive offers delivery support in Umm Al Quwain. Message on WhatsApp to confirm the exact delivery timing and location before booking.",
        },
        {
          question: "Is no deposit car rental available in Umm Al Quwain?",
          answer:
            "Yes. AMJDrive has no deposit options on supported vehicles, including practical sedan, SUV, and 7-seater choices for UAQ renters.",
        },
        {
          question: "What documents are required?",
          answer:
            "UAE residents usually need Emirates ID and a UAE driving license. Tourists usually need a passport, visit visa, valid driving license, and entry stamp.",
        },
        {
          question: "Can I rent monthly in UAQ?",
          answer:
            "Yes. AMJDrive offers monthly rental plans, and you can use the vehicle page to compare cars or ask on WhatsApp for UAQ monthly rental help.",
        },
        {
          question: "Are tourists allowed to rent?",
          answer:
            "Yes. Tourists can rent from AMJDrive when they provide the required documents and meet the valid driving license requirements for the UAE.",
        },
      ]}
      ctaTitle="Need car rental in Umm Al Quwain?"
      ctaDescription="View available AMJDrive cars online or message on WhatsApp to ask about no deposit options, UAQ delivery, and daily, weekly, or monthly plans."
      primaryCtaLabel="View Cars"
      whatsAppCtaLabel="WhatsApp Us"
      quickLinks={[
        { href: "/vehicle", label: "View Cars" },
        { href: "/car-rental-ajman", label: "Car Rental Ajman" },
        { href: "/car-rental-sharjah", label: "Car Rental Sharjah" },
        {
          href: "/monthly-car-rental-sharjah",
          label: "Monthly Car Rental Sharjah",
        },
      ]}
    />
  );
}
