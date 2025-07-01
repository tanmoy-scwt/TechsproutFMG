import "./style.css";
import DashboardHeader from "@/components/dashboard-header";
import DashboardNavMobile from "@/components/dashboard-nav-mobile";
import DashboardNavPC from "@/components/dashboard-nav-pc";
import { dashboardLinks as dl } from "@/lib/constants";
import { NotebookPen } from "lucide-react";
import RazorpayScript from "./_components/razorpay-script";
import StepIndicator from "@/components/StepsIndicator/StepsIndicator";
import { cookies } from "next/headers";
import ProfileCompleteWelcomeCard from "@/components/profileCompleteWelcomeCard";

function DashboardLayout({ children }: { children: React.ReactNode }) {
   const NavLinksPC = [
      { id: 1, link: dl.dashboard, title: "Dashboard", icon: "/img/dashboard/dashboard.svg" },
      { id: 2, link: dl.profile, title: "Profile", icon: "/img/dashboard/profile.svg" },
      { id: 3, link: dl.courses, title: "Courses", icon: "/img/dashboard/courses.svg" },
      { id: 4, link: dl.webinars, title: "Webinars", icon: "/img/dashboard/webinars.svg" },
      { id: 5, link: dl.studentLeads, title: "Student Leads", icon: "/img/dashboard/student-leads.svg" },
      { id: 6, link: dl.webinarLeads, title: "Webinar Leads", icon: "/img/dashboard/webinar-leads.svg" },
      { id: 8, link: dl.potentialStudents, title: "Potential Students", icon: "/img/dashboard/potential-students.svg" },
      {
         id: 9,
         link: "#",
         title: "Purchase History",
         icon: "/img/dashboard/purchase-history.svg",
         subMenus: [
            { id: 91, link: dl.coinHistory, title: "Coins History" },
            { id: 92, link: dl.subscriptionHistory, title: "Subscription History" },
         ],
      },
      { id: 10, link: dl.pricingAndPlans, title: "Pricing & Plans", icon: "/img/dashboard/pricing.svg" },
      { id: 11, link: dl.changePassword, title: "Change Password", icon: "/img/dashboard/change-password.svg" },
   ];

   const NavLinksMobile = [
      { id: 1, link: dl.dashboard, title: "Dashboard", icon: "/img/dashboard/dashboard.svg" },
      { id: 2, link: dl.courses, title: "Courses", icon: "/img/dashboard/courses.svg" },
      { id: 3, link: dl.webinars, title: "Webinars", icon: "/img/dashboard/webinars.svg" },
      { id: 4, link: dl.addCourses, title: "Add Course", icon: <NotebookPen /> },
      //   { id: 5, link: dl.addWebinars, title: "Add Webinar", icon: <LaptopMinimal /> },
   ];
   const cookieStore = cookies();
   const subscriptionTaken = cookieStore.get("ifAnySubscriptionTakenTillNow")?.value;
   const profile_complete = cookieStore.get("profile_complete")?.value;
   const ifAnyCourseExists = cookieStore.get("ifAnyCourseExists")?.value;

   return (
      <div className="dashboard" id="dashboard">
         <DashboardHeader data={NavLinksPC} />
         <div className="container dashboard__container">
            <DashboardNavPC links={NavLinksPC} />
            <DashboardNavMobile links={NavLinksMobile} />
            <main className="dash-nav__main">
               {subscriptionTaken === "false" && (
                  <div className="pds mb-4">
                     <StepIndicator ifAnyCourseExists={ifAnyCourseExists} />
                  </div>
               )}
               {children}
            </main>
         </div>
         {subscriptionTaken == "false" && profile_complete == "0" && ifAnyCourseExists === "false" && <ProfileCompleteWelcomeCard />}
         <RazorpayScript />
      </div>
   );
}

export default DashboardLayout;
