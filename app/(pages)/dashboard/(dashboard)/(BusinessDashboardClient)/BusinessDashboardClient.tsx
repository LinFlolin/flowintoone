"use client";

import { useState } from "react";
import SettingsBusiness from "./(components)/SettingsBusiness";
import ProductsBusiness from "./(components)/ProductsBusiness";
import ReviewsBusiness from "./(components)/ReviewsBusiness";
import ProfileBusiness from "./(components)/ProfileBusiness";

type Tab = "dashboard" | "settings" | "products" | "reviews" | "profile";

export default function BusinessDashboardClient({ business, profile }: any) {
  const [tab, setTab] = useState<Tab>("dashboard");

  return (
    <>
       <div className="w-1/5 h-full  from-40% to-[#f8f4ec] ">
        <h2 className="text-lg font-semibold self-start text-gray-700">
          Welcome back, {business.name}!
        </h2>

        <div className="flex flex-col h-full justify-evenly">
          <button className="text-left text-sm text-blue-500 hover:underline" onClick={() => setTab("dashboard")}>
            Dashboard
          </button>
          <button className="text-left text-sm text-blue-500 hover:underline" onClick={() => setTab("settings")}>
            Page setting
          </button>
          <button className="text-left text-sm text-blue-500 hover:underline" onClick={() => setTab("products")}>
            Products
          </button>
          <button className="text-left text-sm text-blue-500 hover:underline" onClick={() => setTab("reviews")}>
            Reviews
          </button>
          <button className="text-left text-sm text-blue-500 hover:underline" onClick={() => setTab("profile")}>
            Profile
          </button>
        </div>
      </div>
      <div className="w-full h-full flex flex-col items-start justify-start gap-4 p-6 bg-white rounded-lg ">
        {tab === "dashboard" && (
          <>
            <h1 className="text-2xl font-bold text-gray-800">Business Dashboard</h1>
            <p className="text-gray-600">Here you can manage your business profile, products, and reviews.</p>
          </>
        )}

        {tab === "settings" && <SettingsBusiness />}
        {tab === "products" && <ProductsBusiness />}
        {tab === "reviews" && <ReviewsBusiness />}
        {tab === "profile" && <ProfileBusiness profile={profile} />}
      </div>
    </>
  );
}