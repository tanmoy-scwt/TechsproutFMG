"use client";
import "./style.css";
import Image from "next/image";
import { useState } from "react";
import Modal from "@/components/modal";

export interface VideoModalContent {
   thumbnail: string;
   previewThumbnail?: string;
   videoLink: string;
   thumbnailAlt: string;
}

interface VideoModalProps {
   content: VideoModalContent;
}
function VideoModal({ content }: VideoModalProps) {
   const [showModal, setShowModal] = useState(false);

   const image = content.previewThumbnail ? (
      <Image
         src={content.thumbnail}
         height={133}
         width={200}
         alt={content.thumbnailAlt || "Thumbnail"}
         blurDataURL={content.previewThumbnail}
         loading="lazy"
         placeholder="blur"
         className="img"
      />
   ) : (
      <Image
         src={content.thumbnail}
         height={133}
         width={200}
         alt={content.thumbnailAlt || "Thumbnail"}
         loading="lazy"
         className="img"
      />
   );

   return (
      <div className="video-modal">
         <div onClick={() => setShowModal((prev) => !prev)} className="video__thumbnail">
            {image}
            <div className="video__thumb--inner">
               <p className="intro">Introduction</p>
               <div className="video-modal__play">
                  <Image
                     src="/img/icons/play.svg"
                     width={27}
                     height={27}
                     alt={`Play ${content.thumbnailAlt || "Video"}`}
                  />
               </div>
            </div>
         </div>
         <Modal show={showModal} onBackdropClick={() => setShowModal(false)} />
      </div>
   );
}

export default VideoModal;
