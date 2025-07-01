// components/AddCoinsButton.tsx
"use client";

import { useRouter } from "next/navigation";

const AddCoinsButton = () => {
   const router = useRouter();

   const handleRedirect = () => {
      router.push("/dashboard/pricing-and-plans?type=coins"); // Redirect to the coins page
   };

   return (
      <button className="button__primary sub__section--btn-dark" onClick={handleRedirect}>
         Add Coins
      </button>
   );
};

export default AddCoinsButton;
