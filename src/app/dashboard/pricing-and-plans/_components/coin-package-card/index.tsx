"use client";

import "./style.css";
import { formatCurrency, isNumber } from "@/lib/utils";
import { Check, Loader, X } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dispatch, useState, SetStateAction } from "react";
import { ErrorToast } from "@/lib/toast";
import { toast } from "sonner";
import { processPaymentForCoins } from "@/lib/payments";
import { CoinPackage } from "../../_types";
import { convertUnderscoresToSpaces } from "@/lib/text-formatter";
import DOMPurify from "dompurify";

interface CoinPackageCardProps {
   data: CoinPackage;
   setLoading: Dispatch<SetStateAction<boolean>>;
   fetchCoinBalance: () => void;
}

function CoinPackageCard({ data, setLoading, fetchCoinBalance }: CoinPackageCardProps) {
   const [amount, setAmount] = useState<string>(data.min_amount || "1");
   const [showModal, setShowModal] = useState<boolean>(false);
   const [paymentLoading, setPaymentLoading] = useState<boolean>(false);

   const handlePay = async () => {
      console.log(fetchCoinBalance);
      try {
         setLoading(false);
         setPaymentLoading(true);
         await processPaymentForCoins(
            amount,
            () => {
               setPaymentLoading(false);
               setShowModal(false);
            },
            fetchCoinBalance
         );
      } catch (e) {
         console.error(e);
      } finally {
         setLoading(false);
      }
   };

   const updatedDescription = data.description.replace(
    /\{plan\.coin_to_rupee_ratio\}/g, // Match placeholders
    `${data.coin_to_rupee_ratio}` // Replace with value and 'x'
  );

   return (
      <div className="cpc">
         {data.most_popular == 1 && (
            <div className="cpc__popular">
               <p>Most Popular</p>
            </div>
         )}
         <div className="cpc__container">
            <p className="cpc__highlight-text">{data.title}</p>

            <p className="cpc__price">
               {formatCurrency({ amount: parseFloat(data.min_amount) })} -{" "}
               {formatCurrency({ amount: parseFloat(data.max_amount) })}
               {/* 100-200 */}
            </p>

            {/* <p className="cpc__highlight-text sm">
               {data.bonus_coins ? data.bonus_coins : `${data.coin_to_rupee_ratio}X Bonus Coins`}
               {data.bonus_coins > 1 && "s"}
            </p> */}
            <ul className="px-3 plandesc" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(updatedDescription) }} />
            {/* <ul >

               <li className="text-black flex gap-3 items-start justify-start mb-1">
                  <span>
                     <Check color="#0f88dc" size={18} />
                  </span>
                  <span>
                     The total coins you will get are {data.coin_to_rupee_ratio} time(s) of the purchased amount.
                  </span>
               </li>
               <li className="text-black flex gap-3 items-start justify-start mb-1">
                  <span>
                     <Check color="#0f88dc" size={18} />
                  </span>
                  <span>No expiry</span>
               </li>
               <li className="text-black flex gap-3 items-start justify-start mb-1">
                  <span>
                     <Check color="#0f88dc" size={18} />
                  </span>
                  <span>Get {data.coin_to_rupee_ratio} x the amount you spend</span>
               </li>
               {["email_automation", "premium_support"].map((item, index) => (
                  <li
                     key={index}
                     className={`${
                        data[item as keyof CoinPackage] ? "text-black" : "text-gray-400"
                     } flex gap-3 items-start justify-start w-full mb-1`}
                  >
                     {data[item as keyof CoinPackage] ? <Check color="#0f88dc" size={18} /> : <X size={18} />}
                     <span>{convertUnderscoresToSpaces(item)}</span>
                  </li>
               ))}
            </ul> */}
         </div>

         <Dialog open={showModal} onOpenChange={setShowModal}>
            <DialogTrigger asChild>
               <button className="button__primary-light cpc__button">Recharge Now</button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-[565px]">
               <DialogHeader>
                  <DialogTitle>Please enter an Amount</DialogTitle>
               </DialogHeader>
               <div className="mt-6 flex flex-col gap-4">
                  <Input
                     placeholder={`Enter amount between ${data.min_amount} and ${data.max_amount}`}
                     type="number"
                     // min={parseFloat(data.min_amount)}
                     // max={parseFloat(data.max_amount)}
                     value={amount}
                     onChange={(e) => {
                        const amt = e.target.value;
                        if (+amt < parseFloat(data.min_amount)) {
                           toast.dismiss();
                           ErrorToast(`Minimum amount is ${data.min_amount}.`);
                           setAmount(amt);
                           return;
                        } else if (+amt > parseFloat(data.max_amount)) {
                           toast.dismiss();
                           ErrorToast(`Maximum amount is ${data.max_amount}.`);
                           setAmount(amt);
                           return;
                        }
                        setAmount(amt);
                     }}
                  />
                  <Button
                     className="button__primary-light cpc__button !flex items-center gap-1 disabled:cursor-not-allowed hover:bg-indigo-500"
                     onClick={handlePay}
                     disabled={
                        paymentLoading ||
                        !amount ||
                        +amount < parseFloat(data.min_amount) ||
                        +amount > parseFloat(data.max_amount)
                     }
                  >
                     Pay {formatCurrency({ amount: +amount })}{" "}
                     {paymentLoading && <Loader className="animate-spin duration-2000" />}
                  </Button>
               </div>
            </DialogContent>
         </Dialog>
      </div>
   );
}

export default CoinPackageCard;
