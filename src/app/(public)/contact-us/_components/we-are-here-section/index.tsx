import Image from "next/image";
import "./style.css";

interface WeAreHereSectionProps {
   content: {
      phone: string;
      phoneSupportTime: string;
      phone_title: string;
      email: string;
      emailSupportTime: string;
      email_title: string;
      subtitle: string;
      socials: Array<{
         icon: string;
         link: string;
         alt: string;
      }>;
   };
}

function WeAreHereSection({ content }: WeAreHereSectionProps) {
   return (
      <section>
         <div className="container cwah__container">
            <h2 className="subtitle">{content.subtitle}</h2>
            <div className="cwah__items">
               <div className="cwah__item">
                  <p className="cwah__item--title">{content.phone_title}</p>
                  <a href={`tel:${content.phone}`} rel="noreferrer" target="_blank" className="cwah__item--content">
                     {content.phone}
                  </a>
                  <p className="cwah__item--hours">Assistance hours: {content.phoneSupportTime || "24*7"}</p>
               </div>
               <div className="cwah__item">
                  <p className="cwah__item--title">{content.email_title}</p>
                  <a href={`mailto:${content.email}`} rel="noreferrer" target="_blank" className="cwah__item--content">
                     {content.email}
                  </a>
                  <p className="cwah__item--hours">Assistance hours: {content.emailSupportTime || "24*7"}</p>
               </div>
            </div>
            <ul className="cwah__socials--container">
               {content.socials.map((item, index) => (
                  <li key={index}>
                     <a href={item.link} rel="noreferrer" target="_blank">
                        <Image src={item.icon} width={20} height={20} alt={item.alt} />
                     </a>
                  </li>
               ))}
            </ul>
         </div>
      </section>
   );
}

export default WeAreHereSection;
