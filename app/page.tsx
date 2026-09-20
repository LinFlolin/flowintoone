import { ArtisanDirectory } from "@/components/home/ArtisanDirectory";
import { CategoryGrid } from "@/components/home/CategoryGrid";
import { HeroSection } from "@/components/home/HeroSection";
import { RegistrationCTA } from "@/components/home/RegistrationCTA";
import { SearchSection } from "@/components/home/SearchSection";
import { UpcomingEvents } from "@/components/home/UpcomingEvents";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { getHomepageData } from "@/lib/data/homepage";

export const revalidate = 300;

type HomepageProps = {
  searchParams: Promise<{ query?: string; category?: string }>;
};

export default async function Homepage({ searchParams }: HomepageProps) {
  const params = await searchParams;
  const { categories, businesses, events } = await getHomepageData({
    query: params.query,
    category: params.category,
  });

  return (
    <>
      <Header />
      <main>
        <HeroSection />
        <SearchSection query={params.query} />
        <CategoryGrid categories={categories.data} error={categories.error} />
        <ArtisanDirectory
          artisans={businesses.data}
          error={businesses.error}
          query={params.query}
          category={params.category}
        />
        <UpcomingEvents events={events.data} error={events.error} />
        <RegistrationCTA />
      </main>
      <Footer />
    </>
  );
}
