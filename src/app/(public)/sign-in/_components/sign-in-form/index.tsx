"use client";

import "./style.css";
import { EmailSignInAction, EmailSignInActionArgs } from "@/actions/sign-in";
import PasswordInput from "@/components/password-input";
import { CustomAuthError } from "@/lib/auth-error";
import { dashboardLinks as dl } from "@/lib/constants";
import { ErrorToast, SuccessToast } from "@/lib/toast";
import { Loader } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { FieldValues, useForm } from "react-hook-form";
import ForgotPasswordFlow from "../forget-password";

function SignInForm() {
   const router = useRouter();
   const callbackUrl = useSearchParams().get("callbackUrl");
   const [loggingIn, setLoggingIn] = useState(false);
   /*prettier-ignore*/
   const {register, handleSubmit, formState: { errors }} = useForm({
    defaultValues:{
        email:'',
        password: ''
    }
   });

   const handleOnFormSubmit = async (data: FieldValues) => {
      console.log("hello check its runing or not with other click");
      try {
         setLoggingIn(true);
         const res = await EmailSignInAction(data as EmailSignInActionArgs);
         console.log("login response is ", res);
         if (!res.status) {
            throw res;
         }
         SuccessToast("Login Successful.");
         router.push(callbackUrl || dl.dashboard);
      } catch (error: any) {
         ErrorToast(error.message || "Something went wrong.");
      } finally {
         setLoggingIn(false);
      }
   };

   return (
      <div className="si-form__container">
         <form onSubmit={handleSubmit(handleOnFormSubmit)} className="si-form">
            <div className="si-form__input--container">
               <input
                  type="email"
                  id="email"
                  className={`input ${errors.email ? "error-input" : ""}`}
                  autoComplete="email"
                  placeholder="Email"
                  {...register("email", {
                     required: {
                        value: true,
                        message: "Please enter an email.",
                     },
                     validate: (value) => {
                        return /^[\w-\.]+@([\w-]+\.)+[\w-]{2,12}$/.test(value) || "Invalid email.";
                     },
                  })}
               />
               {errors.email?.message && <p className="error">{errors.email.message}</p>}
            </div>
            <div className="si-form__input--container">
               <PasswordInput
                  id="password"
                  className={`input ${errors.password ? "error-input" : ""}`}
                  placeholder="Password"
                  {...register("password", {
                     required: {
                        value: true,
                        message: "Please enter a password.",
                     },
                     minLength: {
                        value: 8,
                        message: "Password should be at least 8 chracters.",
                     },
                     //  validate: (value) => {
                     //     if (value === email) {
                     //         return "For your security, please ensure your email and password are not identical.";
                     //     }
                     //     return true;
                     //  },
                  })}
               />
               {errors.password?.message && <p className="error">{errors.password.message}</p>}
            </div>
            <div className="si-form__recover--container">
               {/* <Link prefetch={false} href="#" className="si-form__recover">
                  Forgot Password?
               </Link> */}
            </div>
            <input hidden type="submit" aria-hidden />

            <button
               className={`button__primary ${loggingIn ? "opacity-70 !cursor-not-allowed" : "opacity-100"}`}
               disabled={loggingIn}
            >
               Login {loggingIn && <Loader className="animate-spin duration-2000" />}
            </button>
         </form>
         <div className="forget">
            <ForgotPasswordFlow />
         </div>
      </div>
   );
}

export default SignInForm;
