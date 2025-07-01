import "./style.css";
import { ChangePasswordForm } from "../../_components";
import Image from "next/image";

function ChangePasswordFormSection() {
   return (
      <section className="cpass__section">
         <ChangePasswordForm className="cpass__form" />
         <div className="cpass__img--container">
            <Image
               src="/img/dashboard/change-pass.svg"
               width={450}
               height={450}
               alt="Man holding lock and key"
               className="cpass__img"
            />
         </div>
      </section>
   );
}

export default ChangePasswordFormSection;
