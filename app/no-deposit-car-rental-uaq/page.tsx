import type { Metadata } from "next";
import SeoLandingPage from "@/app/components/SeoLandingPage";
import { getCars } from "@/lib/cars";
import { getFeaturedVehicles } from "@/lib/landing-pages";

export const metadata: Metadata = {
  title: "No Deposit Car Rental UAQ | Rent a Car Umm Al Quwain | AMJDrive",
  description:
    "Rent a car in Umm Al Quwain with no deposit options. AMJDrive offers daily, weekly and monthly car rental with UAQ delivery and simple booking.",
  alternates: {
    canonical: "/no-deposit-car-rental-uaq",
  },
  openGraph: {
    title: "No Deposit Car Rental UAQ | Rent a Car Umm Al Quwain | AMJDrive",
    description:
      "Rent a car in Umm Al Quwain with no deposit options. AMJDrive offers daily, weekly and monthly car rental with UAQ delivery and simple booking.",
    url: "/no-deposit-car-rental-uaq",
    type: "website",
  },
};

export default async function NoDepositCarRentalUaqPage() {
  const cars = await getCars();
  const featuredVehicles = getFeaturedVehicles(cars, [
    "nissan-sunny",
    "mitsubishi-attrage",
    "mitsubishi-xpander",
  ]).map((vehicle, index) => ({
    ...vehicle,
    tag: ["Economy no deposit", "Simple sedan option", "Family 7-seater"][index],
    summary: [
      "Nissan Sunny is a sensible choice for UAQ drivers who want a clean sedan, simple pricing, and a no deposit rent a car Umm Al Quwain option when available.",
      "Mitsubishi Attrage keeps the booking straightforward for daily errands, weekly use, or a longer UAQ car rental no deposit plan.",
      "Mitsubishi Xpander works well when you need more seats for family trips, visitors, or school and work routines around Umm Al Quwain.",
    ][index],
  }));

  return (
    <SeoLandingPage
      path="/no-deposit-car-rental-uaq"
      eyebrow="UAQ No Deposit Rental"
      title="No Deposit Car Rental in Umm Al Quwain"
      description="Rent in UAQ without blocking a big deposit. AMJDrive offers selected no deposit car rental options with delivery to Umm Al Quwain and self pickup from Sharjah."
      intro="If you live in UAQ, work there, or are staying for a few days, AMJDrive helps you book a practical car without the usual heavy deposit hold. You can choose daily, weekly, or monthly rental and confirm the final price before booking."
      heroImage={{
        src: "/vehicle/nissan-sunny.jpg",
        alt: "Nissan Sunny for no deposit car rental in Umm Al Quwain",
      }}
      highlights={[
        {
          title: "No big deposit block",
          description:
            "Selected cars can be booked with no deposit options, so you keep more cash free for fuel, Salik, parking, and daily use.",
        },
        {
          title: "Clear before you book",
          description:
            "AMJDrive shows the rental route clearly and confirms charges before your booking. No hidden charges are added quietly at handover.",
        },
        {
          title: "UAQ delivery available",
          description:
            "Delivery can be arranged in Umm Al Quwain depending on timing and car availability. Self pickup from the Sharjah office is also available.",
        },
      ]}
      sections={[
        {
          title: "Why UAQ customers choose no deposit rental",
          description:
            "For many customers in Umm Al Quwain, blocking a large deposit is the most frustrating part of renting a car. A no deposit car rental UAQ option is useful for residents, tourists, workers, and families who want transport without tying up extra money for days or weeks.",
        },
        {
          title: "Cars for normal UAE driving",
          description:
            "Choose from economy cars, sedans, SUVs, and 7-seater family cars depending on stock and date. Nissan Sunny and Mitsubishi Attrage are easy daily choices, while Hyundai Creta, Mitsubishi ASX, Mitsubishi Xpander, and Suzuki Ertiga suit more space or family use.",
        },
        {
          title: "Delivery or Sharjah self pickup",
          description:
            "AMJDrive can arrange delivery to UAQ locations such as Al Salamah, Al Raas, Al Riqqah, and the Corniche area when available. If you prefer collecting the car yourself, self pickup from the Sharjah office is also simple.",
        },
        {
          title: "Simple booking steps",
          description:
            "Choose your car, select pickup and return dates, pay advance or confirm online, then receive the car in UAQ or collect it from the Sharjah office. The process is kept direct so you are not chasing unclear fees at the last minute.",
        },
      ]}
      featuredVehicles={featuredVehicles}
      faqTitle="No deposit car rental UAQ FAQs"
      faqs={[
        {
          question: "Can I rent a car in UAQ without deposit?",
          answer:
            "Yes, AMJDrive offers no deposit rental options for selected cars with clear pricing before booking.",
        },
        {
          question: "Do you deliver cars to Umm Al Quwain?",
          answer:
            "Yes, delivery to UAQ can be arranged. Customers can also choose self pickup from Sharjah.",
        },
        {
          question: "Which cars are available for no deposit rental?",
          answer:
            "Economy cars, sedans, SUVs and 7-seater family cars may be available depending on date and stock.",
        },
        {
          question: "Can tourists rent a car in UAQ?",
          answer:
            "Yes, tourists can book if they provide valid passport, visa/entry stamp and driving license documents.",
        },
      ]}
      ctaTitle="Book a no deposit car for UAQ"
      ctaDescription="View available cars, choose your dates, or message AMJDrive on WhatsApp to confirm no deposit rent a car Umm Al Quwain availability and delivery timing."
      primaryCtaLabel="View Available Cars"
      secondaryCtaLabel="Book No Deposit Car"
      secondaryCtaHref="/booking/nissan-sunny"
      whatsAppCtaLabel="WhatsApp Us"
      quickLinks={[
        { href: "/car-rental-uaq", label: "Car Rental UAQ" },
        { href: "/vehicle", label: "All Cars" },
        { href: "/booking/nissan-sunny", label: "Nissan Sunny" },
        { href: "/booking/mitsubishi-attrage", label: "Mitsubishi Attrage" },
        { href: "/booking/hyundai-creta", label: "Hyundai Creta" },
        { href: "/booking/mitsubishi-xpander", label: "Mitsubishi Xpander" },
      ]}
    />
  );
}
