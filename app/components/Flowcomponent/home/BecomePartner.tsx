"use client";
import SubscriptionCard from '@app/components/SubscriptionCard';
import FadeInOnScroll from '@app/ui/FadeInOnScroll'   
import Image from 'next/image'
export default function BecomePartner() {
  return (
    <>
      <div className="bg-linear-to-b h-60vh text-Cream z-20 from-[#f8f4ec] to-[#7217ba] from-20% md:from-0% md:to-60% flex flex-col md:flex-col justify-center items-center ">
        <div className="flex w-full my-10 h-[80vh] justify-around items-center px-4 md:px-16">
          <div className=" relative flex flex-col md:flex-col items-end ">
            <FadeInOnScroll mobileVariant='zoom-in' desktopVariant='fade-up' delay={50}>
              <Image src="/Group-45-1.png" alt="Chi siamo" width={150} height={150} className="rounded-xl m-6 self-end" />
            </FadeInOnScroll>
            <div>
              <h1 className="text-2xl md:text-5xl  mb-4">Diventa nostro partner</h1>
              <p className="text-lg md:text-xl mb-6 max-w-2xl">
                Che tu sia un negozio, un artigiano, un fornitore o un freelance, qui trovi lo spazio giusto per far brillare il tuo lavoro. 
              </p>
              <button className="bg-Cream text-[#7217ba] px-6 py-3 rounded-full font-semibold hover:bg-[#FFA500] hover:text-Cream transition-colors duration-300" >
                <a href="/chi-siamo" className="text-[#7217ba] hover:text-Cream">Scopri di più</a>
              </button>
            </div>
         
          </div>
          <FadeInOnScroll mobileVariant='zoom-in' desktopVariant='zoom-in' delay={50}>
            <Image src="/Aboutus.jpg" alt="Chi siamo" width={350} height={350} className="rounded-xl  shadow-lg shadow-Cream " />
          </FadeInOnScroll>              
        </div>               
      </div>    
      <SubscriptionCard/>
    </>
  )
}
