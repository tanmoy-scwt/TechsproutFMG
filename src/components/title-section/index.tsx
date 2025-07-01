interface TitleSectionProps {
   title: string;
   description?: string;
   titleClassName?: string;
   descriptionClassName?: string;
}

function TitleSection({ title, description, titleClassName = "", descriptionClassName = "" }: TitleSectionProps) {
   return (
      <section className="page-heading__container">
         <div className="container">
            <h1 className={`title text-center ${titleClassName}`}>{title}</h1>
            {description && <p className={`ex-desc text-center ${descriptionClassName}`}>{description}</p>}
         </div>
      </section>
   );
}

export default TitleSection;
