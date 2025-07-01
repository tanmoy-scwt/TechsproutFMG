// ClientComponent.tsx
"use client";

import React from "react";
import { getSession } from "next-auth/react";
import { ClientFetch } from "@/actions/client-fetch";
import axios from "axios";
// Define the type for InvoiceItem
interface InvoiceItem {
   id: string | number;
}

interface UploadInvoiceProps {
   item: InvoiceItem;
}

// The UploadInvoice component
const UploadInvoice: React.FC<UploadInvoiceProps> = ({ item }) => {
   const upLoadInvoice = async (addInVoicId: string | number) => {
      const session = await getSession();
      try {
         // Fetch the binary file data from the API
         const response = await axios.get(
            `${process.env.NEXT_PUBLIC_API_URL}/user/subscriptions/invoice/download/${addInVoicId}`,
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
            : `invoice-${addInVoicId}.pdf`;

         link.download = fileName; // Set the filename
         document.body.appendChild(link); // Append the link to the document
         link.click(); // Trigger the download
         document.body.removeChild(link); // Clean up the link element
         URL.revokeObjectURL(link.href); // Revoke the Blob URL after download
      } catch (err) {
         console.error("Error downloading invoice: ", err);
      }
   };

   return <span onClick={() => upLoadInvoice(item.id)}>Download</span>;
};

export default UploadInvoice;
