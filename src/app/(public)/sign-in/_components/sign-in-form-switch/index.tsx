"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { OTPSignInForm, SignInForm } from "../../_components";

function SignInFormSwitch() {
   return (
      <div className="flex flex-col gap-[25px]">
         <h1 className="ex-title text-center">Welcome Back</h1>
         <div className="line-text__container">
            <span></span>
            <p className="label text-center">Log in to your account</p>
            <span></span>
         </div>
         <Tabs defaultValue="password" className="w-full flex flex-col items-center justify-center">
            <TabsList className="w-full">
               <TabsTrigger value="password" className="w-full">
                  Password
               </TabsTrigger>
               <TabsTrigger value="otp" className="w-full">
                  OTP
               </TabsTrigger>
            </TabsList>
            <TabsContent value="password" className="w-full" tabIndex={1}>
               <SignInForm />
            </TabsContent>
            <TabsContent value="otp" className="w-full" tabIndex={1}>
               <OTPSignInForm />
            </TabsContent>
         </Tabs>
      </div>
   );
}

export default SignInFormSwitch;
