import "./style.css";
import DOMPurify from "isomorphic-dompurify";

interface HTMLRendererProps {
   htmlString: string;
   className?: string;
   showBefore?: boolean;
}

function HTMLRenderer({ htmlString, className = "", showBefore = true }: HTMLRendererProps) {
   const clean = DOMPurify.sanitize(htmlString, { USE_PROFILES: { html: true } });

   return (
      <div
         dangerouslySetInnerHTML={{
            __html: clean,
         }}
         className={`${showBefore ? "html-renderer__before" : ""} ${className}`}
         id="html-renderer"
      />
   );
}

export default HTMLRenderer;
