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

export default async function Homepage() {
  const { categories, businesses, events } = await getHomepageData();

  return (
    <>
      <Header />
      <main>
        <HeroSection />
        <SearchSection />
        <CategoryGrid categories={categories.data} error={categories.error} />
        <ArtisanDirectory artisans={businesses.data} error={businesses.error} />
        <UpcomingEvents events={events.data} error={events.error} />
        <RegistrationCTA />
      </main>
      <Footer />
    </>
  );
}
