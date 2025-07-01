"use client";

import { CoinPurchaseTable } from "@/app/dashboard/_components";
import CoinUsageTable from "@/app/dashboard/_components/coin-usage-table";
import { DatePickerWithRange } from "@/components/date-range-picker";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Define the types for each table's data
interface CoinPurchaseTableData {
   sl: number; // Serial number
   name: string; // Name of the item
   date: string; // Purchase date
   type: string; // Transaction type
   remarks: string; // Remarks or comments
   coins: number; // Coins received
   amount: number; // Amount paid
   invoice: string; // Invoice ID
}

interface CoinUsageTableData {
   sl: number; // Serial number
   skills: string[]; // Skills associated with the record
   enquiryDate: string; // Date of enquiry
   location: string; // Location or user identifier
   studentId: number; // ID of the student
   studentName: string; // Name of the student
   coinsUsed: number; // Coins consumed
   studentMessage: string | null;
}

// Props interface for the component
interface CoinHistoryListingSectionProps {
   usageData: CoinUsageTableData[]; // Data for the usage table
   purchaseData: CoinPurchaseTableData[]; // Data for the purchase table
}

function CoinHistoryListingSection({ usageData, purchaseData }: CoinHistoryListingSectionProps) {
   return (
      <section>
         <Tabs defaultValue="purchase" className="w-full flex flex-col items-center justify-center gap-[15px]">
            <div className="w-full flex flex-col mob:flex-row items-center justify-between gap-4">
               <TabsList className="w-full mob:max-w-[350px] p-0">
                  <TabsTrigger
                     value="purchase"
                     className="w-full data-[state=active]:bg-primary data-[state=active]:text-white p-1.5 mob:px-3"
                  >
                     Purchase
                  </TabsTrigger>
                  <TabsTrigger
                     value="usage"
                     className="w-full data-[state=active]:bg-primary data-[state=active]:text-white p-1.5 mob:px-3"
                  >
                     Usage
                  </TabsTrigger>
               </TabsList>
               <DatePickerWithRange placeholder="Select filter range" />
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

export default CoinHistoryListingSection;
