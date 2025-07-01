import { CourseSliderSectionContent } from "@/components/courses-slider-section";

export interface InstituteInfoSectionContent {
   id: number | string;
   image: string;
   previewImage?: string;
   name: string;
   about: string;
   averageRatings: number;
   totalReviews: number;
   totalStudents: number;
   location: string;
   highlights: Array<string>;
   experience: number;
}

export type InstituteDetailsPageContent = InstituteInfoSectionContent & CourseSliderSectionContent;
