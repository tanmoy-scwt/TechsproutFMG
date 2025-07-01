"use client";

import "./style.css";

import Slider from "@/components/slider";
import TrainerCard, { TrainerCardContent } from "@/components/trainer-card";
import ArrowRight from "@/icons/ArrowRight";
import { links } from "@/lib/constants";
import Link from "next/link";
import React from "react";
import { SwiperSlide } from "swiper/react";

function TopTrainersSection({ data = [] }) {
   const content: {
      title: string;
      items: Array<TrainerCardContent>;
   } = {
      title: "Meet Your Top Trainers",
      items: data,
   };
   return (
      <section className="section">
         <div className="container tt__container">
            <div className="tt__title--container">
               <h1 className="h2">{content.title}</h1>
            </div>
            <div className="tt__explore--container">
               <Link prefetch={false} href={links.exploreTrainers} className="explore">
                  Explore All <ArrowRight />
               </Link>
            </div>
            <Slider
               count320={1.1}
               count400={1.25}
               count480={1.75}
               count680={2.25}
               count920={3.25}
               count1280={4}
               className="tt__container--slider-wrapper"
            >
               {content?.items?.map((item) => (
                  <SwiperSlide key={item.id}>
                     <TrainerCard content={item} />
                  </SwiperSlide>
               ))}
            </Slider>
            <div className="tt__button--container">
               <Link prefetch={false} href={links.signUp} className="button__transparent tt__bi--button">
               List Your Classes/Courses{" "}
                  <svg width="11" height="11" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                     <path
                        d="M1.05566 12.3912L12.3223 1.12451"
                        stroke="currentColor"
                        strokeWidth="1.40833"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                     />
                     <path
                        d="M3.16797 1.12451H12.3221V10.2787"
                        stroke="currentColor"
                        strokeWidth="1.40833"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                     />
                  </svg>
               </Link>
            </div>
         </div>
      </section>
   );
}

export default TopTrainersSection;
