import { ExternalToast, toast } from "sonner";

const defaultToastOptions: ExternalToast = {
   closeButton: true,
   dismissible: true,
   position: "top-right",
   richColors: true,
   duration: 2000,
   cancel: true,
};

export function SuccessToast(message = "Success", data?: Omit<ExternalToast, "id">) {
   toast.success(message, {
      style: {
         background: "#fff",
         color: "hsl(140, 100%, 27%)",
         borderBottom: "5px solid hsl(140, 100%, 27%)",
      },
      ...defaultToastOptions,
      ...data,
   });
}

export function ErrorToast(message = "Oops, Something went wrong. ❗", data?: Omit<ExternalToast, "id">) {
   toast.error(message, {
      style: {
         background: "#fff",
         color: "#f01707",
         borderBottom: "5px solid #f01707",
      },
      ...defaultToastOptions,
      ...data,
   });
}

export function InfoToast(message = "Please wait...", data?: Omit<ExternalToast, "id">) {
   toast.info(message, {
     
      ...defaultToastOptions,
      ...data,
   });
}

