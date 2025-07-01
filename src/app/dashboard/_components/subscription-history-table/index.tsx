import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuGroup,
   DropdownMenuItem,
   DropdownMenuLabel,
   DropdownMenuSeparator,
   DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import UploadInvoice from "./UploadInvoice";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatCurrency } from "@/lib/utils";
import { format } from "date-fns";
import { DownloadIcon, MoreHorizontal } from "lucide-react";

export type SubscriptionHistoryTableData = Array<{
   id: string | number;
   sl: string | number;
   package_name: string;
   purchase_date: string;
   end_date: string;
   amount_paid: number;
}>;

interface SubscriptionHistoryTableProps {
   data: SubscriptionHistoryTableData;
}
function SubscriptionHistoryTable({ data }: SubscriptionHistoryTableProps) {
   return (
      <Table className="overflow-auto w-full">
         <TableHeader className="bg-[#E9EFF4]">
            <TableRow>
               <TableHead className="w-[100px] whitespace-nowrap">Sl. No.</TableHead>
               <TableHead className="whitespace-nowrap">Package Name</TableHead>
               <TableHead className="whitespace-nowrap">Purchase Date</TableHead>
               <TableHead className="whitespace-nowrap">End Date</TableHead>
               <TableHead>Amount</TableHead>
               <TableHead className="text-center">Action</TableHead>
            </TableRow>
         </TableHeader>
         <TableBody>
            {data?.map((item, index) => (
               <TableRow key={index + 1}>
                  <TableCell className="whitespace-nowrap">{index + 1}</TableCell>
                  <TableCell>{item.package_name}</TableCell>
                  <TableCell className="whitespace-nowrap">
                     {format(new Date(item.purchase_date), "LLL dd, y")}
                  </TableCell>
                  <TableCell className="whitespace-nowrap">{format(new Date(item.end_date), "LLL dd, y")}</TableCell>
                  <TableCell>
                     {formatCurrency({
                        amount: item.amount_paid,
                     })}
                  </TableCell>

                  <TableCell className="flex justify-center items-center">
                     <DropdownMenu>
                        <DropdownMenuTrigger asChild className="cursor-pointer">
                           <MoreHorizontal stroke="#212121" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-56">
                           <DropdownMenuLabel>Invoice Options</DropdownMenuLabel>
                           <DropdownMenuSeparator />
                           <DropdownMenuGroup>
                              <DropdownMenuItem className="cursor-pointer">
                                 <DownloadIcon stroke="#212121" />
                                 <UploadInvoice item={item} />
                              </DropdownMenuItem>
                           </DropdownMenuGroup>
                        </DropdownMenuContent>
                     </DropdownMenu>
                  </TableCell>
               </TableRow>
            ))}
         </TableBody>
      </Table>
   );
}

export default SubscriptionHistoryTable;
