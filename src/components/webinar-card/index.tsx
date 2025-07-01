import "./style.css";
import Link from "next/link";
import { links } from "@/lib/constants";
import PreviewImage from "@/components/preview-image";
import { format } from 'date-fns';

export interface WebinarCardContent {
   id: number | string;
   logo: string;
   previewImage?: string;
   f_name: string;
   title: string;
   subtitle: string;
   start_date: string;
   start_time: string;
   no_of_seats: number;
   agenda: string;
   slug: string;
}

interface WebinarCardProps {
   content: WebinarCardContent;
}

const formatDateAndTime = (start_date: string, start_time: string) => {
    const date = new Date(`${start_date}T${start_time}`);
    return format(date, "MMMM d - h:mm a");
};

const TruncatedText = ({ text, limit }: { text: string; limit: number }) => {
    const truncated = text?.length > limit ? `${text.substring(0, limit)}...` : text;
    return truncated;
};

function WebinarCard({ content }: WebinarCardProps) {

   return (
      <Link prefetch={false} href={`${links.exploreWebinars}/${content.slug}`} className="web-card">
         <div className="web-card__image--container">
            <PreviewImage
               src={`${process.env.NEXT_PUBLIC_IMAGE_URL}/${content.logo}`}
               height={250}
               width={250}
               alt={content.title}
               blurDataURL={content.previewImage}
            />
            <p className="web-card__author">{`By ${content.f_name}`}</p>
         </div>
         <div className="web-card__content--container">
            <div className="web-card__badge--container">
               <p className="web-card__badge">Webinar</p>
               <p className="web-card__date">{formatDateAndTime(content?.start_date, content?.start_time)}</p>
            </div>

            <p className="web-card__title">{content.title}</p>
            <p className="web-card__subtitle"><TruncatedText text={content?.agenda} limit={40} /></p>
            <p className="web-card__seats">{content.no_of_seats} Seats Available</p>
         </div>
      </Link>
   );
}

export default WebinarCard;
