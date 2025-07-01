import "./style.css";
import { AddComment, InfiniteComments } from "../../_components";
import { Suspense } from "react";

interface BlogDetailsCommentsSectionProps {
   postId: string | number;
   headingClass?: string;
}
function BlogDetailsCommentsSection({ postId, headingClass }: BlogDetailsCommentsSectionProps) {
   return (
      <section className="section bdcs__section">
         <h2 className={`bdcs__title ${headingClass}`}>Comments</h2>
         <AddComment />
         <Suspense fallback={<p className="ex-desc">Loading...</p>}>
            <div className="bdcs__comments--container">
               <InfiniteComments postId={postId} />
            </div>
         </Suspense>
      </section>
   );
}

export default BlogDetailsCommentsSection;
