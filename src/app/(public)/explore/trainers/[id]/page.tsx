import { links } from "@/lib/constants";
import { TrainerInfoSection } from "../_components";
import { TrainerDetailsPageContent } from "../types";
import CourseSliderSection from "@/components/courses-slider-section";
import { ClientFetch } from "@/actions/client-fetch";
import { notFound } from "next/navigation";

async function TrainerDetailsPage({ params }: { params: { id: string } }) {
  const { id } = params;

  const res = await ClientFetch(
    `${process.env.API_URL}/trainer/details/${id}`,
    { cache: "no-store" }
  );
  const trainerDetails = await res.json();

  if (!trainerDetails.status) {
    notFound();
  }

  const content: TrainerDetailsPageContent = {
    id: trainerDetails?.data?.id,
    name: trainerDetails?.data?.f_name,
    about: trainerDetails?.data?.bio,
    image: `${process.env.NEXT_PUBLIC_IMAGE_URL}/${trainerDetails?.data?.profile_pic}`,
    previewImage: trainerDetails?.data?.preview_logo,
    experience: trainerDetails?.data?.year_of_exp,
    location: trainerDetails?.data?.city_name,
    profession: trainerDetails?.data?.skill_name,
    totalReviews: trainerDetails?.data?.totalReviews,
    totalStudents: trainerDetails?.data?.totalStudents,
    averageRatings: trainerDetails?.data?.average_rating,
    highlights: trainerDetails?.data?.highlights,
    courses: trainerDetails?.data?.relatedCourses,
  };

  return (
    <main>
      <TrainerInfoSection
        content={{
          id: content.id,
          name: content.name,
          about: content.about,
          image: content.image,
          previewImage: content.previewImage,
          totalReviews: content.totalReviews,
          averageRatings: content.averageRatings,
          totalStudents: content.totalStudents,
          experience: content.experience,
          location: content.location,
          profession: content.profession,
          highlights: content.highlights,
        }}
      />

      {content?.courses?.length > 0 && (
        <CourseSliderSection
          sliderClassName="td__all-courses"
          containerClassName="container"
          title={`More courses by ${content.name}`}
          link={links.exploreCourses}
          courses={content.courses}
          headingClass="subtitle"
          wrap={false}
        />
      )}
    </main>
  );
}

export default TrainerDetailsPage;
