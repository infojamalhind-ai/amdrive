import type { Metadata } from "next";
import SeoLandingPage from "@/app/components/SeoLandingPage";
import { getCars } from "@/lib/cars";
import { getFeaturedVehicles } from "@/lib/landing-pages";

export const metadata: Metadata = {
  title: "Monthly Car Rental UAQ | Long Term Rent a Car Umm Al Quwain",
  description:
    "Affordable monthly car rental in Umm Al Quwain with AMJDrive. Choose economy, SUV or 7-seater cars with flexible mileage plans and UAQ delivery.",
  alternates: {
    canonical: "/monthly-car-rental-uaq",
  },
  openGraph: {
    title: "Monthly Car Rental UAQ | Long Term Rent a Car Umm Al Quwain",
    description:
      "Affordable monthly car rental in Umm Al Quwain with AMJDrive. Choose economy, SUV or 7-seater cars with flexible mileage plans and UAQ delivery.",
    url: "/monthly-car-rental-uaq",
    type: "website",
  },
};

export default async function MonthlyCarRentalUaqPage() {
  const cars = await getCars();
  const featuredVehicles = getFeaturedVehicles(cars, [
    "nissan-sunny",
    "hyundai-creta",
    "mitsubishi-xpander",
  ]).map((vehicle, index) => ({
    ...vehicle,
    tag: ["Economy monthly", "SUV monthly", "7-seater monthly"][index],
    summary: [
      "Nissan Sunny is a practical monthly car rental UAQ choice when you want a lower overall cost for work, errands, and regular driving.",
      "Hyundai Creta suits UAQ customers who want SUV space for family use, daily commuting, or longer trips across nearby emirates.",
      "Mitsubishi Xpander is a useful long term car rental UAQ option when seven seats matter more than a compact sedan.",
    ][index],
  }));

  return (
    <SeoLandingPage
      path="/monthly-car-rental-uaq"
      eyebrow="UAQ Monthly Rental"
      title="Monthly Car Rental in Umm Al Quwain"
      description="Monthly rental is a practical choice for UAQ residents, workers, families, and business users who need a car for 30 days or more."
      intro="AMJDrive offers monthly rent a car Umm Al Quwain options with economy, sedan, SUV, and 7-seater choices. Plans depend on the selected car, dates, mileage, and availability, and delivery to UAQ can be arranged."
      heroImage={{
        src: "/vehicle/hyundai-creta.jpg",
        alt: "Hyundai Creta for monthly car rental in Umm Al Quwain",
      }}
      highlights={[
        {
          title: "Better for 30 days or more",
          description:
            "Monthly rental usually gives a lower daily cost than renewing short bookings again and again.",
        },
        {
          title: "Mileage choices",
          description:
            "Flexible mileage plans may be available, so you can match the car to your daily UAQ driving routine.",
        },
        {
          title: "Family and work use",
          description:
            "Pick a small sedan for basic transport, an SUV for extra comfort, or a 7-seater for family and staff movement.",
        },
      ]}
      sections={[
        {
          title: "Who monthly rental suits in UAQ",
          description:
            "Monthly car rental in Umm Al Quwain is useful for residents waiting for their own car, employees on contract work, families hosting visitors, and small business users who need steady transport without buying a vehicle.",
        },
        {
          title: "Why monthly can be easier",
          description:
            "A monthly plan can reduce the daily cost, avoid repeated renewals, and give you one clear rental period. It is also easier to plan around school runs, site visits, supermarket trips, and regular drives between UAQ, Sharjah, Ajman, and Dubai.",
        },
        {
          title: "Car groups and mileage plans",
          description:
            "Economy options include Nissan Sunny and Mitsubishi Attrage. Sedan and compact choices include Suzuki Ciaz and Nissan Magnite. SUV choices include Hyundai Creta and Mitsubishi ASX. For seven seats, check Mitsubishi Xpander or Suzuki Ertiga. Monthly plans depend on car and mileage.",
        },
        {
          title: "UAQ delivery and Sharjah pickup",
          description:
            "Delivery can be arranged to Umm Al Quwain depending on timing and availability. Customers who prefer direct collection can also use AMJDrive self pickup from Sharjah.",
        },
      ]}
      featuredVehicles={featuredVehicles}
      faqTitle="Monthly car rental UAQ FAQs"
      faqs={[
        {
          question: "Do you offer monthly car rental in UAQ?",
          answer:
            "Yes, AMJDrive offers monthly rental options for customers in Umm Al Quwain.",
        },
        {
          question: "Is monthly rental cheaper than daily rental?",
          answer:
            "Usually yes. Monthly rental gives a better overall rate for customers who need a car for 30 days or more.",
        },
        {
          question: "Can I get delivery in Umm Al Quwain?",
          answer:
            "Yes, delivery can be arranged to UAQ depending on timing and availability.",
        },
        {
          question: "Can I choose mileage for monthly rental?",
          answer:
            "Yes, monthly rental can include different mileage plans depending on the selected car.",
        },
      ]}
      ctaTitle="Check a monthly rental for UAQ"
      ctaDescription="Compare monthly cars online or message AMJDrive to confirm the monthly price, mileage plan, and UAQ delivery timing before booking."
      primaryCtaLabel="View Monthly Cars"
      secondaryCtaLabel="Check Monthly Price"
      secondaryCtaHref="/booking/monthly/nissan-sunny"
      whatsAppCtaLabel="WhatsApp Monthly Rental"
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
