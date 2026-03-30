"use client";

import React from "react";
import FormBoxUi from "../../components/FormBoxUi";
import "@splidejs/react-splide/css";
import { Splide, SplideSlide } from "@splidejs/react-splide";
import Createbuisiness from "../../components/Createbuisiness";
import SupplierRegisterMembership from "./(RegisterComponent)/SupplierRegisterMembership";


export default function Supplier() {
  return (
    <FormBoxUi >
      <Splide options={{}}>
        <SplideSlide >
          <SupplierRegisterMembership />
        </SplideSlide>      
        <SplideSlide >
          <SupplierRegisterMembership />
        </SplideSlide> 
      </Splide>
    </FormBoxUi>
  );
}
