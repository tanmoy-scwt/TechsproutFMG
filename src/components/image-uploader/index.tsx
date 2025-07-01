"use client";

import "./style.css";
import { ImageProps } from "next/image";
import PreviewImage from "@/components/preview-image";
import { ChangeEvent, useState } from "react";
import { CloudUpload, LucideCloudUpload } from "lucide-react";
import PencilIcon from "@/icons/PencilIcon";
import { convertAndResizeImage } from "@/lib/utils";

interface ImageUploaderProps {
   className?: string;
   defaultImage?: string;
   onUpload?: (url: string, file: File) => void;
   isValid?: boolean;
}

function ImageUploader({ className = "", defaultImage, onUpload, isValid = true }: ImageUploaderProps) {
   const [imageLink, setimageLink] = useState("");

   const handleChange = async (e: ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
         await convertAndResizeImage(file, {
            width: 10,
            successCallback: (src) => {
               onUpload?.(src, file);
            },
         });
         const imgUrl = URL.createObjectURL(file);
         setimageLink(imgUrl);
      }
   };

   return (
      <>
         <label className="image-uploader" htmlFor="image-uploader__input">
            <input
               type="file"
               id="image-uploader__input"
               className="image-uploader__input"
               accept="image/png, image/jpeg, image/webp, image/jpg"
               aria-hidden="true"
               onChange={handleChange}
            />
            {imageLink || defaultImage ? (
               <PreviewImage
                  src={imageLink || defaultImage || ""}
                  width={1600}
                  height={900}
                  className="image-uploader__image"
                  alt="Image Uploader"
               />
            ) : (
               <div className="flex flex-col items-center justify-center gap-4">
                  <LucideCloudUpload size={45} />
                  <p className="label">Click to upload file</p>
               </div>
            )}
            {imageLink && <PencilIcon size={28} className="select-icon" />}
         </label>
         {!isValid && <p className="error">please upload a valid image</p>}
      </>
   );
}

export default ImageUploader;
