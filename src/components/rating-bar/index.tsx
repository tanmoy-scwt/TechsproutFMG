"use client";
import "./style.css";
import RatingStar from "@/components/rating-star";
import React, { useEffect, useState } from "react";
import Image from "next/image";

export interface RatingBarProps {
   className?: string;
   starRating: number;
   totalCount: number;
   barCount: number;
   innerBarColor?: string;
   outerBarColor?: string;
   starBGColor?: string;
   starFillColor?: string;
   starStrokeColor?: string;
   starStrokeWidth?: string;
}
function RatingBar({
   className = "",
   starRating,
   barCount,
   totalCount,
   innerBarColor = "#FD8E1F",
   outerBarColor = "#fff2e5",
   starFillColor = "#FD8E1F",
   starBGColor = "#fff2e5",
   starStrokeColor = "#FD8E1F",
   starStrokeWidth = "1",
}: RatingBarProps) {
   const percentage = ((barCount / totalCount) * 100).toFixed(1);
   const [visibleStars, setVisibleStars] = useState<1 | 2>(1);

   useEffect(() => {
      const w = window.innerWidth;
      //380 is media query in css
      //Change CSS media query width if changing width here
      if (w >= 380) {
         setVisibleStars(2);
      }
   }, []);

   useEffect(() => {
      const handleResize = () => {
         const w = window.innerWidth;
         //380 is media query in css
         //Change CSS media query width if changing width here
         if (w >= 380) {
            setVisibleStars(2);
         } else {
            setVisibleStars(1);
         }
      };

      window.addEventListener("resize", handleResize);

      return () => {
         window.removeEventListener("resize", handleResize);
      };
   }, []);

   return (
      <div className={`rating-star ${className}`}>
         <div className="rating-star__stars">
            {visibleStars === 2 && (
               <RatingStar
                  rating={starRating}
                  aria-hidden={visibleStars !== 2}
                  fillColor={starFillColor}
                  bgColor={starBGColor}
                  strokeColor={starStrokeColor}
                  strokeWidth={starStrokeWidth}
                  width={20}
                  height={20}
               />
            )}
            {visibleStars !== 2 && <Image src="/img/icons/star.svg" width={20} height={20} alt="Star" />}
            <p className="rating-star__text">{`${starRating} Star`}</p>
         </div>
         <div className="rating-star__bar--container">
            <div className="rating-star__outer" style={{ backgroundColor: outerBarColor }}>
               <div
                  className="rating-star__inner"
                  style={{ width: `${percentage}%`, backgroundColor: innerBarColor }}
               ></div>
            </div>
            <p className="rating-star__text">{`(${percentage}%)`}</p>
         </div>
      </div>
   );
}

export default RatingBar;
