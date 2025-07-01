import "./style.css";
import RatingStar from "@/components/rating-star";
import { CourseDetailsSectionContent } from "../../types";
import HTMLRenderer from "@/components/html-renderer";

interface CourseDetailsSectionProps {
   className?: string;
   content: CourseDetailsSectionContent;
}

function CourseDetailsSection({ className = "", content }: CourseDetailsSectionProps) {
    console.log(content)
   return (
      <section className={`cd__section ${className}`}>
         <h1 className="ex-title">{content.title}</h1>
         {/* <HTMLRenderer htmlString={content.highlights} className="ex-desc" /> */}
         {content.badge ? <p className="badge">Featured</p> : null}

         {/* <p className="ex-desc cd__ratings">
            <span className="cd__ratings-stars">
               {content?.averageRatings ? content.averageRatings : ""}
               {content?.averageRatings > "0.0" && <RatingStar rating={+content.averageRatings} /> }
               {`(${content.totalRatings} ratings)`}
            </span>
            {`${content.totalStudents} Students`}
         </p> */}
      </section>
   );
}

export default CourseDetailsSection;
