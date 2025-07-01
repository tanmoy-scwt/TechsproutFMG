import "./style.css";
import { HTMLAttributes, ReactNode } from "react";

interface ListingsContainerProps extends HTMLAttributes<HTMLDivElement> {
   className?: string;
   children: ReactNode;
}

function ListingsContainer({ className = "", children, ...props }: ListingsContainerProps) {
   return (
      <div className={`listings-container ${className}`} {...props}>
         {children}
      </div>
   );
}

export default ListingsContainer;
