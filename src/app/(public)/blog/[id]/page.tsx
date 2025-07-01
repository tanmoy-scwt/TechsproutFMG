import "./style.css";
import HTMLRenderer from "@/components/html-renderer";
import CourseSliderSection from "@/components/courses-slider-section";
import { BlogDetailsCommentsSection, BlogDetailsTitleSection, RelatedBlogCard } from "./_components";
import { BlogDetailsTitleSectionContent } from "./_components/bd-title-section";
import { PopularCourseCardContent } from "@/components/popular-course-card";
import { RelatedBlogCardContent } from "./_components/related-blog-card";
import { ClientFetch } from "@/actions/client-fetch";
import { notFound } from "next/navigation";

interface BlogDetailsPageContent extends BlogDetailsTitleSectionContent {
   content: string;
   relatedCourses: Array<PopularCourseCardContent>;
   relatedBlogs: Array<RelatedBlogCardContent>;
   trendingBlogs: Array<RelatedBlogCardContent>;
}

async function BlogDetailsPage({ params }: { params: { id: string } }) {
   const { id } = params;

   const res = await ClientFetch(`${process.env.API_URL}/blog/details/${id}`, { cache: "no-store" });
   const blogDetails = await res.json();

   if (!blogDetails.status) {
        notFound();
    }

   const data: BlogDetailsPageContent = {
      title: blogDetails?.data?.title,
      coverImage: `${process.env.NEXT_PUBLIC_IMAGE_URL}/${blogDetails?.data?.picture}`,
      previewCoverImage: blogDetails?.data?.preview_logo,
      coverImageAlt: blogDetails?.data?.title,
      updatedDate: blogDetails?.data?.updated_at,
      content: blogDetails?.data?.full_content,
      relatedCourses: blogDetails?.data?.relatedCourses,
      trendingBlogs: blogDetails?.data?.trendingBlogs,
      relatedBlogs: blogDetails?.data?.relatedBlogs,
   };

   return (
      <main>
         <div className="container bd__container section">
            <article>
               <BlogDetailsTitleSection content={data} />
               <HTMLRenderer htmlString={data.content} showBefore={false} />
            </article>
            <aside className="bd__sidebar">
               {Array.isArray(data.trendingBlogs) && data.trendingBlogs.length > 0 && (
                  <div className="bd__siderbar--items">
                     <h2 className="bd__title">Trending Blogs</h2>
                     <div className="bd__siderbar--item">
                        {data.trendingBlogs.map((blog) => (
                           <RelatedBlogCard key={blog.id} content={blog} />
                        ))}
                     </div>
                  </div>
               )}
               {Array.isArray(data.relatedBlogs) && data.relatedBlogs.length > 0 && (
                  <div className="bd__siderbar--items">
                     <h2 className="bd__title">Related Blogs</h2>
                     <div className="bd__siderbar--item">
                        {data.relatedBlogs.map((blog) => (
                           <RelatedBlogCard key={blog.id} content={blog} />
                        ))}
                     </div>
                  </div>
               )}
            </aside>
         </div>
         {/* <div className="container">
            <CourseSliderSection
               sliderClassName="bd__slider"
               courses={data.relatedCourses}
               headingClass="bd__title"
               wrap={false}
            /> */}
            {/* <BlogDetailsCommentsSection postId={params.id} headingClass="bd__title" /> */}
         {/* </div> */}
      </main>
   );
}

export default BlogDetailsPage;
