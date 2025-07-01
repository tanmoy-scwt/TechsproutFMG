import { links } from "@/lib/constants";
import "./style.css";
import Image from "next/image";
import Link from "next/link";
import PreviewImage from "../preview-image";

type ClassMethodTypes = "Online" | "Offline" | "Both";

export interface PopularCourseCardContent {
  id: number;
  category_name: string;
  course_logo: string;
  previewImage?: string;
  average_rating: number;
  course_name: string;
  duration_value: number;
  duration_unit: string;
  experience: number;
  f_name: string;
  teaching_mode?: ClassMethodTypes;
  slug: string;
}

interface PopularCourseCardProps {
  content: PopularCourseCardContent;
}

function PopularCourseCard({ content }: PopularCourseCardProps) {
  return (
    <Link
      prefetch={false}
      href={`${links.exploreCourses}/${content.slug}`}
      className="pc-card"
    >
      <div className="pc-card__top--container">
        <PreviewImage
          src={`${process.env.NEXT_PUBLIC_IMAGE_URL}/${content.course_logo}`}
          height={201}
          width={276}
          alt={content.course_name}
          blurDataURL={content.previewImage}
          loading="lazy"
        />
        <p className="pc-card__top--item pc-card__badge">
          {content.category_name}
        </p>
        {content.average_rating && (
          <p className="pc-card__top--item pc-card__ratings">
            <Image
              src="/img/icons/star.svg"
              height={15}
              width={15}
              alt={`${content.average_rating} Stars Rating`}
            />
            {content.average_rating}
          </p>
        )}
        <p className="pc-card__top--item pc-card__method">
          {content.teaching_mode === "Both"
            ? "Online/Offline"
            : content.teaching_mode}
        </p>
      </div>
      <div className="pc-card__bottom--container">
        <p className="pc-card__title">
          {content.course_name.length > 26
            ? content.course_name.slice(0, 26) + "..."
            : content.course_name}
        </p>

        <p className="pc-card__time">
          <Image
            src="/img/icons/time.svg"
            height={15}
            width={15}
            alt="Course Duration"
          />
          {` Duration: ${content.duration_value} ${content.duration_unit}`}
        </p>

        <div className="pc-card__author--container">
          <p className="pc-card__author">By {content.f_name}</p>
          <div className="button__primary-light">Details</div>
        </div>
      </div>
    </Link>
  );
}

export default PopularCourseCard;
