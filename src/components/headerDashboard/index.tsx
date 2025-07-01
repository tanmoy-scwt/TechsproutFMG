"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { dashboardLinks as dl, links } from "@/lib/constants";
import { ChevronDown, LifeBuoy, Loader, LogOut, User, UserCircle2 } from "lucide-react";
import { getSession, useSession } from "next-auth/react";
import PreviewImage from "../preview-image";
import { SignOutAction } from "@/actions/sign-out";
import useWindowDimension from "@/hooks/use-window-dimension";
import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuGroup,
   DropdownMenuItem,
   DropdownMenuLabel,
   DropdownMenuSeparator,
   DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
const DashboardHeaderDropwdown = () => {
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
export default DashboardHeaderDropwdown;
