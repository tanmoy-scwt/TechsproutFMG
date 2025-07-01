// razorpay.d.ts

declare global {
   interface Window {
      Razorpay: {
         new (options: RazorpayOptions): RazorpayInstance;
      };
   }

   interface RazorpayOptions {
      key: string;
      amount: number;
      currency: string;
      name: string;
      description: string;
      handler: (response: any) => void;
      prefill: {
         name: string;
         email: string;
         contact: string;
      };
      notes: {
         address: string;
      };
   }

   interface RazorpayInstance {
      open: () => void;
      close: () => void;
      on: (event: string, callback: (data: any) => void) => void;
   }
}

export {};
