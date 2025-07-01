"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { PaginatedTable } from "@/components/table";
import Loading from "@/components/loading";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import axios from "axios";
import { format } from "date-fns"; // Import date-fns
import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuGroup,
   DropdownMenuItem,
   DropdownMenuLabel,
   DropdownMenuSeparator,
   DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DownloadIcon, MoreHorizontal } from "lucide-react";
import { ClientFetch } from "@/actions/client-fetch";

interface PurchaseHistory {
   sl: number; // Serial number
   name: string; // Name of the item or transaction
   date: string; // Date of purchase
   type: string; // Type of transaction (e.g., "Purchase")
   remarks: string; // Any remarks associated with the transaction
   coins: number; // Number of coins received
   amount: number; // Amount paid for the transaction
   invoice: number; // Invoice number or ID
}

const CoinHistoryListingSection = () => {
   const { data: session, status } = useSession();

   const [purchaseData, setPurchaseData] = useState([]);
   const [usageData, setUsageData] = useState([]);
   const [loading, setLoading] = useState(false);
   const [purchaseCurrentPage, setPurchaseCurrentPage] = useState(1);
   const [purchaseTotalPages, setPurchaseTotalPages] = useState(1);
   const [usageCurrentPage, setUsageCurrentPage] = useState(1);
   const [usageTotalPages, setUsageTotalPages] = useState(1);

   // Format dates
   const formatDate = (date: string) => {
      try {
         return format(new Date(date), "dd-MM-yyyy");
      } catch {
         return "Invalid Date";
      }
   };

   const fetchPurchaseHistory = async (page: number) => {
      if (!session?.user?.userId) return;

      setLoading(true);
      try {
         const response = await ClientFetch(
            `${process.env.NEXT_PUBLIC_API_URL}/user/coins/purchase-history/${session.user.userId}?page=${page}`,
            {
               headers: { Authorization: `Bearer ${session.user.token}` },
            }
         );

         const responseData = await response.json();

         const pagination = responseData.data;
         const formattedData = responseData.data.data.map((item: any, index: number) => ({
            sl: index + 1 + (page - 1) * pagination.per_page,
            name: item.title || "Unknown",
            date: formatDate(item.purchase_date), // Format the date
            type: item.transaction_type,
            remarks: item.remarks || "N/A",
            coins: item.coins_received,
            amount: parseFloat(item.amount_paid),
            invoice: item.id, // Use the invoice ID for rendering
         }));

         setPurchaseData(formattedData);
         setPurchaseCurrentPage(pagination.current_page);
         setPurchaseTotalPages(pagination.last_page);
      } catch (error) {
         console.error("Error fetching purchase history:", error);
      } finally {
         setLoading(false);
      }
   };

   const fetchUsageHistory = async (page: number) => {
      if (!session?.user?.userId) return;
      if (!session?.user?.token) return;

      setLoading(true);
      try {
         const response = await axios.get(
            `${process.env.NEXT_PUBLIC_API_URL}/user/coins/consumed-history/${session.user.userId}?page=${page}`,
            {
               headers: { Authorization: `Bearer ${session.user.token}` },
            }
         );
         const responseData = response.data.data.data;
         const pagination = response.data.data;
         const formattedData = responseData.map((item: any, index: number) => ({
            sl: index + 1 + (page - 1) * pagination.per_page,
            studentName: item.student_name || "Unknown",
            skills: item.skills || "N/A",
            enquiryDate: formatDate(item.enquiry_date), // Format the date
            coinConsumedDate: formatDate(item.coin_consumed_date), // Format the date
            coinsConsumed: item.coins_consumed,
            studentMessage: item.student_message || "N/A",
            studentEmail: item.student_email || "N/A",
            studentPhone: item.student_phone || "N/A",
         }));

         setUsageData(formattedData);
         setUsageCurrentPage(pagination.current_page);
         setUsageTotalPages(pagination.last_page);
      } catch (error) {
         console.error("Error fetching usage history:", error);
      } finally {
         setLoading(false);
      }
   };

   useEffect(() => {
      if (session?.user?.userId && session?.user?.token) {
         fetchPurchaseHistory(purchaseCurrentPage);
         fetchUsageHistory(usageCurrentPage);
      } else {
         console.error("user not found");
      }
   }, [session?.user?.email]);

   const handlePurchasePageChange = (page: number) => {
      setPurchaseCurrentPage(page);
   };

   const handleUsagePageChange = (page: number) => {
      setUsageCurrentPage(page);
   };

   if (status === "loading") {
      return <Loading />;
   }

   const handleInvoiceDownload = async (invoiceId: number) => {
      try {
         // Fetch the binary file data from the API
         const response = await axios.get(
            `${process.env.NEXT_PUBLIC_API_URL}/user/coins/invoice/download/${invoiceId}`,
            {
               headers: { Authorization: `Bearer ${session?.user?.token}` },
               responseType: "blob", // Ensure the response is treated as binary data
            }
         );

         // Create a Blob from the response data
         const blob = new Blob([response.data], { type: response.headers["content-type"] });

         // Create a temporary URL for the Blob
         const link = document.createElement("a");
         link.href = URL.createObjectURL(blob);

         // Set the file name for download (use a custom name or extract from headers)
         const contentDisposition = response.headers["content-disposition"];
         const fileName = contentDisposition
            ? contentDisposition.match(/filename="(.+)"/)?.[1]
            : `invoice-${invoiceId}.pdf`;

         link.download = fileName; // Set the filename
         document.body.appendChild(link); // Append the link to the document
         link.click(); // Trigger the download
         document.body.removeChild(link); // Clean up the link element
         URL.revokeObjectURL(link.href); // Revoke the Blob URL after download
      } catch (err) {
         console.error("Error downloading invoice: ", err);
      }
   };

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
            </div>
            <TabsContent value="purchase" className="w-full">
               <PaginatedTable
                  data={purchaseData}
                  loading={loading}
                  columns={[
                     { label: "Sl. No.", key: "sl" },
                     { label: "Date", key: "date" },
                     { label: "Transaction Type", key: "type" },
                     { label: "Remarks", key: "remarks" },
                     { label: "Coins", key: "coins" },
                     { label: "Amount Paid", key: "amount" },
                     {
                        label: "Invoice",
                        key: "invoice",
                        render: (row: PurchaseHistory) => (
                           <DropdownMenu>
                              <DropdownMenuTrigger asChild className="cursor-pointer">
                                 <MoreHorizontal stroke="#212121" />
                              </DropdownMenuTrigger>
                              <DropdownMenuContent className="w-56">
                                 <DropdownMenuLabel>Invoice Options</DropdownMenuLabel>
                                 <DropdownMenuSeparator />
                                 <DropdownMenuGroup>
                                    <DropdownMenuItem
                                       className="cursor-pointer"
                                       onClick={() => {
                                          console.log(row);
                                          handleInvoiceDownload(row.invoice);
                                       }}
                                    >
                                       <DownloadIcon stroke="#212121" />
                                       <span>Download</span>
                                    </DropdownMenuItem>
                                 </DropdownMenuGroup>
                              </DropdownMenuContent>
                           </DropdownMenu>
                        ),
                     },
                  ]}
                  currentPage={purchaseCurrentPage}
                  totalPages={purchaseTotalPages}
                  onPageChange={handlePurchasePageChange}
               />
            </TabsContent>
            <TabsContent value="usage" className="w-full">
               <PaginatedTable
                  data={usageData}
                  loading={loading}
                  columns={[
                     { label: "Sl. No.", key: "sl" },
                     { label: "Student Name", key: "studentName" },
                     { label: "Skills", key: "skills" },
                     { label: "Enquiry Date", key: "enquiryDate" },
                     { label: "Coin Consumed Date", key: "coinConsumedDate" },
                     { label: "Coins Consumed", key: "coinsConsumed" },
                     { label: "Student Message", key: "studentMessage" },
                     { label: "Student Email", key: "studentEmail" },
                     { label: "Student Phone", key: "studentPhone" },
                  ]}
                  currentPage={usageCurrentPage}
                  totalPages={usageTotalPages}
                  onPageChange={handleUsagePageChange}
               />
            </TabsContent>
         </Tabs>
      </section>
   );
};

export default CoinHistoryListingSection;
