import "./style.css";

import Image from "next/image";
import Link from "next/link";
import RatingStar from "@/components/rating-star";
import { links } from "@/lib/constants";
import PreviewImage from "@/components/preview-image";
import HTMLRenderer from "../html-renderer";

export interface InstituteCardContent {
   id: number | string;
   profile_pic: string;
   preview_profile_pic?: string;
   city_name: string;
   year_of_exp: string;
   f_name: string;
   bio: string;
   average_rating: string;
   totalReviews: number;
   slug: string;
}
interface InstituteCardProps {
   content: InstituteCardContent;
}

const TruncatedText = ({ text, limit }: { text: string; limit: number }) => {
    const truncated = text?.length > limit ? `${text.substring(0, limit)}...` : text;
    return truncated;
};



function InstituteCard({ content }: InstituteCardProps) {

    const truncatedBio = content?.bio?.length > 65
  ? content.bio.substring(0, 65) + "..."
  : content?.bio;

   return (
      <Link prefetch={false} href={`${links.exploreInstitutions}/${content.slug}`} className="inst-card">
         <div className="inst-card__image--container">
            <PreviewImage
               src={`${process.env.NEXT_PUBLIC_IMAGE_URL}/${content.profile_pic}`}
               blurDataURL={content.preview_profile_pic}
               height={250}
               width={250}
               alt={content.f_name}
               loading="lazy"
            />
            <div className="inst-card__gradient">
               <div className="inst-card__location--container">
               {content?.city_name &&
                  <p className="inst-card__location">
                     <Image
                        src="/img/icons/location.svg"
                        height={12}
                        width={9}
                        alt="location"
                        className="inst-card__loc-icon"
                     />{" "}
                     {content?.city_name}
                  </p>
                  }
                  <p className="inst-card__exp">{`Exp: ${content.year_of_exp} Years`}</p>
               </div>
            </div>
         </div>
         <div className="inst-card__title--container">
            <p className="inst-card__title">{content.f_name}</p>
            <HTMLRenderer htmlString={truncatedBio} className="inst-card__desc" />
         </div>
         <div className="inst-card__bottom--container">
            <p className="inst-card__rating">
               {content?.average_rating > "0.0" && <RatingStar rating={+content?.average_rating} /> } {content?.totalReviews > 0 && (<span>({content?.totalReviews})</span>) }
            </p>
            <div className="inst-card__arrow--container">
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
            </div>
         </div>
      </Link>
   );
}

export default InstituteCard;
