import "./style.css";
import PreviewImage from "@/components/preview-image";
import { SignInFormSwitch } from "../../_components";
import Link from "next/link";
import { links } from "@/lib/constants";

function SignInFormSection() {
   return (
      <section className="section sif__section">
         <div className="container sif__container">
            <div className="sif__image--conatiner">
               <PreviewImage
                  src="/img/auth/banner.png"
                  height={450}
                  width={450}
                  alt="Sign in page"
                  loading="eager"
                  priority
               />
            </div>
            <div className="sif__form--container container">
               <SignInFormSwitch />
               <p className="text-center">
                  Dont have an account?{" "}
                  <Link prefetch={false} href={links.signUp} className="sif__form--link">
                     Sign up
                  </Link>
               </p>
            </div>
         </div>
      </section>
   );
}

export default SignInFormSection;
