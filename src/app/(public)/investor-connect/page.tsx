import "./style.css";

import Image from "next/image";
import HTMLRenderer from "@/components/html-renderer";
import TitleSection from "@/components/title-section";
import { ClientFetch } from "@/actions/client-fetch";
import { Metadata } from "next";


export async function generateMetadata(): Promise<Metadata> {
    const res = await ClientFetch(`${process.env.API_URL}/seo-details/investorConnect`, { cache: "no-store" });
    const metadata = await res.json();

    return {
       title: metadata?.data?.mete_title,
       description: metadata?.data?.meta_description,
       keywords: metadata?.data?.meta_keyword,
    };
 }

async function AboutUsPage() {
    const res = await ClientFetch(`${process.env.API_URL}/investor-connect`, { cache: "no-store" });
   const investorContent = await res.json();

   const content = investorContent?.data?.content;

   return (
      <main>
         <TitleSection title={investorContent?.data?.title} />
         <section className="html-renderer__section container ic__section">
            <HTMLRenderer htmlString={content} showBefore={false} />
            <div className="ic__img--container">
               <Image
                  src="/img/investor-connect/investor-connect-demo.png"
                  width={350}
                  height={350}
                  alt="Investor Connect - Symbol of Growth"
                  className="ic__img"
               />
            </div>
         </section>
      </main>
   );
}

export default AboutUsPage;
