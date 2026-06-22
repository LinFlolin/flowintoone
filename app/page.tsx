
import { supabase } from "@/api/client";
import BecomePartner from "./components/Flowcomponent/home/BecomePartner";
import HeroHome from "./components/Flowcomponent/home/Hero";
import QA from "./components/Flowcomponent/home/QA";
import WhoWeAre from "./components/Flowcomponent/home/WhoWeAre";
import AnimationOnScroll from "./ui/FadeInOnScroll";

export default async function Home() {
  return (
    //  <div className="">
    //     <HeroHome />
    //     <WhoWeAre />
    //     <BecomePartner />
    //     <QA />      
    //  </div>
    <div className="snap-y h-screen overflow-y-scroll w-screen bg-linear-to-b from-DarkViola from-0% via-GrapeViola via-35% to-pinkViola to-100%">
      
      <AnimationOnScroll delay={0}  mobileVariant='zoom-in' desktopVariant='fade-up' >
        <section className="snap-center h-screen text-white text-3xl font-bold flex flex-col items-center justify-center p-6">
          <h1>Lorem Ipsum</h1>
          <p className="font-light text-sm text-center">
            "Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit..."
          </p>
          <button className="bg-pinkPastel-light text-DarkViola px-4 py-2 rounded mt-4 hover:bg-pinkPastel-light transition duration-300 text-sm">
            Learn More
          </button>
        </section>
      </AnimationOnScroll>
      <AnimationOnScroll delay={0}  mobileVariant='zoom-in' desktopVariant='fade-up' >
        <section className="snap-center h-screen text-white flex flex-col items-center justify-center p-6">
          <h1 className="text-3xl font-bold">Lorem Ipsum</h1>
          <p className="font-light text-sm text-center">
            "Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit..."
          </p>
        </section>
      </AnimationOnScroll>
       <AnimationOnScroll delay={0}  mobileVariant='zoom-in' desktopVariant='fade-up' >
        <section className="snap-center h-screen text-white flex flex-col items-center justify-center p-6">
          <h1 className="text-3xl font-bold">Lorem Ipsum</h1>
          <p className="font-light text-sm text-center">
            "Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit..."
          </p>
        </section>
      </AnimationOnScroll>
       <AnimationOnScroll delay={0}  mobileVariant='zoom-in' desktopVariant='fade-up' >
        <section className="snap-center h-screen text-white flex flex-col items-center justify-center p-6">
          <h1 className="text-3xl font-bold">Lorem Ipsum</h1>
          <p className="font-light text-sm text-center">
            "Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit..."
          </p>
        </section>
      </AnimationOnScroll>
       <AnimationOnScroll delay={0}  mobileVariant='zoom-in' desktopVariant='fade-up' >
        <section className="snap-center h-screen text-white flex flex-col items-center justify-center p-6">
          <h1 className="text-3xl font-bold">Lorem Ipsum</h1>
          <p className="font-light text-sm text-center">
            "Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit..."
          </p>
        </section>
      </AnimationOnScroll>


    </div>
  );
}
