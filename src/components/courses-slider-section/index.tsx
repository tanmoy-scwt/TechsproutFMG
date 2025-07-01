"use client";

import "./style.css";

import PopularCourseCard, { PopularCourseCardContent } from "@/components/popular-course-card";
import Slider, { SliderProps } from "@/components/slider";
import ArrowRight from "@/icons/ArrowRight";
import { links } from "@/lib/constants";
import Link from "next/link";
import { SwiperSlide } from "swiper/react";

export interface CourseSliderSectionContent {
   courses: Array<PopularCourseCardContent>;
}
interface CourseSliderSectionProps extends CourseSliderSectionContent {
   title?: string;
   link?: string;
   sliderClassName: string;
   sliderProps?: Omit<SliderProps, "className" | "children">;
   containerClassName?: string;
   headingClass?: string;
   wrap?: boolean;
}
function CourseSliderSection({
   title = "Related Courses",
   link,
   courses,
   sliderProps,
   sliderClassName,
   containerClassName = "",
   headingClass = "h2",
   wrap = true,
}: CourseSliderSectionProps) {
   //console.log("courses",courses);
   return (
      <section className="section">
         <div className={`course-slider__container ${wrap ? "wrap" : ""} ${containerClassName}`}>
            <h2 className={`${headingClass} course-slider__heading`}>{title}</h2>
            <Link prefetch={false} href={link || links.exploreCourses} className="explore">
               Explore All <ArrowRight />
            </Link>

            <div className="course-slider__section--slider-wrapper">
               <Slider
                  spaceBetween={15}
                  count320={1.25}
                  count480={1.5}
                  count565={2.1}
                  count768={2.5}
                  count920={3.15}
                  count1280={4}
                  showPaginationOnPc={true}
                  className={sliderClassName}
                  {...sliderProps}
               >
                  {courses?.map((course) => (
                     <SwiperSlide key={course.id}>
                        <PopularCourseCard content={course} />
                     </SwiperSlide>
                  ))}
               </Slider>
            </div>
         </div>
      </section>
   );
}

export default CourseSliderSection;
