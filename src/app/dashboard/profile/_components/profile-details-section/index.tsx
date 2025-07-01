"use client";
import React, { useState, useEffect } from "react";
import "./style.css";
import { UserProfile } from "../../_types";
import Link from "next/link";
import PencilIcon from "@/icons/PencilIcon";
import { Separator } from "@/components/ui/separator";
import ProfilePicPicker from "@/app/dashboard/_components/profile-pic-picker";
import { ErrorToast, SuccessToast } from "@/lib/toast";
import { GrLinkNext } from "react-icons/gr";
import { dashboardLinks as dl } from "@/lib/constants";


interface ProfileDetailsSectionProps {
   data: UserProfile;
   session: {
      user: {
         token: string;
      };
   } | null;
   profileCompleteMiddleware?: string | number;
}
interface userDetail {
   data: {
      profile_complete: number | string;
   };
}
function ProfileDetailsSection({ data, session, profileCompleteMiddleware }: ProfileDetailsSectionProps) {
   const [userStatusValue, setUserStatusValue] = useState<userDetail>();
   console.log(typeof profileCompleteMiddleware, "profileCompleteMiddleware");


   const renderArrayToString = (items: Array<string | { label: string; value: string }>) => {
      if (items?.length === 0) return "-";

      return items?.map((item, index, all) => {
         const str = typeof item !== "string" ? item.label : item;
         return all.length - 1 === index ? str : str + ", ";
      });
   };

   const getUserDetailsStatus = async () => {
      try {
         const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/current/user/details`, {
            method: "GET",
            headers: {
               "Content-Type": "application/json",
               Authorization: `Bearer ${session?.user.token}`,
            },
         });

         const userStatus = await response.json();
         setUserStatusValue(userStatus);
      } catch (error) {
         console.error("Error fetching user details:", error);
         return null; // Return null or handle the error case
      }
   };

   useEffect(() => {
      getUserDetailsStatus();
   }, []);

   useEffect(() => {
      if (userStatusValue?.data?.profile_complete === 0) {
         ErrorToast("Your profile is not complete!");
      }
   }, [userStatusValue]);


   return (
      <>
         <div className="pds">
            <h1 className="subtitle">My Profile</h1>
            <section className="pds__img--container">
               <ProfilePicPicker
                  src={
                     data?.profile_pic
                        ? `${process.env.NEXT_PUBLIC_IMAGE_URL}/${data.profile_pic}`
                        : "/img/common/logo-icon.svg"
                  }
                  alt="Profile Image"
                  blurDataURL={data?.preview_profile_pic}
                  loading="eager"
                  editable={false}
               />
               <Link href="/dashboard/profile/edit" className="pds__edit-button">
                  <span>Edit Profile</span> <PencilIcon />
               </Link>
            </section>
            <section>
               <h2 className="dash-subtitle">Personal Information</h2>

               <div className="pds__info--container">
                  <div className="overflow-hidden">
                     <p className="label">Full Name</p>
                     <p className="ex-desc dash-value">{data?.f_name}</p>
                  </div>

                  <div className="overflow-hidden">
                     <p className="label">Phone</p>
                     <p className="ex-desc dash-value">{data?.phone}</p>
                  </div>
                  <div className="overflow-hidden">
                     <p className="label">Email</p>
                     <p className="ex-desc dash-value whitespace-nowrap overflow-hidden text-ellipsis">{data?.email}</p>
                  </div>
                  <div className="overflow-hidden">
                     <p className="label">Country</p>
                     <p className="ex-desc dash-value">{data?.country_name || "-"}</p>
                  </div>
                  <div className="overflow-hidden">
                     <p className="label">State</p>
                     <p className="ex-desc dash-value">{data?.state_name || "-"}</p>
                  </div>
                  <div className="overflow-hidden">
                     <p className="label">City</p>
                     <p className="ex-desc dash-value">{data?.city_name || "-"}</p>
                  </div>
                  <div className="overflow-hidden">
                     <p className="label">Area</p>
                     <p className="ex-desc dash-value">{data?.area || "-"}</p>
                  </div>
                  <div className="overflow-hidden">
                     <p className="label">Address</p>
                     <p className="ex-desc dash-value">{data?.address || "-"}</p>
                  </div>
                  <div className="overflow-hidden">
                     <p className="label">Postcode</p>
                     <p className="ex-desc dash-value">{data?.postcode || "-"}</p>
                  </div>
                  <div className="overflow-hidden">
                     <p className="label">GST</p>
                     <p className="ex-desc dash-value">{data?.gst_no || "-"}</p>
                  </div>
               </div>
            </section>
            <Separator />

            <section>
               <h2 className="dash-subtitle">Skills and Qualification</h2>

               <div className="pds__info--container">
                  {data?.user_type === "institute" ? (
                     ""
                  ) : (
                     <div className="overflow-hidden">
                        <p className="label">Qualification</p>
                        <p className="ex-desc dash-value">{renderArrayToString(data?.qualification)}</p>
                     </div>
                  )}

                  <div className="overflow-hidden">
                     <p className="label">Skills</p>
                     <p className="ex-desc dash-value">{renderArrayToString(data?.skill)}</p>
                  </div>
                  <div className="overflow-hidden">
                     <p className="label">Languages</p>
                     <p className="ex-desc dash-value">{renderArrayToString(data?.language)}</p>
                  </div>
                  <div className="overflow-hidden">
                     <p className="label">Experience (in years)</p>
                     <p className="ex-desc dash-value whitespace-nowrap overflow-hidden text-ellipsis">
                        {`${data?.year_of_exp ? data?.year_of_exp + (data?.year_of_exp > 0 ? " Years" : " Year") : "-"}`}
                     </p>
                  </div>
               </div>
            </section>
            {/* <div className="flex justify-end mt-4">
               <Link href={profileCompleteMiddleware === '0' ? dl.profileEdit : dl.addCourses} className="pds__edit-button ">
                  Continue<GrLinkNext size={16} />
               </Link>
            </div> */}
         </div>
      </>
   );
}

export default ProfileDetailsSection;
