"use client";

import "./style.css";

import { UserProfile } from "../../../_types";
import { Separator } from "@/components/ui/separator";
import { FieldValues, useForm } from "react-hook-form";
import ProfilePicPicker from "@/app/dashboard/_components/profile-pic-picker";
import { dashboardLinks, LOGO_ICON_PREVIEW } from "@/lib/constants";
import { useCallback, useEffect, useRef, useState } from "react";
import { ServerFetch } from "@/actions/server-fetch";
import AutoFillInput, { AutoFillInputSuggestion } from "@/components/autofill-input";
import { Session } from "next-auth";
import { getSession, useSession } from "next-auth/react";
import { ErrorToast, SuccessToast } from "@/lib/toast";
import { Loader } from "lucide-react";
import { useRouter } from "next/navigation";
import { RevalidatePath } from "@/actions/revalidate-path";
import Loading from "@/components/loading";
import GoogleAddressAutofill from "@/components/google-address-autofill";
import Tiptap from "@/components/tiptap/Tiptap";
interface EditProfileFormProps {
   data: UserProfile;
   SubscriptionTakenTillNow: string | undefined;
   CourseExists: string | undefined;
}
interface UserBio {
   bio: string | null;
}
interface UserHighlight {
   highlights: string | null;
}
interface SuggestionOption {
   loading: boolean;
   value: Array<AutoFillInputSuggestion>;
   selected: Array<AutoFillInputSuggestion>;
   error?: string;
}

interface Suggestions {
   language: SuggestionOption;
   skill: SuggestionOption;
   qualification: SuggestionOption;
}

interface Qualification {
   id: number;
   name: string;
}
interface Skill {
   id: number;
   name: string;
}

interface Language {
   id: number;
   name: string;
}

