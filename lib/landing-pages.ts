import type { Car } from "@/app/components/Vehicle";

type FeaturedVehicle = {
  car: Car;
  dailyHref: string;
  monthlyHref: string;
};

export function getFeaturedVehicles(cars: Car[], preferredSlugs: string[]) {
  const featured = preferredSlugs
    .map((slug) => cars.find((car) => car.slug === slug))
    .filter((car): car is Car => Boolean(car));

  if (featured.length >= 3) {
    return featured.slice(0, 3).map((car) => ({
      car,
      dailyHref: `/booking/${car.slug}`,
      monthlyHref: `/booking/monthly/${car.slug}`,
    })) satisfies FeaturedVehicle[];
  }

  const fallbackCars = cars.filter(
    (car) => !featured.some((featuredCar) => featuredCar.slug === car.slug)
  );

  return [...featured, ...fallbackCars].slice(0, 3).map((car) => ({
    car,
    dailyHref: `/booking/${car.slug}`,
    monthlyHref: `/booking/monthly/${car.slug}`,
  })) satisfies FeaturedVehicle[];
}
