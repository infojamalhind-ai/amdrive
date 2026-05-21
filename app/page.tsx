import Header from "./components/Header";
import Hero from "./components/Hero";
import Vehicle from "./components/Vehicle";
import ContactCTA from "./components/ContactCTA";
import FAQ from "./components/FAQ";
import Reviews from "./components/Reviews";
import Footer from "./components/Footer";
import { getHomepageCars } from "@/lib/cars";

export const revalidate = 600;

export default async function Home() {
  const cars = await getHomepageCars();

  return (
    <main className="bg-white text-gray-900">
      <Header />

      <section id="home" className="scroll-mt-28">
        <Hero />
      </section>

      <section id="cars" className="scroll-mt-28">
        <Vehicle cars={cars} />
      </section>

      <section id="contact" className="scroll-mt-28">
        <ContactCTA />
      </section>

      <section id="location" className="scroll-mt-28">
        <Footer />
      </section>

      <section id="faq" className="scroll-mt-28">
        <FAQ />
      </section>

      <section id="reviews" className="scroll-mt-28">
        <Reviews />
      </section>
    </main>
  );
}
