import HeroPromo from "./hero/HeroPromo";
import HeroSearch from "./hero/HeroSearch";

export default function Hero() {
  return (
    <section className="bg-gradient-to-b from-purple-950 via-purple-800 to-fuchsia-700">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-3 md:block md:px-6 md:py-14">
        <div className="order-2 md:order-none">
          <HeroPromo />
        </div>
        <div className="order-1 md:order-none">
          <HeroSearch />
        </div>
      </div>
    </section>
  );
}
