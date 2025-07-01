// components/PlanRenewalButton.tsx
"use client";

import { useRouter } from "next/navigation";

const PlanRenewalButton = () => {
   const router = useRouter();

   const handleRedirect = () => {
      console.log("first");
      router.push("/dashboard/pricing-and-plans?type=subscription"); // Change to the correct URL
   };

   return (
      <button className="button__transparent sub__section--btn-light" onClick={handleRedirect}>
         Plan Renewal
      </button>
   );
};

export default PlanRenewalButton;
