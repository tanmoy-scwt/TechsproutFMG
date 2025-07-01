import Link from "next/link";
import "./style.css";
import { links } from "@/lib/constants";
import { ClientFetch } from "@/actions/client-fetch";
import HTMLRenderer from "@/components/html-renderer";
import { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
   const res = await ClientFetch(`${process.env.API_URL}/seo-details/listYourCourse`, { cache: "no-store" });
   const metadata = await res.json();

   return {
      title: metadata?.data?.mete_title,
      description: metadata?.data?.meta_description,
      keywords: metadata?.data?.meta_keyword,
   };
}

async function ListYourCoursesPage() {
   const url = `${process.env.API_URL}/list-your-courses`;
   const res = await ClientFetch(url, { cache: "no-store" });
   const listCourse = await res.json();

   const content = {
      introVideoUrl: listCourse?.data?.url,
      title: listCourse?.data?.title,
      //   highlights: [
      //      "Register your profile and list your courses.",
      //      "Get global visibility.",
      //      "Receive leads and enquiries.",
      //      "Convert leads into opportunities.",
      //      "Teach online/offline and keep 100% earnings.",
      //   ],
      description: listCourse?.data?.content,
   };

   return (
      <main>
         <section className="lyc__section section container">
            <div className="lyc__iframe--container">
               {/* <iframe
                  width="100%"
                  height="100%"
                  src={content.introVideoUrl}
                  title="List your courses on Find My Guru video guide"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                  className="iframe"
               ></iframe> */}
               <div dangerouslySetInnerHTML={{ __html: content.introVideoUrl }} />
            </div>
            <div className="lyc__content--container">
               <h1 className="h2">{content.title}</h1>
               {/* <ul className="tick-list">
                  {content.highlights.map((highlight, index) => (
                     <li key={index}>{highlight}</li>
                  ))}
               </ul> */}
               <div>
                  <HTMLRenderer htmlString={content.description} showBefore={false} />
               </div>
               <Link prefetch={false} href={links.signUp} className="button__primary lyc__link">
                  Register Now
               </Link>
            </div>
         </section>
      </main>
   );
}

export default ListYourCoursesPage;
