import BecomePartner from "./components/home/BecomePartner";
import HeroHome from "./components/home/Hero";
import QA from "./components/home/QA";
import WhoWeAre from "./components/home/WhoWeAre";
import NavigationMenu from "./components/NavigationMenu";

export default async function Home() {
  return (
   <div className="h-screen w-screen">
      <NavigationMenu />
      <HeroHome />
      <WhoWeAre />
      <BecomePartner />
      <QA />      
   </div>
  );
}
