'use client';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format } from "date-fns";
import "./style.css";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
 } from "@/components/ui/dialog"
import Image from "next/image";
import { ErrorToast, SuccessToast } from "@/lib/toast";
import { ServerFetch } from "@/actions/server-fetch";
import { getSession } from "next-auth/react";
import { useState } from "react";
import Link from "next/link";
import { revalidateByTag } from "@/actions/revalidate-by-tag";
import { RefreshCw } from "lucide-react";

export type PotentialStudentsListingTableData = Array<{
   id: number;
   student_name: string;
   skills: string;
   city_name: string;
   student_email: string;
   student_phone: string;
   created_at: string;
   unlock_status : string;
   calling_code: string;
}>;

interface CoinPurchaseTableProps {
   data: PotentialStudentsListingTableData;
   unlock_coin_no : number;
   last_coin_purchase_date : string;
   remaining_coin : number;
}

function PotentialStudentsListingTable({ data, remaining_coin, last_coin_purchase_date, unlock_coin_no }: CoinPurchaseTableProps) {

    const [isOpen, setIsOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [openDialogId, setOpenDialogId] = useState<number | null>(null);


    function maskEmail(email: string): string {
        if (!email) return '';
        const [localPart, domain] = email.split('@');
        const maskedLocalPart = localPart.slice(0, 1) + '*'.repeat(localPart.length - 1);
        return `${maskedLocalPart}@${domain}`;
     }

     function maskPhone(phone: string): string {
        if (!phone) return '';
        return phone.slice(0, 5) + '*'.repeat(phone.length - 5);
     }

     function maskIsdCode(calling_code: string): string {
        if (!calling_code) return '';
        return calling_code.slice(0, 1) + '*'.repeat(calling_code.length - 1);
     }

     const handleUnlockClick = async(id:number, unlock_coin: number, remaining_coin:number) => {
        setIsSubmitting(true);
        if (remaining_coin < unlock_coin) {
            ErrorToast("You don't have enough coins to unlock it");
            setIsSubmitting(false);
        }else{
            try {
                const session = await getSession();
                const dataPost = {
                    "user_course_student_lead_id":id,
                    "used_coins":unlock_coin
                };

                const unlockLead = await ServerFetch(
                    `/user/unlock/potential-lead`,
                    {
                        method: 'POST',
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${session?.user.token}`,
                        },
                        body: JSON.stringify(dataPost),
                    }
                );

                if(unlockLead?.status){
                    revalidateByTag("potentialLeadsListing");
                    SuccessToast('Leads unlock successfully');
                    setIsOpen(false);
                    setIsSubmitting(false);
                    setOpenDialogId(null);
                }else{
                    ErrorToast(unlockLead?.message);
                }
             } catch (error) {
                ErrorToast("Error to unlock");
                setIsSubmitting(false);
             }

        }
      };

   return (
      <Table className="overflow-auto w-full">
         <TableHeader className="bg-[#E9EFF4]">
            <TableRow>
               <TableHead className="w-[100px] whitespace-nowrap">Sl. No.</TableHead>
               <TableHead className="whitespace-nowrap">Student Name</TableHead>
               <TableHead className="whitespace-nowrap">Searched Skill</TableHead>
               <TableHead>Location</TableHead>
               <TableHead className="whitespace-nowrap">ISD Code</TableHead>
               <TableHead className="whitespace-nowrap">Contact Details</TableHead>
               <TableHead className="whitespace-nowrap">Date Searched</TableHead>
               <TableHead className="text-center">Unlock</TableHead>
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
            data?.map((item, index) => (
               <TableRow key={item.id}>
                  <TableCell className="whitespace-nowrap">{index + 1}</TableCell>
                  <TableCell className="whitespace-nowrap">{item.student_name}</TableCell>
                  <TableCell>{item.skills}</TableCell>
                  <TableCell>{item.city_name}</TableCell>
                  <TableCell>{item?.unlock_status === null ? maskIsdCode(item.calling_code) : item.calling_code}</TableCell>
                  <TableCell>
                     <span className="block">{item?.unlock_status === null ? maskEmail(item.student_email) : item.student_email}</span>
                     <span className="block mt-1">{item?.unlock_status === null ? maskPhone(item.student_phone) : item.student_phone}</span>
                  </TableCell>
                  <TableCell>{format(new Date(item.created_at), "LLL dd, y")}</TableCell>
                  <TableCell className="flex justify-center items-center">

                  <Dialog
                    open={openDialogId === item.id}
                    onOpenChange={(isOpen) =>
                        setOpenDialogId(isOpen ? item.id : null)
                    }
                    >
                        <DialogTrigger asChild>
                        <p className="explore text-center" style={{maxWidth: "95px"}}>
                        {item?.unlock_status === null ?
                        <button className="bg-green-600 border-0 px-2 py-1 text-[12px] text-white rounded-sm hover:bg-green-800 transition duration-500">
                        Unlock
                     </button>: null}
                        </p>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[600px] c-all-review-modal">
                            {/* <div className="modalHeading">
                                <h4>All Reviews</h4>
                            </div> */}
                            <div className="available-coins-body">
                                       <div className="available-item-left">
                                        <Link className="history bg-gray-100 min-w-[85px] p-1 px-3 rounded-sm outline-none text-sm text-black" href="/dashboard/coin-history">History</Link>
                                        <Link className="recharge bg-purple-500 text-white ml-1.5 p-1 px-3 rounded-sm" href="/dashboard/pricing-and-plans">Recharge</Link>
                                        <h3>Your Available Coins</h3>
                                        <div className="coins-view">
                                            <div className="item">
                                                <Image src="/img/icons/2_coins.svg" width={60} height={60} alt="coins" />
                                            </div>
                                            <div className="item">
                                               <p><big>{remaining_coin}</big> <small>coins <br /> last time recharge</small></p>
                                               <p>{format(new Date(last_coin_purchase_date),'do MMM yyyy')}</p>
                                            </div>
                                        </div>
                                        </div>
                                       <div className="available-item-right">
                                            <h4>No of Coins</h4>
                                            <p><big>{unlock_coin_no}</big> <small>coins</small> <br /> <small>use for information</small></p>
                                            <button onClick={() => handleUnlockClick(item.id, unlock_coin_no, remaining_coin)} className="bg-green-600 border-0 px-2 py-1 text-[12px] text-white rounded-sm hover:bg-green-800 transition duration-500 unlock">Unlock {isSubmitting && <RefreshCw className="animate-spin" />}</button>
                                        </div>
                            </div>
                        <div className="cdr__reviews max-h-[500px] overflow-y-auto c-all-review-modal__scrollbar">

                        </div>
                        </DialogContent>
                    </Dialog>

                  </TableCell>
               </TableRow>
             ))
            )}
         </TableBody>
      </Table>
   );
}

export default PotentialStudentsListingTable;
