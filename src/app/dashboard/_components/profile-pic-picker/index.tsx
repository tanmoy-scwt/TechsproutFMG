"use client";

import "./style.css";
import { ImageProps } from "next/image";
import PreviewImage from "@/components/preview-image";
import PencilIcon from "@/icons/PencilIcon";
import { ChangeEvent, useState, useCallback } from "react";
import { convertAndResizeImage, delay } from "@/lib/utils";
import { LOGO_ICON_PREVIEW } from "@/lib/constants";
import { Loader } from "lucide-react";
import { ErrorToast } from "@/lib/toast";
import Modal from "@/components/modal";
import Cropper from "react-easy-crop";
import { getCroppedImg } from "@/lib/cropImage";

interface ProfilePicPickerProps extends Omit<ImageProps, "onChange"> {
   src: string;
   width?: number;
   height?: number;
   editable?: boolean;
   className?: string;
   onChange?: (src: string, blurDataURL: string, file: File | null) => void;
}

function ProfilePicPicker({
   src = "/img/common/logo-icon.svg",
   width = 125,
   height = 125,
   editable = true,
   className = "",
   onChange,
   blurDataURL = LOGO_ICON_PREVIEW,
   ...props
}: ProfilePicPickerProps) {
   const [generating, setGenerating] = useState(false);
   const [showCropModal, setShowCropModal] = useState(false);
   const [crop, setCrop] = useState({ x: 0, y: 0 });
   const [zoom, setZoom] = useState(1);
   const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
   const [tempImage, setTempImage] = useState("");
   const [images, setImages] = useState<{
      src: string;
      blurDataURL?: string;
      file: File | null;
   }>({
      src,
      blurDataURL,
      file: null,
   });

   const handleCropComplete = useCallback((_: any, croppedAreaPixels: any) => {
      setCroppedAreaPixels(croppedAreaPixels);
   }, []);

   const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      if (file.size / 1024 > 2000) {
         ErrorToast("Files can't be bigger than 2MB.");
         return;
      }

      const imgUrl = URL.createObjectURL(file);
      setTempImage(imgUrl);
      setShowCropModal(true);
   };

   const applyCrop = async () => {
      if (!tempImage || !croppedAreaPixels) return;

      setGenerating(true);
      try {
         const croppedBlob = await getCroppedImg(tempImage, croppedAreaPixels);
         const preview = await new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = reject;
            reader.readAsDataURL(croppedBlob);
         });

         const file = new File([croppedBlob], "profile.jpg", { type: "image/jpeg" });
         const objectUrl = URL.createObjectURL(file);

         onChange?.(objectUrl, preview, file);
         setImages({ src: objectUrl, blurDataURL: preview, file });
      } catch (err) {
         ErrorToast("Something went wrong while cropping.");
      } finally {
         setGenerating(false);
         setShowCropModal(false);
      }
   };

   return (
      <>
         <label className={`pp-picker ${editable ? "editable" : ""}`} htmlFor="pp-picker__img-input">
            <input
               disabled={!editable || generating}
               type="file"
               id="pp-picker__img-input"
               className="pp-picker__img-input"
               accept="image/png, image/jpeg, image/webp, image/jpg"
               aria-hidden="true"
               onChange={handleFileChange}
            />
            <PreviewImage
               src={images.src}
               width={width}
               height={height}
               className={`pp-picker__img ${className}`}
               {...props}
            />
            {editable && !generating && <PencilIcon size={28} />}
            {generating && <Loader className="animate-spin duration-2000" size={25} />}
         </label>

         <Modal show={showCropModal} onBackdropClick={() => setShowCropModal(false)}>
            <div className="cropper-container">
               <div className="relative w-full h-[400px] bg-black">
                  <Cropper
                     image={tempImage}
                     crop={crop}
                     zoom={zoom}
                     aspect={1}
                     onCropChange={setCrop}
                     onZoomChange={setZoom}
                     onCropComplete={handleCropComplete}
                  />
               </div>
               <div className="flex justify-end gap-4 mt-4">
                  <button onClick={() => setShowCropModal(false)} className="btn-cancel">
                     Cancel
                  </button>
                  <button onClick={applyCrop} className="btn-confirm">
                     Apply
                  </button>
               </div>
            </div>
         </Modal>
      </>
   );
}

export default ProfilePicPicker;
