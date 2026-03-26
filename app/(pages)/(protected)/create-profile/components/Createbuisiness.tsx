"use client";

import { useState } from "react";
import { createBusiness } from "../funtions/actions";
import Image from "next/image";

export default function Createbuisiness() {
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");

  const handleNameChange = (value: string) => {
    setName(value);

    const generatedSlug = value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");

    setSlug(generatedSlug);
  };

  return (
    <div className="bg-linear-to-b text-Cream from-[#7217ba] from-90% md:from-60% to-[#f8f4ec] h-screen flex justify-center items-center">
      <div className="h-4/5 w-4/5 bg-Cream overflow-hidden rounded-xl shadow-lg flex md:flex-row justify-center items-center">
    
        <form className="p-10 flex flex-col justify-around h-4/5  " action={createBusiness}>
            <div className="">
              <h1 className="text-3xl font-bold text-center mb-6 text-Viola">
                Create your business profile
              </h1>
              <p className="text-center text-gray-600 mb-8">
                Start by creating your business profile. This will allow you to manage your products and orders effectively.
              </p>
            </div>

            <div className="flex flex-col gap-2 ">
              <label htmlFor="name" className="font-medium text-Viola">
                Business name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
                required
                placeholder="Enter your business name"
                className="w-full rounded-xl border border-gray-300 px-4 py-3 bg-white text-black outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div className="flex flex-col gap-2 text-Viola">
              <label htmlFor="slug" className="font-medium">
                Slug
              </label>
              <input
                id="slug"
                name="slug"
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                required
                placeholder="your-business-name"
                className="w-full rounded-xl border border-gray-300 px-4 py-3 bg-white text-black outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div className="flex flex-col gap-2 text-Viola">
              <label htmlFor="business_type" className="font-medium">
                Business type
              </label>
              <select
                id="business_type"
                name="business_type"
                required
                defaultValue=""
                className="w-full rounded-xl border border-gray-300 px-4 py-3 bg-white text-black outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="" disabled>
                  Select type
                </option>
                <option value="shop">Shop</option>
                <option value="supplier">Supplier</option>
              </select>
            </div>
            <button
              type="submit"
              className="mt-4 rounded-xl bg-[#7217ba] text-white py-3 px-4 font-semibold hover:opacity-90 transition"
            >
              Create business
            </button>
        </form>

        <div className="bg-image bg-[url('/about-us.jpg')] bg-cover bg-center bg-no-repeat w-2/3 h-full hidden md:block" >
         
        </div>
      </div>
    </div>
  );
}