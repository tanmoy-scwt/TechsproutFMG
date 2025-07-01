"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ServerFetch } from "@/actions/server-fetch";
import { getSession } from "next-auth/react";
import { ErrorToast, SuccessToast } from "@/lib/toast";
import PreviewImage from "@/components/preview-image";
import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuGroup,
   DropdownMenuItem,
   DropdownMenuLabel,
   DropdownMenuSeparator,
   DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Edit, MoreHorizontal, TrashIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { revalidateByTag } from "@/actions/revalidate-by-tag";

export type CoursesListingTableData = Array<{
   sl: number;
   id: number | string;
   title: string;
   category: string;
   skills: Array<string>;
   image: string;
   previewImage?: string;
   status: "Pending" | "Approved" | "Rejected";
}>;

interface CoursesListingTableProps {
   data: CoursesListingTableData;
}

function CoursesListingTable({ data }: CoursesListingTableProps) {
   const statusClass = {
      Approved: "text-green-500",
      Rejected: "text-red-500",
      Pending: "text-orange-500",
   };

   const router = useRouter();
   const deleteCourseList = async (deleteId: string | number) => {
      const session = await getSession();
      const response = await ServerFetch("/course/" + (deleteId ? `delete/${deleteId}` : `delete`), {
         method: "GET",
         headers: {
            Authorization: `Bearer ${session?.user.token}`,
         },
         cache: "no-store",
      });
      console.log("response", response);
      if (response.status === true) {
         SuccessToast("Course Deleted Successfully");
         revalidateByTag("userCoursesListing");
      } else {
         ErrorToast("error");
      }
   };
   return (
      <Table className="overflow-auto w-full">
         <TableHeader className="bg-[#E9EFF4]">
            <TableRow>
               <TableHead className="w-[100px] whitespace-nowrap">Sl. No.</TableHead>
               <TableHead>Title</TableHead>
               <TableHead>Category</TableHead>
               <TableHead>Skills</TableHead>
               <TableHead className="text-center">Image</TableHead>
               <TableHead>Status</TableHead>
               <TableHead className="text-center">Action</TableHead>
            </TableRow>
         </TableHeader>
         <TableBody>
            {data?.length === 0 ? (
               <TableRow>
                  <TableCell className="whitespace-nowrap text-center pt-8" colSpan={7}>
                     No Data Found
                  </TableCell>
               </TableRow>
            ) : (
               data?.map((item) => (
                  <TableRow key={item.sl}>
                     <TableCell className="whitespace-nowrap">{item.sl}</TableCell>
                     <TableCell>{item.title}</TableCell>
                     <TableCell>{item.category}</TableCell>
                     <TableCell>{item.skills ? item.skills.join(", ") : "-"}</TableCell>
                     <TableCell className="flex justify-center items-center">
                        <PreviewImage
                           src={`${process.env.NEXT_PUBLIC_IMAGE_URL}/${item.image}`}
                           width={30}
                           height={30}
                           alt={`${item.title} Thumbnail`}
                           className="w-[30px] h-[30px] object-cover"
                           blurDataURL=""
                        />
                     </TableCell>
                     <TableCell className={`font-semibold ${statusClass[item.status]}`}>{item.status}</TableCell>
                     <TableCell className="flex justify-center items-center">
                        <DropdownMenu>
                           <DropdownMenuTrigger asChild className="cursor-pointer">
                              <MoreHorizontal stroke="#212121" />
                           </DropdownMenuTrigger>
                           <DropdownMenuContent className="w-56">
                              <DropdownMenuLabel>Options</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuGroup>
                                 <DropdownMenuItem
                                    className="cursor-pointer"
                                    onClick={() => {
                                       router.push("/dashboard/courses/edit/" + item.id);
                                    }}
                                 >
                                    <Edit stroke="#212121" />
                                    <span>Edit</span>
                                 </DropdownMenuItem>
                                 <DropdownMenuItem className="cursor-pointer" onClick={() => deleteCourseList(item.id)}>
                                    <TrashIcon stroke="#212121" />
                                    <span>Delete</span>
                                 </DropdownMenuItem>
                              </DropdownMenuGroup>
                           </DropdownMenuContent>
                        </DropdownMenu>
                     </TableCell>
                  </TableRow>
               ))
            )}
         </TableBody>
      </Table>
   );
}

export default CoursesListingTable;
