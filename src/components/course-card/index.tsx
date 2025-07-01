import "./style.css";
import React from "react";
import Link from "next/link";
import RatingStar from "@/components/rating-star";
import PreviewImage from "@/components/preview-image";
import { links } from "@/lib/constants";

export interface CourseCardContent {
   id: number | string;
   course_logo: string;
   course_logo_preview?: string;
   course_name: string;
   f_name: string;
   //badge?: string;
   year_of_exp: string | number;
   duration_value: string | number;
   duration_unit: string;
   average_rating: number;
   teaching_mode: "Online" | "Offline" | "Both";
   skills: Array<string>;
   featured: number;
   slug: string;
}

function CourseCard({ content }: { content: CourseCardContent }) {
   return (
      <Link prefetch={false} href={`${links.exploreCourses}/${content.slug}`} className="course-card">
         <div className="course-card__image--container">
            <PreviewImage
               src={`${process.env.NEXT_PUBLIC_IMAGE_URL}/${content.course_logo}`}
               height={201}
               width={276}
               alt={content.course_name}
               blurDataURL={content.course_logo_preview}
               loading="lazy"
            />
         </div>
         <div className="course-card__content--container">
            <h2 className="subtitle course-card__title">{content.course_name}</h2>
            <div className="course-card__badge--container">
               {content.featured ? <p className="course-card__badge">Featured</p> : ""}
               <p className="course-card__tutor">By {content.f_name}</p>
            </div>
            <p className="course-card__light-text course-card__exp">
               <span>Experience: {content.year_of_exp} Years</span> |{" "}
               <span>
                  Duration: {content.duration_value} {content.duration_unit}
               </span>
            </p>
            <div className="course-card__rating--container">
               <p className="course-card__rating course-card__dark-text">
                  {/* {`${content.average_rating} `} */}
                  <RatingStar
                     rating={+content.average_rating}
                     fillColor="#FED02C"
                     bgColor="#D6D6D6"
                     strokeColor="#00000000"
                  />
               </p>

               <p className="course-card__dark-text">
                  {content.teaching_mode === "Both" ? "Online & Offline" : content.teaching_mode}
               </p>
            </div>
            {Array.isArray(content?.skills) && (
               <p className="course-card__dark-text course-card__skills">
                  Skills:{" "}
                  <span className="course-card__light-text">
                     {content?.skills?.map((skill, index) => (
                        <span key={skill + index}>{skill}</span>
                     ))}
                  </span>
               </p>
            )}
         </div>
      </Link>
   );
}

export default CourseCard;
