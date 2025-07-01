import "./style.css";
import Image from "next/image";
import Link from "next/link";

export interface CategoriesCardContent {
   category_logo: string;
   name: string;
   link?: string;
}

interface CategoriesCardProps {
   content: CategoriesCardContent;
}

function CategoriesCard({ content }: CategoriesCardProps) {
   return (
      <div className="categories-card">
         <Image
            src={`${process.env.NEXT_PUBLIC_IMAGE_URL}/${content.category_logo}`}
            height={65}
            width={80}
            alt={content.name + " Category Icon"}
         />
         <p>{content.name}</p>
      </div>
   );
}

export default CategoriesCard;
