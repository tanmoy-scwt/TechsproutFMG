import { CourseSliderSectionContent } from "@/components/courses-slider-section";

export interface TrainerInfoSectionContent {
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
   profession: string;
   experience: number;
}

export type TrainerDetailsPageContent = TrainerInfoSectionContent & CourseSliderSectionContent;
