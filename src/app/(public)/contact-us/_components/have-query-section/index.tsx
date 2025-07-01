import "./style.css";
import { ContactUsForm } from "../../_components";

interface QuerySectionProps {
    maps: string;
}

function HaveQuerySection({ maps}: QuerySectionProps) {

   return (
      <section>
         <div className="container chq__container">
            <h2 className="subtitle">Have any query?</h2>
            <div className="chq__iframe--container">
            <p dangerouslySetInnerHTML={{ __html: maps }} ></p>
               <ContactUsForm />
            </div>
         </div>
      </section>
   );
}

export default HaveQuerySection;
