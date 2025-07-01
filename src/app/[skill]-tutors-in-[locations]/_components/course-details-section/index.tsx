import "./style.css";
import RatingStar from "@/components/rating-star";
import { CourseDetailsSectionContent } from "../../types";

interface CourseDetailsSectionProps {
   className?: string;
   content: CourseDetailsSectionContent;
}

function CourseDetailsSection({ className = "", content }: CourseDetailsSectionProps) {
   return (
      <section className={`cd__section ${className}`}>
         <h1 className="ex-title">{content.title}</h1>
         <p className="ex-desc">{content.description}</p>
         {content.badge ? <p className="badge">Featured</p> : null}

         <p className="ex-desc cd__ratings">
            <span className="cd__ratings-stars">
               {content.averageRatings ? content.averageRatings : ""}
               <RatingStar rating={+content.averageRatings} />
               {`(${content.totalRatings} ratings)`}
            </span>
            {`${content.totalStudents} Students`}
         </p>
      </section>
   );
}

export default CourseDetailsSection;
