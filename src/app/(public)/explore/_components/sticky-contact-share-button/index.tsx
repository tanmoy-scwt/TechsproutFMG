"use client";

import "./style.css";
import ShareButton from "@/components/share-button";

interface StickyContactShareButtonProps {
   shareTitle: string;
   children: string | React.ReactNode;
   fullContactButton?: boolean;
   sticky?: boolean;
   onClick?: () => void;
}

function StickyContactShareButton({
   shareTitle,
   fullContactButton,
   children,
   sticky = true,
   onClick,
}: StickyContactShareButtonProps) {
   return (
      <div className={`scs-button ${sticky ? "sticky" : ""}`}>
         <button onClick={onClick} className="button__primary" style={{ width: fullContactButton ? "100%" : "" }}>
            {children}
         </button>
         <ShareButton title={shareTitle} />
      </div>
   );
}

export default StickyContactShareButton;
