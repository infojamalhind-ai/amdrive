import type { Metadata } from "next";
import SeoLandingPage from "@/app/components/SeoLandingPage";
import { getCars } from "@/lib/cars";
import { getFeaturedVehicles } from "@/lib/landing-pages";

export const metadata: Metadata = {
  title:
    "Rent a Car in Ajman Near Al Zorah, Corniche & Freehold Communities | AMJDrive",
  description:
    "Affordable car rental in Ajman near Al Zorah, Corniche and major residential areas. No deposit options and delivery available.",
  alternates: {
    canonical: "/rent-a-car-ajman-landmarks",
  },
  openGraph: {
    title:
      "Rent a Car in Ajman Near Al Zorah, Corniche & Freehold Communities | AMJDrive",
    description:
      "Affordable car rental in Ajman near Al Zorah, Corniche and major residential areas. No deposit options and delivery available.",
    url: "/rent-a-car-ajman-landmarks",
    type: "website",
  },
};

export default async function RentACarAjmanLandmarksPage() {
  const cars = await getCars();
  const featuredVehicles = getFeaturedVehicles(cars, [
    "nissan-sunny",
    "toyota-raize",
    "mitsubishi-xpander",
  ]).map((vehicle, index) => ({
    ...vehicle,
    tag: ["Ajman city sedan", "Freehold SUV option", "Family travel"][index],
    summary: [
      "Nissan Sunny is a practical car rental option for residents, tourists, property investors, and expats around Ajman Corniche, Al Nuaimiya, and Al Rashidiya.",
      "Toyota Raize gives Ajman renters SUV practicality for Al Zorah, City Centre Ajman, Al Jurf, Emirates City, and Ajman Uptown trips.",
      "Mitsubishi Xpander is useful when family travel, visitor pickup, or longer monthly rental plans in Ajman need 7 seats.",
    ][index],
  }));

  return (
    <SeoLandingPage
      path="/rent-a-car-ajman-landmarks"
      eyebrow="Ajman Landmark Car Rental"
      title="Car Rental Near Ajman Landmarks and Freehold Communities"
      description="Affordable car rental in Ajman near Al Zorah, Ajman Corniche, Al Nuaimiya, Al Rashidiya, City Centre Ajman, Al Jurf, Emirates City, and Ajman Uptown with delivery available."
      intro="AMJDrive helps residents, property investors, tourists, and expats in Ajman book no deposit options, daily, weekly, and monthly rentals, and family-friendly cars with WhatsApp booking support."
      heroImage={{
        src: "/vehicle/toyota-raize.jpg",
        alt: "Toyota Raize available for car rental near Ajman landmarks at AMJDrive",
      }}
      highlights={[
        {
          title: "Delivery Available",
          description:
            "Delivery is available across Ajman, including Al Zorah, Ajman Corniche, Al Jurf, Emirates City, and Ajman Uptown.",
        },
        {
          title: "No Deposit Options",
          description:
            "Choose supported AMJDrive vehicles with no deposit options for a simpler rental in Ajman residential and landmark areas.",
        },
        {
          title: "Brand New Cars",
          description:
            "Compare clean, modern economy cars, SUVs, and 7-seater family cars with clear AMJDrive booking paths.",
        },
        {
          title: "Monthly Rental Plans",
          description:
            "Monthly rental plans are available for residents, expats, investors, and families staying longer in Ajman.",
        },
      ]}
      sections={[
        {
          title: "Delivery available across Ajman",
          description:
            "AMJDrive supports car rental delivery across Ajman locations such as Al Zorah, Ajman Corniche, Al Nuaimiya, Al Rashidiya, City Centre Ajman, Al Jurf, Emirates City, and Ajman Uptown.",
        },
        {
          title: "No deposit options",
          description:
            "Supported AMJDrive vehicles include no deposit options, which helps renters start more easily whether they are local residents, property investors, tourists, or new expats in Ajman.",
        },
        {
          title: "Daily, weekly and monthly rentals",
          description:
            "Daily rentals work well for errands and short visits, weekly rentals suit temporary stays, and monthly rental plans fit longer routines around Ajman freehold communities and nearby emirates.",
        },
        {
          title: "Cars for residents, tourists and family travel",
          description:
            "Choose economy cars for simple city driving, SUVs for extra comfort, or 7-seater cars for family travel, visitor pickup, and luggage-heavy plans around Ajman.",
        },
      ]}
      featuredVehicles={featuredVehicles}
      faqTitle="Ajman landmark car rental FAQs"
      faqs={[
        {
          question: "Do you deliver cars to Al Zorah?",
          answer:
            "Yes. AMJDrive can support delivery to Al Zorah. Message on WhatsApp to confirm the exact location, timing, and vehicle availability.",
        },
        {
          question: "Rent a car near Ajman Corniche?",
          answer:
            "Yes. You can rent a car near Ajman Corniche with AMJDrive and choose from daily, weekly, and monthly rental options.",
        },
        {
          question: "Delivery available in Emirates City and Al Jurf?",
          answer:
            "Yes. Delivery is available in Emirates City, Al Jurf, and other Ajman areas, subject to confirmation with AMJDrive before booking.",
        },
        {
          question: "Monthly rental available in Ajman?",
          answer:
            "Yes. AMJDrive offers monthly rental plans in Ajman for residents, expats, tourists, and property investors staying longer.",
        },
        {
          question: "Tourist rental documents accepted?",
          answer:
            "Yes. Tourists can rent when they provide the required documents, usually passport, visit visa, valid driving license, and entry stamp.",
        },
      ]}
      ctaTitle="Need car rental near Ajman landmarks?"
      ctaDescription="View available AMJDrive cars or message on WhatsApp to ask about Ajman delivery, no deposit options, tourist documents, and monthly rental plans."
      primaryCtaLabel="View Cars"
      whatsAppCtaLabel="WhatsApp Booking"
      quickLinks={[
        { href: "/vehicle", label: "View Cars" },
        { href: "/car-rental-ajman", label: "Car Rental Ajman" },
        { href: "/car-rental-uaq", label: "Car Rental UAQ" },
      ]}
    />
  );
}
