"use client";

import React, { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { ErrorToast, SuccessToast } from "@/lib/toast";
import { Loader } from "lucide-react";

const ForgotPasswordFlow = () => {
   const [isModalOpen, setIsModalOpen] = useState(false);
   const [isEmailModal, setIsEmailModal] = useState(true);
   const [isOtpModal, setIsOtpModal] = useState(false);
   const [isPasswordModal, setIsPasswordModal] = useState(false);
   const [otp, setOtp] = useState({ email: "", otp: "" });
   const [submitting, setSubmitting] = useState(false);
   const [message, setMessage] = useState(""); // To show error/success messages
   const [resetToken, setResetToken] = useState(""); // Store the reset token

   const {
      register,
      handleSubmit,
      formState: { errors },
   } = useForm();
   const {
      register: otpRegister,
      handleSubmit: otpSubmit,
      formState: { errors: otpErrors },
   } = useForm();
   const {
      register: passwordRegister,
      handleSubmit: passwordSubmit,
      formState: { errors: passwordErrors },
   } = useForm();

   // Handle email submission (send OTP)
   const handleEmailSubmit = async (data: any) => {
      try {
         setSubmitting(true);
         const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/forgot-password`, {
            method: "POST",
            headers: {
               "Content-Type": "application/json",
            },
            body: JSON.stringify({ email: data.email }),
         });

         const result = await response.json();

         if (!response.ok) {
            throw new Error(result.message || "Unable to send OTP.");
         }
         setOtp({ email: data.email, otp: "" });
         setResetToken(result.reset_token);
         setIsEmailModal(false);
         setIsOtpModal(true);

         SuccessToast("OTP sent successfully.");
      } catch (error) {
         if (error instanceof Error) {
            ErrorToast(error.message);
         }
      } finally {
         setSubmitting(false);
      }
   };
   //    console.log("setopt", otp);

   // Handle OTP submission
   const handleOtpSubmit = async (data: any) => {
      try {
         const otpString = data.otp.join("");
         setOtp({ ...otp, otp: otpString });
         setIsOtpModal(false);
         setIsPasswordModal(true);

         //  setSubmitting(true);
         //  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/reset-password`, {
         //     method: "POST",
         //     headers: {
         //        "Content-Type": "application/json",
         //     },
         //     body: JSON.stringify({
         //        email: otp.email,
         //        email_otp: data.otp,
         //     }),
         //  });
         //  const result = await response.json();
         //  if (!response.ok) {
         //     throw new Error(result.message || "Invalid OTP.");
         //  }
         //  SuccessToast("OTP verified successfully. You can now reset your password.");
      } catch (error) {
         if (error instanceof Error) {
            ErrorToast(error.message);
         }
      } finally {
         setSubmitting(false);
      }
   };

   // Handle password reset submission
   const handlePasswordSubmit = async (data: any) => {
      if (data.password !== data.confirmPassword) {
         setMessage("Passwords do not match");
         return;
      }

      try {
         setSubmitting(true);
         const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/reset-password`, {
            method: "POST",
            headers: {
               "Content-Type": "application/json",
            },
            body: JSON.stringify({
               email: otp.email,
               email_otp: otp.otp,
               new_password: data.password,
               confirm_password: data.confirmPassword,
            }),
         });

         const result = await response.json();

         if (!response.ok) {
            throw new Error(result.message || "Unable to reset the password.");
         }
         //  SuccessToast("OTP verified successfully. You can now reset your password.");
         SuccessToast("Password reset successfully!");
         setIsPasswordModal(false);
         setIsModalOpen(false);
      } catch (error) {
         if (error instanceof Error) {
            ErrorToast(error.message);
         }
      } finally {
         setSubmitting(false);
      }
   };
   // Handle Input Change for OTP
   const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
      const value = e.target.value;

      // Update the OTP string directly using string slicing
      const newOtp = otp.otp.slice(0, index) + value + otp.otp.slice(index + 1);

      // Update the OTP state with the modified OTP string
      setOtp({ ...otp, otp: newOtp });

      // Move focus to the next input if the current one is filled
      if (value && index < 3) {
         const nextInput = document.getElementById(`otp-input-${index + 1}`);
         nextInput?.focus();
      }
   };

   // Handle KeyDown for Backspace
   const handleOtpBackspace = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
      // If backspace is pressed and the current input is empty, move focus to the previous input
      if (e.key === "Backspace" && index > 0 && !otp.otp[index]) {
         const prevInput = document.getElementById(`otp-input-${index - 1}`);
         prevInput?.focus();
      }
   };
   return (
      <>
         {/* Forgot Password Link */}
         <Link prefetch={false} href="#" className="si-form__recover" onClick={() => setIsModalOpen(true)}>
            Forgot Password?
         </Link>

         {/* Main Modal Wrapper */}
         <Dialog.Root open={isModalOpen} onOpenChange={setIsModalOpen}>
            <Dialog.Portal>
               <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-50" />
               <Dialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-lg shadow-lg w-96">
                  <Dialog.Title className="text-xl font-bold mb-4">Forgot Password</Dialog.Title>

                  {/* Email Modal */}
                  {isEmailModal && (
                     <form onSubmit={handleSubmit(handleEmailSubmit)}>
                        <input
                           type="email"
                           placeholder="Enter your email"
                           {...register("email", { required: "Email is required" })}
                           className="w-full p-2 border rounded mb-4"
                        />
                        {errors.email && (
                           <p className="text-sm text-red-500">
                              {" "}
                              {errors.email?.message && typeof errors.email.message === "string"
                                 ? errors.email.message
                                 : ""}
                           </p>
                        )}
                        <button
                           type="submit"
                           className="bg-blue-500 text-white px-4 py-2 rounded"
                           disabled={submitting}
                        >
                           {submitting ? <Loader size={20} className="animate-spin" /> : "Send OTP"}
                        </button>
                     </form>
                  )}

                  {/* OTP Modal */}
                  {isOtpModal && (
                     <form onSubmit={otpSubmit(handleOtpSubmit)}>
                        <div className="flex justify-between space-x-2">
                           {/* OTP Input Slots */}
                           {[0, 1, 2, 3].map((index) => (
                              <input
                                 key={index}
                                 id={`otp-input-${index}`}
                                 type="text"
                                 value={otp.otp[index] || ""}
                                 {...otpRegister(`otp[${index}]`, {
                                    required: "OTP is required",
                                    maxLength: 1,
                                    pattern: /^[0-9]{1}$/,
                                 })}
                                 className="w-12 h-12 text-center border rounded-md"
                                 maxLength={1}
                                 autoFocus={index === 0}
                                 onChange={(e) => handleOtpChange(e, index)}
                                 onKeyDown={(e) => handleOtpBackspace(e, index)}
                              />
                           ))}
                        </div>
                        <button
                           type="submit"
                           className="bg-blue-500 text-white px-4 py-2 rounded mt-3"
                           disabled={submitting}
                        >
                           {submitting ? <Loader size={20} className="animate-spin" /> : "Verify OTP"}
                        </button>
                     </form>
                  )}

                  {/* Password Reset Modal */}
                  {isPasswordModal && (
                     <form onSubmit={passwordSubmit(handlePasswordSubmit)}>
                        <input
                           type="password"
                           placeholder="New Password"
                           {...passwordRegister("password", { required: "Password is required" })}
                           className="w-full p-2 border rounded mb-4"
                        />
                        {passwordErrors.password && (
                           <p className="text-sm text-red-500">
                              {" "}
                              {passwordErrors.password?.message && typeof passwordErrors.password.message === "string"
                                 ? passwordErrors.password.message
                                 : "Invalid input"}
                           </p>
                        )}
                        <input
                           type="password"
                           placeholder="Confirm New Password"
                           {...passwordRegister("confirmPassword", { required: "Please confirm your password" })}
                           className="w-full p-2 border rounded mb-4"
                        />
                        {passwordErrors.confirmPassword && (
                           <p className="text-sm text-red-500">
                              {" "}
                              {passwordErrors.confirmPassword?.message &&
                              typeof passwordErrors.confirmPassword.message === "string"
                                 ? passwordErrors.confirmPassword.message
                                 : ""}
                           </p>
                        )}
                        <button
                           type="submit"
                           className="bg-blue-500 text-white px-4 py-2 rounded"
                           disabled={submitting}
                        >
                           {submitting ? <Loader size={20} className="animate-spin" /> : "Reset Password"}
                        </button>
                     </form>
                  )}

                  {/* Error/Success Message */}
                  {message && <p className="mt-4 text-sm text-gray-600">{message}</p>}

                  {/* Close Modal */}
                  <Dialog.Close asChild>
                     <button className="absolute top-4 right-4 text-gray-500 hover:text-gray-700">Close</button>
                  </Dialog.Close>
               </Dialog.Content>
            </Dialog.Portal>
         </Dialog.Root>
      </>
   );
};

export default ForgotPasswordFlow;
