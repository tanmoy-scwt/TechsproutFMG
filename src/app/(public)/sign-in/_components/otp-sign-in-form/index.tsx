"use client";

import "./style.css";

import { dashboardLinks as dl } from "@/lib/constants";
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from "@/components/ui/input-otp";
import {
   Dialog,
   DialogContent,
   DialogDescription,
   DialogHeader,
   DialogTitle,
   DialogTrigger,
} from "@/components/ui/dialog";
import React, { useEffect, useState } from "react";
import { MobileSignInAction, SendSignInOTP } from "@/actions/otp-sign-in";
import { Loader } from "lucide-react";
import { ErrorToast, SuccessToast } from "@/lib/toast";
import { useRouter, useSearchParams } from "next/navigation";
import { CustomAuthError } from "@/lib/auth-error";
import { ResendSignUpOTP } from "@/actions/sign-up";
import { Button } from "@/components/ui/button";

function OTPSignInForm() {
   const router = useRouter();
   const callbackUrl = useSearchParams().get("callbackUrl");
   const [data, setData] = useState({
      phone: "",
      otp: "",
   });
   const [error, setError] = useState({
      phone: "",
      otp: "",
   });
   const [loading, setLoading] = useState({
      otp: false,
      signIn: false,
   });

   const [openOTPModal, setOpenOTPModal] = useState(false);

   const handlePhoneInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setData((prev) => ({ ...prev, phone: e.target.value }));
      if (error.phone && e.target.value.length === 10) {
         setError((prev) => ({ ...prev, phone: "" }));
      }
   };
   //Send OTP API Call
   const handlePhoneSubmit = async (open: boolean) => {
      try {
         if (!data.phone || data.phone.length !== 10) {
            throw new Error("Please enter a valid phone number.");
         }
         if (error.phone) {
            setError((prev) => ({ ...prev, phone: "" }));
         }
         setLoading((prev) => ({ ...prev, otp: true }));
         //Send OTP Server action
         const result = await SendSignInOTP(data.phone);

         if (!result.status) {
            throw new Error(result.message || "Unable to send OTP.");
         }

         setOpenOTPModal(open);
      } catch (error) {
         if (error instanceof Error) {
            setError((prev) => ({ ...prev, phone: error.message }));
         }
      } finally {
         setLoading((prev) => ({ ...prev, otp: false }));
      }
   };

   //Login WIth OTP API Call
   const handleOTPSubmit = async (e: React.MouseEvent | React.KeyboardEvent) => {
      e.stopPropagation();
      try {
         setLoading((prev) => ({ ...prev, signIn: true }));
         const res = await MobileSignInAction(data);
         if (!res.status) {
            throw res;
         }

         SuccessToast("Login Successful.");
         router.push(callbackUrl || dl.dashboard);
      } catch (error: any) {
         ErrorToast(error.message || "Something went wrong.");
      } finally {
         setLoading((prev) => ({ ...prev, signIn: false }));
      }
   };

   return (
      <div className="osi-form__container">
         <form
            className="osi-form"
            onSubmit={(e) => {
               e.preventDefault();
               handlePhoneSubmit(true);
            }}
         >
            <div className="osi-form__input--container">
               <input
                  type="tel"
                  id="phone"
                  className={`input`}
                  autoComplete="tel"
                  placeholder="Mobile No."
                  onChange={handlePhoneInputChange}
                  value={data.phone}
               />
               {error.phone && <p className="error">{error.phone}</p>}
            </div>

            <input hidden type="submit" aria-hidden />
         </form>
         <Dialog
            open={openOTPModal}
            onOpenChange={(open) => {
               if (!open) {
                  setOpenOTPModal(false);
               }
            }}
         >
            <DialogTrigger asChild>
               <button
                  className={`button__primary w-full ${loading.otp ? "opacity-70 !cursor-not-allowed" : "opacity-100"}`}
                  type="button"
                  onClick={(e) => {
                     handlePhoneSubmit(true);
                  }}
               >
                  {loading.otp ? "Sending... " : "Send OTP "}
                  {loading.otp && <Loader className="animate-spin duration-2000" />}
               </button>
            </DialogTrigger>
            <DialogContent className="w-max" closeOnOverlayClick={false}>
               <DialogHeader>
                  <DialogTitle>Enter OTP</DialogTitle>
               </DialogHeader>
               <DialogDescription>{`Please enter the OTP sent to ${data.phone}`}</DialogDescription>
               <div>
                  <InputOTP
                     maxLength={4}
                     value={data.otp}
                     onChange={(otp) => {
                        setData((prev) => ({ ...prev, otp }));
                     }}
                     onKeyDown={(e) => {
                        if (e.key === "Enter") {
                           handleOTPSubmit(e);
                        }
                     }}
                  >
                     <InputOTPGroup className="justify-center w-full">
                        <InputOTPSlot index={0} className="w-12 h-12" />
                        <InputOTPSlot index={1} className="w-12 h-12" />
                        <InputOTPSlot index={2} className="w-12 h-12" />
                        <InputOTPSlot index={3} className="w-12 h-12" />
                     </InputOTPGroup>
                  </InputOTP>
                  <div className="w-full flex justify-end mt-2">
                     <SignInResendOTPButton phone={data.phone} />
                  </div>
               </div>
               <button
                  className={`button__primary ${loading.signIn ? "opacity-70 !cursor-not-allowed" : "opacity-100"}`}
                  type="button"
                  onClick={handleOTPSubmit}
               >
                  {loading.signIn ? "Submitting... " : "Submit "}
                  {loading.signIn && <Loader className="animate-spin duration-2000" />}
               </button>
            </DialogContent>
         </Dialog>
      </div>
   );
}

export default OTPSignInForm;

const SignInResendOTPButton = ({ phone }: { phone: string }) => {
   const [sending, setSending] = useState(false);
   const [timeLeftForResend, setTimeLeftForResend] = useState(0);

   const handleResendOTP = async () => {
      try {
         setSending(true);
         const result = await SendSignInOTP(phone);
         console.log(result);

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
