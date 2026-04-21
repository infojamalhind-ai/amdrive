import HeroPromo from "./hero/HeroPromo";
import HeroSearch from "./hero/HeroSearch";

export default function Hero() {
  return (
    <section className="bg-gradient-to-b from-purple-900 via-purple-700 to-fuchsia-600">
      <div className="mx-auto max-w-7xl px-4 py-10 md:px-6 md:py-14">
        <HeroPromo />
        <HeroSearch />
      </div>
    </section>
  );
}