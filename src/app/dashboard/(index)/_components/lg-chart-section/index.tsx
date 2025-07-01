"use client";
import React, { useEffect, useState } from "react";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
import { SubscriptionDetailsSection } from "@/app/dashboard/_components";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { ChartData } from "../../types";
import { getSession } from "next-auth/react";
interface LeadGenerationChartSectionProps {
   data: ChartData;
}
interface SubscriptionDetailsSectionData {
//    data: { package_name: string; last_recharge: string; expiry_date: string; remainingCoins: number; status: string };
        data: {
            f_name: string;
            user_type: string;
            currentSubscription: {
            subscription_purchase_id: number;
            package_name: string;
            last_recharge: string;
            expiry_date: string;
            };
            remainingCoins: number;
            status: string;
            upComingSubscriptionDtls?: {
            subscription_purchase_id: number;
            package_name: string;
            last_recharge: string;
            expiry_date: string;
            start_date: string;
            };
        };
    }
function LeadGenerationChartSection({ data }: LeadGenerationChartSectionProps) {
   const [subDetail, setSubDetail] = useState<SubscriptionDetailsSectionData>({
      //data: { package_name: "", last_recharge: "", expiry_date: "", remainingCoins: 0, status: "" },
        data: {
          f_name: "",
          user_type: "",
          currentSubscription: {
            subscription_purchase_id: 0,
            package_name: "",
            last_recharge: "",
            expiry_date: "",
          },
          remainingCoins: 0,
          status: "",
          upComingSubscriptionDtls: undefined, // Optional property
        },

   });
   const [loading, setLoading] = useState(true); // Track loading state
   const [error, setError] = useState(null);
   const chartConfig = {
      value: {
         label: "Desktop",
         color: "#3bafff",
      },
   } satisfies ChartConfig;

   useEffect(() => {
      const getSubscriptionDetails = async () => {
         try {
            const session = await getSession();

            if (!session || !session.user?.userId || !session.user?.token) {
               throw new Error("Session or user data is missing");
            }

            const subscriptionUrl = `${process.env.NEXT_PUBLIC_API_URL}/user/subscriptions/details/${session.user.userId}`;
            const subRes = await fetch(subscriptionUrl, {
               headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${session.user.token}`,
               },
            });

            if (!subRes.ok) {
               throw new Error("Failed to fetch subscription details");
            }

            const subsResp: SubscriptionDetailsSectionData = await subRes.json();
            setSubDetail(subsResp); // Set the subscription data or null if not found
         } catch (err) {
         } finally {
            setLoading(false); // Set loading to false after the request finishes
         }
      };

      getSubscriptionDetails();
   }, []);

   if (loading) {
      return <p>Loading...</p>;
   }

   if (error) {
      return <p>Error: {error}</p>;
   }
   //    console.log("subDetail", subDetail);
   return (
      <section className="lgcs__section dash-bg">
         {/* <h2 className="dash-subtitle">Lead Generation Trend</h2>
               <ChartContainer config={chartConfig} className="min-h-[125px] w-[103%] h-[103%] ml-[-20px]">
                  {data?.length === 0 ? (
                     <div className="w-full h-full flex items-center justify-center">
                        <p className="text-[var(--color-text-300)]">No data available</p>
                     </div>
                  ) : (
                     <BarChart accessibilityLayer={true} data={data}>
                        <CartesianGrid />
                        <XAxis
                           dataKey="date"
                           tickLine={false}
                           tickMargin={10}
                           axisLine
                           //   tickFormatter={(value) => value.slice(0, 3)}
                        />
                        <YAxis dataKey="value" tickLine={false} tickMargin={10} axisLine />
                        <ChartTooltip content={<ChartTooltipContent />} />

                        <Bar
                           dataKey="value"
                           fill="var(--color-value)"
                           radius={4}
                           activeBar={{ fill: "#0f88dc" }}
                           barSize={50}
                        />
                     </BarChart>
                  )}
               </ChartContainer> */}

         <SubscriptionDetailsSection data={subDetail} />
      </section>
   );
}

export default LeadGenerationChartSection;
