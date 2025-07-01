"use client";

import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { EyeIcon } from "lucide-react";
import moment from "moment";
import Modal from "@/components/modal";
import { format } from "date-fns";

export type CoinUsageTableData = {
   sl: number; // Serial number
   skills: string[]; // Array of skills
   enquiryDate: string; // Enquiry date in ISO format
   location: string; // Location of the enquiry
   studentId: number; // Student ID
   studentName: string; // Name of the student
   coinsUsed: number; // Number of coins used
   studentMessage: string | null; // Optional student message
}[];

interface CoinUsageTableProps {
   data: CoinUsageTableData; // Data for the table
}

function CoinUsageTable({ data }: CoinUsageTableProps) {
   const [selectedStudent, setSelectedStudent] = useState<CoinUsageTableData[number] | null>(null);
   const [isModalOpen, setIsModalOpen] = useState(false);

   const handleViewDetails = (student: CoinUsageTableData[number]) => {
      setSelectedStudent(student);
      setIsModalOpen(true);
   };

   const closeModal = () => {
      setSelectedStudent(null);
      setIsModalOpen(false);
   };
   console.log("");
   return (
      <div>
         <Table>
            <TableHeader className="bg-[#E9EFF4]">
               <TableRow>
                  <TableHead className="w-[100px] whitespace-nowrap">Sl. No.</TableHead>
                  <TableHead className="whitespace-nowrap">Name</TableHead>
                  <TableHead className="whitespace-nowrap">Skills</TableHead>
                  <TableHead className="whitespace-nowrap">Enquiry Date</TableHead>
                  <TableHead className="whitespace-nowrap">Location</TableHead>
                  <TableHead className="whitespace-nowrap">Student Details</TableHead>
                  <TableHead className="whitespace-nowrap">Coins Used</TableHead>
               </TableRow>
            </TableHeader>
            <TableBody>
               {data?.length > 0 ? (
                  data.map((item, index) => (
                     <TableRow key={item.sl}>
                        <TableCell className="font-medium">{index + 1}</TableCell>
                        <TableCell>{item.studentName}</TableCell>
                        <TableCell className="w-full max-w-[160px]">{item.skills}</TableCell>
                        <TableCell className="whitespace-nowrap">
                           {item?.enquiryDate && format(new Date(item?.enquiryDate), "MMM dd, yyyy")}
                        </TableCell>
                        <TableCell>{item.location}</TableCell>
                        <TableCell>
                           <button
                              className="flex items-center mx-auto gap-1 bg-primary hover:opacity-85 text-white transition-all duration-500 px-2 py-1 rounded-[4px] w-max"
                              onClick={() => handleViewDetails(item)}
                           >
                              View <EyeIcon size={17} />
                           </button>
                        </TableCell>
                        <TableCell>{item.coinsUsed} Coins</TableCell>
                     </TableRow>
                  ))
               ) : (
                  <tr>
                     <td colSpan={7}>
                        <div className="flex items-center justify-center h-40">No data found</div>
                     </td>
                  </tr>
               )}
            </TableBody>
         </Table>

         {isModalOpen && selectedStudent && (
            <Modal show={isModalOpen} onBackdropClick={closeModal}>
               <div className="p-6 bg-white rounded-xl shadow-lg max-w-lg mx-auto space-y-4">
                  <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">Student Details</h2>
                  <div className="space-y-2">
                     <div>
                        <p className="text-sm font-medium text-gray-600">Name:</p>
                        <p className="text-lg text-gray-800">{selectedStudent.studentName}</p>
                     </div>
                     <div>
                        <p className="text-sm font-medium text-gray-600">Skills:</p>
                        <p className="text-lg text-gray-800">{selectedStudent.skills}</p>
                     </div>
                     {selectedStudent.studentMessage ? (
                        <div>
                           <p className="text-sm font-medium text-gray-600">Message:</p>
                           <p className="text-lg text-gray-800">{selectedStudent.studentMessage}</p>
                        </div>
                     ) : (
                        <p className="text-sm text-gray-600">No message</p>
                     )}
                  </div>
               </div>
            </Modal>
         )}
      </div>
   );
}

export default CoinUsageTable;
