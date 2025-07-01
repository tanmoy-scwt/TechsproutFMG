"use client";

import { useState } from "react";
import Link from "next/link";
import { dashboardLinks as dl } from "@/lib/constants";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CoinPurchaseTable, CoinUsageTable } from "@/app/dashboard/_components";
import ArrowRight from "@/icons/ArrowRight";
import { CoinUsageTableData } from "@/app/dashboard/_components/coin-usage-table";
import { CoinPurchaseTableData } from "@/app/dashboard/_components/coin-purcahse-table";

interface CoinHistorySectionProps {
   usageData: CoinUsageTableData;
   purchaseData: CoinPurchaseTableData;
}

function CoinHistorySection({ usageData, purchaseData }: CoinHistorySectionProps) {
   const [selectedTab, setSelectedTab] = useState<"purchase" | "usage">("purchase");

   console.log("usageData", usageData);
   return (
      <section className="dash-bg">
         <h2 className="dash-subtitle">Coin History</h2>
         <Tabs defaultValue="purchase" className="w-full flex flex-col items-center justify-center gap-[15px]">
            <div className="w-full flex items-center justify-between gap-3 mob:gap-4">
               <TabsList className="w-full max-w-[350px] p-0">
                  <TabsTrigger
                     value="purchase"
                     className="w-full data-[state=active]:bg-primary data-[state=active]:text-white p-1.5 mob:px-3"
                     onClick={() => {
                        setSelectedTab("purchase");
                     }}
                  >
                     Purchase
                  </TabsTrigger>
                  <TabsTrigger
                     value="usage"
                     className="w-full data-[state=active]:bg-primary data-[state=active]:text-white p-1.5 mob: px-3 "
                     onClick={() => {
                        setSelectedTab("usage");
                     }}
                  >
                     Usage
                  </TabsTrigger>
               </TabsList>
               <Link href={`${dl.coinHistory}?type=${selectedTab}`} className="explore">
                  See All <ArrowRight />
               </Link>
            </div>
            <TabsContent value="purchase" className="w-full" tabIndex={1}>
               <CoinPurchaseTable data={purchaseData} />
            </TabsContent>
            <TabsContent value="usage" className="w-full" tabIndex={1}>
               <CoinUsageTable data={usageData} />
            </TabsContent>
         </Tabs>
      </section>
   );
}

export default CoinHistorySection;
