import "./style.css";
import { HaveQuerySection, WeAreHereSection } from "./_components";
import TitleSection from "@/components/title-section";
import { ClientFetch } from "@/actions/client-fetch";
import { Metadata } from "next";


export async function generateMetadata(): Promise<Metadata> {
    const res = await ClientFetch(`${process.env.API_URL}/seo-details/contactUs`, { cache: "no-store" });
    const metadata = await res.json();

    return {
       title: metadata?.data?.mete_title,
       description: metadata?.data?.meta_description,
       keywords: metadata?.data?.meta_keyword,
    };
 }

async function ContactUsPage() {

   const res = await ClientFetch(`${process.env.API_URL}/contact-us`, { cache: "no-store" });
   const contactInfo = await res.json();

   const content = {
      phone_title: contactInfo?.data?.subtitle_2,
      phone: contactInfo?.data?.phone,
      phoneSupportTime: contactInfo?.data?.phoneSupportTime,
      email_title: contactInfo?.data?.subtitle_3,
      email: contactInfo?.data?.email,
      emailSupportTime: contactInfo?.data?.emailSupportTime,
      subtitle: contactInfo?.data?.subtitle_1,
      //maps: contactInfo?.data?.image,
      socials: [
         {
            icon: "/img/icons/facebook.svg",
            link: contactInfo?.data?.facebook_url,
            alt: "connect with us on facebook",
         },
         {
            icon: "/img/icons/instagram.svg",
            link: contactInfo?.data?.insta_url,
            alt: "connect with us on instagram",
         },
         {
            icon: "/img/icons/linkedin.svg",
            link: contactInfo?.data?.linkedin_url,
            alt: "connect with us on linkedin",
         },
         {
            icon: "/img/icons/x.svg",
            link: contactInfo?.data?.twitter_url,
            alt: "connect with us on X",
         },
         {
            icon: "/img/icons/youtube.svg",
            link: contactInfo?.data?.youtube_url,
            alt: "connect with us on youtube",
         },
      ],
   };

   return (
      <main className="contact-us__main">
         <TitleSection title={contactInfo?.data?.title} />
         <WeAreHereSection content={content} />
         <HaveQuerySection maps={contactInfo?.data?.image} />
      </main>
   );
}

export default ContactUsPage;
