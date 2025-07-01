import "./style.css";
import { CourseDetailsIntroVideoSectionContent } from "../../types";

interface CourseDetailsIntroVideoSectionProps {
   className?: string;
   content: CourseDetailsIntroVideoSectionContent;
}

function CourseDetailsIntroVideoSection({ className = "", content }: CourseDetailsIntroVideoSectionProps) {
   return (
      <section className={`cdiv__section ${className}`}>
        {content.introVideoUrl &&
         <div className="cdiv__container">
            <iframe
               width="100%"
               height="100%"
               src={content.introVideoUrl}
               title={content.title}
               allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
               referrerPolicy="strict-origin-when-cross-origin"
               allowFullScreen
               className="iframe"
            ></iframe>
         </div>
        }
      </section>
   );
}

export default CourseDetailsIntroVideoSection;
