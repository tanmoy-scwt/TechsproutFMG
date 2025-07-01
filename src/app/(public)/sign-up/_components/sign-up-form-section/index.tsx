import "./style.css";
import PreviewImage from "@/components/preview-image";
import { SignUpForm } from "../../_components";

function SignInFormSection() {
   return (
      <section className="section suf__section">
         <div className="container suf__container">
            <div className="suf__image--conatiner">
               <PreviewImage
                  src="/img/auth/banner.png"
                  height={450}
                  width={450}
                  alt="Sign in page"
                  loading="eager"
                  priority
               />
            </div>
            <div className="suf__form--container container">
               <SignUpForm />
            </div>
         </div>
      </section>
   );
}

export default SignInFormSection;
