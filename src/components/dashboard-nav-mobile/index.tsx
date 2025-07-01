"use client";
import "./style.css";
import Image from "next/image";
import useWindowDimension from "@/hooks/use-window-dimension";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { NavLink } from "@/types";

interface DashboardNavMobileProps {
   className?: string;
   links: Array<NavLink & { type?: "Component" }>;
}

function DashboardNavMobile({ className = "", links }: DashboardNavMobileProps) {
   const { width } = useWindowDimension();
   const path = usePathname();

   if (!width || width >= 848) return null;

   return (
      <nav aria-label="Dashboard" className={`sidenav-mob ${className}`} aria-hidden={width >= 848}>
         <ul className="sidenav-mob__links">
            {links.map((item) => (
               <li key={item.id} className={`sidenav-mob__link ${item.link === path ? "active" : ""}`}>
                  <Link href={item.link}>
                     {item.icon &&
                        (typeof item.icon === "string" ? (
                           <Image src={item.icon} alt={item.title} width={22} height={22} />
                        ) : (
                           item.icon
                        ))}
                     {item.title}
                  </Link>
               </li>
            ))}
         </ul>
      </nav>
   );
}

export default DashboardNavMobile;
