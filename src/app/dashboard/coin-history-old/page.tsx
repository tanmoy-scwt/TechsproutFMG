import { CoinHistoryListingSection } from "./_components";
import { auth } from "@/lib/auth";
import { ClientFetch } from "@/actions/client-fetch";
import { Suspense } from "react";
import Loading from "@/components/loading";

interface CoinHistoryPageProps {
   searchParams: {
      type: string;
   };
}

interface PurchaseHistory {
   id: number;
   title: string | null;
   amount_paid: string;
   coins_received: number;
   purchase_date: string;
   transaction_type: string;
   remarks: string | null;
}

interface ConsumedHistory {
   f_name: string;
   id: number;
   enquiry_date: string;
   coin_consumed_date: string;
   coins_consumed: number;
   student_name: string | null;
   student_email: string | null;
   student_phone: string | null;
   student_message: string | null;
   skills: string | null;
}

async function CoinHistoryPage({ searchParams }: CoinHistoryPageProps) {
   console.log(searchParams);
   const session = await auth();
   const userId = session?.user.userId;
   const token = session?.user.token;

   const purchaseHistoryUrl = `${process.env.API_URL}/user/coins/purchase-history/${userId}`;
   const consumedHistoryUrl = `${process.env.API_URL}/user/coins/consumed-history/${userId}`;

   const [purchaseResponse, consumedResponse] = await Promise.all([
      ClientFetch(purchaseHistoryUrl, {
         headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
         },
      }),
      ClientFetch(consumedHistoryUrl, {
         headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
         },
      }),
   ]);

   const purchaseJson = await purchaseResponse.json();
   const consumedJson = await consumedResponse.json();

   const purchaseData: PurchaseHistory[] = purchaseJson?.data?.data ?? [];
   const consumedData: ConsumedHistory[] = consumedJson?.data?.data ?? [];

   const formattedPurchaseData = purchaseData.map((item, index) => ({
      sl: index + 1,
      name: item.title || "Unknown",
      date: item.purchase_date,
      type: item.transaction_type,
      remarks: item.remarks || "N/A",
      coins: item.coins_received,
      amount: parseFloat(item.amount_paid),
      invoice: `INV${item.id}`,
   }));

   const formattedUsageData = consumedData.map((item, index) => ({
      sl: index + 1,
      skills: item.skills ? item.skills.split(",") : [],
      enquiryDate: item.enquiry_date,
      location: item.f_name,
      studentId: item.id,
      studentName: item.student_name || "Anonymous",
      coinsUsed: item.coins_consumed,
      studentMessage: item.student_message,
   }));

   return (
      <div className="dash-bg">
         <h1 className="subtitle">Coin History</h1>
         <Suspense fallback={<Loading />}>
            <CoinHistoryListingSection purchaseData={formattedPurchaseData} usageData={formattedUsageData} />
         </Suspense>
      </div>
   );
}

export default CoinHistoryPage;
