import { timeFromNow } from "@/lib/utils";
import "./style.css";
import PreviewImage from "@/components/preview-image";

export interface CommentCardContent {
   id: number | string;
   coverImage: string;
   previewCoverImage?: string;
   date: string;
   name: string;
   comment: string;
}

interface CommentCardProps {
   content: CommentCardContent;
}

function CommentCard({ content }: CommentCardProps) {
   // console.log();
   return (
      <div className="comment-card">
         <PreviewImage
            src={content.coverImage}
            alt={`${content.name} Profile Pic`}
            blurDataURL={content.previewCoverImage}
            width={50}
            height={50}
            className="comment-card__img"
         />

         <div className="comment-card__title--container">
            <p className="comment-card__title">{content.name}</p>
            <p className="comment-card__date">{timeFromNow(content.date)}</p>
         </div>
         <p className="comment-card__content">{content.comment}</p>
      </div>
   );
}

export default CommentCard;
