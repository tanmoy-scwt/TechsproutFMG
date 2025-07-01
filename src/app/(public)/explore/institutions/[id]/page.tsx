import CourseSliderSection from "@/components/courses-slider-section";
import { InstituteInfoSection } from "../_components";
import { InstituteDetailsPageContent } from "../types";
import { links } from "@/lib/constants";
import { ClientFetch } from "@/actions/client-fetch";
import { notFound } from "next/navigation";

async function InstituteDetailsPage({ params }: { params: { id: string } }) {
   const { id } = params;

   const res = await ClientFetch(`${process.env.API_URL}/institute/details/${id}`, { cache: "no-store" });
   const instituteDetails = await res.json();

   if (!instituteDetails.status) {
    notFound();
  }

   const content: InstituteDetailsPageContent = {
      id: instituteDetails?.data?.id,
      image: `${process.env.NEXT_PUBLIC_IMAGE_URL}/${instituteDetails?.data?.profile_pic}`,
      previewImage: instituteDetails?.data?.preview_logo,
      location: instituteDetails?.data?.city_name,
      name: instituteDetails?.data?.f_name,
      about: instituteDetails?.data?.bio,
      averageRatings: instituteDetails?.data?.average_rating,
      totalReviews: instituteDetails?.data?.totalReviews,
      totalStudents: instituteDetails?.data?.totalStudents,
      experience: instituteDetails?.data?.year_of_exp,
      highlights: instituteDetails?.data?.highlights,
      courses: instituteDetails?.data?.relatedCourses,
   };
   return (
      <main>
         <InstituteInfoSection
            content={{
               id: content.id,
               name: content.name,
               about: content.about,
               image: content.image,
               previewImage: content.previewImage,
               highlights: content.highlights,
               location: content.location,
               averageRatings: content.averageRatings,
               totalReviews: content.totalReviews,
               totalStudents: content.totalStudents,
               experience: content.experience,
            }}
         />
         {content?.courses?.length > 0 &&
         <CourseSliderSection
            sliderClassName="id__all-courses"
            containerClassName="container"
            title="Related Courses"
            link={links.exploreCourses}
            courses={content.courses}
            headingClass="subtitle"
            wrap={false}
         />
         }
      </main>
   );
}

export default InstituteDetailsPage;
