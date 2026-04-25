import { notFound } from "next/navigation";
import LegacyProductPage from "@/app/components/LegacyProductPage";
import {
  getMetadata,
  getSeoCars,
  legacyProductConfigs,
  legacyProductSlugs,
  type LegacyProductSlug,
} from "@/lib/legacy-seo";

type PageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export function generateStaticParams() {
  return legacyProductSlugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;

  if (!legacyProductSlugs.includes(slug as LegacyProductSlug)) {
    return {};
  }

  const config = legacyProductConfigs[slug as LegacyProductSlug];

  return getMetadata({
    title: config.title,
    description: config.description,
    path: `/product/${config.slug}`,
    image: config.image,
  });
}

export default async function ProductPage({ params }: PageProps) {
  const { slug } = await params;

  if (!legacyProductSlugs.includes(slug as LegacyProductSlug)) {
    notFound();
  }

  const cars = await getSeoCars();

  return <LegacyProductPage slug={slug as LegacyProductSlug} cars={cars} />;
}

