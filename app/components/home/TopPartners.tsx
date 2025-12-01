  // import { supabase } from "@/api/client";
  // import type { Profile } from "@/types/profile";

import ShopCardsTemplate from "@app/ui/template/ShopCardsTemplate";

export default function TopPartners() {
  return (
   
    <div className=" px-4 py-10 md:mx-20 mx-2">
      <h2 className="text-3xl py-6 text-center font-extrabold text-Viola font-comfortaa">Top Partners</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">          
        <ShopCardsTemplate Shop_Name="Partner 1" Shop_Desc="Description for Partner 1" Shop_Img_url="/Logo.png" Shop_link="/" />
        <ShopCardsTemplate Shop_Name="Partner 1" Shop_Desc="Description for Partner 1" Shop_Img_url="/Logo.png" Shop_link="/" />
        <ShopCardsTemplate Shop_Name="Partner 1" Shop_Desc="Description for Partner 1" Shop_Img_url="/Logo.png" Shop_link="/" />
        <ShopCardsTemplate Shop_Name="Partner 1" Shop_Desc="Description for Partner 1" Shop_Img_url="/Logo.png" Shop_link="/" />
        <ShopCardsTemplate Shop_Name="Partner 1" Shop_Desc="Description for Partner 1" Shop_Img_url="/Logo.png" Shop_link="/" />
        <ShopCardsTemplate Shop_Name="Partner 1" Shop_Desc="Description for Partner 1" Shop_Img_url="/Logo.png" Shop_link="/" />
        <ShopCardsTemplate Shop_Name="Partner 1" Shop_Desc="Description for Partner 1" Shop_Img_url="/Logo.png" Shop_link="/" />
      </div>
    </div>
  );
}