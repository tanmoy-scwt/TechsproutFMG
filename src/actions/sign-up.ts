"use server";

import { UserType } from "@/types";

export type SignUpActionData = {
   type: UserType;
   fullName: string;
   phone: string;
   email: string;
   password: string;
   emailOTP: string;
   phoneOTP: string;
   calling_code: string;
   mobile_number: string;
};

export const SignUpAction = async (data: SignUpActionData) => {
   try {
      const res = await fetch(`${process.env.API_URL}/register`, {
         method: "POST",
         headers: { "Content-Type": "application/json" },
         body: JSON.stringify({
            user_type: data.type,
            f_name: data.fullName,
            email: data.email,
            password: data.password,
            phone: data.phone,
            email_otp: data.emailOTP,
            phone_otp: data.phoneOTP,
            calling_code: data.calling_code,
            mobile_number: data.mobile_number
         }),
         cache: "no-cache",
      });

      return res.json();
   } catch (error) {
      throw error;
   }
};

export const SendOTP = async (data: Pick<SignUpActionData, "email" | "phone" | "fullName" | "calling_code">) => {
   try {
      const res = await fetch(`${process.env.API_URL}/send-otp`, {
         method: "POST",
         headers: { "Content-Type": "application/json" },
         body: JSON.stringify({ f_name: data.fullName, email: data.email, phone: data.phone, calling_code: data.calling_code }),
         cache: "no-cache",
      });

      return res.json();
   } catch (error) {
      throw error;
   }
};

export const ResendSignUpOTP = async (
   data: { email?: string; phone?: string; fullName: string },
   type: "EMAIL" | "PHONE"
) => {
   try {
      const bodyData: { [key: string]: string } = {
         f_name: data.fullName,
      };
      if (type === "EMAIL" && data.email) {
         bodyData.email = data.email;
         bodyData.otp_type = "email";
      } else if (type === "PHONE" && data.phone) {
         bodyData.phone = data.phone;
         bodyData.otp_type = "phone";
      } else {
         if (type === "EMAIL") {
            throw new Error("Please provide an email to resend the OTP.");
         } else if (type === "PHONE") {
            throw new Error("Please provide a phone number to resend the OTP.");
         } else {
            throw new Error("Please provide an email or phone number to resend the OTP.");
         }
      }

      const res = await fetch(`${process.env.API_URL}/resend-otp`, {
         method: "POST",
         headers: { "Content-Type": "application/json" },
         body: JSON.stringify(bodyData),
         cache: "no-cache",
      });
      return res.json();
   } catch (error) {
      throw error;
   }
};
