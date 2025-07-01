import { links } from "@/lib/constants";
import "./style.css";
import Image from "next/image";
import Link from "next/link";
import HTMLRenderer from "../html-renderer";

interface footerDataType {
    facebook_url: string;
    instagram_url: string;
    linkedin_url: string;
    twitter_url: string;
    youtube_url: string;
    footer_quick_links: string;
    footer_category: string;
    footer_support: string;
    footer_disclaimer: string;
    footer_copy_right: string;
    footer_logo: string;
 }

 interface footerProps {
    data: footerDataType;
 }

function Footer({ data }: footerProps) {
   const content = {
      socials: [
         {
            icon: "/img/icons/facebook.svg",
            link: data?.facebook_url,
            alt: "connect with us on facebook",
         },
         {
            icon: "/img/icons/instagram.svg",
            link: data?.instagram_url,
            alt: "connect with us on instagram",
         },
         {
            icon: "/img/icons/linkedin.svg",
            link: data?.linkedin_url,
            alt: "connect with us on linkedin",
         },
         {
            icon: "/img/icons/x.svg",
            link: data?.twitter_url,
            alt: "connect with us on X",
         },
         {
            icon: "/img/icons/youtube.svg",
            link: data?.youtube_url,
            alt: "connect with us on youtube",
         },
      ],
    //   quickLinks: [
    //      { title: "Home", link: links.home },
    //      { title: "About Us", link: links.aboutUs },
    //      { title: "Contact Us", link: links.contactUs },
    //   ],
    //   topCategories: [
    //      { title: "Terms & Conditions", link: links.termsAndConditions },
    //      { title: "Privacy Policy", link: links.privacyPolicy },
    //   ],
    //   support: [
    //      { title: "FAQs for Students", link: links.faq },
    //      { title: "FAQs for Trainers / Institutes", link: links.faq },
    //      { title: "Investor Connect", link: "/investor-connect" },
    //      { title: "Interview Questions", link: "#" },
    //   ],
    //   disclaimer:
    //      "All the course names, logos, and certification titles we use are their respective owners' property. The firm, service, or product names on the website are solely for identification purposes. We do not own, endorse or have the copyright of any brand/logo/name in any manner. Few graphics on our website are freely available on public domains.",
    //   copyrightText: "©️ 2024 Findmyguru.com . All Rights Reserved. A Brand of TutorKhoj Private Limited",
   };


    let footerSupport;
    try {
      footerSupport = JSON.parse(data?.footer_support);
    } catch (error) {
      footerSupport = [];
    }

    let footerCategory;
    try {
        footerCategory = JSON.parse(data?.footer_category);
    } catch (error) {
        footerCategory = [];
    }

    let footerQuickLinks;
    try {
        footerQuickLinks = JSON.parse(data?.footer_quick_links);
    } catch (error) {
        footerQuickLinks = [];
    }




   return (
      <footer id="footer">
         <div className="container footer__container">
            <div className="footer__items--container">
               <div className="footer__logo-social--container">
                  <div className="footer__logo--container">
                     <Image src={`${process.env.NEXT_PUBLIC_IMAGE_URL}/${data?.footer_logo}`} width={150} height={60} alt="Font My Guru logo" />
                  </div>

                  <ul className="footer__socials--container">
                     {content.socials.map((item, index) => (
                        <li key={index}>
                           <a href={item.link} rel="noreferrer" target="_blank" className="footer__text link">
                              <Image src={item.icon} width={20} height={20} alt={item.alt} />
                           </a>
                        </li>
                     ))}
                  </ul>
               </div>
               {Array.isArray(footerQuickLinks) && footerQuickLinks.length > 0 &&
               <div>
                  <p className="footer__title">Quick Links</p>
                  <ul className="footer__links">
                     {footerQuickLinks.map((item, index) => (
                        <li key={index}>
                           <Link prefetch={false} href={item.url} className="footer__text link hover">
                              {item.title}
                           </Link>
                        </li>
                     ))}
                  </ul>
               </div>
               }
               {Array.isArray(footerCategory) && footerCategory.length > 0 &&
               <div>
                  <p className="footer__title">Top 4 Category</p>
                  <ul className="footer__links">
                     {footerCategory.map((item, index) => (
                        <li key={index}>
                           <Link prefetch={false} href={item.url} className="footer__text link hover">
                              {item.title}
                           </Link>
                        </li>
                     ))}
                  </ul>
               </div>
               }
               {Array.isArray(footerSupport) && footerSupport.length > 0 &&
               <div>
                  <p className="footer__title">Support</p>
                  <ul className="footer__links">
                     {footerSupport.map((item, index) => (
                        <li key={index}>
                           <Link prefetch={false} href={item.url} className="footer__text link hover">
                              {item.title}
                           </Link>
                        </li>
                     ))}
                  </ul>
               </div>
               }
            </div>

            <div className="footer__disclaimer--container">
                <HTMLRenderer htmlString={data?.footer_disclaimer} className="footer__disclaimer footer__text" />
            </div>

            <p className="footer__text footer__copyright">
               {data?.footer_copy_right}
            </p>
         </div>
      </footer>
   );
}

export default Footer;
