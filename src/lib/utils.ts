import { FormDataType } from "@/types";
import { clsx, type ClassValue } from "clsx";
import { notFound } from "next/navigation";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
   return twMerge(clsx(inputs));
}

export const generateRatingsArray = (rating: number) => {
   rating = +rating;
   if (!rating && rating !== 0) throw new Error("Please provide a rating");
   if (rating < 0 || rating > 5) throw new Error("Rating should be between 0-5");

   const fullStars = Math.floor(rating);
   let remainderStars = rating - fullStars;

   let i = 0;
   const arr = [];
   while (i < 5) {
      if (i + 1 <= fullStars) {
         arr.push({
            id: i + 1,
            value: 1,
         });
      } else {
         arr.push({
            id: i + 1,
            value: +remainderStars?.toFixed(2),
         });
         remainderStars = 0; //Changing remainderStars to 0 to push zero after this iteration
      }
      i++;
   }
   return arr;
};

export async function delay(waitTime = 3000) {
   return new Promise((res) => {
      setTimeout(() => {
         return res("Finish");
      }, waitTime);
   });
}

export async function convertAndResizeImage(
   file: File,
   options?: {
      successCallback?: (src: string) => void;
      errorCallback?: (e: Error) => void;
      width?: number;
      objectFit?: boolean;
      type?: "image/png" | "image/webp" | "image/jpeg";
   }
) {
   // "image/svg+xml"
   async function getBase64Image(file: File) {
      const supportedFileTypes = ["image/webp", "image/png", "image/jpeg"];
      if (!file) {
         throw new Error("No input file.");
      }
      if (!supportedFileTypes.includes(file.type)) {
         throw new Error(`Unsupported file. Supported file types are: ".webp", ".png", ".jpeg"`);
      }

      //Cource: https://stackoverflow.com/questions/6150289/how-can-i-convert-an-image-into-base64-string-using-javascript

      const r = await new Promise((resolve, reject) => {
         const reader = new FileReader();
         reader.onloadend = () => resolve(reader.result);
         reader.onerror = reject;
         reader.readAsDataURL(file);
      });
      return r;
   }

   const width = options?.width;
   const height = width;
   const successCallback = options?.successCallback;
   const errorCallback = options?.errorCallback;
   const objectFit = options?.objectFit || true;
   const type = options?.type || "image/webp";

   try {
      const src = (await getBase64Image(file)) as string;

      const img = document.createElement("img");
      img.crossOrigin = "Anonymous";
      img.src = src;

      img.onload = function () {
         const canvas = document.createElement("CANVAS") as HTMLCanvasElement;
         const ctx = canvas.getContext("2d")!;

         let imgWidth = img.naturalWidth;
         let imgHeight = img.naturalHeight;
         let canvasWidth = img.naturalWidth;
         let canvasHeight = img.naturalHeight;

         if (width && height) {
            const imgAspectRatio = img.naturalWidth / img.naturalHeight;
            imgWidth = width;
            canvasWidth = width;

            if (objectFit) {
               imgHeight = height;
               canvasHeight = height;
            } else {
               imgHeight = imgWidth / imgAspectRatio;
               canvasHeight = imgHeight;
            }
         }

         canvas.width = canvasWidth;
         canvas.height = canvasHeight;

         ctx.drawImage(img, 0, 0, imgWidth, imgHeight);
         const dataURL = canvas.toDataURL(type);

         //On Success
         successCallback?.(dataURL);
      };
   } catch (e) {
      if (e instanceof Error) {
         //On Error
         errorCallback?.(e);
      }
   }
}

export function isMobile() {
   const hasTouch = matchMedia("(any-pointer:coarse)").matches;
   const hasMouse = matchMedia("(any-pointer:fine)").matches;

   return hasTouch && !hasMouse;
}

export function isNumber(x: number | string) {
   if (typeof x === "number") {
      return x - x === 0;
   }
   if (typeof x === "string" && x.trim() !== "") {
      return Number.isFinite ? Number.isFinite(+x) : isFinite(+x);
   }
   return false;
}

export function formatCurrency({
   amount,
   locale = "en-IN",
   options = {
      currency: "INR",
      maximumFractionDigits: 2,
      style: "currency",
   },
}: {
   amount: number;
   locale?: Intl.LocalesArgument;
   options?: Intl.NumberFormatOptions;
}) {
   if (!isNumber(amount)) {
      throw new Error("Given Amount is not a valid number.");
   }

   return Intl.NumberFormat ? Intl.NumberFormat(locale, options).format(amount) : `${amount} ${options.currency}`;
}

export function formatDate({
   date,
   locale = "en-IN",
   options = {
      hour12: true,
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
   },
}: {
   date: string;
   locale?: Intl.LocalesArgument;
   options?: Intl.DateTimeFormatOptions;
}) {
   if (!date) {
      throw new Error("Please provide a date string.");
   }
   const dateInstance = new Date(date);

   if (dateInstance.toString() === "Invalid Date") {
      return "";
   }

   return new Date(date).toLocaleString(locale, options);
}

