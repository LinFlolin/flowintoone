import BecomePartner from "./components/Flowcomponent/home/BecomePartner";
import HeroHome from "./components/Flowcomponent/home/Hero";
import QA from "./components/Flowcomponent/home/QA";
import WhoWeAre from "./components/Flowcomponent/home/WhoWeAre";

export default async function Home() {
  return (
   <div className="h-screen w-screen">
      <HeroHome />
      <WhoWeAre />
      <BecomePartner />
      <QA />      
   </div>
  );
}
