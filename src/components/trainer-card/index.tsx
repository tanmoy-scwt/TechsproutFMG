import "./style.css";

import Image from "next/image";
import Link from "next/link";
import { links } from "@/lib/constants";
import PreviewImage from "@/components/preview-image";

export interface TrainerCardContent {
   id: number | string;
   profile_pic: string;
   course_logo_preview?: string;
   f_name: string;
   skill_name: string;
   year_of_exp: number;
   average_rating: number;
   city_name: string;
   slug: string;
}

interface TrainerCardProps {
   content: TrainerCardContent;
}

function TrainerCard({ content }: TrainerCardProps) {

    const skillName = String(content.skill_name || "");

   return (
      <Link prefetch={false} href={`${links.exploreTrainers}/${content.slug}`} className="trainer-card">
         <div className="trainer-card__image--container">
            <PreviewImage
               src={`${process.env.NEXT_PUBLIC_IMAGE_URL}/${content.profile_pic}`}
               height={250}
               width={250}
               alt={content.f_name}
               blurDataURL={content.course_logo_preview}
            />
         </div>
         <div className="trainer-card__content--container">
            <div className="trainer-card__name--container">
               <p className="trainer-card__text trainer-card__name">
                  {content.f_name}{" "}
                  {/* {content.skill_name && <span className="trainer-card__subtext">{`${content.skill_name} `}</span>} */}
                  {skillName.length > 50 ? (
                    <span className="trainer-card__subtext">{`${skillName.substring(0, 50)}...`}</span>
                    ) : (
                    <span className="trainer-card__subtext">{skillName}</span>
                    )}
               </p>
               {content.year_of_exp && (
                  <p className="trainer-card__text trainer-card__exp">
                     Exp: <span className="trainer-card__subtext">{`${content.year_of_exp} Years`}</span>
                  </p>
               )}
            </div>
            <div className="trainer-card__ratings--container">
               {content.average_rating && (
                  <p className="trainer-card__subtext trainer-card__ratings">
                     <Image
                        src="/img/icons/star.svg"
                        height={15}
                        width={18}
                        alt={`${content.average_rating} Stars Rating`}
                     />
                     {content.average_rating}
                  </p>
               )}
               <p className="trainer-card__subtext trainer-card__location">{content.city_name}</p>
            </div>
         </div>
      </Link>
   );
}

export default TrainerCard;
