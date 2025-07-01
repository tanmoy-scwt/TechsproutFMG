import TitleSection from "@/components/title-section";
import { FaqToggleSection, FaqQuestionsSection } from "./_components";
import { ClientFetch } from "@/actions/client-fetch";
import { Metadata } from "next";


export async function generateMetadata(): Promise<Metadata> {
    const res = await ClientFetch(`${process.env.API_URL}/seo-details/faq`, { cache: "no-store" });
    const metadata = await res.json();

    return {
       title: metadata?.data?.mete_title,
       description: metadata?.data?.meta_description,
       keywords: metadata?.data?.meta_keyword,
    };
 }

async function FaqPage({ searchParams }: any) {

    const { type } = searchParams;

    let url = `${process.env.API_URL}/faqs`;

    const params = new URLSearchParams();
    if (type){
        params.append("type", type);
    }else{
        params.append("type", "student");
    }
    url += `?${params.toString()}`;

    const res = await ClientFetch(url, { cache: "no-store" });
    const faqList = await res.json();

   const QuestionAnswers = faqList?.data;

   return (
      <main>
         <TitleSection title="FAQ" description="For students / Tutors & institutes" />
         <FaqToggleSection />
         <FaqQuestionsSection items={QuestionAnswers} />
      </main>
   );
}

export default FaqPage;
