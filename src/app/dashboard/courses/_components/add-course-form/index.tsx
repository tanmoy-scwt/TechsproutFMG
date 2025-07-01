"use client";

import "./style.css";
import { useEffect, useState } from "react";
import MultistepFormIndicator from "@/components/multistep-form-indicator";
import AddCourseFormStep1 from "./step1";
import AddCourseFormStep2 from "./step2";
import AddCourseFormStep3 from "./step3";
import { FormDataType } from "@/types";
import { checkFormValidity } from "@/lib/utils";
import { ErrorToast, SuccessToast } from "@/lib/toast";
import { ServerFetch } from "@/actions/server-fetch";
import { getSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { CloudLightning, RefreshCw } from "lucide-react";
import { Session } from "next-auth";
import { revalidateByTag } from "@/actions/revalidate-by-tag";
import Loading from "@/components/loading";
import { set } from "date-fns";
import { da } from "date-fns/locale";
import { dashboardLinks } from "@/lib/constants";

function AddCourseForm({ editId, subscriptionTaken }: { editId?: string | undefined | null, subscriptionTaken?: string | undefined }) {
   const [currentStep, setCurrentStep] = useState(1);
   const [checkboxValue, setCheckboxValue] = useState(0);
   const [dataLoading, setDataLoading] = useState(editId ? true : false);
   const [isSubmitting, setIsSubmitting] = useState(false);

   const formSteps = [{ name: "Course Details" }, { name: "Course Content" }];
   const [categoryData, setCategoryData] = useState([]);
   const [formData, setFormData] = useState<FormDataType>({
      course_name: {
         value: "",
         label: "Course Name",
         isValid: true,
         required: true,
         stepNo: 1,
      },
      category_id: {
         value: "",
         label: "Category",
         isValid: true,
         required: true,
         stepNo: 1,
         objectValue: [],
      },
      currency_id: {
         value: "1",
         label: "Currency",
         isValid: true,
         required: true,
         stepNo: 1,
         options: [],
         objectValue: {},
      },
      skill: {
         value: [],
         label: "Skills",
         isValid: true,
         isLoading: false,
         required: true,
         stepNo: 1,
         objectValue: [],
      },
      language: {
         value: [],
         label: "Languages",
         isValid: true,
         required: true,
         stepNo: 1,
         objectValue: [],
      },
      year_of_exp: {
         value: "",
         label: "Experience (In Years)",
         stepNo: 1,
         isValid: true,
         required: true,
         dataType: "number",
      },
      duration_value: {
         value: "",
         label: "Duration",
         stepNo: 1,
         isValid: true,
         required: true,
         dataType: "number",
      },
      duration_unit: {
         value: "hours",
         stepNo: 1,
         isValid: true,
         options: [
            { label: "Hours", value: "hours" },
            { label: "Days", value: "days" },
            { label: "Weeks", value: "weeks" },
            { label: "Months", value: "months" },
            { label: "Years", value: "years" },
         ],
         required: true,
      },
      fee: {
         stepNo: 1,
         value: "",
         label: "Fee",
         isValid: true,
         required: true,
         dataType: "number",
      },
      fee_unit: {
         value: "Full Course",
         stepNo: 1,
         isValid: true,
         options: [
            { label: "Per Hour", value: "hourly" },
            { label: "Full Course", value: "Full Course" },
         ],
         required: true,
      },
      batch_type: {
         stepNo: 1,
         value: "weekend",
         isValid: true,
         label: "Batch Type",
         options: [
            {
               label: "Weekend",
               value: "Weekend",
               //   labelClassName: "step1__form--cb-label",
            },
            {
               label: "Week Days",
               value: "Weekday",
               //   labelClassName: "step1__form--cb-label",
            },
            {
               label: "Both",
               value: "Both",
               //   labelClassName: "step1__form--cb-label",
            },
         ],
         required: true,
      },
      teaching_mode: {
         stepNo: 1,
         value: "Online",
         isValid: true,
         label: "Class Type",
         options: [
            {
               label: "Online",
               value: "Online",
               //   labelClassName: "step1__form--cb-label",
            },
            {
               label: "Offline",
               value: "Offline",
               //   labelClassName: "step1__form--cb-label",
            },
            {
               label: "Both",
               value: "Both",
               //   labelClassName: "step1__form--cb-label",
            },
         ],
         required: true,
      },
      first_class_free: {
         stepNo: 1,
         value: "1",
         isValid: true,
         label: "I can Teach First Lesson For Free",
         required: true,
         dataType: "number",
      },
      course_logo: {
         value: null,
         isValid: true,
         stepNo: 2,
         label: "Course Image",
         url: "/img/common/default-image.png",
      },
      demo_video_url: {
         stepNo: 2,
         value: "",
         isValid: true,
         label: "Demo Video (YouTube Link)",
      },
      course_content: {
         stepNo: 2,
         value: "",
         isValid: true,
         label: "Course Content",
         required: true,
      },
      highlights: {
         stepNo: 2,
         value: "",
         isValid: true,
         label: "Highlights",
      },
      fee_upon_enquiry: {
         stepNo: 2,
         value: 0,
         isValid: true,
         label: "Fee Upon Enquiry",
         required: true,
         datatype: "number",
      },
   });
   const router = useRouter();

   const [hasScrolled, setHasScrolled] = useState(false);
   useEffect(() => {
      if (currentStep === 2 && !hasScrolled) {
         window.scrollTo(0, 0); // Scroll to the top
         setHasScrolled(true); // Set flag to prevent further scrolling
      }
   }, [currentStep, hasScrolled]);
   console.log("formData", formData.language.value);
   const handleSubmit = async () => {
      setIsSubmitting(true);
      try {
         if (!checkFormValidity(formData, setFormData, currentStep)) {
            return ErrorToast("Please fill all the required fields");
         }
         setCurrentStep((prev) => (prev < formSteps.length ? prev + 1 : formSteps.length));
         if (currentStep === formSteps.length) {
            const body = new FormData();
            for (const key in formData) {
               if (formData[key].value !== null) {
                  const value =
                     typeof formData[key].value === "object" && !key.includes("course_logo")
                        ? JSON.stringify(formData[key].value)
                        : formData[key].value;
                  if (value) {
                     body.append(key, value as string);
                  }
               }
            }
            const session = await getSession();
            if (!session?.user) return;
            body.append("user_id", String(session?.user.userId));
            body.append("course_logo_preview", formData?.course_logo?.url);

            if (editId) {
               if (!formData?.course_logo?.isEdited) {
                  body.delete("course_logo_preview");
                  body.delete("course_logo");
               }
            }

            //log each value and key in body
            //   console.log(formData["skill"]);
            //   body.forEach((value, key) => {
            //     console.log(key, value);
            //   });
            //   return;

            const resp = await ServerFetch("/course/" + (editId ? `update/${editId}` : `add`), {
               method: "POST",
               headers: {
                  Authorization: `Bearer ${session?.user.token}`,
               },
               body,
               cache: "no-store",
            });
            if (!resp.status) {
               throw new Error(resp.message);
            }
            SuccessToast(`Course ${editId ? "updated" : "added"} successfully`);
            if (subscriptionTaken == "false") {
               router.push(dashboardLinks.pricingAndPlans)
            } else {
               router.push(dashboardLinks.courses);
            }
            // router.push("/dashboard/courses");
            revalidateByTag("userCoursesListing");
         }
      } catch (error: any) {
         ErrorToast(error.message || "Something went wrong");
         console.log(error, `error in handleSubmit`);
      } finally {
         setIsSubmitting(false);
      }
   };

   const getCurrencies = async () => {
      try {
         const { data } = await ServerFetch("/currency/listing", {
            next: { revalidate: 5, tags: ["currencies"] },
         });
         const temp = { ...formData };

         temp["currency_id"].options = data?.map((c: any) => ({
            ...c,
            value: String(c.value),
         }));
         temp["currency_id"].value = String(data[0].value);
         setFormData(temp);
      } catch (error) {
         console.log(error, "error in getCurrencies");
      }
   };

   const getCourseDetails = async () => {
      try {
         const session: Session | null = await getSession();
         const { data } = await ServerFetch("/course/update/" + editId, {
            method: "GET",
            headers: {
               Authorization: `Bearer ${session?.user.token}`,
            },
         });
         const temp = { ...formData };
         for (const key in temp) {
            temp[key].value = typeof data[key] === "number" ? String(data[key]) : data[key];
            if (key === "category_id") {
               temp[key].objectValue = {
                  value: String(data.category_id),
                  label: data?.category_name,
               };
            }
            if (key === "skill") {
               temp[key].objectValue = data[key];
               temp[key].value = data[key]?.map((item: any) => String(item.value));
            }
            if (key === "language") {
               temp[key].objectValue = data[key];
               temp[key].value = data[key]?.map((item: any) => String(item.value));
            }
            if (key === "course_logo") {
               temp[key].required = false;
            }
         }
         setFormData(temp);
      } catch (error) {
         console.log(error, "error in getCourseDetails");
      }
   };
   const getCategoryList = async () => {
      try {
         const session: Session | null = await getSession();
         console.log("session", session?.user.token);
         const CategoryList = await ServerFetch(`/category/listing`, {
            method: "GET",
            headers: {
               Authorization: `Bearer ${session?.user.token}`,
            },
         });
         if (!CategoryList.status) {
            throw new Error("Failed to fetch CategoryList");
         }

         const option = CategoryList.data?.map((category: { value: string | number; label: string }) => ({
            value: category.value,
            label: category.label,
         }));

         setCategoryData(option);
      } catch (error) {
         console.error("Error fetching CategoryList:", error);
      }
   };

   //    const getSubscriptioinDetails = async () => {
   //       try {
   //          const session: Session | null = await getSession();
   //          const SubscriptionList = await ServerFetch(`/current/user/details`, {
   //             method: "GET",
   //             headers: {
   //                Authorization: `Bearer ${session?.user.token}`,
   //             },
   //          });
   //          setSubscriptionStatus(SubscriptionList.data.subscriptionActiveStatus);

   //          if (!SubscriptionList.status) {
   //             throw new Error("Failed to fetch Subscription");
   //          }
   //       } catch (error) {
   //          console.error("Error fetching Subscription:", error);
   //       }
   //    };

   useEffect(() => {
      (async () => {
         try {
            if (editId) {
               await getCourseDetails();
            }
            await getCurrencies();
         } catch (error) {
            console.log(error);
         } finally {
            setDataLoading(false);
         }
      })();
      getCategoryList();
   }, []);

   const onInpChange = (e: { target: { name: string; value: string | number | string[] | null } }) => {
      try {
         const { name, value } = e.target;
         const temp = { ...formData };
         temp[name].value = value;
         temp[name].isValid = true;
         temp[name].isEdited = true;
         console.log("temp", temp);
         setFormData(temp);
      } catch (error) {
         console.log(error);
      }
   };
   const CategorySelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
      // Get the selected value as an integer (not an array)
      const selectedCategory = parseInt(e.target.value, 10); // Convert the selected value to an integer

      setFormData((prevFormData) => ({
         ...prevFormData,
         category_id: {
            ...prevFormData.category_id,
            value: selectedCategory, // Update formData with a single integer value
         },
      }));
   };

   const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const checkedValue = e.target.checked ? 1 : 0;
      setCheckboxValue(checkedValue);

      setFormData((prev: FormDataType) => ({
         ...prev,
         fee_upon_enquiry: {
            ...prev.fee_upon_enquiry,
            value: checkedValue,
         },
         fee: {
            ...prev.fee,
            value: "0",
         },
      }));
   };
   //    useEffect(() => {
   //       getSubscriptioinDetails();
   //       if (subscriptionStatus === 1) {
   //          SuccessToast(`Subscription Expire`);
   //          router.push("/dashboard/pricing-and-plans");
   //       } else {
   //          console.log("Subscription status is not 1");
   //       }
   //    }, [subscriptionStatus]);

   if (dataLoading) return <Loading />;

   return (
      <div className="acf__form--container">
         <MultistepFormIndicator steps={formSteps} currentStep={currentStep} onStepClick={setCurrentStep} />
         <section className={currentStep === 1 ? "" : "hidden"} aria-hidden={currentStep !== 1}>
            <AddCourseFormStep1
               formData={formData}
               handleCheckboxChange={handleCheckboxChange}
               checkboxValue={checkboxValue}
               onInpChange={onInpChange}
               dataLoading={dataLoading}
               categoryData={categoryData}
               CategorySelect={CategorySelect}
            />
         </section>
         <section className={currentStep === 2 ? "" : "hidden"} aria-hidden={currentStep !== 2}>
            <AddCourseFormStep2 formData={formData} setFormData={setFormData} onInpChange={onInpChange} />
         </section>
         {/* <section className={currentStep === 3 ? "" : "hidden"} aria-hidden={currentStep !== 3}>
            <AddCourseFormStep3 />
         </section> */}

         <div className="acf__form--buttons">
            {currentStep > 1 && (
               <button
                  className="button__transparent"
                  onClick={() => {
                     setCurrentStep((prev) => prev - 1);
                  }}
               >
                  Back
               </button>
            )}
            <button
               disabled={isSubmitting}
               className="button__primary-light !flex items-center justify-center gap-1"
               onClick={handleSubmit}
            >
               {isSubmitting && <RefreshCw className="animate-spin" />}
               {currentStep < formSteps.length ? "Next" : "Publish"}
            </button>
         </div>
      </div>
   );
}

export default AddCourseForm;
