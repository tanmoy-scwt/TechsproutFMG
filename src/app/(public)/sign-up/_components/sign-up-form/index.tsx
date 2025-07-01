"use client";

import { ResendSignUpOTP, SendOTP, SignUpAction } from "@/actions/sign-up";
import "./style.css";

import PasswordInput from "@/components/password-input";
import { links } from "@/lib/constants";
import Link from "next/link";
import { parsePhoneNumberFromString, CountryCode } from "libphonenumber-js";
import { FieldValues, useForm, Controller } from "react-hook-form";
import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { DialogDescription } from "@radix-ui/react-dialog";
import { Separator } from "@/components/ui/separator";
import { Loader } from "lucide-react";
import { UserType } from "@/types";
import { ErrorToast, SuccessToast } from "@/lib/toast";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { CountryData } from "react-phone-input-2";
import { EmailSignInAction, EmailSignInActionArgs } from "@/actions/sign-in";
import { dashboardLinks as dl } from "@/lib/constants";

function SignUpForm() {
   const router = useRouter();
   const [submitting, setSubmitting] = useState({
      otp: false,
      signUp: false,
   });
   const [otpSent, setOtpSent] = useState(false);
   /*prettier-ignore*/
   const {control, register, handleSubmit, formState: { errors }, watch, getValues, reset} = useForm({
    defaultValues:{
        accountType:'',
        fullName:'',
        phone: '',
        email:'',
        password:'',
        confirmPassword:'',
        mobile_number: "",
        calling_code: ""
    }
   });
   const [otp, setOtp] = useState({
      email: "",
      phone: "",
   });

   const [selectedCountry, setSelectedCountry] = useState<CountryData | null>(
    null
  );

  const [loggingIn, setLoggingIn] = useState(false);
  const callbackUrl = useSearchParams().get("callbackUrl");

   const handleSendOTP = async (data: FieldValues) => {
      try {
         setSubmitting((prev) => ({ ...prev, otp: true }));

         const phoneNumber = data.phone.replace(/\D/g, ""); // Remove non-numeric characters
        const callingCode = selectedCountry?.dialCode
                ? selectedCountry.dialCode.replace(/\D/g, "")
                : "";
        data.calling_code = callingCode;
        data.mobile_number = phoneNumber.replace(callingCode, "").trim();

         const result = await SendOTP({
            email: data.email,
            fullName: data.fullName,
            phone: data.mobile_number,
            calling_code: data.calling_code,
         });

         if (!result.status) {
            throw new Error(result.message || "Unable to send otp for verification.");
         }

         SuccessToast("OTP sent successfully.");

         setOtpSent(true);
      } catch (error) {
         if (error instanceof Error) {
            ErrorToast(error.message);
         }
      } finally {
         setSubmitting((prev) => ({ ...prev, otp: false }));
      }
   };

   const handleSignUp = async () => {
      try {
         setSubmitting((prev) => ({ ...prev, signUp: true }));

         if (!otp.email || otp.email?.length !== 4) {
            throw new Error("Enter a valid OTP sent to your email.");
         }
         if (!otp.phone || otp.phone?.length !== 4) {
            throw new Error("Enter a valid OTP sent to your phone.");
         }

         const data = getValues();

         const phoneNumber = data.phone.replace(/\D/g, ""); // Remove non-numeric characters
        const callingCode = selectedCountry?.dialCode
                ? selectedCountry.dialCode.replace(/\D/g, "")
                : "";
        data.calling_code = callingCode;
        data.mobile_number = phoneNumber.replace(callingCode, "").trim();


         const result = await SignUpAction({
            email: data.email,
            fullName: data.fullName,
            password: data.password,
            phone: data.phone,
            mobile_number: data.mobile_number,
            calling_code: data.calling_code,
            type: data.accountType as UserType,
            phoneOTP: otp.phone,
            emailOTP: otp.email,
         });
         console.log("data",data);

         if (!result.status) {
            throw new Error(result.message || "Registration has been failed.");
         }

         setOtp({ email: "", phone: "" });
         reset();
         setOtpSent(false);
         //SuccessToast("Registration successful. Please login to continue.");

         const credentials = {
            email: data.email,
            password: data.password
          };

         try {
            setLoggingIn(true);
            const res = await EmailSignInAction(credentials as EmailSignInActionArgs);
            console.log("login response is ", res);
            if (!res.status) {
               throw res;
            }
            SuccessToast("Registration successful.");
            //SuccessToast("Login Successful.");
            router.push(callbackUrl || dl.profile);
         } catch (error: any) {
            ErrorToast(error.message || "Something went wrong.");
         } finally {
            setLoggingIn(false);
         }

         setTimeout(() => {
            router.replace(links.signIn);
         }, 500);
      } catch (error) {
         if (error instanceof Error) {
            ErrorToast(error.message);
         }
      } finally {
         setSubmitting((prev) => ({ ...prev, signUp: false }));
      }
   };

   const w = watch();

   return (
      <div className="su-form__container">
         <h1 className="ex-title1 text-center">
            Start your Teaching Journey with <span className="highlight">FindMyGuru</span>
         </h1>
         <div className="line-text__container">
            <span></span>
            <label htmlFor="accountType" className="label text-center">
               Sign up for a new account
            </label>
            <span></span>
         </div>
         <form onSubmit={handleSubmit(handleSendOTP)} className="su-form">
            <div className="su-form__input--container">
               <select
                  id="accountType"
                  className={`select ${errors.accountType ? "error-input" : ""}`}
                  defaultValue=""
                  {...register("accountType", {
                     required: {
                        value: true,
                        message: "Please select your account type.",
                     },
                  })}
               >
                  <option value="" disabled>
                     Choose Account Type
                  </option>
                  <option value="institute">Institute</option>
                  <option value="tutor">Individual Tutor</option>
               </select>
               {errors.accountType?.message && <p className="error">{errors.accountType.message}</p>}
            </div>

            <div className="su-form__input--container">
               <input
                  type="text"
                  id="fullName"
                  className={`input ${errors.fullName ? "error-input" : ""}`}
                  autoComplete="name"
                  placeholder="Full Name"
                  {...register("fullName", {
                     required: {
                        value: true,
                        message: "Please enter the Full Name.",
                     },
                  })}
               />
               {errors.fullName?.message && <p className="error">{errors.fullName.message}</p>}
            </div>

            <div className="su-form__input--container">
               {/* <input
                  type="text"
                  id="phone"
                  className={`input ${errors.phone ? "error-input" : ""}`}
                  autoComplete="tel"
                  placeholder="Mobile Number"
                  {...register("phone", {
                     required: {
                        value: true,
                        message: "Please enter your Mobile Number.",
                     },
                     minLength: {
                        value: 10,
                        message: "Please enter a valid Mobile Number.",
                     },
                     maxLength: {
                        value: 10,
                        message: "Please enter a valid Mobile Number.",
                     },
                  })}
               />
               {errors.phone?.message && <p className="error">{errors.phone.message}</p>} */}
               {/* {countries && Object.keys(countries).length > 0 ? ( */}
               <Controller
                      name="phone"
                      control={control}
                      rules={{
                        required: "Please enter your phone number.",
                        validate: (value) => {
                            const countryCode =
                            (selectedCountry?.countryCode?.toUpperCase() ||
                              "IN") as CountryCode;

                          const phoneNumber = parsePhoneNumberFromString(
                            value,
                            countryCode
                          );
                          if (!phoneNumber || !phoneNumber.isValid()) {
                            return "Invalid phone number.";
                          }
                          return true;
                        },
                      }}
                      render={({ field }) => (
                        <PhoneInput
                          {...field}
                          enableSearch={true}
                          country={"in"} // Default country
                          onlyCountries={["in"]} // Dynamically loaded countries
                          inputStyle={{ width: "100%" }}
                          onChange={(value, country) => {
                            if (country) {
                              setSelectedCountry(country as CountryData); // Fix TypeScript issue
                            }
                            field.onChange(value);
                          }}
                        />
                      )}
                    />
                    {errors?.phone && (
                        <p className="error">{errors.phone.message}</p>
                      )}
                {/* ) : (
""
                  )} */}
            </div>

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
                        return /^[\w-\.]+@([\w-]+\.)+[\w-]{2,12}$/.test(value) || "Please enter a valid Email.";
                     },
                  })}
               />
               {errors.email?.message && <p className="error">{errors.email.message}</p>}
            </div>

            <div className="su-form__input--container">
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
                  })}
               />
               {errors.password?.message && <p className="error">{errors.password.message}</p>}
            </div>

            <div className="su-form__input--container">
               <PasswordInput
                  id="confirmPassword"
                  className={`input ${errors.confirmPassword ? "error-input" : ""}`}
                  placeholder="Confirm Password"
                  {...register("confirmPassword", {
                     required: {
                        value: true,
                        message: "Please confirm your password.",
                     },
                     validate: (value) => {
                        if (value !== w.password) {
                           return "Your Password and Confirm Password should match.";
                        }
                        return true;
                     },
                  })}
               />
               {errors.confirmPassword?.message && <p className="error">{errors.confirmPassword.message}</p>}
            </div>

            <input hidden type="submit" aria-hidden />
            <button
               className={`button__primary ${
                  submitting.otp || otpSent ? "opacity-70 !cursor-not-allowed" : "opacity-100"
               }`}
               disabled={submitting.otp || otpSent}
            >
               Sign Up {(submitting.otp || otpSent) && <Loader className="animate-spin duration-2000" />}
            </button>
         </form>
         <Dialog
            open={otpSent}
            onOpenChange={(v) => {
               if (!v) {
                  setOtp({ email: "", phone: "" });
               }
               setOtpSent(false);
            }}
         >
            <DialogContent
               className="w-full max-w-[300px] flex flex-col justify-center items-center"
               closeOnOverlayClick={false}
            >
               <DialogHeader>
                  <DialogTitle>Enter OTP</DialogTitle>
               </DialogHeader>
               <Separator />
               <div>
                  <DialogDescription className="flex justify-between gap-2 my-2">
                     <span className="text-[14px] whitespace-nowrap">Email OTP</span>{" "}
                     <SignUpResendOTPButton type="EMAIL" email={getValues().email} fullName={getValues().fullName} />
                  </DialogDescription>

                  <InputOTP
                     maxLength={4}
                     onChange={(v) => {
                        setOtp((prev) => ({ ...prev, email: v }));
                     }}
                     value={otp.email}
                  >
                     <InputOTPGroup className="w-full">
                        <InputOTPSlot index={0} className="w-12 h-12" />
                        <InputOTPSlot index={1} className="w-12 h-12" />
                        <InputOTPSlot index={2} className="w-12 h-12" />
                        <InputOTPSlot index={3} className="w-12 h-12" />
                     </InputOTPGroup>
                  </InputOTP>
               </div>

               <div>
                  <DialogDescription className="flex justify-between gap-2 my-2">
                     <span className="text-[14px] whitespace-nowrap">Phone OTP</span>{" "}
                     <SignUpResendOTPButton type="PHONE" phone={getValues().phone} fullName={getValues().fullName} />
                  </DialogDescription>

                  <InputOTP
                     maxLength={4}
                     onChange={(v) => {
                        setOtp((prev) => ({ ...prev, phone: v }));
                     }}
                     value={otp.phone}
                  >
                     <InputOTPGroup className="w-full">
                        <InputOTPSlot index={0} className="w-12 h-12" />
                        <InputOTPSlot index={1} className="w-12 h-12" />
                        <InputOTPSlot index={2} className="w-12 h-12" />
                        <InputOTPSlot index={3} className="w-12 h-12" />
                     </InputOTPGroup>
                  </InputOTP>
               </div>

               <button
                  className={`button__primary w-full  ${
                     submitting.signUp ? "opacity-70 !cursor-not-allowed" : "opacity-100"
                  }`}
                  disabled={submitting.signUp}
                  onClick={handleSignUp}
               >
                  Submit {submitting.signUp && <Loader className="animate-spin duration-2000" />}
               </button>
            </DialogContent>
         </Dialog>
         <p>
            Already have an account?{" "}
            <Link prefetch={false} href={links.signIn} className="su-form__link">
               Sign in
            </Link>
         </p>
      </div>
   );
}

