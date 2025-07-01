import React, { useEffect, useState } from "react";
import {
   Dialog,
   DialogContent,
   DialogDescription,
   DialogHeader,
   DialogTitle,
   DialogTrigger,
} from "@/components/ui/dialog";
import { ErrorToast } from "@/lib/toast";
import "./style.css";

interface OtpDialogProps {
   isOpen: boolean;
   onClose: () => void;
   onSubmit: (otp: string) => Promise<boolean>; // Adjusted to handle async result
}

const OtpDialog: React.FC<OtpDialogProps> = ({ isOpen, onClose, onSubmit }) => {
   const [otp, setOtp] = useState<string>("");
   const [isSubmitting, setIsSubmitting] = useState(false);

   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      if (/^\d{0,4}$/.test(value)) {
         setOtp(value);
      }
   };

   const handleSubmit = async () => {
      if (otp.length === 4) {
         setIsSubmitting(true); // Show loader
         const isSuccess = await onSubmit(otp); // Wait for submission result
         setIsSubmitting(false);

         if (isSuccess) {
            onClose(); // Close only if submission is successful
         }
      } else {
         ErrorToast("Please enter a 4-digit OTP");
      }
   };

   // Reset OTP when the dialog is opened
   useEffect(() => {
      if (isOpen) {
         setOtp(""); // Reset the OTP field
      }
   }, [isOpen]);

   return (
      <Dialog open={isOpen} onOpenChange={onClose}>
         <DialogContent className="otp_model">
            <DialogHeader>
               <DialogTitle>
                  <span className="enter-otp">Enter OTP</span>
               </DialogTitle>
               <DialogDescription>
                  <span className="enter-otp-text">Please enter the 4-digit OTP sent to your phone.</span>
               </DialogDescription>
            </DialogHeader>
            <div className="flex flex-col items-center space-y-4 otp-holder">
               <input
                  type="text"
                  value={otp}
                  onChange={handleInputChange}
                  maxLength={4}
                  className="border p-2 text-center text-xl w-24"
                  placeholder="0000"
               />
               {/* <button
                  onClick={handleSubmit}
                  className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
               >
                  Submit
               </button> */}
               <button
                  className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
                  type="submit"
                  onClick={handleSubmit}
                  disabled={isSubmitting}
               >
                  {isSubmitting ? (
                     <span className="loader"></span> // Add your loader here
                  ) : (
                     "Submit"
                  )}
               </button>
            </div>
         </DialogContent>
      </Dialog>
   );
};

export default OtpDialog;
