"use client";

import "./style.css";
import { UserProfile } from "../../../_types";
import { Separator } from "@/components/ui/separator";
import { FieldValues, useForm } from "react-hook-form";
import ProfilePicPicker from "@/app/dashboard/_components/profile-pic-picker";
import { dashboardLinks, LOGO_ICON_PREVIEW } from "@/lib/constants";
import { useCallback, useEffect, useRef, useState } from "react";
import { ServerFetch } from "@/actions/server-fetch";
import { Session } from "next-auth";
import { getSession, useSession } from "next-auth/react";
import { ErrorToast, SuccessToast } from "@/lib/toast";
import { Loader } from "lucide-react";
import { useRouter } from "next/navigation";
import Loading from "@/components/loading";
import GoogleAddressAutofill from "@/components/google-address-autofill";
import Tiptap from "@/components/tiptap/Tiptap";
import dynamic from "next/dynamic";
import { MultiValue } from 'react-select'
import Skeleton from "@/components/skeleton";

const Select = dynamic(() => import("react-select"), { ssr: false })

interface EditProfileFormProps {
   data: UserProfile;
   SubscriptionTakenTillNow: string | undefined;
   CourseExists: string | undefined;
}

interface MasterData {
   qualifications: Qualification[];
   skills: Skill[];
   languages: Language[];
}

interface Qualification {
   value: number;
   label: string;
}

interface Skill {
   id: number;
   name: string;
}

interface Language {
   id: number;
   name: string;
}

type SelectOption = {
   label: string;
   value: string | number;
};

interface FormData {
   personalInfo: {
      profilePic: {
         src: string;
         preview_profile_pic?: string;
         file: File | null;
      };
      f_name: string;
      email: string;
      phone: string;
      bio: string | null;
      highlights: string | null;
      country: string;
      state: string;
      city: string;
      address: string;
      gst_no: string;
      postcode: string;
      area: string;
   };
   educationalInfo: {
      qualifications: MultiValue<SelectOption>;
      skills: MultiValue<SelectOption>;
      languages: MultiValue<SelectOption>;
      year_of_exp: number;
   };
}

