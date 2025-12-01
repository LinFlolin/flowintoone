import Image from "next/image";

type Props = {
    Shop_Name : string;
    Shop_Desc : string;
    Shop_Img_url  : string;
    Shop_link : string; 
}

export default function ShopCardsTemplate( {
    Shop_Name ,
    Shop_Desc ,
    Shop_Img_url ,
    Shop_link 
}: Props
){
  return (
    <div className="border p-4 rounded-lg shadow-md flex flex-col items-center gap-4 border-gray-200">
        <Image src={Shop_Img_url} alt={Shop_Name} width={36} height={36} loading="lazy"/>
        <div>
            <h1>{Shop_Name}</h1>
            <p>{Shop_Desc}</p>
        </div>
        <button className=" ">
            <a href={Shop_link}>Visit Shop</a>
        </button>
    </div>
  )
}
