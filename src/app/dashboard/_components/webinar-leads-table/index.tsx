"use client";

import { revalidateByTag } from "@/actions/revalidate-by-tag";
import { ServerFetch } from "@/actions/server-fetch";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { isValidDate } from "@/lib/utils";
import { format } from "date-fns";
import { Check, DownloadIcon, EyeIcon, MoreHorizontal, Pencil } from "lucide-react";
import moment from "moment";
import { getSession } from "next-auth/react";
import { useState } from "react";

export type WebinarLeadsTableData = Array<{
   id: number;
   sl: number;
   webinarTitle: string;
   studentName: string;
   email: string;
   phone: string;
   message: string;
   remarks?: string;
   enquiryDate: string;
}>;

interface WebinarLeadsTableProps {
   data: WebinarLeadsTableData;
}

const EditableCell = ({ item, updateRemarks }: { item: any; updateRemarks: (id: number, remarks: string) => void }) => {
   const [isEditing, setIsEditing] = useState(!item.remarks);
   const [remarks, setRemarks] = useState(item.remarks || "");

   const handleEdit = () => setIsEditing(true);

   const handleSave = () => {
      updateRemarks(item.id, remarks); // Call the update API
      setIsEditing(false);
   };

   return (
      <TableCell>
         {isEditing ? (
            <div className="flex items-center gap-2 bg-gray-100 border border-gray-200">
               <input
                  className="min-w-[100px] outline-none border-none py-3 ps-1"
                  placeholder="Write something"
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  onKeyDown={(e) => {
                     if (e.key === "Enter") {
                        e.preventDefault();
                        handleSave();
                     }
                  }}
               />
               <button
                  className="btn btn-primary"
                  onClick={handleSave}
                  disabled={!remarks.trim()} // Disable button if input is empty
               >
                  <Check />
               </button>
            </div>
         ) : (
            <div className="flex items-center gap-2  bg-gray-100 border border-gray-200">
               <input className=" min-w-[100px] outline-none border-none py-3 ps-1" value={remarks} readOnly />
               <button className="btn btn-secondary px-2" onClick={handleEdit}>
                  <Pencil size={16} />
               </button>
            </div>
         )}
      </TableCell>
   );
};

function WebinarLeadsTable({ data }: WebinarLeadsTableProps) {
   const updateRemarks = async (id: number, remarks: string) => {
      try {
         const session = await getSession();
         await ServerFetch("/user/webinar/lead/update-remarks", {
            headers: {
               "Content-Type": "application/json",
               Authorization: `Bearer ${session?.user.token}`,
            },
            body: JSON.stringify({
               webinar_lead_id: id,
               tutor_notes: remarks,
            }),
            method: "POST",
         });
         //revalidate the listing
         revalidateByTag("webinarLeadsListing");
      } catch (error) {
         console.error(error, "Error updating remarks");
      }
   };

   return (
      <Table className="overflow-auto w-full">
         <TableHeader className="bg-[#E9EFF4]">
            <TableRow>
               <TableHead className="whitespace-nowrap">Sl. No.</TableHead>
               <TableHead className="whitespace-nowrap">Enquiry Date</TableHead>
               <TableHead className="whitespace-nowrap">Webinar Title</TableHead>
               <TableHead className="whitespace-nowrap">Student Name</TableHead>
               <TableHead className="whitespace-nowrap">Student Details</TableHead>
               <TableHead>Message</TableHead>
               <TableHead>Remarks</TableHead>
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
                     <TableCell className="whitespace-nowrap">
                        {isValidDate(item.enquiryDate) ? moment(item.enquiryDate).format("LLL") : item.enquiryDate}
                     </TableCell>
                     <TableCell>{item.webinarTitle}</TableCell>
                     <TableCell className="whitespace-nowrap">{item.studentName}</TableCell>
                     <TableCell>
                        <span className="block">{item.email}</span>
                        <span className="block mt-1">{item.phone}</span>
                     </TableCell>
                     <TableCell>
                        <Popover>
                           <PopoverTrigger asChild>
                              <button className="flex items-center mx-auto gap-1 bg-primary hover:opacity-85 text-white transition-all duration-500 px-2 py-1 rounded-[4px] w-max">
                                 View <EyeIcon size={17} />
                              </button>
                           </PopoverTrigger>
                           <PopoverContent className="w-auto max-w-[250px] p-4" align="start">
                              <p className="label !text-slate-900">{item.message || "No message"}</p>
                           </PopoverContent>
                        </Popover>
                     </TableCell>
                     <EditableCell item={item} updateRemarks={updateRemarks} />

                     {/* <TableCell className="flex justify-center items-center">
                     <DropdownMenu>
                        <DropdownMenuTrigger asChild className="cursor-pointer">
                           <button className="h-[50px]">
                              <MoreHorizontal stroke="#212121" />
                           </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-56">
                           <DropdownMenuLabel>Invoice Options</DropdownMenuLabel>
                           <DropdownMenuSeparator />
                           <DropdownMenuGroup>
                              <DropdownMenuItem className="cursor-pointer">
                                 <DownloadIcon stroke="#212121" />
                                 <span>Download</span>
                              </DropdownMenuItem>
                           </DropdownMenuGroup>
                        </DropdownMenuContent>
                     </DropdownMenu>
                  </TableCell> */}
                  </TableRow>
               ))
            )}
         </TableBody>
      </Table>
   );
}

export default WebinarLeadsTable;
