import { greetUser } from "@/lib/utils";
import { CoinHistorySection, DashboardInfoSection, LeadGenerationChartSection } from "./_components";
import { ChartData, DashboardInfoItem } from "./types";
import { auth } from "@/lib/auth";
import { ClientFetch } from "@/actions/client-fetch";

async function DashboardOverviewPage() {
   const session = await auth();

   const res = await ClientFetch(`${process.env.NEXT_PUBLIC_API_URL}/user/dashboard/${session?.user.userId}`, {
      headers: {
         "Content-Type": "application/json",
         Authorization: `Bearer ${session?.user.token}`,
      },
      next: { revalidate: 0, tags: ["profileDetails"] },
   });

   // const profileData: UserProfile = (await res.json())?.data;
   const data = (await res.json())?.data;

   const infoData = [
      {
         title: "Your Leads",
         icon: "/img/dashboard/leads-info.svg",
         value: data?.tota_lLeads,
      },
      {
         title: "Course Offerings",
         icon: "/img/dashboard/courses-info.svg",
         value: data?.no_Of_Courses,
      },
      {
         title: "Webinars",
         icon: "/img/dashboard/webinars-info.svg",
         value: data?.no_Of_Webinars,
      },
   ];
   const chartData: ChartData = data?.monthlyLeadsData?.map((item: any) => ({
      date: `${item.month}/${item.year}`,
      value: item?.totalLeads,
   }));
   const coinData = {
      usageData: data?.coin_consume_history?.map((item: any) => ({
         sl: item?.id,
         skills: item?.skill_name,
         enquiryDate: item?.enquiry_date,
         name: item?.name,
         location: item?.location,
         studentId: item?.user_id,
         studentName: item?.student_name,
         studentMessage: item?.student_message,
         coinsUsed: item?.coins_consumed,
      })),
      purchaseData: data?.coin_purchase_history?.map((item: any) => ({
         sl: item?.id,
         name: item?.title,
         date: item?.purchase_date,
         type: item?.transaction_type ? item?.transaction_type : "N/A",
         remarks: item?.remarks ? item?.remarks : "N/A",
         coins: item?.coins_received ? item?.coins_received : "N/A",
         amount: item?.amount_paid ? item?.amount_paid : "N/A",
         invoice: "",
      })),
   };

   return (
      <div className="flex flex-col gap-[40px]">
         <h1 className="subtitle -mb-[20px]">{greetUser(session?.user.fullName ?? "")}</h1>
         <DashboardInfoSection data={infoData} />
         <LeadGenerationChartSection data={chartData} />
         <CoinHistorySection usageData={coinData.usageData} purchaseData={coinData.purchaseData} />
      </div>
   );
}

export default DashboardOverviewPage;
