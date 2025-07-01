"use client";

import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CoinPackagesSection, SubscriptionPlansTable } from "../../_components";
// import { CoinPackageCardData, Subscription } from "../coin-package-card";
//import { CoinPackageCardData } from "../coin-package-card";
import { ServerFetch } from "@/actions/server-fetch";
import { getSession } from "next-auth/react";
import { ErrorToast } from "@/lib/toast";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CoinPackage, Subscription } from "../../_types";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

// Define props for the PricingPlansTabsSection component
interface PricingPlansTabsSectionProps {
   // data: CoinPackage[];
   subscriptionsList: Subscription[];
   subscriptionsError?: string; // Error message for subscriptions API
   coinPackagesList: CoinPackage[];
   coinPackagesError?: string; // Error message for coin packages API
   setLoading:Dispatch<SetStateAction<boolean>>
   fetchCoinBalance: () => void
}

function PricingPlansTabsSection({
   // data,
   subscriptionsList,
   subscriptionsError,
   coinPackagesList,
   coinPackagesError,
   setLoading,
   fetchCoinBalance
}: PricingPlansTabsSectionProps) {
// function PricingPlansTabsSection({ data }: { data: Array<CoinPackageCardData> }) {
   const [subscriptionStatus, setSubscriptionStatus] = useState();
   const tabValue = useSearchParams().get("type");
   const [isOpen, setIsOpen] = useState(false);
   const getSubscriptioinDetails = async () => {
      try {
         const session = await getSession();
         const SubscriptionList = await ServerFetch(`/current/user/details`, {
            method: "GET",
            headers: {
               Authorization: `Bearer ${session?.user.token}`,
            },
         });

         setSubscriptionStatus(SubscriptionList.data.subscriptionActiveStatus);

         if (!SubscriptionList.status) {
            throw new Error("Failed to fetch Subscription");
         }
      } catch (error) {
         console.error("Error fetching Subscription:", error);
      }
   };
   useEffect(() => {
      getSubscriptioinDetails();
      if (subscriptionStatus === 0) {
         ErrorToast("Subscription Expire");
      }
   }, [subscriptionStatus]);

   return (
      <div>
         <Tabs defaultValue={tabValue || "subscription"} className="overflow-hidden">
            <div className="overflow-x-auto mb-[var(--pm-100)]">
               <TabsList>
                  <TabsTrigger value="subscription" asChild>
                     <Link
                        href="?type=subscription"
                        className="data-[state=active]:bg-primary data-[state=active]:text-white"
                     >
                        Subscription Plans
                     </Link>
                  </TabsTrigger>
                  <TabsTrigger value="coins" asChild>
                     <Link href="?type=coins" className="data-[state=active]:bg-primary data-[state=active]:text-white">
                        Coins Packages
                     </Link>
                  </TabsTrigger>
               </TabsList>
            </div>
            <TabsContent value="subscription" tabIndex={1}>
               {subscriptionsError ? (
                  <div className="text-red-600 text-center">
                     {subscriptionsError}
                  </div>
               ) : (
                  <SubscriptionPlansTable subscriptionsList={subscriptionsList} fetchCoinBalance={fetchCoinBalance} />
               )}
            </TabsContent>
            <TabsContent value="coins" tabIndex={1}>
                <Dialog open={isOpen} onOpenChange={setIsOpen}>
                    <DialogTrigger asChild>
                        <button className="coin-popup" onClick={() => setIsOpen(true)}>How Coins Work</button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                        <h4>About Coins</h4>
                        </DialogHeader>
                        {/* <div className="space-y-4">
                        <p>Coins are the platform's virtual currency that helps you <b>access more student opportunities and increase your earnings.</b></p>
                        <p>Your active subscription enables students to contact you directly. However, <b>Coins empower you to take the next step</b> by proactively connecting with students who are exploring courses in your category <b>but haven't reached out to you yet.</b></p>
                        <p>With Coins, you can:</p>
                        <ul className="list-disc pl-5">
                            <li><b>Unlock Interested Students:</b> View and contact students interested in courses like yours.</li>
                        </ul>
                        <strong>Expand your reach, seize more opportunities, and grow your earnings with smart Coin usage!</strong>
                        </div> */}
                        <div className="space-y-4">
                            <p>Coins are the platform&apos;s virtual currency that helps you <b>access more student opportunities and increase your earnings.</b></p>
                            <p>Your active subscription enables students to contact you directly. However, <b>Coins empower you to take the next step</b> by proactively connecting with students who are exploring courses in your category <b>but haven&apos;t reached out to you yet.</b></p>
                            <p>With Coins, you can:</p>
                            <ul className="list-disc pl-5">
                                <li><b>Unlock Interested Students:</b> View and contact students interested in courses like yours.</li>
                            </ul>
                            <strong>Expand your reach, seize more opportunities, and grow your earnings with smart Coin usage!</strong>
                        </div>

                    </DialogContent>
                </Dialog>
               {coinPackagesError ? (
                  <div className="text-red-600 text-center">{coinPackagesError}</div>
               ) : (
                  // <CoinPackagesSection data={data} />
                  <CoinPackagesSection data={coinPackagesList} setLoading={setLoading} fetchCoinBalance={fetchCoinBalance}/>
               )}
            </TabsContent>
         </Tabs>
      </div>
   );
}

export default PricingPlansTabsSection;
