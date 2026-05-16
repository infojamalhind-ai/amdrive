import type { Metadata } from "next";
import SeoLandingPage from "@/app/components/SeoLandingPage";
import { getCars } from "@/lib/cars";
import { getFeaturedVehicles } from "@/lib/landing-pages";

export const metadata: Metadata = {
  title: "Monthly Car Rental Ajman | Long Term Rent a Car Ajman | AMJDrive",
  description:
    "Affordable monthly car rental in Ajman with flexible mileage plans and delivery options. Book economy cars, SUVs and 7-seaters with AMJDrive.",
  alternates: { canonical: "/monthly-car-rental-ajman" },
  openGraph: {
    title: "Monthly Car Rental Ajman | Long Term Rent a Car Ajman | AMJDrive",
    description:
      "Affordable monthly car rental in Ajman with flexible mileage plans and delivery options. Book economy cars, SUVs and 7-seaters with AMJDrive.",
    url: "/monthly-car-rental-ajman",
    type: "website",
  },
};

export default async function MonthlyCarRentalAjmanPage() {
  const cars = await getCars();
  const featuredVehicles = getFeaturedVehicles(cars, [
    "mitsubishi-attrage",
    "hyundai-creta",
    "mitsubishi-xpander",
  ]).map((vehicle, index) => ({
    ...vehicle,
    tag: ["Monthly economy", "Monthly SUV", "Family monthly"][index],
    summary: [
      "Mitsubishi Attrage keeps the monthly cost sensible for Ajman residents, workers, and students who need regular transport.",
      "Hyundai Creta is a comfortable SUV choice for monthly driving between Ajman, Sharjah, and nearby daily routes.",
      "Mitsubishi Xpander gives seven seats for family use, staff movement, or visitors staying in Ajman for a longer period.",
    ][index],
  }));

  return (
    <SeoLandingPage
      path="/monthly-car-rental-ajman"
      eyebrow="Ajman Monthly Rental"
      title="Monthly Car Rental in Ajman"
      description="Choose a monthly rental when you need a car in Ajman for regular work, family, or business use without renewing a short booking every few days."
      intro="AMJDrive offers monthly rent a car Ajman options with clear pricing, flexible mileage choices on selected cars, delivery support, and self pickup from the Sharjah office."
      heroImage={{
        src: "/vehicle/mitsubishi-attrage.jpg",
        alt: "Mitsubishi Attrage for monthly car rental in Ajman",
      }}
      highlights={[
        {
          title: "Lower daily cost",
          description:
            "Monthly plans usually make more sense than short-term rentals when you need a car for 30 days or more.",
        },
        {
          title: "Flexible mileage",
          description:
            "Mileage plans can vary by car, so you can choose based on how often you drive around Ajman and nearby emirates.",
        },
        {
          title: "Delivery or pickup",
          description:
            "Delivery can be arranged in Ajman depending on availability, and self pickup from Sharjah is also available.",
        },
      ]}
      sections={[
        {
          title: "Why monthly rental is popular in Ajman",
          description:
            "Ajman customers often need a car for steady daily use: work in Al Nuaimiya, family trips from Al Rashidiya, or regular drives near Ajman Corniche. Monthly car rental Ajman plans keep the booking simpler than extending a daily rental again and again.",
        },
        {
          title: "Benefits of monthly plans",
          description:
            "A monthly plan can reduce the daily cost, give one clear rental period, and make budgeting easier. It suits residents waiting for a personal car, workers on temporary contracts, families with visitors, and small business users who need dependable transport.",
        },
        {
          title: "How mileage choices work",
          description:
            "Monthly rental can include different mileage plans depending on the selected vehicle. If you mainly drive inside Ajman, a lower mileage plan may be enough. If you travel often to Sharjah or Dubai, ask AMJDrive which plan fits before booking.",
        },
        {
          title: "Economy, SUV and 7-seater choices",
          description:
            "Economy cars such as Nissan Sunny and Mitsubishi Attrage are practical for regular driving. SUV options such as Hyundai Creta and Mitsubishi ASX add space and comfort. Mitsubishi Xpander and Suzuki Ertiga are useful when you need seven seats.",
        },
        {
          title: "Delivery and self pickup",
          description:
            "AMJDrive can arrange delivery to Ajman depending on timing and car availability. If pickup is easier for you, self pickup from the Sharjah office keeps the handover direct and clear.",
        },
      ]}
      featuredVehicles={featuredVehicles}
      faqTitle="Monthly car rental Ajman FAQs"
      faqs={[
        {
          question: "Do you offer monthly rental in Ajman?",
          answer:
            "Yes, AMJDrive offers monthly car rental plans for residents, workers and families in Ajman.",
        },
        {
          question: "Is monthly rental cheaper?",
          answer:
            "Monthly plans usually provide lower daily cost compared to short-term rentals.",
        },
        {
          question: "Can I get delivery in Ajman?",
          answer:
            "Yes, delivery can be arranged depending on timing and availability.",
        },
        {
          question: "Which cars are available monthly?",
          answer:
            "Economy cars, SUVs and 7-seater family cars may be available depending on stock.",
        },
      ]}
      ctaTitle="Check monthly rental plans in Ajman"
      ctaDescription="View monthly cars, compare practical options, or message AMJDrive to confirm price, mileage, delivery, and documents before booking."
      primaryCtaLabel="Check Monthly Plans"
      secondaryCtaLabel="Book Now"
      secondaryCtaHref="/booking/monthly/mitsubishi-attrage"
      whatsAppCtaLabel="WhatsApp Booking"
      quickLinks={[
        { href: "/car-rental-ajman", label: "Car Rental Ajman" },
        { href: "/vehicle", label: "View Cars" },
        { href: "/booking/nissan-sunny", label: "Nissan Sunny" },
        { href: "/booking/mitsubishi-attrage", label: "Mitsubishi Attrage" },
        { href: "/booking/hyundai-creta", label: "Hyundai Creta" },
        { href: "/booking/mitsubishi-xpander", label: "Mitsubishi Xpander" },
      ]}
    />
  );
}
