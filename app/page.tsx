import BecomePartner from "./components/home/BecomePartner";
import HeroHome from "./components/home/Hero";
import QA from "./components/home/QA";
import WhoWeAre from "./components/home/WhoWeAre";

export default async function Home() {
  return (
   <div className="">
      <HeroHome />
      <WhoWeAre />
      <BecomePartner />
      <QA />      
   </div>
  );
}
