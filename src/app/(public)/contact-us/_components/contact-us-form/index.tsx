"use client";

import { FieldValues, useForm } from "react-hook-form";
import "./style.css";
import ArrowRight from "@/icons/ArrowRight";
import ReCAPTCHA from "react-google-recaptcha";
import { useState } from "react";
import { ServerFetch } from "@/actions/server-fetch";
import { ErrorToast, SuccessToast } from "@/lib/toast";
import { RefreshCw } from "lucide-react";

const RECAPTCHA_SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY as string;

function ContactUsForm() {
    const [captchaToken, setCaptchaToken] = useState<string | null>(null);
    const [isRecaptchaError, setIsRecaptchaError] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

   const {
      register,
      handleSubmit,
      formState: { errors },reset ,
   } = useForm({
      defaultValues: {
         name: "",
         email: "",
         phone: "",
         message: "",
      },
   });

   const handleFormSubmit = async (data: FieldValues) => {
        const response = await fetch("/api/verify-captcha", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ token: captchaToken }),
        });

        const recaptchadata = await response.json();
        setIsSubmitting(true);

        if (recaptchadata.success) {
            setIsRecaptchaError(false);

            const contactDetails = await ServerFetch(
                `/contact-us`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data),
                }
            );
            if(contactDetails?.status){
                SuccessToast(contactDetails?.message);
                setIsSubmitting(false);
                reset();
            }else{
                ErrorToast(contactDetails?.message);
                setIsSubmitting(false);
            }
        } else {
            setIsRecaptchaError(true);
            setIsSubmitting(false);
        }

   };

   return (
      <form className="cuf__form" onSubmit={handleSubmit(handleFormSubmit)}>
         <div className="cuf__input--container">
            <div>
               <input
                  type="text"
                  id="name"
                  autoComplete="name"
                  className={`input ${errors.name ? "error-input" : ""}`}
                  placeholder="Full Name"
                  {...register("name", {
                     required: {
                        value: true,
                        message: "Please enter your full name.",
                     },
                  })}
               />
               {errors.name && <p className="error">{errors.name.message}</p>}
            </div>
            <div>
               <input
                  type="email"
                  id="email"
                  autoComplete="email"
                  className={`input ${errors.email ? "error-input" : ""}`}
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
            <div>
               <input
                  type="tel"
                  id="phone"
                  autoComplete="tel"
                  className={`input ${errors.phone ? "error-input" : ""}`}
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
            <div className="cuf__textarea--container">
               <textarea
                  id="message"
                  placeholder="Enter Your Message"
                  className={`textarea ${errors.message ? "error-input" : ""}`}
                  {...register("message", {
                     required: {
                        value: true,
                        message: "Please enter a message.",
                     },
                     minLength: {
                        value: 20,
                        message: "Message should be at least 20 characters long.",
                     },
                  })}
               />
               {errors.message && <p className="error">{errors.message.message}</p>}
            </div>
            <div>
                <ReCAPTCHA
                    sitekey={RECAPTCHA_SITE_KEY}
                    onChange={(token) => setCaptchaToken(token)} // Store the token on success
                    onExpired={() => setCaptchaToken(null)} // Handle expiration
                />
                 {isRecaptchaError && <p className="error">Please verify reCAPTCHA.</p>}
            </div>
         </div>

         <input type="submit" hidden />
         <button className="button__primary">
            Send Message {isSubmitting && <RefreshCw className="animate-spin" />} <ArrowRight />
         </button>
      </form>
   );
}

export default ContactUsForm;