function EditProfileForm({ data, SubscriptionTakenTillNow, CourseExists }: EditProfileFormProps) {
   console.log(SubscriptionTakenTillNow, "SubS");

   const [allQualifications, setAllQualifications] = useState<Qualification[]>([]);
   const [allSkills, setAllSkills] = useState<Skill[]>([]);
   const [allLanguages, setAllLanguages] = useState<Language[]>([]);

   const [submitting, setSubmitting] = useState(false);
   const [bioEditor, setBioEditor] = useState<UserBio>({ bio: data.bio });
   const [addHighlights, setAddHighlights] = useState<UserHighlight>({ highlights: data.highlights });
   const debounceTimeoutRef = useRef<{ [key: string]: NodeJS.Timeout }>({});
   const [profileImages, setProfileImages] = useState<{
      src: string;
      preview_profile_pic?: string;
      file: File | null;
   }>({
      src: data.profile_pic || "",
      preview_profile_pic: data.preview_profile_pic || "",
      file: null,
   });
   const {
      register,
      handleSubmit,
      formState: { errors },
      watch,
      setValue,
      setError,
      clearErrors,
   } = useForm({
      //defaultValues: data,
      defaultValues: {
         ...data,
         country: data.country || "1", // Default country as India
      }
   });
   const areaContainerRef = useRef<HTMLLabelElement>(null);
   const router = useRouter();
   const { update } = useSession();
   const values = watch();
   const [location, setLocation] = useState<{ [key: string]: Array<{ label: string; value: string }> }>({
      states: [],
      cities: [],
   });
   const [locationLoading, setLocationLoading] = useState({
      states: false,
      cities: false,
   });
   const [suggestions, setSuggestions] = useState<Suggestions>({
      language: { loading: false, value: [], selected: data.language || [], error: "" },
      skill: { loading: false, value: [], selected: data.skill || [], error: "" },
      qualification: { loading: false, value: [], selected: data.qualification || [], error: "" },
   });
   const suggestionsRef = useRef<{ [key: string]: HTMLInputElement }>({});

   const fetchStates = useCallback(async (value: string) => {
      try {
         setLocationLoading((prev) => ({ ...prev, states: true }));
         setLocation((prev) => ({ ...prev, cities: [] }));
         const result = await ServerFetch(`/state/listing?country_id=${value}`, {
            headers: { "Content-Type": "application/json" },
            next: { revalidate: 5, tags: ["State"] },
         });
         if (Array.isArray(result?.data)) {
            setLocation((prev) => ({ ...prev, states: result?.data }));
            setValue("state", data.country === value ? values.state : "");
         }
      } catch (error) {
         console.log(error);
      } finally {
         setLocationLoading((prev) => ({ ...prev, states: false }));
      }
   }, []);

   const fetchCities = useCallback(async (value: string) => {
      try {
         setLocationLoading((prev) => ({ ...prev, cities: true }));
         const result = await ServerFetch(`/city/listing?state_id=${value}`, {
            headers: { "Content-Type": "application/json" },
            next: { revalidate: 5, tags: ["City"] },
         });
         if (Array.isArray(result?.data)) {
            setLocation((prev) => ({ ...prev, cities: result?.data }));
            setValue("city", data.state === value ? values.city : "");
         }
      } catch (error) {
         console.log(error);
      } finally {
         setLocationLoading((prev) => ({ ...prev, cities: false }));
      }
   }, []);


   const fetchSuggestions = async (
      name: string,
      query: string
   ): Promise<{ value: string; label: string }[]> => {
      if (!query) return [];

      console.log("Fetching suggestions for:", name, query);

      let sourceData: any[] = [];

      switch (name) {
         case 'qualification':
            sourceData = allQualifications;
            break;
         case 'skill':
            sourceData = allSkills;
            break;
         case 'language':
            sourceData = allLanguages;
            break;
         default:
            return [];
      }

      const lowerQuery = query.toLowerCase();

      console.log("Source Data:", allQualifications);

      const filtered = sourceData
         .filter((item) => item?.label && item.label.toLowerCase().includes(lowerQuery))
         .map((item) => ({
            value: item.id?.toString() ?? item.value,
            label: item.label ?? '',
         }));

      console.log("Filtered Data:", filtered);

      return filtered;
   };



   const handleLanguageInputChange = async (query: string) => {
      setSuggestions((prev) => ({
         ...prev,
         language: {
            ...prev.language,
            loading: true,
         },
      }));

      const data = await fetchSuggestions("language", query);

      setSuggestions((prev) => ({
         ...prev,
         language: {
            ...prev.language,
            loading: false,
            value: data,
         },
      }));
   };


   const handleSkillInputChange = async (query: string) => {
      setSuggestions((prev) => ({
         ...prev,
         skill: {
            ...prev.skill,
            loading: true,
         },
      }));

      const data = await fetchSuggestions("skill", query);

      setSuggestions((prev) => ({
         ...prev,
         skill: {
            ...prev.skill,
            loading: false,
            value: data,
         },
      }));
   };


   const handleQualificationInputChange = async (query: string) => {
      setSuggestions((prev) => ({
         ...prev,
         qualification: {
            ...prev.qualification,
            loading: true,
         },
      }));

      const data = await fetchSuggestions("qualification", query);

      setSuggestions((prev) => ({
         ...prev,
         qualification: {
            ...prev.qualification,
            loading: false,
            value: data,
         },
      }));
   };



   const genrateMultipleInputValueArray = (input: Array<AutoFillInputSuggestion>) => {
      if (!Array.isArray(input)) return;

      return input.map((i) => `${i.value}`);
   };

   const getAllMasterData = async () => {
      try {
         const [qualificationRes, skillRes, languageRes] = await Promise.all([
            ServerFetch(`/qualification/listing`, {
               headers: { "Content-Type": "application/json" },
               next: { revalidate: 120 },
            }),
            ServerFetch(`/skill/listing`, {
               headers: { "Content-Type": "application/json" },
               next: { revalidate: 120 },
            }),
            ServerFetch(`/language/listing`, {
               headers: { "Content-Type": "application/json" },
               next: { revalidate: 120 },
            }),
         ]);

         console.log("Qualifications:", qualificationRes.data);
         console.log("Skills:", skillRes.data);
         console.log("Languages:", languageRes.data);

         setAllQualifications(Array.isArray(qualificationRes.data) ? qualificationRes.data : []);
         setAllSkills(Array.isArray(skillRes.data) ? skillRes.data : []);
         setAllLanguages(Array.isArray(languageRes.data) ? languageRes.data : []);
      } catch (error) {
         console.error("Error fetching master data:", error);
         setAllQualifications([]);
         setAllSkills([]);
         setAllLanguages([]);
      }
   };

   useEffect(() => {
      getAllMasterData();
   }, []);


   //    const validateMultipleInputs = () => {
   //       const values = {
   //          qualification: genrateMultipleInputValueArray(suggestions.qualification.selected),
   //          skill: genrateMultipleInputValueArray(suggestions.skill.selected),
   //          language: genrateMultipleInputValueArray(suggestions.language.selected),
   //       };
   //       let isValid = true;
   //       let errorItem = "";

   //       for (const value in values) {
   //          const val = value as "skill" | "language";
   //          if (values[val]?.length === 0) {
   //             isValid = false;
   //             if (!errorItem) {
   //                errorItem = val;
   //             }
   //             setSuggestions((prev) => ({ ...prev, [val]: { ...prev[val], error: "This is a required field." } }));
   //          }
   //       }
   //       if (errorItem) {
   //         console.log(errorItem);
   //          suggestionsRef.current?.[errorItem].focus();
   //          suggestionsRef.current?.[errorItem].scrollIntoView({ behavior: "smooth", block: "center" });
   //          errorItem = "";
   //       }
   //       return { isValid, values };
   //    };

   const validateMultipleInputs = () => {
      const values = {
         qualification: genrateMultipleInputValueArray(suggestions.qualification.selected),
         skill: genrateMultipleInputValueArray(suggestions.skill.selected),
         language: genrateMultipleInputValueArray(suggestions.language.selected),
      };
      let isValid = true;
      let errorItem = "";

      for (const value in values) {
         const val = value as "skill" | "language" | "qualification";

         // Skip qualification validation for a specific user type
         if (val === "qualification" && data.user_type === "institute") {
            continue; // Skip validation for qualification
         }

         if (values[val]?.length === 0) {
            isValid = false;
            if (!errorItem) {
               errorItem = val;
            }
            setSuggestions((prev) => ({
               ...prev,
               [val]: { ...prev[val], error: "This is a required field." }
            }));
         }
      }

      if (errorItem) {
         console.log(errorItem);
         if (suggestionsRef.current?.[errorItem]) {
            suggestionsRef.current[errorItem].focus();
            suggestionsRef.current[errorItem].scrollIntoView({ behavior: "smooth", block: "center" });
         }
      }

      return { isValid, values };
   };


   const handleUpdateProfilePicture = async (session: Session) => {
      console.log("formdata profile picture", profileImages);
      try {
         if (!profileImages.file || !session.user) return "no-change";
         const formdata = new FormData();
         formdata.append("profile_pic", profileImages.file);
         formdata.append("preview_profile_pic", profileImages.preview_profile_pic || "");
         formdata.append("user_id", String(session.user.userId));
         const result = await ServerFetch("/user/update/profile-pic", {
            method: "POST",
            headers: {
               Authorization: `Bearer ${session.user.token}`,
            },
            body: formdata,
            cache: "no-store",
         });
         if (!result.status) {
            throw new Error("Unable to update your profile picture at the momemnt.");
         }

         return result.data;
      } catch (error) {
         let m = "Unable to update your profile picture at the momemnt.";
         if (error instanceof Error) {
            m = error.message;
         }
         ErrorToast(m);
      }
   };

   const handleUpdatePersonalInfo = async (session: Session, data: FieldValues) => {
      try {
         if (!session.user) return;

         const dataToSubmit = {
            user_id: session.user.userId,
            f_name: data.f_name,
            email: data.email,
            phone: data.phone,
            bio: bioEditor?.bio,
            highlights: addHighlights?.highlights,
            country: data.country,
            state: data.state,
            city: data.city,
            address: data.address,
            gst_no: data.gst_no || "",
            postcode: data.postcode,
            area: data.area,
         };

         const result = await ServerFetch("/user/update/personal-info", {
            method: "POST",
            headers: {
               "Content-Type": "application/json",
               Authorization: `Bearer ${session.user.token}`,
            },
            body: JSON.stringify(dataToSubmit),
            cache: "no-store",
         });

         if (!result.status) {
            throw new Error("Unable to update your personal information at the moment.");
         }
         return true;
      } catch (error) {
         let m = "Unable to update your personal information at the moment.";
         if (error instanceof Error) {
            m = error.message;
         }
         ErrorToast(m);
      }
   };

   const handleUpdateQualificationInfo = async (session: Session, data: { [key: string]: Array<string | number> }) => {
      try {
         if (!session.user) return;
         const dataToSubmit = {
            user_id: session.user.userId,
            year_of_exp: values.year_of_exp ? +values.year_of_exp : 0,
            qualification: JSON.stringify(data.qualification),
            skill: JSON.stringify(data.skill),
            language: JSON.stringify(data.language),
         };
         console.log("dataToSubmit", dataToSubmit);
         const result = await ServerFetch("/user/update/educational-info", {
            method: "POST",
            headers: {
               "Content-Type": "application/json",
               Authorization: `Bearer ${session.user.token}`,
            },
            body: JSON.stringify(dataToSubmit),
            cache: "no-store",
         });

         if (!result.status) {
            throw new Error("Unable to update your educational information at the moment.");
         }
         return true;
      } catch (error) {
         let m = "Unable to update your educational information at the moment.";
         if (error instanceof Error) {
            m = error.message;
         }
         ErrorToast(m);
      }
   };

   const handleFormSubmit = async (d: FieldValues) => {
      if (!values.area) {
         return;
      }

      try {
         setSubmitting(true);
         const session = await getSession();
         //Validation educational qualification
         const { isValid, values } = validateMultipleInputs();
         if (!session || !isValid) {
            setSubmitting(false);
            return;
         }
         const [profilePic, basicDetails, educationalDetails] = await Promise.allSettled<
            Array<Promise<"no-change" | any>>
         >([
            handleUpdateProfilePicture(session),
            handleUpdatePersonalInfo(session, d),
            handleUpdateQualificationInfo(session, values as { [key: string]: Array<string | number> }),
         ]);

         const data = {
            profilePicture: session.user.profilePicture,
            fullName: session.user.fullName,
         };
         if (profilePic.status === "fulfilled" && profilePic.value && profilePic.value !== "no-change") {
            data.profilePicture = profilePic.value.profile_pic;
            SuccessToast("Profile picture updated succesfully.");
         }
         if (basicDetails.status === "fulfilled" && basicDetails.value) {
            data.fullName = d.f_name;
            SuccessToast("Your basic informations updated succesfully.");
         }
         if (educationalDetails.status === "fulfilled" && educationalDetails.value) {
            SuccessToast("Your educational informations updated succesfully.");
         }
         await update(data);
         // RevalidatePath("/dashboard/profile", "page");
         if (SubscriptionTakenTillNow == 'false') {
            if (SubscriptionTakenTillNow == 'false' && CourseExists == "false") {
               router.push(dashboardLinks.addCourses);
            } else {
               router.push(dashboardLinks.courses);
            }
         } else {
            router.push(dashboardLinks.profile)
         }
      } catch (error) {
         console.log(error);
      } finally {
         setSubmitting(false);
      }
   };

   useEffect(() => {
      if (values.country) {
         fetchStates(values.country);
      }
   }, [values.country]);

   useEffect(() => {
      if (values.state) {
         fetchCities(values.state);
      }
   }, [values.state]);

   return (
      <form
         onSubmit={(e) => {
            e.preventDefault();

            if (!values.area) {
               areaContainerRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
               setError("area", { type: "required", message: "This field is required." });
            }
            if (submitting) return;
            validateMultipleInputs();
            handleSubmit(handleFormSubmit)(e);
         }}
         className="relative"
      >
         <fieldset className="epf" disabled={submitting}>
            <h1 className="subtitle">Edit Profile</h1>
            <ProfilePicPicker
               src={
                  data.profile_pic === profileImages.src
                     ? `${process.env.NEXT_PUBLIC_IMAGE_URL}/${data.profile_pic}`
                     : profileImages.src || "/img/common/logo-icon.svg"
               }
               alt="Profile Image"
               blurDataURL={profileImages.preview_profile_pic || LOGO_ICON_PREVIEW}
               loading="eager"
               onChange={(src, blurDataURL, file) => {
                  setProfileImages({
                     src,
                     preview_profile_pic: blurDataURL,
                     file,
                  });
               }}
            />
            <h2 className="dash-subtitle">Personal Information</h2>

            <div className="epf__info--container">
               <div>
                  <label htmlFor="fullName" className="label">
                     Full Name
                  </label>
                  <input
                     type="text"
                     className="input"
                     id="fullName"
                     autoComplete="name"
                     placeholder="Full Name"
                     {...register("f_name", {
                        required: {
                           value: true,
                           message: "This field is required.",
                        },
                     })}
                  />
                  {errors.f_name && <p className="error">{errors.f_name.message}</p>}
               </div>
               <div>
                  <label htmlFor="phone" className="label">
                     Phone
                  </label>
                  <input
                     type="tel"
                     className="input !cursor-not-allowed opacity-75 !text-gray-600"
                     id="phone"
                     placeholder="Phone"
                     autoComplete="mobile tel"
                     disabled
                     {...register("phone", {
                        required: {
                           value: true,
                           message: "This field is required.",
                        },
                     })}
                  />
                  {errors.phone && <p className="error">{errors.phone.message}</p>}
               </div>
               <div>
                  <label htmlFor="email" className="label">
                     Email
                  </label>
                  <input
                     type="email"
                     className="input !cursor-not-allowed opacity-75 !text-gray-600"
                     id="email"
                     placeholder="Email"
                     autoComplete="email"
                     disabled
                     {...register("email", {
                        required: {
                           value: true,
                           message: "This field is required.",
                        },
                     })}
                  />
                  {errors.email && <p className="error">{errors.email.message}</p>}
               </div>
               <div>
                  <label htmlFor="country" className="label">
                     Select Country
                  </label>
                  <select
                     className="select"
                     {...register("country", {
                        required: {
                           value: true,
                           message: "This field is required.",
                        },
                        value: data.countries?.length > 0 ? values.country : "",
                     })}
                  >
                     <option value="" disabled>
                        Please Select
                     </option>
                     {data.countries?.map((country) => (
                        <option key={country.value} value={country.value}>
                           {country.label}
                        </option>
                     ))}
                  </select>
                  {errors.country && <p className="error">{errors.country.message}</p>}
               </div>
               {values.country && !locationLoading.states && (
                  <div>
                     <label htmlFor="state" className="label">
                        Select State
                     </label>
                     <select
                        className="select"
                        {...register("state", {
                           required: {
                              value: true,
                              message: "This field is required.",
                           },
                        })}
                     >
                        <option value="">Please Select</option>
                        {location.states.map((state) => (
                           <option key={state.value} value={state.value}>
                              {state.label}
                           </option>
                        ))}
                     </select>
                     {errors.state && <p className="error">{errors.state.message}</p>}
                  </div>
               )}
               {(values.state || !values.state) && !locationLoading.cities && !locationLoading.states && (
                  <div>
                     <label htmlFor="city" className="label">
                        Select City
                     </label>
                     <select
                        className="select"
                        {...register("city", {
                           required: {
                              value: true,
                              message: "This field is required.",
                           },
                        })}
                     >
                        <option value="">Please Select</option>
                        {location.cities.map((city) => (
                           <option key={city.value} value={city.value}>
                              {city.label}
                           </option>
                        ))}
                     </select>
                     {errors.city && <p className="error">{errors.city.message}</p>}
                  </div>
               )}

               {/* AREA */}
               <div>
                  <label htmlFor="area" className="label" ref={areaContainerRef}>
                     Area
                  </label>
                  <GoogleAddressAutofill
                     restrictionType={["sublocality"]}
                     onSelect={(areaName) => {
                        setValue("area", areaName);
                        clearErrors("area");
                     }}
                     defaultValue={values.area || ""}
                     focus={!!errors.area}
                  />

                  {errors.area && <p className="error">{errors.area.message}</p>}
               </div>
               <div>
                  <label htmlFor="address" className="label">
                     Address
                  </label>
                  <input
                     type="text"
                     className="input"
                     id="address"
                     placeholder="Address"
                     autoComplete="address-line1"
                     {...register("address", {
                        required: {
                           value: true,
                           message: "This field is required.",
                        },
                     })}
                  />
                  {errors.address && <p className="error">{errors.address.message}</p>}
               </div>
               <div>
                  <label htmlFor="postcode" className="label">
                     Postcode
                  </label>
                  <input
                     type="text"
                     className="input"
                     id="postcode"
                     autoComplete="postal-code"
                     placeholder="Postcode"
                     {...register("postcode", {
                        required: {
                           value: true,
                           message: "This field is required.",
                        },
                     })}
                  />
                  {errors.postcode && <p className="error">{errors.postcode.message}</p>}
               </div>

               <div>
                  <label htmlFor="gst_no" className="label">
                     GST Optional
                  </label>
                  <input
                     type="text"
                     className="input"
                     id="gst"
                     placeholder="GST"
                     {...register("gst_no", {
                        validate: {
                           matchPattern: (value) => {
                              if (value) {
                                 return (
                                    /^[0-9]{2}[A-Za-z]{5}[0-9]{4}[A-Za-z]{1}[1-9A-Za-z]{1}[Z|z][0-9A-Za-z]{1}$/g.test(
                                       value
                                    ) || "Please enter a valid GST number."
                                 );
                              }
                           },
                        },
                     })}
                  />
                  {errors.gst_no && <p className="error">{errors.gst_no.message}</p>}
               </div>
            </div>

            {/* <div>
               <label htmlFor="courseContent">Highlight</label>

               <Tiptap
                  content={data?.highlights as string}
                  onChange={(value: string) => {
                     const temp = { ...data };
                     temp.highlights = value;
                     setAddHighlights(temp);
                  }}
               />
               {errors.highlights && <p className="error">{errors.highlights.message}</p>}
            </div> */}
            <div>
               <label htmlFor="bio">Bio</label>

               <Tiptap
                  content={data?.bio as string}
                  onChange={(value: string) => {
                     const temp = { ...data };
                     temp.bio = value;
                     setBioEditor(temp);
                  }}
               />
               {errors.bio && <p className="error">{errors.bio.message}</p>}
            </div>
            <Separator />

            <h2 className="dash-subtitle">Skills and Qualification</h2>
            <div className="epf__info--container">
               {data.user_type === "institute" ? (
                  ""
               ) : (
                  <div>
                     <AutoFillInput
                        qualificationToggle={true}
                        label="Qualification"
                        id="qualification"
                        suggestions={suggestions.qualification.value}
                        selectedSuggestions={suggestions.qualification.selected}
                        onSuggestionRemove={(suggestion) => {
                           const filteredSelectedQualification = suggestions.qualification.selected.filter(
                              (item) => item.value !== suggestion.value
                           );
                           setSuggestions((prev) => ({
                              ...prev,
                              qualification: {
                                 ...prev.qualification,
                                 selected: filteredSelectedQualification,
                              },
                           }));
                        }}
                        onSuggestionSelect={(qualification) => {
                           console.log("qualification", qualification);
                           const index = suggestions.qualification.selected.findIndex(
                              (item) => item.value === qualification.value
                           );
                           if (index >= 0) return;
                           setSuggestions((prev) => ({
                              ...prev,
                              qualification: {
                                 ...prev.qualification,
                                 selected: [...prev.qualification.selected, qualification],
                                 error: "",
                              },
                           }));
                        }}
                        onInputValueChange={(value) => {
                           handleQualificationInputChange(value);
                        }}
                        loadingSuggestions={suggestions.qualification.loading}
                        ref={(ref: HTMLInputElement) => {
                           suggestionsRef.current.qualification = ref;
                        }}
                     />
                     {suggestions.qualification.error && <p className="error">{suggestions.qualification.error}</p>}
                  </div>
               )}
               <div>
                  <AutoFillInput
                     label="Skills"
                     id="skill"
                     suggestions={suggestions.skill.value}
                     selectedSuggestions={suggestions.skill.selected}
                     onSuggestionRemove={(suggestion) => {
                        const filteredSelectedSkill = suggestions.skill.selected.filter(
                           (item) => item.value !== suggestion.value
                        );
                        setSuggestions((prev) => ({
                           ...prev,
                           skill: {
                              ...prev.skill,
                              selected: filteredSelectedSkill,
                           },
                        }));
                     }}
                     onSuggestionSelect={(skill) => {
                        const index = suggestions.skill.selected.findIndex((item) => item.value === skill.value);
                        if (index >= 0) return;
                        setSuggestions((prev) => ({
                           ...prev,
                           skill: {
                              ...prev.skill,
                              selected: [...prev.skill.selected, skill],
                              error: "",
                           },
                        }));
                     }}
                     onInputValueChange={(value) => {
                        handleSkillInputChange(value);
                     }}
                     loadingSuggestions={suggestions.skill.loading}
                     ref={(ref: HTMLInputElement) => {
                        suggestionsRef.current.skill = ref;
                     }}
                  />
                  {suggestions.skill.error && <p className="error">{suggestions.skill.error}</p>}
               </div>
               <div>
                  <AutoFillInput
                     label="Language"
                     id="language"
                     suggestions={suggestions.language.value}
                     selectedSuggestions={suggestions.language.selected}
                     onSuggestionRemove={(suggestion) => {
                        const filteredSelectedLanguage = suggestions.language.selected.filter(
                           (item) => item.value !== suggestion.value
                        );
                        setSuggestions((prev) => ({
                           ...prev,
                           language: {
                              ...prev.language,
                              selected: filteredSelectedLanguage,
                           },
                        }));
                     }}
                     onSuggestionSelect={(language) => {
                        const index = suggestions.language.selected.findIndex((item) => item.value === language.value);
                        if (index >= 0) return;
                        setSuggestions((prev) => ({
                           ...prev,
                           language: {
                              ...prev.language,
                              selected: [...prev.language.selected, language],
                              error: "",
                           },
                        }));
                     }}
                     onInputValueChange={(value) => {
                        handleLanguageInputChange(value);
                     }}
                     loadingSuggestions={suggestions.language.loading}
                     ref={(ref: HTMLInputElement) => {
                        suggestionsRef.current.language = ref;
                     }}
                  />
                  {suggestions.language.error && <p className="error">{suggestions.language.error}</p>}
               </div>
               <div>
                  <label htmlFor="experience" className="label">
                     Experience in Years
                  </label>
                  <input
                     type="number"
                     className="input"
                     id="year_of_exp"
                     step="0.1"
                     min="0"
                     {...register("year_of_exp", {
                        required: {
                           value: true,
                           message: "This field is required.",
                        },
                        min: {
                           value: 0,
                           message: "Please enter a valid Experience (in years).",
                        },
                     })}
                     onInput={(e: React.ChangeEvent<HTMLInputElement>) => {
                        if (Number(e.target.value) < 0) e.target.value = "";
                     }}
                  />
                  {errors.year_of_exp && <p className="error">{errors.year_of_exp.message}</p>}
               </div>
            </div>

            <input type="submit" hidden disabled={submitting} />
            <div className={"epf__buttons--container"}>
               <button
                  type="button"
                  className={`button__transparent ${submitting ? "opacity-80 !cursor-not-allowed" : ""}`}
                  disabled={submitting}
               >
                  Cancel
               </button>
               <button
                  type="submit"
                  className={`button__primary ${submitting ? "opacity-80 !cursor-not-allowed" : ""}`}
                  disabled={submitting}
               >
                  {submitting ? "Updating " : SubscriptionTakenTillNow == 'false' ? "Update & Continue " : "Update Profile"}
                  {submitting && <Loader className="animate-spin duration-2000" size={15} />}
               </button>
            </div>
         </fieldset>
         {submitting && (
            <div aria-haspopup className="fixed z-10 inset-0 bg-[#ffffff99]">
               <Loading />
            </div>
         )}
      </form>
   );
}

export default EditProfileForm;
