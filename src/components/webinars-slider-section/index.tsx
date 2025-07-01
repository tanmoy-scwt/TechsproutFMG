"use client";

import "./style.css";

import WebinarCard, { WebinarCardContent } from "@/components/webinar-card";
import ArrowRight from "@/icons/ArrowRight";
import Link from "next/link";
import Slider, { SliderProps } from "@/components/slider";
import { SwiperSlide } from "swiper/react";
import { links } from "@/lib/constants";

export interface WebinarSliderSectionContent {
   webinars: Array<WebinarCardContent>;
}
interface WebinarSliderSectionProps extends WebinarSliderSectionContent {
   title?: string;
   link?: string;
   sliderClassName: string;
   sliderProps?: Omit<SliderProps, "className" | "children">;
   containerClassName?: string;
   headingClass?: string;
   wrap?: boolean;
   paddingBlock?: boolean;
}
function WebinarSliderSection({
   title = "All Webinars",
   link,
   webinars,
   sliderProps,
   sliderClassName,
   containerClassName = "",
   headingClass = "h2",
   wrap = true,
   paddingBlock = true,
}: WebinarSliderSectionProps) {
   return (
      <section className={`webinar-slider__section ${paddingBlock ? "section" : ""}`}>
         <div className={`webinar-slider__container ${wrap ? "wrap" : ""} ${containerClassName}`}>
            <h2 className={`${headingClass} webinar-slider__heading`}>{title}</h2>
            <Link prefetch={false} href={link || links.exploreWebinars} className="explore">
               Explore All <ArrowRight />
            </Link>

            <div className="webinar-slider__section--slider-wrapper">
               <Slider
                  count320={1.25}
                  count480={1.5}
                  count565={2.1}
                  count768={2.5}
                  count920={3}
                  className={sliderClassName}
                  {...sliderProps}
               >
                  {webinars?.map((webinar) => (
                     <SwiperSlide key={webinar.id}>
                        <WebinarCard content={webinar} />
                     </SwiperSlide>
                  ))}
               </Slider>
            </div>
         </div>
      </section>
   );
}

export default WebinarSliderSection;
