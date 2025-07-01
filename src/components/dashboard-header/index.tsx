"use client";

import "./style.css";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { dashboardLinks as dl, links } from "@/lib/constants";
import { ChevronDown, LifeBuoy, Loader, LogOut, User, UserCircle2 } from "lucide-react";
import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuGroup,
   DropdownMenuItem,
   DropdownMenuLabel,
   DropdownMenuSeparator,
   DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getSession, useSession } from "next-auth/react";
import PreviewImage from "../preview-image";
import { NavLink } from "@/types";
import { SignOutAction } from "@/actions/sign-out";
import useWindowDimension from "@/hooks/use-window-dimension";

function DashboardHeader({ data: LINKS }: { data: Array<NavLink> }) {
   const [showMobNav, setShowMobNav] = useState(false);
   const path = usePathname();
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

   return (
      <header id="dash-header" className="sticky">
         <nav className="container dash-nav" aria-label="Main">
            <Link prefetch={false} href={links.home} className="dash-nav__logo--container">
               <Image src="/img/common/logo.svg" alt="find my guru logo" width={150} height={58} priority />
            </Link>

            <ul className={`dash-nav__links ${showMobNav ? "show" : ""}`}>
               <li className="dash-nav__mob-icons close" aria-hidden={!showMobNav}>
                  <Image
                     src="/img/icons/close.svg"
                     height={30}
                     width={30}
                     alt="mobile nav close"
                     onClick={handleMobNavToggle}
                  />
               </li>
               {LINKS.map((link) => (
                  <li key={link.id} className="dash-nav__link">
                     <Link prefetch={false} href={link.link}>
                        {link.icon && (
                           <>
                              {typeof link.icon === "string" ? (
                                 <Image src={link.icon} alt={`${link.title} icon`} width={20} height={20} />
                              ) : (
                                 link.icon
                              )}
                           </>
                        )}
                        {link.title}
                     </Link>
                  </li>
               ))}
            </ul>
            <div className="flex items-center gap-2">
               <div className="dash-nav__mob-icons open" onClick={handleMobNavToggle}>
                  <Image src="/img/common/mob-nav.svg" height={30} width={30} alt="mobile nav open" />
               </div>
               <DashboardHeaderProfilePicDropwdown />
            </div>
         </nav>
      </header>
   );
}

export default DashboardHeader;

const DashboardHeaderProfilePicDropwdown = () => {
   const { data: session } = useSession();
   const { width } = useWindowDimension();
   const [loggingOut, setLoggingOut] = useState(false);

   useEffect(() => {
      if (!session) {
         getSession();
      }
   }, []);

   const handleLogout = async () => {
      try {
         setLoggingOut(true);
         await SignOutAction();
      } catch (error) {
         setLoggingOut(false);
      }
   };

   return (
      <DropdownMenu>
         <DropdownMenuTrigger className="flex items-center gap-[2px]">
            {session?.user.profilePicture ? (
               <PreviewImage
                  src={`${process.env.NEXT_PUBLIC_IMAGE_URL}/${session.user.profilePicture}`}
                  alt="Profile Image"
                  width={30}
                  height={30}
                  className="rounded-full w-[30px] md:max-w-[35px] aspect-square object-cover"
               />
            ) : (
               <UserCircle2 size={30} className="rounded-full w-[30px] md:max-w-[35px] aspect-square" />
            )}
            {width && width >= 848 && (
               <span className="label whitespace-nowrap text-ellipsis max-w-[100px] overflow-hidden">
                  {session?.user.fullName}
               </span>
            )}
            <ChevronDown size={24} className="!min-w-[20px]" />
         </DropdownMenuTrigger>
         <DropdownMenuContent className="w-56">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
               <DropdownMenuItem asChild>
                  <Link href={dl.dashboard}>
                     <User />
                     <span>Dashboard</span>
                  </Link>
               </DropdownMenuItem>
               <DropdownMenuItem asChild>
                  <Link href={dl.profile}>
                     <User />
                     <span>Profile</span>
                  </Link>
               </DropdownMenuItem>

               {/* <DropdownMenuItem>
                  <LifeBuoy />
                  <span>Support</span>
               </DropdownMenuItem> */}

               <DropdownMenuItem
                  onSelect={async (e) => {
                     e.preventDefault();
                     await handleLogout();
                  }}
                  disabled={loggingOut}
               >
                  <LogOut />
                  <span>Log out</span>
                  {loggingOut && <Loader className="animate-spin duration-2000" size={10} />}
               </DropdownMenuItem>

               {/* <DropdownMenuSub>
                  <DropdownMenuSubTrigger>
                     <UserPlus />
                     <span>Invite users</span>
                  </DropdownMenuSubTrigger>
                  <DropdownMenuPortal>
                     <DropdownMenuSubContent>
                        <DropdownMenuItem>
                           <Mail />
                           <span>Email</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                           <MessageSquare />
                           <span>Message</span>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                           <PlusCircle />
                           <span>More...</span>
                        </DropdownMenuItem>
                     </DropdownMenuSubContent>
                  </DropdownMenuPortal>
               </DropdownMenuSub> */}
            </DropdownMenuGroup>
         </DropdownMenuContent>
      </DropdownMenu>
   );
};
