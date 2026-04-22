import Header from "./components/Header";
import Hero from "./components/Hero";
import Vehicle from "./components/Vehicle";
import ContactCTA from "./components/ContactCTA";
import FAQ from "./components/FAQ";
import Reviews from "./components/Reviews";
import Footer from "./components/Footer";
import { getCars } from "@/lib/cars";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export default async function Home(props: { searchParams: SearchParams }) {
  const [cars, searchParams] = await Promise.all([
    getCars({ homepageOnly: true }),
    props.searchParams,
  ]);

  return (
    <main className="bg-white text-gray-900">
      <Header />

      <section id="home" className="scroll-mt-28">
        <Hero />
      </section>

      <section id="cars" className="scroll-mt-28">
        <Vehicle cars={cars} searchParams={searchParams} />
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
