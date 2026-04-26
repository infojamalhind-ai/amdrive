import type { Metadata } from "next";
import SeoLandingPage from "@/app/components/SeoLandingPage";
import { getCars } from "@/lib/cars";
import { getFeaturedVehicles } from "@/lib/landing-pages";

export const metadata: Metadata = {
  title:
    "Best Places in Sharjah According to Locals | Car Rental Guide | AMJDrive",
  description:
    "Discover Sharjah attractions locals love-from Al Qasba and Gold Souk to museums and hidden gems-with convenient car rental options.",
  alternates: {
    canonical: "/best-places-in-sharjah-reddit-guide",
  },
  openGraph: {
    title:
      "Best Places in Sharjah According to Locals | Car Rental Guide | AMJDrive",
    description:
      "Discover Sharjah attractions locals love-from Al Qasba and Gold Souk to museums and hidden gems-with convenient car rental options.",
    url: "/best-places-in-sharjah-reddit-guide",
    type: "website",
  },
};

export default async function BestPlacesInSharjahRedditGuidePage() {
  const cars = await getCars();
  const featuredVehicles = getFeaturedVehicles(cars, [
    "nissan-sunny",
    "suzuki-ciaz",
    "nissan-magnite",
  ]).map((vehicle, index) => ({
    ...vehicle,
    tag: ["Easy city drives", "Comfort around town", "Extra room"][index],
    summary: [
      "Nissan Sunny is simple and affordable for moving between Al Qasba, the museum area, Gold Souk, and Corniche without overthinking parking or fuel.",
      "Suzuki Ciaz is a comfortable sedan if you are spending the day between Al Majaz Waterfront, heritage areas, tea stops, and family-friendly places.",
      "Nissan Magnite gives a bit more room for visitors who want a compact SUV while exploring Sharjah landmarks and nearby neighborhoods.",
    ][index],
  }));

  return (
    <SeoLandingPage
      path="/best-places-in-sharjah-reddit-guide"
      eyebrow="Sharjah Local Guide"
      title="Best Places in Sharjah Locals Love (Reddit-Style Guide)"
      description="A practical local-style guide to Sharjah places worth visiting, from Al Qasba at night and the museum area to Blue Souk, Al Majaz Waterfront, Sharjah Corniche, and quiet local gems."
      intro="Sharjah is best enjoyed slowly: a night walk by the water, a museum stop before lunch, a tea break in an old neighborhood, and maybe a relaxed drive along the Corniche. This guide keeps it simple and useful, like the kind of recommendations locals share when someone asks where to actually go."
      heroImage={{
        src: "/vehicle/suzuki-ciaz.jpg",
        alt: "Suzuki Ciaz available for exploring Sharjah attractions with AMJDrive",
      }}
      highlights={[
        {
          title: "Al Qasba At Night",
          description:
            "Al Qasba is an easy evening pick: water views, cafes, a relaxed walk, and a calmer feel once the heat drops.",
        },
        {
          title: "Sharjah Museum Area",
          description:
            "The museum and heritage area is better when you give it time. Park nearby, walk a little, and let the older side of Sharjah show up.",
        },
        {
          title: "Blue Souk / Gold Souk",
          description:
            "Blue Souk and Gold Souk are good for browsing, photos, gifts, and that classic Sharjah market feeling without needing a full-day plan.",
        },
        {
          title: "Al Majaz Waterfront",
          description:
            "Al Majaz works for families, evening walks, food stops, and a nice view across the water when you want something easy.",
        },
      ]}
      sections={[
        {
          title: "Sharjah Corniche",
          description:
            "Sharjah Corniche is one of those places that locals often mention because it is simple: go for a drive, park for a walk, grab tea or coffee, and enjoy the water without making a big plan out of it.",
        },
        {
          title: "Hidden local gems, tea spots and heritage areas",
          description:
            "Some of the nicest Sharjah moments are not big attractions. They are small cafeterias, quiet streets near heritage buildings, late-night tea stops, older market lanes, and random viewpoints you find between errands.",
        },
        {
          title: "Why renting a car helps explore Sharjah attractions",
          description:
            "Sharjah has good places spread across different neighborhoods. A rental car helps if you want to do Al Qasba, the museum area, Blue Souk, Al Majaz Waterfront, and Sharjah Corniche in your own order, especially with family, bags, or a tight schedule.",
        },
      ]}
      featuredVehicles={featuredVehicles}
      faqTitle="Sharjah local guide FAQs"
      faqs={[
        {
          question: "Best places to visit in Sharjah?",
          answer:
            "Good starting points are Al Qasba, Sharjah Museum area, Blue Souk, Gold Souk, Al Majaz Waterfront, Sharjah Corniche, and the older heritage areas around the city.",
        },
        {
          question: "Is Sharjah good for tourists?",
          answer:
            "Yes. Sharjah is good for tourists who like museums, waterfront walks, souks, cultural areas, family-friendly spots, and a quieter pace than Dubai.",
        },
        {
          question: "Can I rent a car to explore Sharjah landmarks?",
          answer:
            "Yes. Renting a car is useful if you want to visit several Sharjah landmarks in one day or move between attractions, restaurants, hotels, and nearby emirates comfortably.",
        },
      ]}
      ctaTitle="Want an easy way to move around Sharjah?"
      ctaDescription="View AMJDrive cars if you want a simple rental for exploring Sharjah attractions, or message on WhatsApp if you have a route or timing question."
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
