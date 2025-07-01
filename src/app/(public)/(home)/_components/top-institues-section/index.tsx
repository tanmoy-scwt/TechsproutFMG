"use client";

import InstituteCard, { InstituteCardContent } from "@/components/institute-card";
import "./style.css";
import ArrowRight from "@/icons/ArrowRight";
import Link from "next/link";
import Slider from "@/components/slider";
import { SwiperSlide } from "swiper/react";
import { links } from "@/lib/constants";

function TopInstituesSection({ data=[] }) {
   const content: {
      title: string;
      items: Array<InstituteCardContent>;
   } = {
      title: "Top Institutes",
      items: data,
   };
   return (
      <section className="section ti__section">
         <div className="container ti__container">
            <h1 className="h2">Top Institutes</h1>
            <Link prefetch={false} href={links.exploreInstitutions} className="explore">
               Explore All <ArrowRight />
            </Link>

            <Slider
               count320={1.1}
               count400={1.25}
               count480={1.75}
               count680={2.25}
               count920={3.25}
               count1280={4}
               className="ti__container--slider-wrapper"
            >
               {content?.items?.map((item) => (
                  <SwiperSlide key={item.id}>
                     <InstituteCard content={item} />
                  </SwiperSlide>
               ))}
            </Slider>
         </div>
      </section>
   );
}

export default TopInstituesSection;
