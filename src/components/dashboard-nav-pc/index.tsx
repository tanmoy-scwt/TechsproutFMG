"use client";
import "./style.css";
import { useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import useWindowDimension from "@/hooks/use-window-dimension";
import Skeleton from "@/components/skeleton";
import ArrowRight from "@/icons/ArrowRight";
import { Button } from "../ui/button";
import { SignOutAction } from "@/actions/sign-out";
import { NavLink } from "@/types";

interface DashboardNavPCProps {
   className?: string;
   links: Array<NavLink>;
}

function DashboardNavPC({ className = "", links }: DashboardNavPCProps) {
   const { width } = useWindowDimension();
   const path = usePathname();

   if (!width) {
      return (
         <div className="sidenav-pc">
            <div className="sidenav-pc__links sidenav-pc__skeleton--container">
               {links?.map((link) => (
                  <Skeleton key={link.id} height={47} className="sidenav-pc__link" />
               ))}
            </div>
         </div>
      );
   }

   if (width < 848) return null;

   return (
      <nav aria-label="Dashboard" className={`sidenav-pc ${className}`} aria-hidden={width < 848}>
         <ul className="sidenav-pc__links">
            {links?.map((item) =>
               item.subMenus ? (
                  <MenuWithSubMenus key={item.id} menu={item} path={path} />
               ) : (
                  <li key={item.id} className={`sidenav-pc__link ${item.link === path ? "active" : ""}`}>
                     <Link href={item.link}>
                        {item.icon && (
                           <>
                              {typeof item.icon === "string" ? (
                                 <Image src={item.icon} alt={`${item.title} icon`} width={22} height={22} />
                              ) : (
                                 item.icon
                              )}
                           </>
                        )}
                        {item.title}
                     </Link>
                  </li>
               )
            )}
            <Button
               type="button"
               variant="destructive"
               onClick={async () => {
                  await SignOutAction();
               }}
            >
               Logout
            </Button>
         </ul>
      </nav>
   );
}

export default DashboardNavPC;

const MenuWithSubMenus = ({ menu, path }: { menu: NavLink; path: string }) => {
   const isActive = useMemo(() => {
      return (menu.subMenus?.findIndex((m) => m.link === path) as number) >= 0;
   }, [path, menu.subMenus]);

   const [showSubMenu, setShowSubMenu] = useState(isActive);

   useEffect(() => {
      setShowSubMenu(isActive);
   }, [isActive, setShowSubMenu]);

   return (
      <li key={menu.id} className={`sidenav-pc__link`}>
         <span
            className={`sidenav-pc__submenu ${showSubMenu || isActive ? "open" : ""}`}
            onClick={() => setShowSubMenu((prev) => !prev)}
         >
            {menu.icon && (
               <>
                  {typeof menu.icon === "string" ? (
                     <Image src={menu.icon} alt={`${menu.title} icon`} width={22} height={22} />
                  ) : (
                     menu.icon
                  )}
               </>
            )}
            {menu.title}
            <ArrowRight className={`sidenav-pc__submenu--arrow ${showSubMenu ? "active" : ""}`} size={16} />
         </span>
         {showSubMenu && (
            <ul className="sidenav-pc__submenu--links">
               {menu.subMenus?.map((item) => (
                  <li key={item.id} className={`sidenav-pc__link ${item.link === path ? "active" : ""}`}>
                     <Link href={item.link}>
                        {item.icon && (
                           <>
                              {typeof item.icon === "string" ? (
                                 <Image src={item.icon} alt={`${item.title} icon`} width={22} height={22} />
                              ) : (
                                 item.icon
                              )}
                           </>
                        )}
                        {item.title}
                     </Link>
                  </li>
               ))}
            </ul>
         )}
      </li>
   );
};
