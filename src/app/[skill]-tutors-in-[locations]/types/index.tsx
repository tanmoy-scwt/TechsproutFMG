import { BolgCardContent } from "@/components/blog-card";
import { CourseSliderSectionContent } from "@/components/courses-slider-section";
import { ReviewCardContent } from "@/components/review-card";

export interface CourseDetailsIntroVideoSectionContent {
   title: string;
   introVideoUrl: string;
}
export interface CourseDetailsSectionContent {
   title: string;
   description: string;
   badge?: string;
   averageRatings: number;
   totalRatings: number;
   totalStudents: number;
}

export interface CourseDetailsInfoSectionContent {
   title: string;
   id: number | string;
   duration: number;
   batchType: string;
   languages: string | Array<string>;
   classType: "Online" | "Offline" | "Both";
   amount: number;
   period: "Minute" | "Hour" | "Day" | "Month" | "Year";
   courseBy: "Trainer" | "Institute";
}

export interface CourseDetailsContentSectionContent {
   description: string;
   skills: Array<string>;
   averageRatings: number;
   totalRatings: number;
   courseBy: "Trainer" | "Institute";
   image: string;
   previewImage: string;
   experience: number;
   location: string;
   name: string;
   about: string;
   creatorId: number | string;
}

export interface CourseDetailsRatingsSectionContent {
   ratingDetails: Array<{
      id: 1 | 2 | 3 | 4 | 5;
      stars: 1 | 2 | 3 | 4 | 5;
      count: number;
   }>;
   averageRatings: number;
   totalRatings: number;
   reviews: Array<ReviewCardContent>;
   courseId: number;
   totalReviews: number
}

export interface CourseDetailsBlogsSectionContent {
   blogs?: Array<BolgCardContent>;
}

export type CourseDetailsPageContent = CourseDetailsIntroVideoSectionContent &
   CourseDetailsSectionContent &
   CourseDetailsInfoSectionContent &
   CourseDetailsContentSectionContent &
   CourseDetailsRatingsSectionContent &
   CourseDetailsBlogsSectionContent &
   CourseSliderSectionContent;
