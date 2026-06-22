
import { supabase } from "@/api/client";
import BecomePartner from "./components/Flowcomponent/home/BecomePartner";
import HeroHome from "./components/Flowcomponent/home/Hero";
import QA from "./components/Flowcomponent/home/QA";
import WhoWeAre from "./components/Flowcomponent/home/WhoWeAre";
export default async function Home() {
  return (
    //  <div className="">
    //     <HeroHome />
    //     <WhoWeAre />
    //     <BecomePartner />
    //     <QA />      
    //  </div>
    <div className="bg-linear-to-b from-DarkViola from-0% via-GrapeViola via-35% to-pinkViola to-100%  h-screen w-screen flex items-center justify-center p-6">
      <div className="text-white text-3xl font-bold">
        <h1>Lorem Ipsum</h1>
        <p className="font-light text-sm">"Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit..."
        </p>
      </div>
    </div>
  );
}
