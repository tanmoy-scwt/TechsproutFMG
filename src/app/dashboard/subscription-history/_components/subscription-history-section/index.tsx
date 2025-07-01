import "./style.css";
import { SubscriptionHistoryTableData } from "@/app/dashboard/_components/subscription-history-table";
import { format } from "date-fns";
interface SubscriptionHistorySectionProps {
   title: string;
   //content: SubscriptionHistoryTableData;
   enddate: string;
}
function SubscriptionHistorySection({ title, enddate }: SubscriptionHistorySectionProps) {
    //console.log("content,",content);
   // console.log(format(new Date(resp?.data?.currentPackageDetails?.end_date), "dd/MM/yyyy, HH:MM:SS a"))
//    const sortedDates = Array.isArray(content) ?
//    content
//       ?.map((item) => item.end_date) // Map to get the end_date
//       .map((dateStr) => new Date(dateStr)) // Convert to Date objects
//       .sort((a, b) => b.getTime() - a.getTime())
//       : []; // Sort in descending order (most recent first)

//    // Get the most recent date
//    const mostRecentDate = sortedDates ? sortedDates[0] : null;
//    const formattedDate = mostRecentDate
//       ? format(mostRecentDate, "dd/MM/yyyy, HH:MM:SS a") // Format the date
//       : ""; // If no date is available, show a message

const formattedDate = enddate
      ? format(new Date(enddate), "dd/MM/yyyy, HH:MM:SS a") // Format the date
      : "";

   return (
    <>
    <section className="shs__section">
         <p className="dash-subtitle">Current Subscription Package: </p>
         <p className="dash-value shs__value">{title}</p>
      </section>
      <section className="shs__section">
      <p className="dash-subtitle">Subscription End Date: </p>
      <p className="dash-value shs__value">{formattedDate}</p>
   </section>
    </>
   );
}

export default SubscriptionHistorySection;
