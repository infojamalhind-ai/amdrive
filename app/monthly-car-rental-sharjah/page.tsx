import type { Metadata } from "next";
import SeoLandingPage from "@/app/components/SeoLandingPage";
import { getCars } from "@/lib/cars";
import { getFeaturedVehicles } from "@/lib/landing-pages";

export const metadata: Metadata = {
  title: "Monthly Car Rental Sharjah",
  description:
    "Compare monthly car rental options in Sharjah with AMJDrive. Review real monthly booking pages, see practical cars, and contact AMJDrive on WhatsApp for help.",
  alternates: {
    canonical: "/monthly-car-rental-sharjah",
  },
  openGraph: {
    title: "Monthly Car Rental Sharjah | AMJ Drive",
    description:
      "Find AMJDrive monthly rental options for Sharjah and continue directly to the live monthly booking pages.",
    url: "/monthly-car-rental-sharjah",
    type: "website",
  },
};

export default async function MonthlyCarRentalSharjahPage() {
  const cars = await getCars();
  const featuredVehicles = getFeaturedVehicles(cars, [
    "nissan-sunny",
    "hyundai-creta",
    "mitsubishi-xpander",
  ]).map((vehicle, index) => ({
    ...vehicle,
    tag: ["Budget monthly plan", "SUV monthly option", "7-seater monthly option"][index],
    summary: [
      "Nissan Sunny is a practical starting point if you want a lower monthly price and a direct route to AMJDrive monthly booking options.",
      "Hyundai Creta suits renters who want a monthly SUV with more comfort and space while staying inside the same AMJDrive booking flow.",
      "Mitsubishi Xpander is useful when your monthly rental in Sharjah needs 7 seats instead of a smaller sedan or SUV layout.",
    ][index],
  }));

  return (
    <SeoLandingPage
      path="/monthly-car-rental-sharjah"
      eyebrow="Sharjah Monthly Rental"
      title="Monthly car rental in Sharjah with direct access to AMJDrive plan pages"
      description="This page is focused on longer rentals in Sharjah. Instead of generic city content, it points you to real AMJDrive monthly booking pages and highlights cars that make sense for recurring work, family use, and longer stays."
      intro="AMJDrive monthly booking pages let you move from comparison to a selected plan on the actual rental route. Use this page if your priority is a monthly rental in Sharjah and you want to review a few sensible car types before opening the live monthly booking pages."
      heroImage={{
        src: "/vehicle/hyundai-creta.jpg",
        alt: "Hyundai Creta available for monthly car rental in Sharjah at AMJDrive",
      }}
      highlights={[
        {
          title: "Monthly booking focus",
          description:
            "Every featured vehicle below includes a direct monthly booking link so you can move straight into the longer-rental flow.",
        },
        {
          title: "Different vehicle types",
          description:
            "This page includes an economy sedan, an SUV, and a 7-seater so Sharjah renters can compare monthly use cases instead of seeing one generic recommendation.",
        },
        {
          title: "Help before checkout",
          description:
            "If you need help understanding plan options or documents, use the WhatsApp CTA to speak with AMJDrive before you continue.",
        },
      ]}
      sections={[
        {
          title: "Useful for longer stays and repeat driving",
          description:
            "Monthly rentals make more sense when you need regular transport for work, family routines, or a longer stay in Sharjah. This page narrows the decision by showing a few practical AMJDrive choices and then sending you into the existing monthly booking pages.",
        },
        {
          title: "How to compare monthly cars",
          description:
            "Start with space, monthly price, and how often you drive. A sedan can be the simplest value choice, an SUV gives you extra room, and a 7-seater is helpful if capacity matters more than compact size. The monthly booking links below lead to the actual AMJDrive plan selection flow.",
        },
        {
          title: "What stays the same from the main booking system",
          description:
            "You still use the real AMJDrive monthly pages, not a separate landing-page form. That means the same car details, support channels, and booking path stay intact while this page adds context for Sharjah-specific long-term shoppers.",
        },
      ]}
      featuredVehicles={featuredVehicles}
      faqTitle="Monthly car rental Sharjah FAQs"
      faqs={[
        {
          question: "Can I go directly to a monthly booking page from here?",
          answer:
            "Yes. Each featured car includes a Monthly Booking button, and this page also links directly to the Nissan Sunny monthly route.",
        },
        {
          question: "Which AMJDrive cars are useful for monthly rental in Sharjah?",
          answer:
            "A practical starting mix is an economy sedan like Nissan Sunny, an SUV like Hyundai Creta, and a larger option like Mitsubishi Xpander when more seats are needed.",
        },
        {
          question: "Do I need to use a different booking flow for monthly rentals?",
          answer:
            "No. This page is only an entry point. The booking itself still happens inside the existing AMJDrive monthly booking pages.",
        },
        {
          question: "Can I ask about plan details before booking?",
          answer:
            "Yes. Use the WhatsApp CTA to ask AMJDrive about availability, documents, or plan-related questions before proceeding.",
        },
      ]}
      ctaTitle="Want a monthly rental in Sharjah?"
      ctaDescription="Open the full AMJDrive vehicle list to compare more cars, or jump directly into a monthly booking page for a faster start."
    />
  );
}
