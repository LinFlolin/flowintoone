import FadeInOnScroll from "@app/ui/FadeInOnScroll";

export default function HeroHome() {
  return (
     <div className="bg-linear-to-b from-[#7217ba] from-50% md:from-60% to-[#f8f4ec] md:via-20%  flex flex-col-reverse justify-center items-center  md:h-120 md:flex-row ">
        <div className="max-md:bg-linear-to-b max-md:from-[#7217ba] max-md:from-55% max-md:to-[#f8f4ec] max-md:via-20% md:max-w-2/3 flex flex-col items-start md:px-12 md:p-8 p-6">
          <h1 className="max-md:hidden text-background md:text-5xl font-bold mb-2">FlowIntoOne</h1>
          <h2 className="text-background text-4xl my-6 md:text-4xl italic md:mb-4 ">"Un’unica vetrina infinite realtà da scoprire"</h2>
          <p className="text-background text-lg mb-6">
            Flow Into One è la piattaforma digitale che unisce e mette in contatto persone, artigiani, negozi, fornitori e freelance in un unico spazio online.
          </p>
          <button  className="bg-Orange font-bold text-background px-6 py-3 rounded-full hover:bg-Green-pastel hover:text-Viola transition">
            <a href="/esplora">Esplora Ora</a>
          </button>
        </div>
        <FadeInOnScroll delay={1000}  mobileVariant={null} desktopVariant={null}>
          <div className="w-full flex justify-center items-center md:rounded-2xl md:overflow-hidden md:bg-background">
            <video
              autoPlay
              loop
              muted
              playsInline
              preload="metadata"
              className="w-full md:w-auto md:h-[400px] md:m-2 md:rounded-2xl backdrop-blur-sm"
            >
              <source src="/hero_video.webm" type="video/webm" />
              <source src="/hero_video.mp4" type="video/mp4" />
              Il tuo browser non supporta il video.
            </video>
          </div>
        </FadeInOnScroll>
      </div>  
  )
}
