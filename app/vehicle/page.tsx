import Header from "../components/Header";
import Vehicle from "../components/Vehicle";
import Reviews from "../components/Reviews";
import FAQ from "../components/FAQ";
import Footer from "../components/Footer";
import { getCars } from "@/lib/cars";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export default async function VehiclePage(props: { searchParams: SearchParams }) {
  const [cars, searchParams] = await Promise.all([getCars(), props.searchParams]);

  return (
    <main className="min-h-screen bg-white text-gray-900">
      <Header />

      <section className="bg-slate-50 px-4 py-6 md:px-8 md:py-8">
        <div className="mx-auto max-w-7xl">
          <div className="rounded-3xl border border-slate-200 bg-white px-4 py-4 shadow-sm md:px-6">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-purple-700">
              Search Results
            </p>

            <h1 className="mt-2 text-2xl font-bold text-slate-900 md:text-3xl">
              Choose Your Car
            </h1>

            <p className="mt-2 text-sm text-slate-600 md:text-base">
              Select your preferred car below and continue to booking.
            </p>
          </div>
        </div>
      </section>

      <Vehicle cars={cars} searchParams={searchParams} />
      <Reviews />
      <FAQ />
      <Footer />
    </main>
  );
}
