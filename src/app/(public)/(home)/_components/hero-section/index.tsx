"use client";

import "./style.css";
import Image from "next/image";
import SearchInput from "@/components/search-input";
import parse from "html-react-parser";
import { Phone } from "lucide-react";
interface HeroDataType {
   banner_image: string;
   title: string;
   search_title: string;
   banner_left_upper_image: string;
   banner_left_upper_text: string;
   banner_right_image: string;
   banner_right_text: string;
   banner_left_lower_image: string;
   banner_left_lower_text: string;
   total_user: string;
   total_user_text: string;
   total_course: string;
   total_course_text: string;
   happy_student: string;
   happy_student_text: string;
   total_webinar: string;
   total_webinar_text: string;
}

interface HeroContentType {
   stats: Array<{
      number: string;
      text: string;
   }>;
   image: {
      src: string;
      alt: string;
      floatingContent: Array<{
         id: number | string;
         icon: string;
         text: string;
         class: "right-in" | "right" | "left";
      }>;
   };
}

interface HeroSectionProps {
   data: HeroDataType;
   phone: number;
}

//function HeroSection({ data }: HeroSectionProps) {
const HeroSection: React.FC<HeroSectionProps> = ({ data, phone }) => {
   const content: HeroContentType = {
      image: {
         src: `${process.env.NEXT_PUBLIC_IMAGE_URL}/${data?.banner_image}`,
         alt: "Find my Guru",
         floatingContent: [
            {
               id: 1,
               icon: `${process.env.NEXT_PUBLIC_IMAGE_URL}/${data?.banner_left_upper_image}`,
               text: data?.banner_left_upper_text,
               class: "right-in",
            },
            {
               id: 2,
               icon: `${process.env.NEXT_PUBLIC_IMAGE_URL}/${data?.banner_right_image}`,
               text: data?.banner_right_text,
               class: "right",
            },
            {
               id: 3,
               icon: `${process.env.NEXT_PUBLIC_IMAGE_URL}/${data?.banner_left_lower_image}`,
               text: data?.banner_left_lower_text,
               class: "left",
            },
         ],
      },
      stats: [
         {
            number: data?.total_user,
            text: data?.total_user_text,
         },
         {
            number: data?.total_course,
            text: data?.total_course_text,
         },
         {
            number: data?.happy_student,
            text: data?.happy_student_text,
         },
         //  {
         //     number: data?.total_webinar,
         //     text: data?.total_webinar_text,
         //  },
      ],
   };
   const phoneNumber = phone;
    //console.log("phoneNumber",phoneNumber);
   const handleCall = () => {
      const phoneNumber = phone; // Set the phone number here

      if (/Mobi|Android|iPhone/i.test(navigator.userAgent)) {
         // If on mobile, use the `tel:` protocol
         window.location.href = `tel:${phoneNumber}`;
      } else {
         // If on desktop, redirect to Skype
         const skypeLink = `skype:${phoneNumber}?call`;
         window.location.href = skypeLink;
      }
   };

   return (
      <section className="home__hero-section">
         <div className="wrapper_icon_phone">
            <ul>
               <li className="Phone" onClick={handleCall}>
                  <Phone size={30} color="white" />
                  <div className="slider">
                     <p>{phoneNumber}</p>
                  </div>
               </li>
            </ul>
         </div>
         <div className="container home__hero-container">
            {data?.title && <h1 className="title home__hero-title">{parse(data?.title)}</h1>}

            <div className="home__hero-search">
               {data?.search_title && <p className="subtitle">{parse(data?.search_title)}</p>}
               <SearchInput />
            </div>

            <div className="home__hero-image--container">
               <div className="home__hero-image">
                  {/* <Image
                     src={content?.image?.src}
                     height={453}
                     width={395}
                     alt={content?.image?.alt}
                     unoptimized
                     priority
                  /> */}
                  <Image
                     src={`${process.env.NEXT_PUBLIC_IMAGE_URL}/${data?.banner_image}`}
                     height={428}
                     width={583}
                     alt="Backgroung Image"
                     priority
                     style={{ objectFit: "cover" }}
                     fetchPriority="high"
                     quality={75}
                  />
               </div>

               {/* <div className="home__hero-floating-card--container">
                  {content?.image?.floatingContent?.map((item, i) => (
                     <div key={item.id} className={`home__hero-floating-card card-${i + 1}`}>
                        <Image
                           src={item.icon}
                           height={55}
                           width={55}
                           alt={item.text}
                           unoptimized
                           className={item.class || "right"}
                        />
                        <p>{item.text}</p>
                     </div>
                  ))}
               </div> */}
            </div>

            <div className="home__hero-stat">
               {content?.stats?.map((stat, i) => (
                  <p key={i}>
                     <span className="highlight">{stat.number}</span>
                     <br />
                     {stat.text}
                  </p>
               ))}
            </div>
         </div>
      </section>
   );
}

export default HeroSection;
