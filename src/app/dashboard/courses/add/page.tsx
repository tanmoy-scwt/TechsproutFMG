import React from "react";
import { AddCourseForm } from "../_components";
import { cookies } from "next/headers";

function AddCoursePage() {
   const cookieStore = cookies();
   const subscriptionTaken = cookieStore.get("ifAnySubscriptionTakenTillNow")?.value;
   console.log("Subscription Taken:", subscriptionTaken);

   return (
      <>
         <div className="dash-bg">
            <h1 className="subtitle">Add Course</h1>
            <AddCourseForm subscriptionTaken={subscriptionTaken} />
         </div>
      </>
   );
}

export default AddCoursePage;
