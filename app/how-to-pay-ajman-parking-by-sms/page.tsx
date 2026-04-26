import type { Metadata } from "next";
import SeoLandingPage from "@/app/components/SeoLandingPage";
import { getCars } from "@/lib/cars";
import { getFeaturedVehicles } from "@/lib/landing-pages";

export const metadata: Metadata = {
  title: "How to Pay Ajman Parking by SMS (Complete Local Guide) | AMJDrive",
  description:
    "Learn how Ajman paid parking works, how to pay by SMS, useful parking apps, and tips visitors often miss.",
  alternates: {
    canonical: "/how-to-pay-ajman-parking-by-sms",
  },
  openGraph: {
    title: "How to Pay Ajman Parking by SMS (Complete Local Guide) | AMJDrive",
    description:
      "Learn how Ajman paid parking works, how to pay by SMS, useful parking apps, and tips visitors often miss.",
    url: "/how-to-pay-ajman-parking-by-sms",
    type: "article",
  },
};

export default async function HowToPayAjmanParkingBySmsPage() {
  const cars = await getCars();
  const featuredVehicles = getFeaturedVehicles(cars, [
    "nissan-sunny",
    "suzuki-ciaz",
    "toyota-raize",
  ]).map((vehicle, index) => ({
    ...vehicle,
    tag: ["Easy city parking", "Comfort around Ajman", "Room for errands"][index],
    summary: [
      "Nissan Sunny is simple to park around Ajman streets, malls, souks, and Corniche areas when you want a small, practical rental.",
      "Suzuki Ciaz works well if you want a comfortable sedan for daily Ajman driving, office visits, and family errands.",
      "Toyota Raize gives a bit more space while still being manageable for paid parking zones, mall parking, and residential areas.",
    ][index],
  }));

  return (
    <SeoLandingPage
      path="/how-to-pay-ajman-parking-by-sms"
      eyebrow="Ajman Parking Guide"
      title="How to Pay for Parking in Ajman by SMS (Simple Local Guide)"
      description="Ajman paid parking is mostly handled through SMS or apps now, so do not be surprised if you do not see an obvious parking machine nearby. In many busy streets, people simply pay from their phone and wait for the confirmation message."
      intro="The basic SMS method many drivers use is: AJM [Plate Code] [Plate Number], then send it to 5155. For example, an Ajman plate might look like AJM B 12345. Always wait for the confirmation SMS before walking away from the car."
      heroImage={{
        src: "/vehicle/nissan-sunny.jpg",
        alt: "Nissan Sunny rental car in Ajman parking area guide by AMJDrive",
      }}
      highlights={[
        {
          title: "SMS To 5155",
          description:
            "Open SMS, type AJM, your plate code, then your plate number, and send it to 5155. Keep the confirmation message.",
        },
        {
          title: "Use Parking Apps",
          description:
            "MPDA, AjmanOne, PrKn, and UAE Parking can help reduce mistakes, especially if you are not used to Ajman plate formats.",
        },
        {
          title: "Check The Sign First",
          description:
            "Before paying, look at the nearest parking sign. Some places have different rules, private parking, or special timing notes.",
        },
        {
          title: "Rental Car Tip",
          description:
            "If you are driving a rental, save the plate code and number in your notes so you do not retype it wrongly each time.",
        },
      ]}
      sections={[
        {
          title: "How Ajman Parking SMS Works",
          description:
            "Ajman parking SMS is meant to be quick: type AJM [Plate Code] [Plate Number] and send it to 5155. Wait for the reply before leaving the car, because the confirmation is what tells you the session is active. If the SMS fails or you typed the plate wrong, fix it before you walk away.",
        },
        {
          title: "Apps That Help With Parking",
          description:
            "The MPDA / Ajman Municipality parking app and AjmanOne are useful for official Ajman services. PrKn and UAE Parking are also handy because they help compose the parking SMS in the right format, which is useful when you are tired, in a hurry, or using a rental plate you do not know by heart.",
        },
        {
          title: "Tips People Often Miss",
          description:
            "Renew before the session expires, not after. Check zone signs instead of guessing from another street. Friday and holiday rules can change or vary by location, so verify current rules locally on the sign or official app. If you often mistype SMS messages, use an app to compose the message for you.",
        },
        {
          title: "Tourist & Rental Car Parking Tips in Ajman",
          description:
            "Visitors usually make two mistakes: they look too long for a machine, or they send the wrong plate details. With a rental car, take a quick photo of the plate or write the plate code and number in your phone. If you are parking near Ajman Corniche, souks, clinics, government offices, or busy food streets, pay as soon as you park and keep the confirmation SMS until you leave.",
        },
        {
          title: "Need a rental car in Ajman?",
          description:
            "If you are visiting or staying in Ajman and need a car, see available cars on AMJDrive. A rental can make short trips easier, but parking still needs the same care: check the sign, pay by SMS or app, and renew before expiry.",
        },
      ]}
      featuredVehicles={featuredVehicles}
      faqTitle="Ajman parking SMS FAQs"
      faqs={[
        {
          question: "How do I pay Ajman parking by SMS?",
          answer:
            "Type AJM, then your plate code, then your plate number, and send it to 5155. Example: AJM B 12345. Wait for the confirmation SMS before leaving the car.",
        },
        {
          question: "Is there an Ajman parking app?",
          answer:
            "Yes. MPDA / Ajman Municipality parking services and AjmanOne can help with Ajman parking. Some drivers also use apps such as PrKn or UAE Parking to compose parking SMS messages correctly.",
        },
        {
          question: "Are there parking machines in Ajman?",
          answer:
            "Some areas may have payment options nearby, but many drivers use SMS or apps instead of looking for a machine. Always check the parking sign where you parked.",
        },
        {
          question: "What apps help create parking SMS?",
          answer:
            "PrKn and UAE Parking can help generate the SMS format. MPDA and AjmanOne are useful for Ajman Municipality services and parking-related tasks.",
        },
      ]}
      ctaTitle="Need a rental car in Ajman?"
      ctaDescription="See available AMJDrive cars if you need a rental for Ajman errands, visits, or short stays. If you have a booking question, WhatsApp is the easiest way to ask."
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
