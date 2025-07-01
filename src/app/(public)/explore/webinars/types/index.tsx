import { WebinarSliderSectionContent } from "@/components/webinars-slider-section";

export interface WebinarDetailsTitleSectionContent {
   id: number;
   title: string;
   subtitle: string;
   description: string;
   date: string;
   startTime: string;
   endTime: string;
   price: number;
   availableSeats: number;
   host: string;
   image: string;
   previewImage?: string;
}
export interface WebinarDetailsDetailsSectionContent {
   webinarFor: Array<string>;
   thingsToDo: Array<string>;
   description: string;
}

export type WebinarDetailsPageContent = WebinarDetailsTitleSectionContent &
   WebinarDetailsDetailsSectionContent &
   WebinarSliderSectionContent;
