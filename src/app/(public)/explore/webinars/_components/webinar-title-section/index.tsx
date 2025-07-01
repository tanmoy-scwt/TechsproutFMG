import "./style.css";
import { WebinarDetailsTitleSectionContent } from "../../types";
import PreviewImage from "@/components/preview-image";
import { formatCurrency } from "@/lib/utils";
import { format, parse } from "date-fns";
import HTMLRenderer from "@/components/html-renderer";

interface WebinarTitleSectionProps {
   className?: string;
   content: WebinarDetailsTitleSectionContent;
}
function WebinarTitleSection({ className = "", content }: WebinarTitleSectionProps) {

    const webinarDate = content.date
  ? format(new Date(content.date.replace(" ", "T")), "MMMM d yyyy")
  : "";

    const parsedStartTime = parse(content?.startTime, "HH:mm:ss", new Date());
    const parsedEndTime = parse(content?.endTime, "HH:mm:ss", new Date());

    // Format the time into 12-hour format with AM/PM
    const formattedStartTime = format(parsedStartTime, "hh:mm a"); // 02:00 PM
    const formattedEndTime = format(parsedEndTime, "hh:mm a"); // 04:00 PM

    // Combine the formatted times
    const timeRange = `${formattedStartTime} - ${formattedEndTime}`;

   return (
      <section className={`wts__section ${className}`}>
         <div className="container wts__container">
            <div className="wts__content--container">
               <p className="ex-desc wts__web-text">WEBINAR</p>
               <h1 className="ex-title wts__title">{content.title}</h1>
               {content.subtitle && <div className="ex-desc wts__description"><HTMLRenderer htmlString={content.subtitle} showBefore={false} /></div>}
               <div className="wts__info--container">
                  <p className="wts__text">
                     <span>Date: </span>
                     {webinarDate}
                  </p>
                  <p className="wts__text">
                     <span>Time: </span>
                     {timeRange}
                  </p>
                  <p className="wts__text">
                     <span>Price: </span>
                     {formatCurrency({ amount: content.price })}
                  </p>
                  <p className="wts__text">
                     <span>Available Seats: </span>
                     {content.availableSeats}
                  </p>
               </div>
            </div>
            <div className="wts__image">
               <PreviewImage
                  src={content.image}
                  blurDataURL={content.previewImage}
                  width={400}
                  height={350}
                  alt={`${content.title} Webinar by ${content.host} thumbnail`}
               />
               <p className="wts__badge">{`By: ${content.host}`}</p>
            </div>
         </div>
      </section>
   );
}

export default WebinarTitleSection;
