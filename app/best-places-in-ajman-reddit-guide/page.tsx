import type { Metadata } from "next";
import SeoLandingPage from "@/app/components/SeoLandingPage";
import { getCars } from "@/lib/cars";
import { getFeaturedVehicles } from "@/lib/landing-pages";

export const metadata: Metadata = {
  title: "Best Places in Ajman Reddit Locals Recommend | AMJDrive",
  description:
    "A practical local-style guide to Ajman places people actually talk about, from Ajman Corniche and Al Zorah to food spots, souks and family areas.",
  alternates: {
    canonical: "/best-places-in-ajman-reddit-guide",
  },
  openGraph: {
    title: "Best Places in Ajman Reddit Locals Recommend | AMJDrive",
    description:
      "A practical local-style guide to Ajman places people actually talk about, from Ajman Corniche and Al Zorah to food spots, souks and family areas.",
    url: "/best-places-in-ajman-reddit-guide",
    type: "website",
  },
};

export default async function BestPlacesInAjmanRedditGuidePage() {
  const cars = await getCars();
  const featuredVehicles = getFeaturedVehicles(cars, [
    "nissan-sunny",
    "toyota-raize",
    "suzuki-ciaz",
  ]).map((vehicle, index) => ({
    ...vehicle,
    tag: ["Easy Ajman drives", "Room for plans", "Comfort sedan"][index],
    summary: [
      "Nissan Sunny is the simple choice if you just want to move between Ajman Corniche, the souk area, City Centre Ajman, and nearby neighborhoods without spending too much.",
      "Toyota Raize works nicely if your day includes Al Zorah, Al Jurf, Emirates City, or a few family stops where extra space helps.",
      "Suzuki Ciaz is a comfortable sedan for longer Ajman drives, especially if you are staying around Al Nuaimiya, Al Rashidiya, or outside the center.",
    ][index],
  }));

  return (
    <SeoLandingPage
      path="/best-places-in-ajman-reddit-guide"
      eyebrow="Ajman Local Guide"
      title="Best Places in Ajman Locals Recommend"
      description="A plain, useful guide to where people usually go in Ajman: Corniche walks, Al Zorah, the old souk area, Ajman Museum, City Centre Ajman, and everyday food areas."
      intro="Ajman is not the kind of place where you need a packed itinerary. Most people keep it simple: Corniche in the evening, Al Zorah when they want quiet, the old souk when they want something local, and City Centre Ajman when they just need food, shopping, or a movie."
      heroImage={{
        src: "/vehicle/toyota-raize.jpg",
        alt: "Toyota Raize available for driving around Ajman with AMJDrive",
      }}
      highlights={[
        {
          title: "Ajman Corniche",
          description:
            "The easy evening plan: sea view, a walk, and tea or karak nearby. Nothing complicated, which is exactly why people keep going back.",
        },
        {
          title: "Al Zorah",
          description:
            "Quieter than the busy parts of town, with mangroves, open space, and a calmer feel. Good for families, photos, and slower weekends.",
        },
        {
          title: "Old Ajman / Souk Area",
          description:
            "Good if you like older local areas. Ajman Gold Souk, Old Souk streets, small shops, and the kind of places that feel more everyday than polished.",
        },
        {
          title: "City Centre Ajman",
          description:
            "Easy parking, food, shopping, and a movie if the weather is too hot or you just want something predictable.",
        },
      ]}
      sections={[
        {
          title: "Ajman Museum",
          description:
            "Ajman Museum is small, but useful if someone wants a bit of history without turning the day into a full museum trip. It pairs well with a quick walk around the older part of Ajman.",
        },
        {
          title: "Al Nuaimiya / Al Rashidiya",
          description:
            "These are more daily-life areas than sightseeing spots. People go for food, errands, cafeterias, and normal Ajman routines. If you are staying nearby, they are practical areas to know.",
        },
        {
          title: "Emirates City / Al Jurf",
          description:
            "These areas matter more if you live in Ajman, are checking apartments, or are staying outside the center. They are spread out, so having a car makes the day much easier.",
        },
        {
          title: "How to explore Ajman without wasting time",
          description:
            "Ajman is easier with a car because places are spread out. You can do Corniche, Al Zorah, Ajman Museum, the souk area, City Centre Ajman, Al Jurf, and Emirates City in your own order. Taxis are fine for one or two rides, but they can add up if you keep hopping around.",
        },
      ]}
      featuredVehicles={featuredVehicles}
      faqTitle="Ajman local guide FAQs"
      faqs={[
        {
          question: "What are the best places in Ajman locals recommend?",
          answer:
            "Most people mention Ajman Corniche for evenings, Al Zorah for quiet nature, the Old Souk and Gold Souk area for something local, Ajman Museum for a short history stop, and City Centre Ajman for food, shopping, and movies.",
        },
        {
          question: "Is Al Zorah worth visiting?",
          answer:
            "Yes, especially if you like quieter places, mangroves, open views, and a slower family-friendly plan. It is not a loud tourist area, and that is part of the appeal.",
        },
        {
          question: "Where can families go in Ajman?",
          answer:
            "Families usually keep Ajman simple: Corniche for a walk, Al Zorah for open space, City Centre Ajman for food and movies, and the souk or museum area for a short local outing.",
        },
        {
          question: "Is Ajman easy to explore by rental car?",
          answer:
            "Yes. Ajman is much easier by rental car because the useful places are spread across different areas, and repeated taxi rides can get expensive.",
        },
      ]}
      ctaTitle="Need a simple car for getting around Ajman?"
      ctaDescription="View available AMJDrive cars or message on WhatsApp if you want help choosing something practical for Ajman drives."
      primaryCtaLabel="View Cars"
      whatsAppCtaLabel="WhatsApp Booking"
      quickLinks={[
        { href: "/vehicle", label: "View Cars" },
        { href: "/car-rental-ajman", label: "Car Rental Ajman" },
        {
          href: "/rent-a-car-ajman-landmarks",
          label: "Ajman Landmark Car Rental",
        },
      ]}
    />
  );
}