function EditProfileForm({ data, SubscriptionTakenTillNow, CourseExists }: EditProfileFormProps) {
   const router = useRouter();
   const { update } = useSession();

   // Master data state
   const [masterData, setMasterData] = useState<MasterData>({
      qualifications: [],
      skills: [],
      languages: []
   });

   const [isLoadingMasterData, setIsLoadingMasterData] = useState(true);

   // Form data state
   const [formData, setFormData] = useState<FormData>({
      personalInfo: {
         profilePic: {
            src: data.profile_pic || "",
            preview_profile_pic: data.preview_profile_pic || "",
            file: null,
         },
         f_name: data.f_name || "",
         email: data.email || "",
         phone: data.phone || "",
         bio: data.bio || null,
         highlights: data.highlights || null,
         country: data.country || "1",
         state: data.state || "",
         city: data.city || "",
         address: data.address || "",
         gst_no: data.gst_no || "",
         postcode: data.postcode || "",
         area: data.area || "",
      },
      educationalInfo: {
         qualifications: [],
         skills: [],
         languages: [],
         year_of_exp: data.year_of_exp || 0,
      }
   });

   // Location state
   const [location, setLocation] = useState<{
      states: Array<{ label: string; value: string }>;
      cities: Array<{ label: string; value: string }>;
   }>({
      states: [],
      cities: [],
   });

   const [locationLoading, setLocationLoading] = useState({
      states: false,
      cities: false,
   });

   const [submitting, setSubmitting] = useState(false);
   const areaContainerRef = useRef<HTMLLabelElement>(null);

   const {
      register,
      handleSubmit,
      formState: { errors },
      watch,
      setValue,
      setError,
      clearErrors,
   } = useForm({
      defaultValues: {
         ...data,
         country: data.country || "1",
      }
   });

   const values = watch();

   // Fetch master data on component mount
   useEffect(() => {
      const fetchMasterData = async () => {
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

            setMasterData({
               qualifications: Array.isArray(qualificationRes.data) ? qualificationRes.data : [],
               skills: Array.isArray(skillRes.data) ? skillRes.data : [],
               languages: Array.isArray(languageRes.data) ? languageRes.data : [],
            });

            // Initialize form data with existing values
            if (data.qualification?.length) {
               const qualificationNos = data.qualification.map((option: { value: string }) => +option.value);
               const selectedQualifications = qualificationRes.data.filter((qual: Qualification) =>
                  qualificationNos.includes(qual.value)
               );
               setFormData(prev => ({
                  ...prev,
                  educationalInfo: {
                     ...prev.educationalInfo,
                     qualifications: selectedQualifications,
                  }
               }));
            }

            if (data.skill?.length) {
               const selectedSkills = data.skill.map((skill: any) => ({
                  label: skill.label,
                  value: skill.value,
               }));
               setFormData(prev => ({
                  ...prev,
                  educationalInfo: {
                     ...prev.educationalInfo,
                     skills: selectedSkills,
                  }
               }));
            }

            if (data.language?.length) {
               const selectedLanguages = data.language.map((lang: any) => ({
                  label: lang.label,
                  value: lang.value,
               }));
               setFormData(prev => ({
                  ...prev,
                  educationalInfo: {
                     ...prev.educationalInfo,
                     languages: selectedLanguages,
                  }
               }));
            }
         } catch (error) {
            console.error("Error fetching master data:", error);
         } finally {
            setIsLoadingMasterData(false);
         }
      };

      fetchMasterData();
   }, [data]);

   // Location data fetching
   const fetchStates = useCallback(async (countryId: string) => {
      try {
         setLocationLoading(prev => ({ ...prev, states: true }));
         setLocation(prev => ({ ...prev, cities: [] }));

         const result = await ServerFetch(`/state/listing?country_id=${countryId}`, {
            headers: { "Content-Type": "application/json" },
            next: { revalidate: 0, tags: ["State"] },
         });

         if (Array.isArray(result?.data)) {
            setLocation(prev => ({ ...prev, states: result?.data }));
            setValue("state", data.country === countryId ? values.state : "");
         }
      } catch (error) {
         console.log(error);
      } finally {
         setLocationLoading(prev => ({ ...prev, states: false }));
      }
   }, []);

   const fetchCities = useCallback(async (stateId: string) => {
      try {
         setLocationLoading(prev => ({ ...prev, cities: true }));
         const result = await ServerFetch(`/city/listing?state_id=${stateId}`, {
            headers: { "Content-Type": "application/json" },
            next: { revalidate: 0, tags: ["City"] },
         });

         if (Array.isArray(result?.data)) {
            setLocation(prev => ({ ...prev, cities: result?.data }));
            setValue("city", data.state === stateId ? values.city : "");
         }
      } catch (error) {
         console.log(error);
      } finally {
         setLocationLoading(prev => ({ ...prev, cities: false }));
      }
   }, []);

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

   // Form handlers
   const handleProfilePicChange = (src: string, blurDataURL: string, file: File | null) => {
      setFormData(prev => ({
         ...prev,
         personalInfo: {
            ...prev.personalInfo,
            profilePic: {
               src,
               preview_profile_pic: blurDataURL,
               file,
            }
         }
      }));
   };

   const handleBioChange = (value: string) => {
      setFormData(prev => ({
         ...prev,
         personalInfo: {
            ...prev.personalInfo,
            bio: value
         }
      }));
   };

   const handleHighlightsChange = (value: string) => {
      setFormData(prev => ({
         ...prev,
         personalInfo: {
            ...prev.personalInfo,
            highlights: value
         }
      }));
   };

   const handleAreaSelect = (areaName: string) => {
      setValue("area", areaName);
      clearErrors("area");
      setFormData(prev => ({
         ...prev,
         personalInfo: {
            ...prev.personalInfo,
            area: areaName
         }
      }));
   };

   // API call handlers
   const handleUpdateProfilePicture = async (session: Session) => {
      try {
         if (!formData.personalInfo.profilePic.file || !session.user) return "no-change";

         const formdata = new FormData();
         formdata.append("profile_pic", formData.personalInfo.profilePic.file);
         formdata.append("preview_profile_pic", formData.personalInfo.profilePic.preview_profile_pic || "");
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
            throw new Error("Unable to update your profile picture at the moment.");
         }

         return result.data;
      } catch (error) {
         let message = "Unable to update your profile picture at the moment.";
         if (error instanceof Error) {
            message = error.message;
         }
         ErrorToast(message);
         throw error;
      }
   };

   const handleUpdatePersonalInfo = async (session: Session) => {
      try {
         if (!session.user) return;

         const result = await ServerFetch("/user/update/personal-info", {
            method: "POST",
            headers: {
               "Content-Type": "application/json",
               Authorization: `Bearer ${session.user.token}`,
            },
            body: JSON.stringify({
               user_id: session.user.userId,
               ...formData.personalInfo,
               profilePic: undefined // Remove profilePic from the payload
            }),
            cache: "no-store",
         });

         if (!result.status) {
            throw new Error("Unable to update your personal information at the moment.");
         }
         return true;
      } catch (error) {
         let message = "Unable to update your personal information at the moment.";
         if (error instanceof Error) {
            message = error.message;
         }
         ErrorToast(message);
         throw error;
      }
   };

   const handleUpdateEducationalInfo = async (session: Session) => {
      try {
         if (!session.user) return;

         const result = await ServerFetch("/user/update/educational-info", {
            method: "POST",
            headers: {
               "Content-Type": "application/json",
               Authorization: `Bearer ${session.user.token}`,
            },
            body: JSON.stringify({
               user_id: session.user.userId,
               year_of_exp: formData.educationalInfo.year_of_exp,
               qualification: JSON.stringify(formData.educationalInfo.qualifications.map(q => q.value.toString())),
               skill: JSON.stringify(formData.educationalInfo.skills.map(s => s.value)),
               language: JSON.stringify(formData.educationalInfo.languages.map(l => l.value)),
            }),
            cache: "no-store",
         });

         if (!result.status) {
            throw new Error("Unable to update your educational information at the moment.");
         }
         return true;
      } catch (error) {
         let message = "Unable to update your educational information at the moment.";
         if (error instanceof Error) {
            message = error.message;
         }
         ErrorToast(message);
         throw error;
      }
   };

   // Form validation
   const validateForm = () => {
      let isValid = true;

      // Personal info validation
      if (!formData.personalInfo.area) {
         setError("area", { type: "required", message: "This field is required." });
         areaContainerRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
         isValid = false;
      }

      // Educational info validation
      if (formData.educationalInfo.qualifications.length === 0 && data.user_type !== "institute") {
         setError("qualifications" as any, { type: "required", message: "At least one qualification is required." });
         isValid = false;
      }

      if (formData.educationalInfo.skills.length === 0) {
         setError("skills" as any, { type: "required", message: "At least one skill is required." });
         isValid = false;
      }

      if (formData.educationalInfo.languages.length === 0) {
         setError("languages" as any, { type: "required", message: "At least one language is required." });
         isValid = false;
      }

      return isValid;
   };

   // Form submission
   const handleFormSubmit = async (formValues: FieldValues) => {
      if (!validateForm()) return;

      try {
         setSubmitting(true);
         const session = await getSession();
         if (!session) return;

         const [profilePicResult, personalInfoResult, educationalInfoResult] = await Promise.allSettled([
            handleUpdateProfilePicture(session),
            handleUpdatePersonalInfo(session),
            handleUpdateEducationalInfo(session),
         ]);

         const updatedData: any = {
            profilePicture: session.user.profilePicture,
            fullName: session.user.fullName,
         };

         if (profilePicResult.status === "fulfilled" && profilePicResult.value !== "no-change") {
            updatedData.profilePicture = profilePicResult.value?.profile_pic;
            SuccessToast("Profile picture updated successfully.");
         }

         if (personalInfoResult.status === "fulfilled" && personalInfoResult.value) {
            updatedData.fullName = formData.personalInfo.f_name;
            SuccessToast("Your basic information updated successfully.");
         }

         if (educationalInfoResult.status === "fulfilled" && educationalInfoResult.value) {
            SuccessToast("Your educational information updated successfully.");
         }

         await update(updatedData);

         if (SubscriptionTakenTillNow === 'false') {
            router.push(CourseExists === "false" ? dashboardLinks.addCourses : dashboardLinks.courses);
         } else {
            router.push(dashboardLinks.profile);
         }
      } catch (error) {
         console.error("Error updating profile:", error);
      } finally {
         setSubmitting(false);
      }
   };

   return (
      <form
         onSubmit={handleSubmit(handleFormSubmit)}
         className="relative"
      >
         <fieldset className="epf" disabled={submitting}>
            <h1 className="subtitle">Edit Profile</h1>

            {/* Profile Picture */}
            <ProfilePicPicker
               src={
                  data.profile_pic === formData.personalInfo.profilePic.src
                     ? `${process.env.NEXT_PUBLIC_IMAGE_URL}/${data.profile_pic}`
                     : formData.personalInfo.profilePic.src || "/img/common/logo-icon.svg"
               }
               alt="Profile Image"
               blurDataURL={formData.personalInfo.profilePic.preview_profile_pic || LOGO_ICON_PREVIEW}
               loading="eager"
               onChange={handleProfilePicChange}
            />

            {/* Personal Information Section */}
            <h2 className="dash-subtitle">Personal Information</h2>
            <div className="epf__info--container">
               <div>
                  <label htmlFor="fullName" className="label">
                     Full Name <span className="text-red-500 ml-1">*</span>
                  </label>
                  <input
                     type="text"
                     className="input"
                     id="fullName"
                     autoComplete="name"
                     placeholder="Full Name"
                     {...register("f_name", {
                        required: "This field is required.",
                        onChange: (e) => setFormData(prev => ({
                           ...prev,
                           personalInfo: {
                              ...prev.personalInfo,
                              f_name: e.target.value
                           }
                        }))
                     })}
                  />
                  {errors.f_name && <p className="error">{errors.f_name.message}</p>}
               </div>

               <div>
                  <label htmlFor="phone" className="label">
                     Phone <span className="text-red-500 ml-1">*</span>
                  </label>
                  <input
                     type="tel"
                     className="input !cursor-not-allowed opacity-75 !text-gray-600"
                     id="phone"
                     placeholder="Phone"
                     autoComplete="mobile tel"
                     disabled
                     {...register("phone", {
                        required: "This field is required.",
                     })}
                  />
                  {errors.phone && <p className="error">{errors.phone.message}</p>}
               </div>

               <div>
                  <label htmlFor="email" className="label">
                     Email <span className="text-red-500 ml-1">*</span>
                  </label>
                  <input
                     type="email"
                     className="input !cursor-not-allowed opacity-75 !text-gray-600"
                     id="email"
                     placeholder="Email"
                     autoComplete="email"
                     disabled
                     {...register("email", {
                        required: "This field is required.",
                     })}
                  />
                  {errors.email && <p className="error">{errors.email.message}</p>}
               </div>

               <div>
                  <label htmlFor="country" className="label">
                     Select Country <span className="text-red-500 ml-1">*</span>
                  </label>
                  <select
                     className="select"
                     {...register("country", {
                        required: "This field is required.",
                        onChange: (e) => setFormData(prev => ({
                           ...prev,
                           personalInfo: {
                              ...prev.personalInfo,
                              country: e.target.value
                           }
                        }))
                     })}
                  >
                     <option value="" disabled>Please Select</option>
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
                        Select State <span className="text-red-500 ml-1">*</span>
                     </label>
                     <select
                        className="select"
                        {...register("state", {
                           required: "This field is required.",
                           onChange: (e) => setFormData(prev => ({
                              ...prev,
                              personalInfo: {
                                 ...prev.personalInfo,
                                 state: e.target.value
                              }
                           }))
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
                        Select City <span className="text-red-500 ml-1">*</span>
                     </label>
                     <select
                        className="select"
                        {...register("city", {
                           required: "This field is required.",
                           onChange: (e) => setFormData(prev => ({
                              ...prev,
                              personalInfo: {
                                 ...prev.personalInfo,
                                 city: e.target.value
                              }
                           }))
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

               {/* Area */}
               <div>
                  <label htmlFor="area" className="label" ref={areaContainerRef}>
                     Area <span className="text-red-500 ml-1">*</span>
                  </label>
                  <GoogleAddressAutofill
                     restrictionType={["sublocality"]}
                     onSelect={handleAreaSelect}
                     defaultValue={formData.personalInfo.area || ""}
                     focus={!!errors.area}
                  />
                  {errors.area && <p className="error">{errors.area.message}</p>}
               </div>

               <div>
                  <label htmlFor="address" className="label">
                     Address <span className="text-red-500 ml-1">*</span>
                  </label>
                  <input
                     type="text"
                     className="input"
                     id="address"
                     placeholder="Address"
                     autoComplete="address-line1"
                     {...register("address", {
                        required: "This field is required.",
                        onChange: (e) => setFormData(prev => ({
                           ...prev,
                           personalInfo: {
                              ...prev.personalInfo,
                              address: e.target.value
                           }
                        }))
                     })}
                  />
                  {errors.address && <p className="error">{errors.address.message}</p>}
               </div>

               <div>
                  <label htmlFor="postcode" className="label">
                     Postcode <span className="text-red-500 ml-1">*</span>
                  </label>
                  <input
                     type="text"
                     className="input"
                     id="postcode"
                     autoComplete="postal-code"
                     placeholder="Postcode"
                     {...register("postcode", {
                        required: "This field is required.",
                        onChange: (e) => setFormData(prev => ({
                           ...prev,
                           personalInfo: {
                              ...prev.personalInfo,
                              postcode: e.target.value
                           }
                        }))
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
                                    /^[0-9]{2}[A-Za-z]{5}[0-9]{4}[A-Za-z]{1}[1-9A-Za-z]{1}[Z|z][0-9A-Za-z]{1}$/g.test(value) ||
                                    "Please enter a valid GST number."
                                 );
                              }
                           },
                        },
                        onChange: (e) => setFormData(prev => ({
                           ...prev,
                           personalInfo: {
                              ...prev.personalInfo,
                              gst_no: e.target.value
                           }
                        }))
                     })}
                  />
                  {errors.gst_no && <p className="error">{errors.gst_no.message}</p>}
               </div>
            </div>

            {/* Bio */}
            <div>
               <label htmlFor="bio">Bio</label>
               <Tiptap
                  content={formData.personalInfo.bio as string}
                  onChange={handleBioChange}
               />
               {errors.bio && <p className="error">{errors.bio.message}</p>}
            </div>

            <Separator />

            {/* Skills and Qualification Section */}
            <h2 className="dash-subtitle">Skills and Qualification</h2>
            <div className="epf__info--container">
               {/* Qualifications */}
               <div>
                  <label htmlFor="qualification" className="label">
                     Qualification <span className="text-red-500 ml-1">*</span>
                  </label>
                  {isLoadingMasterData ? (
                     <Skeleton height={40} />
                  ) : (
                     <>
                        <Select
                           isMulti
                           value={formData.educationalInfo.qualifications}
                           onChange={(selected) => setFormData(prev => ({
                              ...prev,
                              educationalInfo: {
                                 ...prev.educationalInfo,
                                 qualifications: selected as MultiValue<SelectOption>
                              }
                           }))}
                           options={masterData.qualifications}
                           placeholder="Select Qualification"
                           required
                        />
                        {errors.qualification && <p className="error">{errors.qualification.message}</p>}
                     </>
                  )}
               </div>

               {/* Skills */}
               <div>
                  <label htmlFor="skill" className="label">
                     Skills <span className="text-red-500 ml-1">*</span>
                  </label>
                  {isLoadingMasterData ? (
                     <Skeleton height={40} />
                  ) : (
                     <>
                        <Select
                           isMulti
                           value={formData.educationalInfo.skills}
                           onChange={(selected) => setFormData(prev => ({
                              ...prev,
                              educationalInfo: {
                                 ...prev.educationalInfo,
                                 skills: selected as MultiValue<SelectOption>
                              }
                           }))}
                           options={masterData.skills}
                           placeholder="Select Skills"
                           required
                        />
                        {errors.skill && <p className="error">{errors.skill.message}</p>}
                     </>
                  )}
               </div>

               {/* Languages */}
               <div>
                  <label htmlFor="language" className="label">
                     Language <span className="text-red-500 ml-1">*</span>
                  </label>
                  {isLoadingMasterData ? (
                     <Skeleton height={40} />
                  ) : (
                     <>
                        <Select
                           isMulti
                           value={formData.educationalInfo.languages}
                           onChange={(selected) => setFormData(prev => ({
                              ...prev,
                              educationalInfo: {
                                 ...prev.educationalInfo,
                                 languages: selected as MultiValue<SelectOption>
                              }
                           }))}
                           options={masterData.languages}
                           placeholder="Select Language"
                           required
                        />
                        {errors.language && <p className="error">{errors.language.message}</p>}
                     </>
                  )}
               </div>

               {/* Experience */}
               <div>
                  <label htmlFor="experience" className="label">
                     Experience in Years <span className="text-red-500 ml-1">*</span>
                  </label>
                  <input
                     type="number"
                     className="input"
                     id="year_of_exp"
                     step="0.1"
                     min="0"
                     {...register("year_of_exp", {
                        required: "This field is required.",
                        min: {
                           value: 0,
                           message: "Please enter a valid Experience (in years).",
                        },
                        onChange: (e) => setFormData(prev => ({
                           ...prev,
                           educationalInfo: {
                              ...prev.educationalInfo,
                              year_of_exp: parseFloat(e.target.value) || 0
                           }
                        }))
                     })}
                     onInput={(e: React.ChangeEvent<HTMLInputElement>) => {
                        if (Number(e.target.value) < 0) e.target.value = "";
                     }}
                  />
                  {errors.year_of_exp && <p className="error">{errors.year_of_exp.message}</p>}
               </div>
            </div>

            {/* Form Actions */}
            <div className="epf__buttons--container">
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