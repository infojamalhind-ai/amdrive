import Header from "./components/Header";
import Hero from "./components/Hero";
import Vehicle from "./components/Vehicle";
import ContactCTA from "./components/ContactCTA";
import FAQ from "./components/FAQ";
import Reviews from "./components/Reviews";
import Footer from "./components/Footer";
import { getHomepageCars } from "@/lib/cars";
import { Suspense } from "react";

export const revalidate = 600;

async function HomepageVehicles() {
  const cars = await getHomepageCars();

  return <Vehicle cars={cars} />;
}

export default function Home() {
  return (
    <main className="bg-white text-gray-900">
      <Header />

      <section id="home" className="scroll-mt-28">
        <Hero />
      </section>

      <section id="cars" className="scroll-mt-28">
        <Suspense
          fallback={
            <div className="bg-slate-50 px-4 py-6 md:px-8 md:py-8">
              <div className="mx-auto max-w-7xl rounded-3xl border border-slate-200 bg-white p-8 text-center text-slate-600 shadow-sm">
                Loading available cars...
              </div>
            </div>
          }
        >
          <HomepageVehicles />
        </Suspense>
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
