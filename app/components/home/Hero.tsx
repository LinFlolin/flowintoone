import FadeInOnScroll from "@app/ui/FadeInOnScroll";
import Link from "next/link";
import Image from "next/image";
import FillImage from "@app/ui/FillImage";


export default function HeroHome() {
  return (
    <div className="bg-linear-to-b text-Cream from-[#7217ba] from-50% md:from-60% to-[#f8f4ec] md:via-20%  flex flex-col md:flex-row-reverse justify-center items-center  md:h-120  ">
  
        <div className="md:p-1 md:bg-Cream md:rounded-2xl md:shadow-lg md:flex md:items-center md:justify-center">
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
    
      <div className="md:hidden relative flex justify-center w-screen ">
       <Link href="/" className=" md:hidden">
        <Image
          src="/Logo.png"
          alt="Flowintoone Logo"
          width={80}
          height={80}
          className="md:hidden absolute -top-10 bg-Cream rounded-full p-2 place-self-center"
        />
      </Link>
      </div>
      <div className="max-md:bg-linear-to-b px-8 py-15 from-Viola/70 via-Viola-Light/90 to-Cream/10 flex flex-col items-start md:max-w-2/3 md:px-12 md:p-8 ">
        <FadeInOnScroll delay={1000}  mobileVariant='zoom-in' >
          <h1 className="text-4xl my-6 md:text-4xl  md:mb-4 ">"Un’unica vetrina infinite realtà da scoprire</h1>
          <p className=" max-md:hidden text-xl mb-6">
            Flow Into One è la piattaforma digitale che unisce e mette in contatto persone, artigiani, negozi, fornitori e freelance in un unico spazio online.
          </p>
          <p className="md:hidden text-xl mb-6 text-right ">
            Scopri nuove storie, prodotti unici e talenti nascosti , tutto in un solo luogo ”
          </p>
        </FadeInOnScroll>
        <FadeInOnScroll delay={1000} variant="fade-up">
          <button  className="bg-Orange font-bold px-6 py-3 rounded-full hover:bg-Green-pastel shadow-md  hover:text-Viola transition max-md:self-end">
            <a href="/esplora">Esplora Ora</a>
          </button>
        </FadeInOnScroll>
        <div className="md:hidden flex flex-col mt-12"> 
            <FadeInOnScroll delay={1000}  mobileVariant='zoom-in'>
              <FillImage SCR_text={'/tre_bubble_left.png'} AlT_text={'Fill fptp'} Width_num={100} Height_num={100} 
                className={'md:hidden self-start mt-6 transform rotate-12 absolute' } 
              />
            </FadeInOnScroll>

            <FadeInOnScroll delay={1000}  mobileVariant='zoom-in' desktopVariant='none'>
              <h2 className="text-3xl my-6 text-right  ">Cresci insieme a noi</h2> 
              <p className="text-xl mb-6 text-right ">
                Scopri nuove storie, prodotti unici e talenti nascosti , tutto in un solo luogo ”
              </p>
            </FadeInOnScroll>
            <FadeInOnScroll delay={1000}  mobileVariant='zoom-in' desktopVariant='none' className="flex justify-center">
              <button  className="bg-Orange float-center font-bold px-6 py-3 rounded-full shadow-md hover:bg-Green-pastel hover:text-Viola transition ">
                <a href="/esplora">Unisciti</a>
              </button>
            </FadeInOnScroll>
            <FadeInOnScroll delay={1000}  mobileVariant='zoom-in' desktopVariant='none'>
 
             <FillImage SCR_text={'/tre_bubble_right.png'} AlT_text={'Flowintoone tree dots foto'} Width_num={100} Height_num={100} 
                classNameDiv=" justify-end" className="md:hidden "
              />
            </FadeInOnScroll>
          </div>
      </div>
 
    </div>  
  )
}
