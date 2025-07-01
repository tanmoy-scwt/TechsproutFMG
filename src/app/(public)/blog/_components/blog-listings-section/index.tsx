import DynamicPagination from "@/components/dynamic-pagination";
import "./style.css";
import BlogCard, { BolgCardContent } from "@/components/blog-card";

interface BlogListingsSectionProps {
   blogs: Array<BolgCardContent>;
   total: number;
   per_page: number;
   current_page: number;
}
function BlogListingsSection({ total, per_page, current_page, blogs }: BlogListingsSectionProps) {
   return (
      <section className="section">
         <div className="blog-listings__container">
            {blogs?.map((blog) => (
               <BlogCard content={blog} key={blog.id} />
            ))}
         </div>
         {total > per_page && (
            <section>
               <DynamicPagination total={total} perPage={per_page} currentPage={current_page} urlParamOnChange="page" />
            </section>
         )}
      </section>
   );
}

export default BlogListingsSection;
