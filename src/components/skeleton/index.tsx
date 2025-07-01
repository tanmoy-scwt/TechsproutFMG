import { CSSProperties } from "react";
import "./style.css";

interface SkeletonProps extends Partial<Pick<CSSProperties, "height" | "width">> {
   className?: string;
}
function Skeleton({ width = "100%", height = "10px", className = "" }: SkeletonProps) {
   return <span className={`skeleton-box ${className}`} style={{ width, height }}></span>;
}

export default Skeleton;
