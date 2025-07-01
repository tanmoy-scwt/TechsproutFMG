"use client";
import "./style.css";
import { CourseDetailsBlogsSectionContent } from "../../types";
import { SwiperSlide } from "swiper/react";
import ArrowRight from "@/icons/ArrowRight";
import { links } from "@/lib/constants";
import Link from "next/link";
import Slider from "@/components/slider";
import BlogCard from "@/components/blog-card";

interface CourseDetailsBlogsSectionProps extends CourseDetailsBlogsSectionContent {
   className: string;
}
function CourseDetailsBlogsSection({ blogs, className = "" }: CourseDetailsBlogsSectionProps) {
   if (!blogs || blogs.length === 0) return;

   return (
      <section className="cd-blogs__section section">
         <h2 className="subtitle">Blogs</h2>
         <Link prefetch={false} href={links.exploreCourses} className="explore">
            Explore All <ArrowRight />
         </Link>

         <Slider
            spaceBetween={15}
            count320={1.25}
            count480={1.5}
            count565={2.1}
            count768={2.5}
            count920={3.15}
            count1280={4}
            className={`cd-blogs__section--slider-wrapper ${className}`}
         >
            {blogs.map((blog) => (
               <SwiperSlide key={blog.id}>
                  <BlogCard content={blog} />
               </SwiperSlide>
            ))}
         </Slider>
      </section>
   );
}

export default CourseDetailsBlogsSection;
