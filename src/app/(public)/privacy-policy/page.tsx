import HTMLRenderer from "@/components/html-renderer";
import TitleSection from "@/components/title-section";
//import { privacyPolicycontent } from "./privacyPolicy";
import { ClientFetch } from "@/actions/client-fetch";
import { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
    const res = await ClientFetch(`${process.env.API_URL}/seo-details/privacyPolicy`, { cache: "no-store" });
    const metadata = await res.json();

    return {
       title: metadata?.data?.mete_title,
       description: metadata?.data?.meta_description,
       keywords: metadata?.data?.meta_keyword,
    };
 }

async function PrivacyPolicyPage() {
    const res = await ClientFetch(`${process.env.API_URL}/privacy-policy`, { cache: "no-store" });
   const privacyContent = await res.json();

   const content = privacyContent?.data?.description;

  return (
    <main>
      <TitleSection title="Privacy Policy" />
      <section className="html-renderer__section">
        <HTMLRenderer htmlString={content} className="container" />
      </section>
    </main>
  );
}

export default PrivacyPolicyPage;
