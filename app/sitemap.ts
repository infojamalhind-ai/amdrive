import type { MetadataRoute } from "next";
import { getCars } from "@/lib/cars";
import { legacyPageConfigs, legacyProductSlugs } from "@/lib/legacy-seo";
import { getAbsoluteUrl } from "@/lib/site-url";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const cars = await getCars();

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: getAbsoluteUrl("/"),
      lastModified: now,
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: getAbsoluteUrl("/vehicle"),
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: getAbsoluteUrl("/car-rental-sharjah"),
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: getAbsoluteUrl("/car-rental-ajman"),
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: getAbsoluteUrl("/monthly-car-rental-sharjah"),
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: getAbsoluteUrl("/terms"),
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.4,
    },
    {
      url: getAbsoluteUrl("/privacy"),
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.4,
    },
    {
      url: getAbsoluteUrl("/refund"),
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.4,
    },
  ];

  const legacyProductRoutes: MetadataRoute.Sitemap = legacyProductSlugs.map((slug) => ({
    url: getAbsoluteUrl(`/product/${slug}`),
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const legacyPageRoutes: MetadataRoute.Sitemap = Object.values(legacyPageConfigs).map(
    (page) => ({
      url: getAbsoluteUrl(page.path),
      lastModified: now,
      changeFrequency: page.slug === "faqs" ? "monthly" : "weekly",
      priority: page.slug === "fleet" ? 0.85 : 0.75,
    })
  );

  const bookingRoutes: MetadataRoute.Sitemap = cars.flatMap((car) => [
    {
      url: getAbsoluteUrl(`/booking/${car.slug}`),
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: getAbsoluteUrl(`/booking/monthly/${car.slug}`),
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    },
  ]);

  return [...staticRoutes, ...legacyProductRoutes, ...legacyPageRoutes, ...bookingRoutes];
}
