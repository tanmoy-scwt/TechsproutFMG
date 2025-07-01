'use client';
import "./style.css";
import { CourseDetailsIntroVideoSectionContent } from "../../types";
import { useEffect, useState } from "react";

interface CourseDetailsIntroVideoSectionProps {
   className?: string;
   content: CourseDetailsIntroVideoSectionContent;
}

function CourseDetailsIntroVideoSection({ className = "", content }: CourseDetailsIntroVideoSectionProps) {

    const [embedUrl, setEmbedUrl] = useState("");

    const extractVideoId = (url: string) => {
        const regex =
          /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/ ]{11})/;
        const match = url.match(regex);
        return match ? match[1] : null;
      };


      useEffect(() => {
        if (content?.introVideoUrl) {
          const videoId = extractVideoId(content.introVideoUrl);
          if (videoId) {
            setEmbedUrl(`https://www.youtube.com/embed/${videoId}`);
          }
        }
      }, [content?.introVideoUrl]);


   return (
      <section className={`cdiv__section ${className}`}>
        {embedUrl &&
         <div className="cdiv__container">
            <iframe
               width="100%"
               height="100%"
               src={embedUrl}
               title={content.title}
               allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
               referrerPolicy="strict-origin-when-cross-origin"
               allowFullScreen
               className="iframe"
            ></iframe>
         </div>
        }
      </section>
   );
}

export default CourseDetailsIntroVideoSection;
