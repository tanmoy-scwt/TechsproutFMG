"use client";
import "./style.css";
import { generateRatingsArray } from "@/lib/utils";
import React, { HTMLAttributes, useId } from "react";

export interface RatingStarProps extends HTMLAttributes<HTMLSpanElement> {
   rating: number;
   width?: number;
   height?: number;
   bgColor?: string;
   fillColor?: string;
   strokeWidth?: string;
   strokeColor?: string;
   svgProps?: HTMLAttributes<HTMLOrSVGElement>;
}
function RatingStar({
   rating,
   bgColor = "#fff",
   fillColor = "#FD8E1F",
   strokeColor = "#FD8E1F",
   strokeWidth = "1",
   width = 22,
   height = 22,
   svgProps,
   ...props
}: RatingStarProps) {
   const RatingsArray = generateRatingsArray(rating);
   const id = useId();

   return (
      <span className="rating-stars" {...props}>
         {RatingsArray.map((rating) => {
            return (
               <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width={width}
                  height={height}
                  fill="none"
                  viewBox="0 0 20 19"
                  key={rating.id}
                  {...svgProps}
               >
                  <defs>
                     <linearGradient id={`${id + rating.id}`} x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset={`${rating.value * 100}%`} style={{ stopColor: fillColor, stopOpacity: 1 }} />
                        <stop offset="0%" style={{ stopColor: bgColor, stopOpacity: 1 }} />
                     </linearGradient>
                  </defs>
                  <path
                     d="M10.3332 15.1215L14.7694 17.9381C15.3415 18.299 16.0457 17.7621 15.8785 17.1019L14.5934 12.0495C14.5586 11.9095 14.5641 11.7625 14.6093 11.6254C14.6545 11.4884 14.7374 11.3669 14.8486 11.275L18.8272 7.95657C19.3465 7.52527 19.0824 6.65386 18.4047 6.60985L13.2114 6.27537C13.0697 6.26713 12.9335 6.21779 12.8194 6.13338C12.7053 6.04897 12.6182 5.93314 12.5689 5.80006L10.6324 0.923707C10.5812 0.782788 10.4878 0.661055 10.365 0.575034C10.2421 0.489014 10.0958 0.442871 9.94587 0.442871C9.79591 0.442871 9.64959 0.489014 9.52677 0.575034C9.40394 0.661055 9.31056 0.782788 9.2593 0.923707L7.32285 5.80006C7.27349 5.93314 7.18644 6.04897 7.07233 6.13338C6.95822 6.21779 6.82199 6.26713 6.68029 6.27537L1.48706 6.60985C0.809304 6.65386 0.545241 7.52527 1.06456 7.95657L5.04311 11.275C5.15431 11.3669 5.23727 11.4884 5.28243 11.6254C5.32759 11.7625 5.33312 11.9095 5.29837 12.0495L4.11009 16.7322C3.90764 17.5244 4.75264 18.167 5.4304 17.7357L9.55857 15.1215C9.67434 15.0479 9.80868 15.0088 9.94587 15.0088C10.0831 15.0088 10.2174 15.0479 10.3332 15.1215Z"
                     fill={`url(#${id + rating.id})`}
                     stroke={strokeColor}
                     strokeWidth={strokeWidth}
                  />
               </svg>
            );
         })}
      </span>
   );
}

export default React.memo(RatingStar);
