import "./style.css";
import React from "react";
import PreviewImage from "@/components/preview-image";
import RatingStar from "@/components/rating-star";
import { format, parse } from "date-fns";

export interface ReviewCardContent {
   id: number;
   student_name: string;
   review: string;
   rating: number;
   created_at: string;
   image: string;
   previewImage?: string;
}

interface ReviwCardProps {
   className?: string;
   content: ReviewCardContent;
}
function ReviewCard({ className = "", content }: ReviwCardProps) {
   const parsedDate = parse(content.created_at, "yyyy-MM-dd HH:mm:ss", new Date());
   const reviewDate = format(parsedDate, "dd-MM-yyyy");

   return (
      <div className={`review-card ${className}`}>
         <PreviewImage
            src={`/img/common/placeHolder.svg`}
            // blurDataURL={content.previewImage}
            alt={content.student_name + " Profile Pic"}
            width={40}
            height={40}
         />
         <div className="review-card__top--container">
            <div className="review-card__name--container">
               <p className="review-card__name">{content.student_name}</p>
               <p className="review-card__date">{reviewDate}</p>
            </div>
            <RatingStar rating={content.rating} height={16} width={16} />
         </div>
         <p className="review-card__review">{content.review}</p>
      </div>
   );
}

export default ReviewCard;
