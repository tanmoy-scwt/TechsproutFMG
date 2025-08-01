import ImageUploader from "@/components/image-uploader";
import Tiptap from "@/components/tiptap/Tiptap";
import { FormDataType } from "@/types";
import React, { useEffect } from "react";

function AddCourseFormStep2({
   formData,
   setFormData,
   onInpChange,
}: {
   formData: FormDataType;
   setFormData: React.Dispatch<React.SetStateAction<FormDataType>>;
   onInpChange: (e: {
      target: {
         name: string;
         value: string | number | string[] | null;
      };
   }) => void;
}) {
   return (
      <div className="step2__form">
         <div className="acf__form--items">
            <p className="label">Course Image</p>
            <ImageUploader
               defaultImage={
                  formData.course_logo.value ? `${process.env.NEXT_PUBLIC_IMAGE_URL}/${formData.course_logo.value}` : ``
               }
               onUpload={(url: string, file: File) => {
                  const temp = { ...formData };
                  temp.course_logo.url = url;
                  temp.course_logo.value = file;
                  temp.course_logo.isValid = true;
                  temp.course_logo.isEdited = true;
                  setFormData(temp);
               }}
            />
         </div>
         <div className="acf__form--items">
            <label htmlFor="introVideo" className="label">
               Demo Video (YouTube Link)
            </label>
            <input
               name="demo_video_url"
               type="url"
               id="introVideo"
               className="input"
               placeholder="youtube.com/watch?v=E-lXXXX12345"
               value={formData.demo_video_url.value as string}
               onChange={onInpChange}
            />
            {!formData.demo_video_url.isValid && (
               <p className="error">please enter a valid {formData.demo_video_url.label?.toLowerCase() || "name"}</p>
            )}
         </div>
         {/* <div className="acf__form--items">
            <label htmlFor="courseContent" className="label">
               Highlight
            </label>
            <Tiptap
               content={formData.highlights.value as string}
               onChange={(value: string) => {
                  const temp = { ...formData };
                  temp.highlights.value = value;
                  setFormData(temp);
               }}
            />
            {!formData.highlights.isValid && (
               <p className="error">please enter a valid {formData.highlights.label?.toLowerCase() || "name"}</p>
            )}
         </div> */}
         <div className="acf__form--items">
            <label htmlFor="courseContent" className="label">
               Course Content <span className="text-red-500 ml-1">*</span>
            </label>
            {/* <textarea
               name="course_content"
               className="textarea"
               id="courseContent"
               placeholder="Enter your course description"
               value={formData.course_content.value as string}
               onChange={onInpChange}
            ></textarea> */}
            <Tiptap
               content={formData.course_content.value as string}
               onChange={(value: string) => {
                  const temp = { ...formData };
                  temp.course_content.value = value;
                  setFormData(temp);
               }}
            />
            {!formData.course_content.isValid && (
               <p className="error">please enter a valid {formData.course_content.label?.toLowerCase() || "name"}</p>
            )}
         </div>
      </div>
   );
}

export default AddCourseFormStep2;
