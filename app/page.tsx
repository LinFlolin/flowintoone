import { ArtisanDirectory } from "@/components/home/ArtisanDirectory";
import { CategoryGrid } from "@/components/home/CategoryGrid";
import { HeroSection } from "@/components/home/HeroSection";
import { RegistrationCTA } from "@/components/home/RegistrationCTA";
import { SearchSection } from "@/components/home/SearchSection";
import { UpcomingEvents } from "@/components/home/UpcomingEvents";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";

export default function Homepage() {
  return (
    <>
      <Header />
      <main>
        <HeroSection />
        <SearchSection />
        <CategoryGrid />
        <ArtisanDirectory />
        <UpcomingEvents />
        <RegistrationCTA />
      </main>
      <Footer />
    </>
  );
}
