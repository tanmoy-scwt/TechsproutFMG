"use client";

import React, { useState } from "react";
import { Table, TableHeader, TableHead, TableRow, TableBody, TableCell } from "@/components/ui/table";
import { Check, X, Loader } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { processPaymentForSubscriptions } from "@/lib/payments";
import { toast } from "sonner";
import { ErrorToast } from "@/lib/toast";

interface Subscription {
   id: number;
   razorpay_plan_id: string;
   title: string;
   duration_in_months: number;
   actual_price: string;
   offer_price: string;
   free_coins: number;
   is_course_listing: number;
   featured_listing: number;
   description: string | null;
   status: string;
   created_at: string;
   updated_at: string;
}

function SubscriptionPlansTable(props: { subscriptionsList: Subscription[]; fetchCoinBalance: () => void }) {
   const { subscriptionsList, fetchCoinBalance } = props;

   const [showModal, setShowModal] = useState<boolean>(false);
   const [paymentLoading, setPaymentLoading] = useState<boolean>(false);
   const [selectedPlan, setSelectedPlan] = useState<Subscription | null>(null);

   const handleSubscribe = (plan: Subscription) => {
      setSelectedPlan(plan);
      setShowModal(true);
   };

   const handlePayment = async () => {
      if (!selectedPlan) return;

      try {
         setPaymentLoading(true);
         const response = await processPaymentForSubscriptions(
            selectedPlan.id,
            () => {
               setPaymentLoading(false);
               setShowModal(false);
               toast.success(`Successfully subscribed to ${selectedPlan.title}`);
            },
            fetchCoinBalance
         );
         console.log("response is ", response);
      } catch (error) {
         console.error(error);
         ErrorToast("Payment failed. Please try again.");
      } finally {
         setPaymentLoading(false);
      }
   };

   const renderRowData = (rowData: string[]) => {
      switch (rowData[0]) {
         case "Plan Duration":
            return rowData.map((item, index) => (
               <TableCell key={index}>{index === 0 ? item : `${item} months`}</TableCell>
            ));

         case "Actual Price":
            return rowData.map((item, index) => (
               <TableCell key={index}>{index === 0 ? item : `INR ${item}`}</TableCell>
            ));

         case "Offer Price":
            return rowData.map((item, index) => (
               <TableCell key={index}>{index === 0 ? item : `INR ${item}`}</TableCell>
            ));

         case "Coins for Competitor Leads":
            return rowData.map((item, index) => <TableCell key={index}>{item}</TableCell>);

         case "Featured Listing Option":
            return rowData.map((item, index) => (
               <TableCell key={index}>
                  {index === 0 ? (
                     item
                  ) : parseInt(item) === 0 || parseInt(item) === 1 ? (
                     item ? (
                        "Free"
                     ) : (
                        <X className="text-red-600 text-xl m-auto" />
                     )
                  ) : (
                     `${item} Coins per Course`
                  )}
               </TableCell>
            ));

         case "Course Listing":
            return rowData.map((item, index) => (
               <TableCell key={index}>
                  {index === 0 ? (
                     item
                  ) : item ? (
                     <Check className="text-green-600 text-xl" />
                  ) : (
                     <X className="text-red-600 text-xl" />
                  )}
               </TableCell>
            ));

         case "Actions":
            return rowData.map((item, index) => (
               <TableCell key={index}>
                  {index === 0 ? (
                     <span className="text-white">{item}</span>
                  ) : (
                     <Button
                        onClick={() => handleSubscribe(subscriptionsList.find((plan) => plan.id === parseInt(item))!)}
                        className="cpc__button text-white hover:bg-indigo-500"
                     >
                        Subscribe
                     </Button>
                  )}
               </TableCell>
            ));

         default:
            return rowData.map((item, index) => <TableCell key={index}>{item}</TableCell>);
      }
   };

   const generateSubscriptionTableData = <T,>(data: T[]) => {
      function getDataPerKey(key: string) {
         return data.map((item: T) => item[key as keyof T]);
      }

      const titleData = getDataPerKey("title");
      const durationInMonthsData = getDataPerKey("duration_in_months");
      const actualPriceData = getDataPerKey("actual_price");
      const offerPriceData = getDataPerKey("offer_price");
      const isCourseListedData = getDataPerKey("is_course_listing");
      const freeCoinsData = getDataPerKey("free_coins");
      const freeCourseListing = getDataPerKey("featured_listing");
      const actions = getDataPerKey("id");

      return [
         ["Feature", ...titleData],
         ["Plan Duration", ...durationInMonthsData],
         ["Actual Price", ...actualPriceData],
         ["Offer Price", ...offerPriceData],
         ["Course Listing", ...isCourseListedData],
         ["Coins for Competitor Leads", ...freeCoinsData],
         ["Featured Listing Option", ...freeCourseListing],
         ["Actions", ...actions],
      ];
   };

   const subscriptionTableData = generateSubscriptionTableData(subscriptionsList);

   return (
      <>
         <Table className="overflow-auto w-full">
            <TableHeader className="bg-[#E9EFF4]">
               <TableRow>
                  {subscriptionTableData[0].map((row, index) => (
                     <TableHead className="whitespace-nowrap text-center" key={index}>
                        {row}
                     </TableHead>
                  ))}
               </TableRow>
            </TableHeader>

            <TableBody>
               {subscriptionTableData.length > 0 &&
                  subscriptionTableData.map((row, index) =>
                     index !== 0 ? (
                        <TableRow key={index} className="text-center">
                           {renderRowData(row as string[])}
                        </TableRow>
                     ) : null
                  )}
            </TableBody>
         </Table>

         {/* Payment Modal */}
         {selectedPlan && (
            <Dialog open={showModal} onOpenChange={setShowModal}>
               <DialogContent className="sm:max-w-[565px]">
                  <DialogHeader>
                     <DialogTitle>Subscribe to {selectedPlan.title}</DialogTitle>
                  </DialogHeader>
                  <div className="mt-6 flex flex-col gap-4">
                     <p>
                        Confirm subscription to <strong>{selectedPlan.title}</strong> for{" "}
                        <strong>INR {selectedPlan.offer_price}</strong>.
                     </p>
                     <Button
                        onClick={handlePayment}
                        disabled={paymentLoading}
                        className="button__primary-light cpc__button !flex items-center gap-1 disabled:cursor-not-allowed hover:bg-indigo-500"
                     >
                        Confirm and Pay {paymentLoading && <Loader className="animate-spin duration-2000" />}
                     </Button>
                  </div>
               </DialogContent>
            </Dialog>
         )}
      </>
   );
}

export default SubscriptionPlansTable;
