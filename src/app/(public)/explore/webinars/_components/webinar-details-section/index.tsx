import "./style.css";
import { WebinarDetailsDetailsSectionContent } from "../../types";
import HTMLRenderer from "@/components/html-renderer";

interface WebinarDetailsSectionProps {
   className?: string;
   content: WebinarDetailsDetailsSectionContent;
}
function WebinarDetailsSection({ className = "", content }: WebinarDetailsSectionProps) {
   return (
      <section className={`${className}`}>
         <div className="wds__container">
            <div className="wds__content--container">
               {content.description &&
               <>
               <h2 className="subtitle">This webinar is best for: </h2>
               <HTMLRenderer htmlString={content.description} showBefore={false} />
               </>
                }
            </div>
            {/* <div className="wds__content--container">
               <h2 className="subtitle">What you will do? </h2>
               <ul className="tick-list">
                  {content.thingsToDo.map((text, index) => (
                     <li className="wds__text" key={index}>
                        {text}
                     </li>
                  ))}
               </ul>
            </div> */}
         </div>
      </section>
   );
}

export default WebinarDetailsSection;
