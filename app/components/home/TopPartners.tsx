// src/components/home/TopPartners.tsx (or similar)
import { shopApi } from "@/api/shops_api";
import ShopCardsTemplate from "@app/ui/template/ShopCardsTemplate";

export default async function TopPartners() {

  const { shops, error } = await shopApi(); 
  
  if (error) {
    console.error(error);
    return (
      <div className="px-4 py-10 md:mx-20 mx-2">
        <h2 className="text-3xl py-6 text-center font-extrabold text-Viola font-comfortaa">
          Top Partners
        </h2>
        <p className="text-red-500 text-sm">Error loading shops</p>
      </div>
    );
  }

  return (
    <div className="px-4 py-10 md:mx-20 mx-2">
      <h2 className="text-3xl py-6 text-center font-extrabold text-Viola font-comfortaa">
        Top Partners
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {shops.map((shop) => (
          <ShopCardsTemplate
            key={shop.id}
            Shop_id={shop.id}
            Shop_Name={shop.shop_name}
            Shop_Img_url={shop.shop_img_url ?? "/Logo.png"}
            Shop_Desc={shop.shop_description ?? ""}
            Shop_link={`/shops/${shop.shop_slug ?? shop.id}`}
            Shop_adress={shop.shop_adress ?? ""}
          />
        ))}
      </div>
    </div>
  );
}