export default SignUpForm;

const SignUpResendOTPButton = (data: { email?: string; phone?: string; type: "EMAIL" | "PHONE"; fullName: string }) => {
   const [sending, setSending] = useState(false);
   const [timeLeftForResend, setTimeLeftForResend] = useState(0);
   const handleResendOTP = async () => {
      try {
         setSending(true);
         const result = await ResendSignUpOTP(
            { email: data.email, phone: data.phone, fullName: data.fullName },
            data.type
         );
         if (!result.status) {
            throw new Error(result.message || "Unable to resend the OTP.");
         }
         SuccessToast(result.message || `OTP has been resent successfully.`);
         setTimeLeftForResend(60);
      } catch (error) {
         if (error instanceof Error) {
            ErrorToast(error.message);
         }
      } finally {
         setSending(false);
      }
   };

   useEffect(() => {
      // Function to handle the countdown logic
      const interval = setInterval(() => {
         // Decrease time if greater than 0
         if (timeLeftForResend > 0) {
            setTimeLeftForResend((prev) => prev - 1);
         }

         // When time reach 0, clear the interval
         if (timeLeftForResend === 0) {
            clearInterval(interval);
         }
      }, 1000); // Run this effect every 1000ms (1 second)

      return () => {
         // Cleanup: stop the interval when the component unmounts
         clearInterval(interval);
      };
   }, [timeLeftForResend]);

   return (
      <Button
         variant="link"
         className="p-0 text-[12px] h-max"
         onClick={handleResendOTP}
         disabled={sending || !!timeLeftForResend}
      >
         {sending ? "Sending" : `Resend ${timeLeftForResend ? "(" + timeLeftForResend + ")" : ""}`}
         {sending && <Loader className="animate-spin duration-2000" size={6} />}
      </Button>
   );
};
