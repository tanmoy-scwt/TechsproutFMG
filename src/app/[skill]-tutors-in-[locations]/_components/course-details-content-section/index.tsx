import "./style.css";
import { CourseDetailsContentSectionContent } from "../../types";
import PreviewImage from "@/components/preview-image";
import Image from "next/image";
import Link from "next/link";
import { links } from "@/lib/constants";

interface CourseDetailsContentSectionProps {
   className?: string;
   content: CourseDetailsContentSectionContent;
}

function CourseDetailsContentSection({ className = "", content }: CourseDetailsContentSectionProps) {
   return (
      <section className={`cdc__section ${className}`}>
         <div>
            <h2 className="subtitle">Course Content</h2>
            <p className="ex-desc">{content.description}</p>
         </div>
         <div>
            <h2 className="subtitle">Skills</h2>
            <p className="ex-desc">{Array.isArray(content.skills) ? content.skills.join(", ") : content.skills}</p>
         </div>
         <div className="cdc__course">
            <h2 className="subtitle">
               {content.courseBy[0].toUpperCase() + content.courseBy.slice(1).toLowerCase() || "Tutor/Institute"}
            </h2>
            <div className="cdc__course-by">
               <div className="cdc__course-by--top">
                  <PreviewImage
                     src={content.image}
                     blurDataURL={content.previewImage}
                     height={100}
                     width={100}
                     alt={`${content.name || ""} Profile Pic`}
                  />
                  <div className="cdc__course-by--top-content">
                     <Link
                        prefetch={false}
                        href={`${links.exploreInstitutions}/${content.creatorId}`}
                        className="top-name"
                     >
                        {content.name}
                     </Link>
                     <p className="top-about">{content.about}</p>
                  </div>
               </div>
               <div className="cdc__course-by--bottom">
                  <p className="ex-desc">
                     {/* <Image src="/img/icons/cbc-star.svg" alt="" width={20} height={20} /> */}
                     {`${content.averageRatings} Average Ratings`}
                  </p>
                  <p className="ex-desc">
                     <Image src="/img/icons/cbc-tick.svg" alt="" width={20} height={20} />
                     {`${content.totalRatings} Reviews`}
                  </p>
                  <p className="ex-desc">
                     <Image src="/img/icons/cbc-bag.svg" alt="" width={20} height={20} />
                     {`${content.experience} Years Experience`}
                  </p>
                  <p className="ex-desc">
                     <Image src="/img/icons/cbc-location.svg" alt="" width={20} height={20} />
                     {content.location}
                  </p>
               </div>
            </div>
         </div>
      </section>
   );
}

export default CourseDetailsContentSection;
