import { Metadata } from "next";
import { BlogSearchSection, BlogListingsSection } from "./_components";
import { ClientFetch } from "@/actions/client-fetch";


export async function generateMetadata(): Promise<Metadata> {
    const res = await ClientFetch(`${process.env.API_URL}/seo-details/blogListing`, { cache: "no-store" });
    const metadata = await res.json();

    return {
       title: metadata?.data?.mete_title,
       description: metadata?.data?.meta_description,
       keywords: metadata?.data?.meta_keyword,
    };
 }

async function BlogPage({searchParams}: any) {
    const { page, query, category } = searchParams;

    let url = `${process.env.API_URL}/blog/listing`;
    const params = new URLSearchParams();
    if (page) params.append("page", page);
    if (query) params.append("searchKey", query);
    if (category) params.append("category", category);
    url += `?${params.toString()}`;

    const res = await ClientFetch(url, { cache: "no-store" });
    const blogList = await res.json();

    const blogs = blogList?.data?.data;
    const categories = blogList?.categories;
   const { total, per_page, current_page  } = blogList?.data;

   return (
      <main>
         <div className="container">
            <BlogSearchSection categories={categories} />
            <BlogListingsSection total={total} per_page={per_page} current_page={current_page} blogs={blogs} />
         </div>
      </main>
   );
}

export default BlogPage;
