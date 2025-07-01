import HTMLRenderer from "@/components/html-renderer";
import TitleSection from "@/components/title-section";
//import { termsConditionsContent } from "./termsAndConditions";
import { ClientFetch } from "@/actions/client-fetch";
import { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
    const res = await ClientFetch(`${process.env.API_URL}/seo-details/termsAndConditions`, { cache: "no-store" });
    const metadata = await res.json();

    return {
       title: metadata?.data?.mete_title,
       description: metadata?.data?.meta_description,
       keywords: metadata?.data?.meta_keyword,
    };
 }

async function TermsAndConditionsPage() {
    const termsRes = await ClientFetch(`${process.env.API_URL}/terms-and-conditions`, { cache: "no-store" });
   const termsContent = await termsRes.json();

   const content = termsContent?.data?.content;

  return (
    <main>
      <TitleSection title={termsContent?.data?.title} />
      <section className="html-renderer__section">
        <HTMLRenderer
          htmlString={content}
          className="container"
        />
      </section>
    </main>
  );
}

export default TermsAndConditionsPage;
