"use client";

import "./style.css";
import CategoriesCard from "@/components/categories-card";
import Slider from "@/components/slider";
import React from "react";
import { SwiperSlide } from "swiper/react";

function TopCategoriesSection({ data=[] }) {
   const content = {
      title: "Top Categories",
      items: data,
   };
   return (
      <section className="section">
         <div className="container tc__container">
            <h1 className="h2 text-center">Top Categories</h1>
            <Slider
               count320={1.5}
               count400={2.15}
               count565={2.75}
               count680={3.15}
               count768={3.75}
               count920={4}
               count1280={5}
               showPaginationOnPc
               showNavigationOnPc
               className="tc__section"
            >
               {content?.items?.slice().reverse().map((item: any) => (
                  <SwiperSlide key={item.id}>
                     <CategoriesCard content={item} />
                  </SwiperSlide>
               ))}
            </Slider>
         </div>
      </section>
   );
}

export default TopCategoriesSection;
