"use client";

import "./style.css";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import React, { useMemo } from "react";
import Image from "next/image";
import { Swiper, SwiperProps } from "swiper/react";
import { FreeMode, Navigation, Pagination, Autoplay } from "swiper/modules";

export interface SliderProps extends SwiperProps {
   children: React.ReactNode;
   className: string;
   count?: number;
   count320?: number;
   count400?: number;
   count480?: number;
   count565?: number;
   count680?: number;
   count768?: number;
   count920?: number;
   count1280?: number;
   showNavigationOnPc?: boolean;
   showNavigationOnMobile?: boolean;
   showPaginationOnPc?: boolean;
   showPaginationOnMobile?: boolean;
   centerCards?: { [key: string]: boolean };
}

const Slider = ({
   children,
   className = "",
   count = 1,
   count320,
   count400,
   count480,
   count565,
   count680,
   count768,
   count920,
   count1280,
   centerCards,
   showNavigationOnPc = false,
   showNavigationOnMobile = false,
   showPaginationOnPc = false,
   showPaginationOnMobile = false,
   spaceBetween = 25,
   ...props
}: SliderProps) => {
   const modules = useMemo(() => {
      const m = [Navigation, Pagination, Autoplay];

      if (props.freeMode) {
         m.push(FreeMode);
      }
      if (props.modules) {
         props.modules.forEach((p) => m.push(p));
      }
      return m;
   }, [props.modules, props.freeMode]);

   const navOnMobile = {
      prevEl: `.${className} .slider-arrow-left`,
      nextEl: `.${className} .slider-arrow-right`,
      disabledClass: "disabled",
      enabled: showNavigationOnMobile,
   };
   const navOnPc = {
      prevEl: `.${className} .slider-arrow-left`,
      nextEl: `.${className} .slider-arrow-right`,
      disabledClass: "disabled",
      enabled: showNavigationOnPc,
   };
   const paginationOnMobile = {
      horizontalClass: "swiper__pagination",
      dynamicBullets: true,
      enabled: showPaginationOnMobile,
   };
   const paginationOnPc = {
      horizontalClass: "swiper__pagination",
      dynamicBullets: true,
      enabled: showPaginationOnPc,
   };

   return (
      <div className={`slider-wrapper ${className}`}>
         <Image
            src="/img/icons/arrow-left.svg"
            height={24}
            width={24}
            alt="arrow"
            className={`slider-arrow slider-arrow-left ${!showNavigationOnMobile ? "hide-mob" : ""} ${
               !showNavigationOnPc ? "hide-pc" : ""
            }`}
         />

         <Swiper
            slidesPerView={count}
            slidesPerGroup={1}
            spaceBetween={spaceBetween}
            loop={true}
            grabCursor={true}
            className={`swiper__slider ${showPaginationOnPc ? "padding-pc" : ""} ${
               showPaginationOnMobile ? "padding-mobile" : ""
            }`}
            navigation={navOnMobile}
            pagination={paginationOnMobile}
            centeredSlides={!!centerCards?.count}
            autoplay={{ delay: 3000, disableOnInteraction: true }} // Autoplay settings
            breakpoints={{
               320: {
                  slidesPerView: count320 ?? count,
                  slidesPerGroup: Math.floor(count320 ?? count),
                  navigation: navOnMobile,
                  pagination: paginationOnMobile,
                  centeredSlides: !!centerCards?.count320,
               },
               400: {
                  slidesPerView: count400 ?? count320 ?? count,
                  slidesPerGroup: Math.floor(count400 ?? count320 ?? count),
                  navigation: navOnMobile,
                  pagination: paginationOnMobile,
                  centeredSlides: !!centerCards?.count400,
               },
               480: {
                  slidesPerView: count480 ?? count400 ?? count,
                  slidesPerGroup: Math.floor(count480 ?? count400 ?? count),
                  navigation: navOnMobile,
                  pagination: paginationOnMobile,
                  centeredSlides: !!centerCards?.count480,
               },
               565: {
                  slidesPerView: count565 ?? count480 ?? count,
                  slidesPerGroup: Math.floor(count565 ?? count480 ?? count),
                  navigation: navOnMobile,
                  pagination: paginationOnMobile,
                  centeredSlides: !!centerCards?.count565,
               },
               680: {
                  slidesPerView: count680 ?? count565 ?? count,
                  slidesPerGroup: Math.floor(count680 ?? count565 ?? count),
                  navigation: navOnPc,
                  pagination: paginationOnPc,
                  centeredSlides: !!centerCards?.count680,
               },
               768: {
                  slidesPerView: count768 ?? count680 ?? count,
                  slidesPerGroup: Math.floor(count768 ?? count680 ?? count),
                  navigation: navOnPc,
                  pagination: paginationOnPc,
                  centeredSlides: !!centerCards?.count768,
               },
               920: {
                  slidesPerView: count920 ?? count768 ?? count,
                  slidesPerGroup: Math.floor(count920 ?? count768 ?? count),
                  navigation: navOnPc,
                  pagination: paginationOnPc,
                  centeredSlides: !!centerCards?.count920,
               },
               1280: {
                  slidesPerView: count1280 ?? count920 ?? count,
                  slidesPerGroup: Math.floor(count1280 ?? count920 ?? count),
                  navigation: navOnPc,
                  pagination: paginationOnPc,
                  centeredSlides: !!centerCards?.count1280,
               },
            }}
            modules={modules}
            autoHeight={false}
            {...props}
         >
            {children}
         </Swiper>

         <Image
            src="/img/icons/arrow-right.svg"
            height={24}
            width={24}
            alt="arrow"
            className={`slider-arrow slider-arrow-right ${!showNavigationOnMobile ? "hide-mob" : ""} ${
               !showNavigationOnPc ? "hide-pc" : ""
            }`}
         />
      </div>
   );
};

export default Slider;
