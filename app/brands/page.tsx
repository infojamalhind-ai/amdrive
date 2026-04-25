import LegacyInfoPage from "@/app/components/LegacyInfoPage";
import { getMetadata, getSeoCars, legacyPageConfigs } from "@/lib/legacy-seo";

const config = legacyPageConfigs.brands;

export const metadata = getMetadata({
  title: config.title,
  description: config.description,
  path: config.path,
});

export default async function BrandsPage() {
  const cars = await getSeoCars();

  return <LegacyInfoPage config={config} cars={cars} />;
}

