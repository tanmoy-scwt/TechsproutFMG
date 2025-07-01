"use client";

import "./style.css";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Session } from "next-auth";
import { getSession } from "next-auth/react";
import { links } from "@/lib/constants";
import DashboardHeaderDropwdown from "@/components/headerDashboard";

interface headerDataType {
   id: number;
   title: string;
   url_link: string;
}

interface headerProps {
   data: {
      data: headerDataType[];
      header_logo: string;
   };
}

function Header({ data }: headerProps) {
   const [show, setShow] = useState<string | null>(null);
   const [showMobNav, setShowMobNav] = useState(false);
   const path = usePathname();
   const NavLinksPC = [
      {
         id: 9,
         link: "#",
         title: "Purchase History",
         icon: "/img/dashboard/purchase-history.svg",
      },
   ];

   const LINKS = data;

   const handleMobNavToggle = () => {
      if (window.innerWidth >= 848) {
         return;
      }
      //!showMobNav because it will be true as we are setting the state for it below
      if (!showMobNav) {
         document.body.classList.add("overflow-hidden");
      } else {
         document.body.classList.remove("overflow-hidden");
      }
      setShowMobNav((prev) => !prev);
   };

   useEffect(() => {
      const handleScreenResize = () => {
         //848px is the media query min width in header css file
         if (window.innerWidth >= 848) {
            setShowMobNav(false);
            document.body.classList.remove("overflow-hidden");
         }
      };

      window.addEventListener("resize", handleScreenResize);

      return () => {
         window.removeEventListener("resize", handleScreenResize);
      };
   }, []);

   useEffect(() => {
      setShowMobNav(false);
      document.body.classList.remove("overflow-hidden");
   }, [path]);

   const getSess = async () => {
      const session = await getSession();
      if (session === null) {
         setShow(null);
      } else {
         setShow(session.user?.name ?? "");
      }
   };

   getSess();

   return (
      <>
         <header id="header" className="sticky">
            <nav className="container nav" aria-label="Main">
               <Link prefetch={false} href={links.home} className="nav__logo--container">
                  <Image
                     src={`${process.env.NEXT_PUBLIC_IMAGE_URL}/${data?.header_logo}`}
                     alt="find my guru logo"
                     width={150}
                     height={58}
                     priority
                  />
               </Link>
               <ul className={`nav__links ${showMobNav ? "show" : ""}`}>
                  <li className="nav__mob-icons close" aria-hidden={!showMobNav}>
                     {showMobNav && (
                        <Image
                           src="/img/icons/close.svg"
                           height={43}
                           width={43}
                           alt="mobile nav close"
                           onClick={handleMobNavToggle}
                        />
                     )}
                  </li>
                  {LINKS?.data?.map((link: any) => (
                     <li key={link.id} className="nav__link">
                        <Link prefetch={false} href={link.url_link}>
                           {link.title}
                        </Link>
                     </li>
                  ))}
                  {show === null ? (
                     <li className="nav__sign-in">
                        <Link prefetch={false} href={links.signIn} className="button__transparent">
                           Sign In
                        </Link>
                     </li>
                  ) : (
                     <DashboardHeaderDropwdown />
                  )}
               </ul>
               <div className="nav__mob-icons open" onClick={handleMobNavToggle}>
                  <Image src="/img/common/mob-nav.svg" height={35} width={35} alt="mobile nav open" />
               </div>
            </nav>
         </header>
      </>
   );
}

export default Header;
