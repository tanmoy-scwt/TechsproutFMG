import "./style.css";

import PreviewImage from "@/components/preview-image";
import Link from "next/link";
import { links } from "@/lib/constants";

export interface RelatedBlogCardContent {
   id: number | string;
   title: string;
   picture: string;
   coverImageAlt: string;
   preview_logo?: string;
   slug?: string;
}

interface RelatedBlogCardProps {
   content: RelatedBlogCardContent;
}

function RelatedBlogCard({ content }: RelatedBlogCardProps) {
   return (
      <Link href={`${links.blog}/${content.slug}`} className="rb-card">
         <PreviewImage
            src={`${process.env.NEXT_PUBLIC_IMAGE_URL}/${content.picture}`}
            alt={content.coverImageAlt || content.title}
            blurDataURL={content.preview_logo}
            width={80}
            height={80}
            className="rb-card__img"
         />
         <p className="rb-card__title">{content.title}</p>
      </Link>
   );
}

export default RelatedBlogCard;
