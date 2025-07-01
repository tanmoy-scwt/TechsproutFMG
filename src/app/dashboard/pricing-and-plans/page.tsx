"use client";

import React, { useEffect, useState } from "react";
import { PricingPlansTabsSection, PricingPlansTitleSection } from "./_components";
import { apiClientPrivate } from "@/services/config";
import Loading from "@/components/loading";
import { CoinPackage, Subscription } from "./_types";
import axios from "axios";
import { getSession } from "next-auth/react";
import StepIndicator from "@/components/StepsIndicator/StepsIndicator";

function PricingAndPlansPage() {
   const [subscriptionsList, setSubscriptionsList] = useState<Subscription[]>([]);
   const [coinPackagesList, setCoinPackagesList] = useState<CoinPackage[]>([]);
   const [subscriptionsError, setSubscriptionsError] = useState<string | null>(null);
   const [coinPackagesError, setCoinPackagesError] = useState<string | null>(null);
   const [isLoading, setIsLoading] = useState<boolean>(true);
   const [coinBalance, setCoinBalance] = useState<number | null>(null); // New state for coin balance
   const [coinBalanceError, setCoinBalanceError] = useState("");

   const fetchData = async () => {
      const session = await getSession();
      console.log("session is ", session);
      const token = session?.user?.token; // Token from session
      const userId = session?.user?.userId;
      setIsLoading(true);
      setSubscriptionsError(null);
      setCoinPackagesError(null);

      try {
         const results = await Promise.allSettled([
            apiClientPrivate.get<{ data: Subscription[] }>("/subscriptions"),
            apiClientPrivate.get<{ data: CoinPackage[] }>("/coins"),
            axios.get(`${process.env.NEXT_PUBLIC_API_URL}/user/coins/balance/${userId}`, {
               headers: {
                  Authorization: `Bearer ${token}`,
               },
            }),
         ]);

         results.forEach((result, index) => {
            if (result.status === "fulfilled") {
               if (index === 0) {
                  setSubscriptionsList(result.value.data.data);
               } else if (index === 1) {
                  setCoinPackagesList(result.value.data.data);
               } else if (index === 2) {
                  setCoinBalance(result.value.data.data); // Assuming `data` is a number
               }
            } else {
               if (index === 0) {
                  setSubscriptionsError("Failed to fetch subscriptions data.");
               } else if (index === 1) {
                  setCoinPackagesError("Failed to fetch coin packages data.");
               } else {
                  setCoinBalanceError("Balance not found");
               }
            }
         });
      } catch (error) {
         console.error("Unexpected error occurred:", error);
      } finally {
         setIsLoading(false);
      }
   };

   const fetchCoinBalance = async () => {
      try {
         const session = await getSession();
         console.log("session is ", session);
         const token = session?.user?.token; // Token from session
         const userId = session?.user?.userId;
         const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/user/coins/balance/${userId}`, {
            headers: {
               Authorization: `Bearer ${token}`,
            },
         });
         if (response.status == 200) {
            setCoinBalance(response.data.data);
         } else {
            setCoinBalanceError("Balance not found.");
         }
      } catch (err) {
         console.log(err);
      }
   };

   useEffect(() => {
      fetchData();
   }, []);

   if (isLoading) {
      return <Loading />;
   }

   return (
      <>
         {/* <div className="pds mb-4">
            <StepIndicator />
         </div> */}
         <div className="dash-bg">
            <PricingPlansTitleSection coinBalance={coinBalance as number} coinBalanceError={coinBalanceError} />
            <PricingPlansTabsSection
               subscriptionsList={subscriptionsList}
               subscriptionsError={subscriptionsError as string}
               coinPackagesList={coinPackagesList}
               coinPackagesError={coinPackagesError as string}
               setLoading={setIsLoading}
               fetchCoinBalance={fetchCoinBalance}
            />
         </div>
      </>
   );
}

export default PricingAndPlansPage;
