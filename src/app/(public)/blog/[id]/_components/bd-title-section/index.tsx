import "./style.css";
import PreviewImage from "@/components/preview-image";
import ShareButton from "@/components/share-button";
import { formatDate } from "@/lib/utils";

export interface BlogDetailsTitleSectionContent {
   title: string;
   coverImage: string;
   previewCoverImage: string;
   coverImageAlt: string;
   updatedDate: string;
}
interface BlogDetailsTitleSectionProps {
   content: BlogDetailsTitleSectionContent;
}

function BlogDetailsTitleSection({ content }: BlogDetailsTitleSectionProps) {
   return (
      <section className="bdts__section">
         <h1 className="bdts__title">{content.title}</h1>
         <div className="bdts__date--container">
            {content.updatedDate && <p className="ex-desc">{formatDate({ date: content.updatedDate })}</p>}
            <ShareButton title={content.title} size={38} />
         </div>
         <PreviewImage
            src={content.coverImage}
            width={977}
            height={550}
            alt={content.coverImageAlt || content.title}
            blurDataURL={content.previewCoverImage}
            loading="eager"
            className="bdts__img"
         />
      </section>
   );
}

export default BlogDetailsTitleSection;
