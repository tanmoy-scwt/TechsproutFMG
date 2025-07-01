"use client";
import "./style.css";
import React, { useRef } from "react";
import { CourseDetailsRatingsSectionContent } from "../../types";
import RatingStar from "@/components/rating-star";
import RatingBar from "@/components/rating-bar";
import ReviewCard from "@/components/review-card";
import ArrowRight from "@/icons/ArrowRight";
import {
   Dialog,
   DialogContent,
   DialogDescription,
   DialogFooter,
   DialogHeader,
   DialogTitle,
   DialogTrigger,
} from "@/components/ui/dialog";
import { FieldValues, useForm } from "react-hook-form";

import ReCAPTCHA from "react-google-recaptcha";
import { useState } from "react";
import { ServerFetch } from "@/actions/server-fetch";
import { ErrorToast, SuccessToast } from "@/lib/toast";

const RECAPTCHA_SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY as string;

interface CourseDetailsRatingsSectionProps {
   className?: string;
   content: CourseDetailsRatingsSectionContent;
}
function CourseDetailsRatingsSection({ className = "", content }: CourseDetailsRatingsSectionProps) {
   const [captchaToken, setCaptchaToken] = useState<string | null>(null);
   const [isRecaptchaError, setIsRecaptchaError] = useState(false);
   const [isOpen, setIsOpen] = useState(false);
   const [isOpenReviewList, setIsOpenReviewList] = useState(false);
   const [reviews, setReviews] = useState([]);

   const {
      register,
      handleSubmit,
      formState: { errors },
      reset,
   } = useForm({
      defaultValues: {
         name: "",
         email: "",
         phone: "",
         review: "",
         rating: "",
      },
   });

   const recaptchaRef = useRef<ReCAPTCHA | null>(null);

   const handleFormSubmit = async (data: FieldValues, event: React.FormEvent) => {
      const response = await fetch("/api/verify-captcha", {
         method: "POST",
         headers: { "Content-Type": "application/json" },
         body: JSON.stringify({ token: captchaToken }),
      });

      const recaptchadata = await response.json();

      if (recaptchadata.success) {
         setIsRecaptchaError(false);
         const dataPost = {
            course_id: content?.courseId,
            student_name: data.name,
            student_email: data.email,
            student_phone: data.phone,
            rating: data.rating,
            review: data.review,
         };
         const webinarDetails = await ServerFetch(`/course/review`, {
            method: "POST",
            headers: {
               "Content-Type": "application/json",
            },
            body: JSON.stringify(dataPost),
         });
         if (webinarDetails?.status) {
            SuccessToast(webinarDetails?.message);
            reset();
            setIsOpen(false);
            //(event.currentTarget as HTMLFormElement).reset();
            if (recaptchaRef.current) {
               recaptchaRef.current.reset();
            }
            setCaptchaToken(null);
            setIsRecaptchaError(false);
         } else {
            ErrorToast(webinarDetails?.message);
         }
      } else {
         setIsRecaptchaError(true);
      }
   };
   const onSubmit = (event: React.FormEvent) => {
      handleSubmit((data) => handleFormSubmit(data, event))(event);
   };

   const handleDialogChange = async (open: boolean) => {
      setIsOpenReviewList(open);
      if (open) {
         const reviewLists = await ServerFetch(`/course/review/listing/${content?.courseId}`);
         setReviews(reviewLists?.data);
      }
   };

   return (
      <section className={`cdr__section ${className}`}>
         <h2 className="subtitle">Students Rating</h2>
         <div className="cdr__ratings">
            <div className="cdr__ratings--average-container">
               <div className="cdr__ratings--average">
                  <p className="subtitle">
                     {content.averageRatings}
                     <RatingStar
                        rating={+content.averageRatings}
                        fillColor="#FD8E1F"
                        bgColor="#fff2e5"
                        strokeColor="#FD8E1F"
                        strokeWidth="1"
                     />
                  </p>

                  <p className="cdr__ratings-text">Course Rating</p>
                  <Dialog open={isOpen} onOpenChange={setIsOpen}>
                     <DialogTrigger asChild>
                        <button className="button__primary">Give Ratings</button>
                     </DialogTrigger>
                     <DialogContent className="sm:max-w-[800px] c-post-review-modal">
                        <h2>Post Review</h2>
                        <form onSubmit={onSubmit}>
                           <div className="grid grid-cols-3 gap-x-[5rem]">
                              <div className="c-input-area">
                                 <label>Your Name</label>
                                 <input
                                    type="text"
                                    className={`form-control input ${errors.name ? "error-input" : ""}`}
                                    placeholder="Name"
                                    {...register("name", {
                                       required: {
                                          value: true,
                                          message: "Please enter your name.",
                                       },
                                    })}
                                 />
                                 {errors.name && <p className="error">{errors.name.message}</p>}
                              </div>

                              <div className="c-input-area">
                                 <label>Mobile</label>
                                 <input
                                    type="tel"
                                    className={`form-control input ${errors.phone ? "error-input" : ""}`}
                                    placeholder="Phone Number"
                                    {...register("phone", {
                                       required: {
                                          value: true,
                                          message: "Please enter your phone number.",
                                       },
                                    })}
                                 />
                                 {errors.phone && <p className="error">{errors.phone.message}</p>}
                              </div>
                              <div className="c-input-area">
                                 <label>Email</label>
                                 <input
                                    type="email"
                                    className={`form-control input ${errors.email ? "error-input" : ""}`}
                                    placeholder="Email"
                                    {...register("email", {
                                       required: {
                                          value: true,
                                          message: "Please enter your email.",
                                       },
                                       validate: (value) => {
                                          return /^[\w-\.]+@([\w-]+\.)+[\w-]{2,12}$/.test(value) || "Invalid email.";
                                       },
                                    })}
                                 />
                                 {errors.email && <p className="error">{errors.email.message}</p>}
                              </div>
                           </div>
                           <div className="c-input-area">
                              <label>Review</label>
                              <textarea
                                 className={`form-control input ${errors.review ? "error-input" : ""}`}
                                 placeholder="Review"
                                 {...register("review", {
                                    required: {
                                       value: true,
                                       message: "Please enter your review.",
                                    },
                                 })}
                              ></textarea>
                              {errors.review && <p className="error">{errors.review.message}</p>}
                           </div>

                           <div className="flex flex-row items-center c-post-review-modal__button-area">
                              <div className="basis-1/4">
                                 <div className="c-input-area">
                                    <label>Rating</label>
                                    <select
                                       className="form-control"
                                       {...register("rating", {
                                          required: {
                                             value: true,
                                             message: "Please select your rating.",
                                          },
                                       })}
                                    >
                                       <option value="">Select Rating</option>
                                       {[5, 4, 3, 2, 1].map((rating) => (
                                          <option key={rating} value={rating}>
                                             {`${rating} Star${rating > 1 ? "s" : ""}`}
                                          </option>
                                       ))}
                                    </select>
                                    {errors.rating && <p className="error">{errors.rating.message}</p>}
                                 </div>
                              </div>
                              <div className="basis-1/2">
                                 <ReCAPTCHA
                                    sitekey={RECAPTCHA_SITE_KEY}
                                    onChange={(token) => setCaptchaToken(token)} // Store the token on success
                                    onExpired={() => setCaptchaToken(null)} // Handle expiration
                                    ref={recaptchaRef}
                                 />
                                 {isRecaptchaError && <p className="error">Please verify reCAPTCHA.</p>}
                              </div>
                              <div className="basis-1/4">
                                 <button className="button__primary ml-auto">Post Review</button>
                              </div>
                           </div>
                        </form>
                     </DialogContent>
                  </Dialog>
               </div>
            </div>
            <div className="cdr__ratings--bar-container">
               {content.ratingDetails.map((rating) => (
                  <RatingBar
                     barCount={rating.count}
                     totalCount={content.totalRatings}
                     starRating={rating.stars}
                     key={rating.id}
                  />
               ))}
            </div>
         </div>
         <div className="cdr__reviews">
            {content?.reviews?.slice(0, 2).map((review, index) => (
               <ReviewCard content={review} key={index} className="cdr__review" />
            ))}
         </div>
         {content?.totalReviews > 2 && (
            <Dialog open={isOpenReviewList} onOpenChange={handleDialogChange}>
               <DialogTrigger asChild>
                  <p className="explore text-center">
                     View All <ArrowRight />
                  </p>
               </DialogTrigger>
               <DialogContent className="sm:max-w-[600px] c-all-review-modal">
                  <div className="cdr__reviews max-h-[500px] overflow-y-auto c-all-review-modal__scrollbar">
                     {reviews?.map((review, index) => (
                        <ReviewCard content={review} key={index} className="cdr__review" />
                     ))}
                  </div>
               </DialogContent>
            </Dialog>
         )}
      </section>
   );
}

export default CourseDetailsRatingsSection;
