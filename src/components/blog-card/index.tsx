import "./style.css";

import Image from "next/image";
import PreviewImage from "@/components/preview-image";
import Link from "next/link";
import { links } from "@/lib/constants";
import { format } from "date-fns";

export interface BolgCardContent {
   slug: string;
   id: number | string;
   title: string;
   short_content: string;
   picture: string;
   previewImage?: string;
   created_at: string;
   no_of_comments: number;
}
interface BlogCardProps {
   content: BolgCardContent;
}
function BlogCard({ content }: BlogCardProps) {
    const blogDate =
    content.created_at
    ? format(new Date(content.created_at.replace(' ', 'T')), 'dd MMM yy')
    : '';

   return (
      <Link prefetch={false} href={`${links.blog}/${content.slug}`} className="blog-card">
         <PreviewImage
            src={`${process.env.NEXT_PUBLIC_IMAGE_URL}/${content.picture}`}
            blurDataURL={content.previewImage}
            alt={content.title}
            width={225}
            height={169.17}
            className="blog-card__img"
         />

         <div className="blog-card__content">
            <div className="blog-card__title--container">
               <h3 className="blog-card__title">{content.title}</h3>
               <p className="blog-card__description">{content.short_content}</p>
            </div>
            <div className="blog-card__bottom--container">
               <div className="blog-card__bottom-item">
                  <Image src="/img/icons/calender.svg" alt="Blog updated date" width={17} height={17} />
                  <p>{blogDate}</p>
               </div>
               {/* <div className="blog-card__bottom-item">
                  <Image src="/img/icons/comments.svg" alt="Blog updated date" width={17} height={17} />
                  <p>{content.no_of_comments}</p>
               </div> */}
            </div>
         </div>
      </Link>
   );
}

export default BlogCard;
