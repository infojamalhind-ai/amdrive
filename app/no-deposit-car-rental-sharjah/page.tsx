import type { Metadata } from "next";
import SeoLandingPage from "@/app/components/SeoLandingPage";
import { getCars } from "@/lib/cars";
import { getFeaturedVehicles } from "@/lib/landing-pages";

export const metadata: Metadata = {
  title: "No Deposit Car Rental Sharjah | Rent a Car Without Deposit | AMJDrive",
  description:
    "Book no deposit car rental in Sharjah with AMJDrive. Economy cars, SUVs and 7-seaters available with easy booking and fast pickup.",
  alternates: { canonical: "/no-deposit-car-rental-sharjah" },
  openGraph: {
    title: "No Deposit Car Rental Sharjah | Rent a Car Without Deposit | AMJDrive",
    description:
      "Book no deposit car rental in Sharjah with AMJDrive. Economy cars, SUVs and 7-seaters available with easy booking and fast pickup.",
    url: "/no-deposit-car-rental-sharjah",
    type: "website",
  },
};

export default async function NoDepositCarRentalSharjahPage() {
  const cars = await getCars();
  const featuredVehicles = getFeaturedVehicles(cars, [
    "nissan-sunny",
    "hyundai-creta",
    "mitsubishi-xpander",
  ]).map((vehicle, index) => ({
    ...vehicle,
    tag: ["Easy city sedan", "Sharjah SUV option", "7-seater family car"][index],
    summary: [
      "Nissan Sunny is a simple Sharjah no deposit car rental choice for daily work runs, errands, and regular city driving.",
      "Hyundai Creta gives extra comfort and space when you want an SUV for Al Majaz, Al Khan, Muwaileh, or nearby trips.",
      "Mitsubishi Xpander is useful when your Sharjah booking needs seven seats for family, visitors, or staff movement.",
    ][index],
  }));

  return (
    <SeoLandingPage
      path="/no-deposit-car-rental-sharjah"
      eyebrow="Sharjah No Deposit Rental"
      title="No Deposit Car Rental in Sharjah"
      description="Rent a car without a large deposit hold. AMJDrive offers selected no deposit cars in Sharjah with clear pricing, WhatsApp booking, self pickup, and delivery support."
      intro="For many Sharjah customers, the deposit is the part that makes renting feel heavy. AMJDrive keeps the booking direct: choose a car, confirm dates, check the terms, and collect from the Sharjah office or ask for delivery."
      heroImage={{
        src: "/vehicle/nissan-sunny.jpg",
        alt: "Nissan Sunny for no deposit car rental in Sharjah",
      }}
      highlights={[
        {
          title: "No deposit options",
          description:
            "Selected vehicles can be booked without a deposit, with the rental terms explained before you confirm.",
        },
        {
          title: "Sharjah office pickup",
          description:
            "Self pickup is available from the Sharjah office, useful if you are near Al Majaz, Al Khan, Al Nahda, or Muwaileh.",
        },
        {
          title: "Clear local booking",
          description:
            "Daily, weekly, and monthly rental options are available with WhatsApp support and no hidden charges.",
        },
      ]}
      sections={[
        {
          title: "Why Sharjah customers prefer no deposit rental",
          description:
            "A no deposit car rental in Sharjah helps when you want to avoid blocking extra money on a card. It is practical for residents, visitors, and workers who need a car for a few days, a week, or longer without making the booking more complicated than it needs to be.",
        },
        {
          title: "Economy, sedan, SUV and 7-seater options",
          description:
            "AMJDrive offers practical cars for normal UAE driving. Economy and sedan options such as Nissan Sunny, Mitsubishi Attrage, and Suzuki Ciaz work well for daily use. SUVs like Hyundai Creta and Mitsubishi ASX give more space, while Mitsubishi Xpander and Suzuki Ertiga suit family trips.",
        },
        {
          title: "Pickup and delivery across Sharjah",
          description:
            "Customers can collect the car from the Sharjah office, or ask for delivery across Sharjah depending on timing and availability. This is helpful for busy areas such as Al Nahda, Al Majaz, Muwaileh, and Al Khan without turning the page into a long list of place names.",
        },
        {
          title: "Tourist and resident booking options",
          description:
            "Residents usually need Emirates ID and a UAE driving license. Tourists can book with valid passport, visa or entry stamp, and driving documents accepted for UAE rental. If you are unsure, WhatsApp AMJDrive before booking and confirm your documents first.",
        },
        {
          title: "Simple booking process",
          description:
            "Choose your car, select pickup and return dates, confirm the no deposit option where available, then book online or continue on WhatsApp. AMJDrive keeps pricing clear so you know the rental cost before handover.",
        },
      ]}
      featuredVehicles={featuredVehicles}
      faqTitle="No deposit car rental Sharjah FAQs"
      faqs={[
        {
          question: "Can I rent a car in Sharjah without deposit?",
          answer:
            "Yes, AMJDrive offers no deposit options on selected vehicles with clear rental terms.",
        },
        {
          question: "Do you offer self pickup in Sharjah?",
          answer:
            "Yes, customers can collect the car directly from the Sharjah office.",
        },
        {
          question: "Are tourists allowed to rent?",
          answer:
            "Yes, tourists can rent with valid passport and driving documents.",
        },
        {
          question: "Which cars are available?",
          answer:
            "Economy cars, SUVs and family 7-seaters may be available depending on dates and stock.",
        },
      ]}
      ctaTitle="Book a no deposit car in Sharjah"
      ctaDescription="View cars, check a no deposit option, or message AMJDrive on WhatsApp to confirm availability and pickup timing."
      primaryCtaLabel="View Cars"
      secondaryCtaLabel="Book Now"
      secondaryCtaHref="/booking/nissan-sunny"
      whatsAppCtaLabel="WhatsApp Booking"
      quickLinks={[
        { href: "/car-rental-sharjah", label: "Car Rental Sharjah" },
        { href: "/vehicle", label: "View Cars" },
        { href: "/booking/nissan-sunny", label: "Nissan Sunny" },
        { href: "/booking/mitsubishi-attrage", label: "Mitsubishi Attrage" },
        { href: "/booking/hyundai-creta", label: "Hyundai Creta" },
        { href: "/booking/mitsubishi-xpander", label: "Mitsubishi Xpander" },
      ]}
    />
  );
}
