import { Metadata } from "next";
import { HeroSection, TopCategoriesSection, TopInstituesSection, TopTrainersSection } from "./_components";
//import WebinarSliderSection from "@/components/webinars-slider-section";
import { links } from "@/lib/constants";
import CourseSliderSection from "@/components/courses-slider-section";
import { ClientFetch } from "@/actions/client-fetch";

export async function generateMetadata(): Promise<Metadata> {
   const res = await ClientFetch(`${process.env.API_URL}/seo-details/homePage`, { cache: "no-store" });
   const metadata = await res.json();

   return {
      title: metadata?.data?.mete_title,
      description: metadata?.data?.meta_description,
      keywords: metadata?.data?.meta_keyword,
   };
}

async function Homepage() {
   const res = await ClientFetch(`${process.env.API_URL}/home/listing`, { cache: "no-store" });
   const Homedata = await res.json();

   return (
      <main>
         <HeroSection data={Homedata?.data?.staticValues} phone={Homedata?.data?.default_phone} />
         <TopCategoriesSection data={Homedata?.data?.categories} />
         {Homedata?.data?.courseDetails.length > 0 && (
            <CourseSliderSection
               sliderClassName="homepage__pc-section"
               title="Most Popular Courses"
               link={links.exploreCourses}
               containerClassName="container"
               courses={Homedata?.data?.courseDetails}
            />
         )}

         {/* <WebinarSliderSection
            sliderClassName="homepage__uw-section"
            title="Upcoming Webinars"
            link={links.exploreWebinars}
            containerClassName="container"
            webinars={Homedata?.data?.webinars}
         /> */}
         {Homedata?.data?.tutors.length > 0 && <TopTrainersSection data={Homedata?.data?.tutors} />}
         {Homedata?.data?.institutions.length > 0 && <TopInstituesSection data={Homedata?.data?.institutions} />}
      </main>
   );
}

export default Homepage;
