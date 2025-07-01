"use client";

import "./style.css";
import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { FacebookShare, twitterShare, whatsappShare } from "./utils";
import useOutsideClick from "@/hooks/use-outside-click";

function ShareButton({ title, size = 45 }: { title: string; size?: number }) {
   const [showIcons, setShowIcons] = useState(false);
   const [style, setStyle] = useState({});
   const ref = useOutsideClick<HTMLDivElement>(() => {
      setShowIcons(false);
   });
   const contentRef = useRef<HTMLDivElement>(null);
   const path = usePathname();

   type SHARE_TYPES = "FB" | "WHATSAPP" | "X";

   const getShareButtonDimension = () => {
      const rect = (ref.current as HTMLDivElement).getBoundingClientRect();
      const { left, top } = rect;

      return { left, top };
   };

   const getContentItemDimension = () => {
      const width = (contentRef.current as HTMLDivElement).offsetWidth;
      const height = (contentRef.current as HTMLDivElement).offsetHeight;

      return { width, height };
   };

   const setContentPosition = () => {
      const size = ref.current?.offsetWidth || 50;

      const { left, top } = getShareButtonDimension();
      const { width, height } = getContentItemDimension();
      const screenWidth = window.innerWidth;
      const topNavHeight = 135;
      const contentOverflowRight = left + size / 2 + width >= screenWidth;
      const contentOverflowLeft = left + size / 2 < width;

      const constructedStyle: React.CSSProperties | null = {};

      if (height + topNavHeight < top) {
         constructedStyle.bottom = size + 10;
         constructedStyle.top = "auto";
      } else {
         constructedStyle.top = size + 10;
         constructedStyle.bottom = "auto";
      }

      if (contentOverflowRight) {
         constructedStyle.right = "0";
         constructedStyle.left = "auto";
      } else if (contentOverflowLeft) {
         constructedStyle.left = "0";
         constructedStyle.right = "auto";
      }

      setStyle(constructedStyle);
   };

   const handleClick = (e: React.MouseEvent) => {
      e.stopPropagation();

      if (showIcons) {
         setShowIcons(false);
         return;
      }
      setShowIcons(true);
      setContentPosition();
   };

   const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
      e.stopPropagation();
      if (e.key === "Enter" || e.key === " ") {
         e.preventDefault();
         if (showIcons) {
            setShowIcons(false);
            return;
         }
         setShowIcons(true);
         setContentPosition();
      }
   };

   const handleSocialNetworksClick = (type: SHARE_TYPES) => (e: React.MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();
      const URL = process.env.NEXT_URL && path ? `${process.env.NEXT_URL}/${path}` : window.location.href;

      if (type === "X") {
         twitterShare({
            text: title,
            url: URL,
            hashtags: "FindMyGuru",
         });
      } else if (type === "WHATSAPP") {
         whatsappShare({
            text: title,
            url: URL,
         });
      } else if ((type = "FB")) {
         FacebookShare({
            url: URL,
         });
      }

      setShowIcons(false);
   };

   const handleSocialNetworksKeyDown = (type: SHARE_TYPES) => (e: React.KeyboardEvent<HTMLButtonElement>) => {
      e.stopPropagation();
      handleSocialNetworksClick(type);
   };

   useEffect(() => {
      const handleEvents = () => {
         setShowIcons(false);
      };

      window.addEventListener("resize", handleEvents);
      window.addEventListener("scroll", handleEvents);
      return () => {
         window.removeEventListener("resize", handleEvents);
         window.removeEventListener("scroll", handleEvents);
      };
   }, [setShowIcons, setStyle]);

   return (
      <div
         className="share-button"
         title={`Share ${title}`}
         ref={ref}
         onClick={handleClick}
         onKeyDown={handleKeyDown}
         tabIndex={0}
         style={{ width: size, height: size }}
      >
         <Image src="/img/share/share.svg" alt="share" width={29} height={29} />

         <div
            className={`share-button__icons ${showIcons ? "show" : "hide"}`}
            ref={contentRef}
            style={style}
            aria-hidden={!showIcons}
         >
            <button
               className="share-button__icon"
               onClick={handleSocialNetworksClick("X")}
               onKeyDown={handleSocialNetworksKeyDown("X")}
               type="button"
            >
               <Image src="/img/share/x.svg" alt="share on x" width={30} height={30} />
            </button>
            <button
               className="share-button__icon"
               onClick={handleSocialNetworksClick("WHATSAPP")}
               onKeyDown={handleSocialNetworksKeyDown("WHATSAPP")}
               type="button"
            >
               <Image src="/img/share/whatsapp.svg" alt="share on whatsapp" width={30} height={30} />
            </button>
            <button
               className="share-button__icon"
               onClick={handleSocialNetworksClick("FB")}
               onKeyDown={handleSocialNetworksKeyDown("FB")}
               type="button"
            >
               <Image src="/img/share/facebook.svg" alt="Share on Facebook" width={30} height={30} />
            </button>
         </div>
      </div>
   );
}

export default ShareButton;
