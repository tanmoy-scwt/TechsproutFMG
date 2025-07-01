import { ServerFetch } from "@/actions/server-fetch";
import { getSession } from "next-auth/react";
import { ErrorToast, InfoToast, SuccessToast } from "./toast";
import { formatCurrency } from "./utils";
import { format } from "date-fns";

export const createCoinOrder = async ({
   amount,
   token,
   userId,
}: {
   amount: number | string;
   token: string;
   userId: string | number;
}) => {
   try {
      const data = await ServerFetch(`/user/coins/create-order`, {
         method: "POST",
         headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
         },
         body: JSON.stringify({
            amount,
            user_id: userId,
         }),
         cache: "no-store",
      });
      if (!data.status) {
         throw new Error(data.message || "Unable to generate order id at the momemnt.");
      }
      return data.data;
   } catch (error) {
      throw error;
   }
};

export const verifyPaymentForCoins = async (
   data: {
      orderCreationId: string;
      razorpay_payment_id: string;
      razorpay_order_id: string;
      razorpay_signature: string;
      user_id: number;
   },
   token: string
) => {
   try {
      const result = await ServerFetch("/user/coins/purchase", {
         method: "POST",
         headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
         body: JSON.stringify(data),
         cache: "no-store",
      });

      return result;
   } catch (error) {
      throw error;
   }
};

export const processPaymentForCoins = async (amount: string, hideModal: any, fetchCoinBalance: () => void) => {
   console.log("hide modal is ", hideModal)
   const session = await getSession();
   if (!session?.user || !window.Razorpay) return;
   try {
      const orderId: string = await createCoinOrder({ amount, token: session.user.token, userId: session.user.userId });

      const options = {
         key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
         amount: parseFloat(amount) * 100,
         currency: "INR",
         name: "name",
         description: "description",
         order_id: orderId,
         handler: async function (response: any) {
            try {
               const data = {
                  orderCreationId: orderId,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_signature: response.razorpay_signature,
                  user_id: session.user.userId,
               };
               InfoToast("Please wait , processing...")
               const result = await verifyPaymentForCoins(data, session.user.token);

               if (result?.data.payment_status !== "Success") {
                  throw new Error(result.message);
               }
               SuccessToast(
                  `Payment of ${formatCurrency({
                     amount: result.data.amount,
                  })} is successful. Fetching your updated balance...`
               );
               setTimeout(() => fetchCoinBalance(), 1000)
            } catch (error) {

               let message = `Payment Failed.`;
               if (error instanceof Error && error.message) {
                  message = error.message;
               }
               ErrorToast(message);
            }
         },
         prefill: {
            name: session.user.fullName,
            email: session.user.email,
         },
         theme: {
            color: "#3399cc",
         },
      };
      const instance = new window.Razorpay(options as unknown as RazorpayOptions);
      instance.on("payment.failed", function (response: any) {
         // ErrorToast(response.error.description);
         ErrorToast("error one");
      });
      instance.open();
   } catch (error) {
      let m = "Unable to process your payment at the moment. Please try again later.";
      if (error instanceof Error) {
         m = error.message;
      }
      ErrorToast(m);
   } finally {
      hideModal?.();
   }
};

export const createSubscriptionOrder = async ({
   token,
   userId,
   subscriptionPlanId,
}: {

   token: string;
   userId: string | number;
   subscriptionPlanId: string | number;
}) => {
   try {
      const data = await ServerFetch(`/user/subscriptions/create-order`, {
         method: "POST",
         headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
         },
         body: JSON.stringify({
            user_id: userId,
            subscription_plan_id: subscriptionPlanId,
         }),
         cache: "no-store",
      });
      if (!data.status) {
         throw new Error(data.message || "Unable to generate order ID at the moment.");
      }
      return data.data; // Return order ID
   } catch (error) {
      throw error;
   }
};

export const verifyPaymentForSubscriptions = async (
   data: {
      subscription_id: number;
      orderCreationId: string;
      razorpay_payment_id: string;
      razorpay_order_id: string;
      razorpay_signature: string;
      user_id: number;
   },
   token: string
) => {
   try {
      console.log("testing the datad ", data)
      const result = await ServerFetch("/user/subscriptions/purchase", {
         method: "POST",
         headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
         body: JSON.stringify(data),
         cache: "no-store",
      });

      return result;
   } catch (error) {
      throw error;
   }
};

export const processPaymentForSubscriptions = async (
   subscriptionPlanId: string | number,
   hideModal: any, fetchCoinBalance: () => void
) => {
   console.log("subscription ", subscriptionPlanId)
   const session = await getSession();
   if (!session?.user || !window.Razorpay) return;
   try {
      const createSubDetails = await createSubscriptionOrder({
         token: session.user.token,
         userId: session.user.userId,
         subscriptionPlanId,
      });
      // const orderId: string = "order_Pk7fo4PDrNvKJ5"
        // console.log("99999999999",createSubDetails);
      if(!createSubDetails?.is_free_plan){
      const options = {
         key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
         currency: "INR",
         name: "Subscription Payment",
         description: `Subscription Plan ${subscriptionPlanId}`,
         order_id: createSubDetails?.order_id,
         handler: async function (response: any) {
            try {
               const data = {
                  orderCreationId: createSubDetails?.order_id,
                  subscription_id: subscriptionPlanId as number,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_signature: response.razorpay_signature,
                  user_id: session.user.userId,
               };
               console.log('verify data',data);
               InfoToast("Please wait , processing...")
               const result = await verifyPaymentForSubscriptions(data, session.user.token);
               console.log("response is ", result)
               if (result?.data.payment_status !== "Success") {
                  throw new Error(result.message);
               }
               SuccessToast(
                  `Subscription successful! Start Date: ${format(new Date(result.data.subscription_start_date), "dd MMM yyyy")}, End Date: ${format(new Date(result.data.subscription_end_date), "dd MMM yyyy")}. Fetching your updated coin list...`
               );
               setTimeout(() => fetchCoinBalance(), 1000)
            } catch (error) {
               let message = `Payment Failed.`;
               if (error instanceof Error && error.message) {
                  message = error.message;
               }
               ErrorToast(message);
            }
         },
         prefill: {
            name: session.user.fullName,
            email: session.user.email,
         },
         theme: {
            color: "#3399cc",
         },
      };
      const instance = new window.Razorpay(options as unknown as RazorpayOptions);
      instance.on("payment.failed", function (response: any) {
         ErrorToast(response.error.description);
      });
      instance.open();
    }else{
        SuccessToast(
            `Subscription successful! Start Date: ${format(new Date(createSubDetails.start_date), "dd MMM yyyy")}, End Date: ${format(new Date(createSubDetails.end_date), "dd MMM yyyy")}. Fetching your updated coin list...`
         );
    }
   } catch (error) {
      let m = "Unable to process your payment at the moment. Please try again later.";
      if (error instanceof Error) {
         m = error.message;
      }
      ErrorToast(m);
   } finally {
      hideModal?.();
   }
};
