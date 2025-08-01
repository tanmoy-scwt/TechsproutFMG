"use client";
import "./style.css";

import ImageUploader from "@/components/image-uploader";
import InputSingleCheckbox from "@/components/input-single-checkbox";
import InputWithCharacterLimit from "@/components/input-with-character-limit";
import DatePicker from "@/components/ui/date-picker";
import { useCallback, useEffect, useState } from "react";
import { FormDataType } from "@/types";
import { useRouter } from "next/navigation";
import { checkFormValidity, convertToAMPM } from "@/lib/utils";
import { ErrorToast, SuccessToast } from "@/lib/toast";
import { getSession } from "next-auth/react";
import { ServerFetch } from "@/actions/server-fetch";
import { revalidateByTag } from "@/actions/revalidate-by-tag";
import SuggestiveInput from "@/components/suggestions-input";
import TimePicker from "@/components/ui/time-picker";
import { RefreshCw } from "lucide-react";
import InputWithEndSelect from "@/components/input-with-end-select";
import Tiptap from "@/components/tiptap/Tiptap";
import moment from "moment";
import { convertAMPMto24Hour } from "@/lib/utils";
import Loading from "@/components/loading";

const AddWebinarForm = ({ editId }: { editId?: string }) => {
   //    const [subscriptionStatus, setSubscriptionStatus] = useState();
   const [isLoading, setIsLoading] = useState(editId ? true : false);
   const webinarMode = [
      { id: "webinar-online", label: "Online", value: "Online" },
      { id: "webinar-offline", label: "Offline", value: "Offline" },
   ];

   const [formData, setFormData] = useState<FormDataType>({
      title: {
         value: "",
         label: "Webinar Title",
         isValid: true,
         required: true,
      },
      languages: {
         value: "",
         label: "Languages",
         isValid: true,
         required: true,
         objectValue: [],
      },
      agenda: {
         value: "",
         label: "Webinar Agenda",
         isValid: true,
         required: true,
      },
      start_date: {
         value: "",
         label: "Start Date",
         isValid: true,
         required: true,
      },
      start_time: {
         value: "12:30 PM",
         label: "Start Time",
         isValid: true,
         required: true,
      },
      end_date: {
         value: "",
         label: "End Date",
         isValid: true,
         required: true,
      },
      end_time: {
         value: "01:00 PM",
         label: "End Time",
         isValid: true,
         required: true,
      },
      delivery_mode: {
         value: "Online",
         label: "Webinar Mode",
         isValid: true,
         required: true,
      },
      category_id: {
         value: "",
         label: "Category",
         isValid: true,
         required: true,
         objectValue: [],
      },
      logo: {
         value: null,
         isValid: true,
         label: "Webinar Image",

         url: "",
      },
      address: {
         value: "",
         label: "Webinar Address",
         isValid: true,
         required: false,
      },
      no_of_seats: {
         value: 1,
         label: "Number of Seats",
         isValid: true,
         required: true,
      },
      fee: {
         value: "",
         label: "Webinar Price (₹)",
         isValid: true,
         required: true,
      },
      currency_id: {
         value: "",
         label: "Currency",
         isValid: true,
         required: true,
         options: [],
         objectValue: [],
      },
      content: {
         value: "",
         label: "Content",
         isValid: true,
         required: true,
      },
   });

   const [isSubmitting, setIsSubmitting] = useState(false);
   const router = useRouter();

   const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();

      setIsSubmitting(true);
      try {
         if (!checkFormValidity(formData, setFormData)) {
            return ErrorToast("Please fill all the required fields");
         }

         const body = new FormData();
         for (const key in formData) {
            if (formData[key].value !== null) {
               const value =
                  typeof formData[key].value === "object" &&
                     !key.includes("logo") &&
                     !key.includes("start_date") &&
                     !key.includes("end_date")
                     ? JSON.stringify(formData[key].value)
                     : formData[key].value;
               if (value) {
                  if (key === "start_date" || key === "end_date") {
                     body.append(key, moment(value as Date).format("YYYY-MM-DD"));
                  } else if (key === "start_time" || key === "end_time") {
                     body.append(key, convertAMPMto24Hour(value as string));
                  } else if (key === "agenda") {
                     body.append(key, value as string);
                     body.append("content", value as string);
                  } else if (key === "languages") {
                     body.append(key, JSON.stringify([value as string]));
                  } else {
                     body.append(key, value as string);
                  }
               }
            }
         }

         // //log each value and key in body
         // body.forEach((value, key) => {
         //   console.log(key, value);
         // });
         // return;

         const session = await getSession();
         if (!session?.user) return;
         body.append("user_id", String(session?.user.userId));
         if (formData?.logo?.url) {
            body.append("logo_preview", formData?.logo?.url);
         }

         const resp = await ServerFetch("/webinar/" + (editId ? `update/${editId}` : `add`), {
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

         SuccessToast(editId ? "Webinar Updated Successfully" : "Webinar Added Successfully");
         revalidateByTag("userWebinarsListing");
         router.replace("/dashboard/webinars");
      } catch (error: any) {
         ErrorToast(error.message || "Something went wrong");
      } finally {
         setIsSubmitting(false);
      }
   };

   const onInpChange = (e: { target: { name: string; value: string | number | string[] | null } }) => {
      try {
         const { name, value } = e.target;
         const temp = { ...formData };
         temp[name].value = value;
         temp[name].isValid = true;
         temp[name].isEdited = true;
         setFormData(temp);
      } catch (error) {
         console.log(error);
      }
   };

   const [loadingKey, setLoadingKey] = useState<string | null>(null);

   const listingEndpoints = {
      category_id: "/category",
      language: "/language",
      skill: "/skill",
   };

   const fetchSuggestions = useCallback(
      async (query: string, name: string): Promise<{ value: string; label: string }[]> => {
         if (!query) {
            return [];
         }
         try {
            setLoadingKey(name);
            const { data } = await ServerFetch(
               `${listingEndpoints[name as keyof typeof listingEndpoints]}/listing?key=${query}`
            );
            return data.map((item: any) => ({
               value: String(item.value),
               label: item.label,
            }));
         } catch (error) {
            console.log(error);
            return [];
         } finally {
            setLoadingKey("");
         }
      },
      []
   );

   const getCurrencies = async () => {
      try {
         const { data } = await ServerFetch("/currency/listing", {
            next: { revalidate: 0, tags: ["currencies"] },
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

   const getWebinarDetails = async () => {
      try {
         const session = await getSession();
         const { data } = await ServerFetch("/webinar/update/" + editId, {
            method: "GET",
            headers: {
               Authorization: `Bearer ${session?.user.token}`,
            },
         });
         console.log(data, "data");
         const temp = { ...formData };
         for (const key in temp) {
            temp[key].value = data[key];
            if (key === "category_id") {
               temp[key].objectValue = {
                  value: String(data.category_id),
                  label: data?.category_name,
               };
            }
            if (key === "logo") {
               temp[key].required = false;
            }
            if (key === "languages") {
               temp[key].objectValue = data?.languages?.map((l: any) => ({
                  ...l,
                  value: String(l.value),
               }));
               temp[key].value = data?.languages?.length > 0 ? String(data?.languages[0].value) : "";
            }
            if (key === "start_time" || key === "end_time") {
               temp[key].value = convertToAMPM(data[key] as string);
            }
         }
         setFormData(temp);
      } catch (error) {
         console.log(error);
      }
   };

   console.log(formData, "formData");
   //    const getSubscriptioinDetails = async () => {
   //       try {
   //          const session = await getSession();
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
               await getWebinarDetails();
            }
            await getCurrencies();
         } catch (error) {
            console.log(error);
         } finally {
            setIsLoading(false);
         }
      })();
   }, []);
   //    useEffect(() => {
   //       getSubscriptioinDetails();
   //       if (subscriptionStatus === 1) {
   //          SuccessToast(`Subscription Expire`);
   //          router.push("/dashboard/pricing-and-plans");
   //       } else {
   //          console.log("Subscription status is not 1");
   //       }
   //    }, [subscriptionStatus]);
   if (isLoading) return <Loading />;

   return (
      <form className="aweb__form">
         <fieldset className="aweb__form--container">
            <div className="aweb__form--items col-span-3">
               <InputWithCharacterLimit
                  label="Webinar Title"
                  id="webinar-name"
                  name="title"
                  maxLength={50}
                  placeholder="Enter webinar title"
                  onChange={onInpChange}
                  value={formData.title.value as string}
                  isValid={formData.title.isValid}
               />
            </div>
            <div className="aweb__form--items col-span-1">
               <SuggestiveInput
                  id="languages"
                  name="languages"
                  techlang="Language"
                  placeholder="Enter language"
                  fetchSuggestions={(query: string) => fetchSuggestions(query, "language")}
                  value={formData.languages?.value as string}
                  onChange={onInpChange}
                  isLoading={loadingKey === "language"}
                  isValid={formData.languages.isValid}
                  objectValue={
                     formData.languages?.objectValue as {
                        value: string;
                        label: string;
                     }
                  }
               />
            </div>
            <div className="aweb__form--items">
               <p className="label">Start Date</p>
               <DatePicker
                  date={formData.start_date.value as Date}
                  setDate={(date) => {
                     const temp = { ...formData };
                     temp.start_date.value = date as Date;
                     setFormData(temp);
                  }}
               />
            </div>
            <div className="aweb__form--items">
               <p className="label">Start Time</p>
               <TimePicker
                  time={formData.start_time.value as string}
                  setTime={(time) => {
                     const temp = { ...formData };
                     temp.start_time.value = time;
                     setFormData(temp);
                  }}
               />
            </div>
            <div className="aweb__form--items">
               <p className="label">End Date</p>
               <DatePicker
                  minDate={formData.start_date.value as Date}
                  disabled={!formData.start_date.value}
                  date={formData.end_date.value as Date}
                  setDate={(date) => {
                     const temp = { ...formData };
                     temp.end_date.value = date as Date;
                     setFormData(temp);
                  }}
               />
            </div>
            <div className="aweb__form--items">
               <p className="label">End Time</p>
               <TimePicker
                  time={formData.end_time.value as string}
                  setTime={(time) => {
                     const temp = { ...formData };
                     temp.end_time.value = time;
                     setFormData(temp);
                  }}
               />
            </div>
            <div className="aweb__form--items">
               <SuggestiveInput
                  techSkill={true}
                  id="category_id"
                  name="category_id"
                  label="Category"
                  placeholder="Select Category"
                  fetchSuggestions={(query: string) => fetchSuggestions(query, "category_id")}
                  value={formData.category_id?.value as string}
                  objectValue={
                     formData.category_id?.objectValue as {
                        value: string;
                        label: string;
                     }[]
                  }
                  onChange={onInpChange}
                  isLoading={loadingKey === "category_id"}
                  isValid={formData.category_id.isValid}
               />
            </div>
            <div className="aweb__form--items">
               <label htmlFor="webinar-seats" className="label">
                  Number of Seats
               </label>
               <input
                  type="number"
                  id="webinar-seats"
                  className="input"
                  placeholder="1200"
                  min={1}
                  name="no_of_seats"
                  value={formData.no_of_seats.value as string}
                  onChange={onInpChange}
               />
            </div>
            <div className="aweb__form--items">
               <InputWithEndSelect
                  label="Webinar Price"
                  id="fee"
                  selectOptions={
                     formData.currency_id?.options as {
                        label: string;
                        value: string;
                     }[]
                  }
                  inputType="number"
                  placeholder="Enter price"
                  onChange={onInpChange}
                  name="fee"
                  optionName="currency_id"
                  optionValue={formData.currency_id.value as string}
                  isValid={formData.fee.isValid}
                  optionIsValid={formData.currency_id.isValid}
                  value={formData.fee.value as string}
               />
            </div>
            <div className="aweb__form--items">
               <p className="label">Webinar Mode</p>
               <InputSingleCheckbox
                  name="delivery_mode"
                  items={webinarMode}
                  onChange={(v: string | null) => {
                     onInpChange({ target: { name: "delivery_mode", value: v } });
                  }}
                  value={formData.delivery_mode.value as string}
               />
            </div>
            {formData.delivery_mode.value === "offline" && (
               <div className="aweb__form--items">
                  <label className="label">Webinar Address</label>
                  <input
                     type="text"
                     className="input"
                     autoComplete="address-level1"
                     name="address"
                     value={formData.address.value as string}
                     onChange={onInpChange}
                  />
               </div>
            )}
            <div className="aweb__form--items row-span-2">
               <p className="label">Webinar Image</p>
               <ImageUploader
                  defaultImage={
                     formData.logo.value ? `${process.env.NEXT_PUBLIC_IMAGE_URL}/${formData.logo.value}` : ""
                  }
                  onUpload={(url: string, file: File) => {
                     const temp = { ...formData };
                     temp.logo.url = url;
                     temp.logo.value = file;
                     temp.logo.isValid = true;
                     temp.logo.isEdited = true;
                     setFormData(temp);
                  }}
                  isValid={formData.logo.isValid}
               />
            </div>
            <div className="aweb__form--items col-span-3">
               <label className="label">Content</label>
               <Tiptap
                  content={formData.content.value as string}
                  onChange={(value: string) => {
                     const temp = { ...formData };
                     temp.content.value = value;
                     setFormData(temp);
                  }}
               />
            </div>
            <div className="acf__form--items col-span-3">
               <label className="label">Webinar Agenda</label>
               <textarea
                  name="agenda"
                  className="textarea"
                  id="agenda"
                  placeholder="Enter your  description"
                  value={formData.agenda.value as string}
                  onChange={onInpChange}
               ></textarea>
            </div>
         </fieldset>
         <div className="aweb__form--buttons">
            <button
               className="button__transparent"
               onClick={() => {
                  router.push("/dashboard/webinars");
               }}
               type="button"
            >
               Cancel
            </button>
            <button
               type="button"
               className="button__primary-light !flex gap-1 items-center justify-center"
               onClick={handleSubmit}
            >
               {isSubmitting && <RefreshCw className="animate-spin" />}
               Publish
            </button>
         </div>
      </form>
   );
};

export default AddWebinarForm;