export function timeFromNow(date: string) {
   if (!date) {
      return "";
   }
   const dateInstance = new Date(date);

   if (dateInstance.toString() === "Invalid Date") {
      return "";
   }

   const timePassedInSeconds = (Date.now() - dateInstance.getTime()) / 1000;
   const timePassedInMinutes = timePassedInSeconds / 60;
   const timePassedInHours = timePassedInMinutes / 60;

   if (timePassedInSeconds >= 0 && timePassedInSeconds < 60) {
      return `${Math.floor(timePassedInSeconds)}s ago`;
   }
   if (timePassedInMinutes >= 1 && timePassedInMinutes < 2) {
      return `a minute ago`;
   }
   if (timePassedInMinutes >= 2 && timePassedInMinutes < 60) {
      return `a few minutes ago`;
   }
   if (timePassedInHours >= 1 && timePassedInHours < 2) {
      return `an hour ago`;
   }
   if (timePassedInHours >= 2 && timePassedInHours < 24) {
      return `a few hours ago`;
   }
   if (timePassedInHours >= 24 && timePassedInHours < 48) {
      return `yesterday`;
   }
   if (timePassedInHours >= 48 && timePassedInHours < 24 * 30) {
      return `${Math.floor(timePassedInHours / 24)} days ago`;
   }
   if (timePassedInHours >= 24 * 30 && timePassedInHours < 24 * 30 * 2) {
      return `a month ago`;
   }
   if (timePassedInHours >= 24 * 30 * 2 && timePassedInHours < 24 * 30 * 12) {
      return `a few months ago`;
   }
   if (timePassedInHours >= 24 * 30 * 12 && timePassedInHours < 24 * 30 * 24) {
      return `an year ago`;
   }

   return "a few years ago";
}

export function greetUser(name: string) {
   const now = new Date();
   const hours = now.getHours();

   let message: string = "";

   if (hours >= 5 && hours < 12) {
      message = "Good morning";
   } else if (hours >= 12 && hours < 17) {
      message = "Good afternoon";
   } else if (hours >= 17 && hours < 21) {
      message = "Good evening";
   } else {
      message = "Good night";
   }

   if (name) {
      message += `, ${name} `;
   }

   message += "!";
   return message;
}

export const checkFormValidity = (
   formData: FormDataType,
   setFormData: (data: FormDataType) => void,
   stepNo?: number
) => {
   try {
      let isValidForm = true;
      const temp = { ...formData };
      for (const key in temp) {
         if (stepNo ? temp[key]?.stepNo === stepNo && temp[key]?.required : temp[key]?.required) {
            if (
               temp[key]?.value === "" ||
               temp[key]?.value === null ||
               temp[key]?.value === undefined ||
               (temp[key]?.value as string[])?.length === 0
            ) {
               temp[key].isValid = false;
               isValidForm = false;
            } else if (
               temp[key]?.minLength &&
               typeof temp[key]?.value === "string" &&
               temp[key]?.value.length < temp[key]?.minLength
            ) {
               console.log(temp[key]?.value.length, temp[key]?.minLength);
               temp[key].isValid = false;
               isValidForm = false;
            } else if (
               temp[key]?.maxLength &&
               typeof temp[key]?.value === "string" &&
               temp[key]?.value.length > temp[key]?.maxLength
            ) {
               temp[key].isValid = false;
               isValidForm = false;
            } else if (temp[key]?.regex && !temp[key]?.regex?.test(temp[key]?.value as string)) {
               temp[key].isValid = false;
               isValidForm = false;
            }
         }
      }
      setFormData(temp);
      return isValidForm;
   } catch (error) {
      return false;
   }
};

export function convertToAMPM(time24: string) {
   // Split the time into hours and minutes
   try {
      if (time24.includes("AM") || time24.includes("PM")) {
         return time24;
      }
      const timeParts = time24.split(":");
      let hours = parseInt(timeParts[0]);
      const minutes = parseInt(timeParts[1]);

      // Determine if it's AM or PM
      const period = hours >= 12 ? "PM" : "AM";

      // Adjust hours if necessary
      hours = hours % 12;
      hours = hours ? hours : 12; // Handle midnight (0 hours)

      // Format the time in AM/PM format
      const time12 = hours + ":" + (minutes < 10 ? "0" : "") + minutes + " " + period;

      return time12;
   } catch (error) {
      console.log(error);
      return "";
   }
}

export function convertAMPMto24Hour(timeInAMPM: string) {
   try {
      const [time, period] = timeInAMPM.split(" ");

      const [hours, minutes] = time.split(":").map(Number);

      if (period === "AM") {
         if (hours === 12) {
            // Special case: 12:00 AM becomes 00:00 in 24-hour format
            return `00:${minutes.toString().padStart(2, "0")}`;
         } else {
            // For other AM times, no change is needed
            return time;
         }
      } else if (period === "PM") {
         if (hours === 12) {
            // Special case: 12:00 PM remains 12:00 in 24-hour format
            return time;
         } else {
            // For other PM times, add 12 to the hours
            const militaryHours = (hours + 12) % 24;
            return `${militaryHours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;
         }
      } else {
         // Invalid period (neither AM nor PM)
         return "Invalid input";
      }
   } catch (error) {
      console.log(error);
      return "";
   }
}

export const isValidDate = (date: string | Date | undefined | null) => {
   if (!date) return false;

   return new Date(date)?.toString() !== "Invalid Date";
};
