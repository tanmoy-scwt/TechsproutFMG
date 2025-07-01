import { format } from "date-fns";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuGroup,
   DropdownMenuItem,
   DropdownMenuLabel,
   DropdownMenuSeparator,
   DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DownloadIcon, MoreHorizontal, TrashIcon } from "lucide-react";
import moment from "moment";
import axios from "axios";
import { useSession } from "next-auth/react";

export type CoinPurchaseTableData = Array<{
   sl: number;
   name: string;
   date: string;
   type: string;
   remarks: string | number;
   coins: number;
   amount: number;
   invoice: string;
}>;

interface CoinPurchaseTableProps {
   data: CoinPurchaseTableData;
}

function CoinPurchaseTable({ data }: CoinPurchaseTableProps) {
   console.log("CoinPurchaseTable", data);
   const { data: session } = useSession();

   const handleInvoiceDownload = async (invoiceId: number) => {
      try {
         // Fetch the binary file data from the API
         const response = await axios.get(
            `${process.env.NEXT_PUBLIC_API_URL}/user/coins/invoice/download/${invoiceId}`,
            {
               headers: { Authorization: `Bearer ${session?.user?.token}` },
               responseType: "blob", // Ensure the response is treated as binary data
            }
         );

         // Create a Blob from the response data
         const blob = new Blob([response.data], { type: response.headers["content-type"] });

         // Create a temporary URL for the Blob
         const link = document.createElement("a");
         link.href = URL.createObjectURL(blob);

         // Set the file name for download (use a custom name or extract from headers)
         const contentDisposition = response.headers["content-disposition"];
         const fileName = contentDisposition
            ? contentDisposition.match(/filename="(.+)"/)?.[1]
            : `invoice-${invoiceId}.pdf`;

         link.download = fileName; // Set the filename
         document.body.appendChild(link); // Append the link to the document
         link.click(); // Trigger the download
         document.body.removeChild(link); // Clean up the link element
         URL.revokeObjectURL(link.href); // Revoke the Blob URL after download
      } catch (err) {
         console.error("Error downloading invoice: ", err);
      }
   };

   return (
      <div>
         <Table className="overflow-auto w-full">
            <TableHeader className="bg-[#E9EFF4]">
               <TableRow>
                  <TableHead className="w-[100px] whitespace-nowrap">Sl. No.</TableHead>
                  <TableHead className="text-center">Date</TableHead>
                  <TableHead className="whitespace-nowrap">Transaction Type</TableHead>
                  <TableHead className="text-center">Remarks</TableHead>
                  <TableHead className="text-center">Coins</TableHead>
                  <TableHead className="text-center">Amount Paid</TableHead>
                  <TableHead className="text-center">Invoice</TableHead>
               </TableRow>
            </TableHeader>
            <TableBody>
               {data?.map((item, index) => (
                  <TableRow key={index + 1}>
                     <TableCell className="whitespace-nowrap">{index + 1}</TableCell>
                     <TableCell className="whitespace-nowrap">{format(new Date(item.date), "MMM dd, yyyy")}</TableCell>
                     <TableCell className="text-center">{item.type}</TableCell>
                     <TableCell className="text-center">{item.remarks}</TableCell>
                     <TableCell className="text-center">{item.coins}</TableCell>
                     <TableCell className="text-center">{item.amount}</TableCell>
                     <TableCell className="flex justify-center items-center">
                        <DropdownMenu>
                           <DropdownMenuTrigger asChild className="cursor-pointer">
                              <MoreHorizontal stroke="#212121" />
                           </DropdownMenuTrigger>
                           <DropdownMenuContent className="w-56">
                              <DropdownMenuLabel>Invoice Options</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuGroup>
                                 <DropdownMenuItem
                                    className="cursor-pointer"
                                    onClick={() => {
                                       handleInvoiceDownload(item.sl);
                                    }}
                                 >
                                    <DownloadIcon stroke="#212121" />
                                    <span>Download</span>
                                 </DropdownMenuItem>
                              </DropdownMenuGroup>
                           </DropdownMenuContent>
                        </DropdownMenu>
                     </TableCell>
                  </TableRow>
               ))}
               {data?.length == 0 && (
                  <tr>
                     <td colSpan={7}>
                        <div className="flex items-center justify-center h-[200px] text-gray-500 text-lg">
                           No data found
                        </div>
                     </td>
                  </tr>
               )}
            </TableBody>
         </Table>
      </div>
   );
}

export default CoinPurchaseTable;
