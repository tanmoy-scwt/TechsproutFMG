import { ClientFetch } from "@/actions/client-fetch";
import HTMLRenderer from "@/components/html-renderer";
import TitleSection from "@/components/title-section";
import { Metadata } from "next";


export async function generateMetadata(): Promise<Metadata> {
    const res = await ClientFetch(`${process.env.API_URL}/seo-details/aboutUs`, { cache: "no-store" });
    const metadata = await res.json();

    return {
       title: metadata?.data?.mete_title,
       description: metadata?.data?.meta_description,
       keywords: metadata?.data?.meta_keyword,
    };
 }

async function AboutUsPage() {

    const res = await ClientFetch(`${process.env.API_URL}/about-us`, { cache: "no-store" });
   const aboutContent = await res.json();

   const content = aboutContent?.data?.description;

   return (
      <main>
         <TitleSection title={aboutContent?.data?.title} />
         <section className="html-renderer__section">
            <HTMLRenderer htmlString={content} className="container" />
         </section>
      </main>
   );
}

export default AboutUsPage;
