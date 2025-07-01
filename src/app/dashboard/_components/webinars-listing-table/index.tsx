"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getSession } from "next-auth/react";
import { ServerFetch } from "@/actions/server-fetch";
import { ErrorToast, SuccessToast } from "@/lib/toast";

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
import moment from "moment";
import { useRouter } from "next/navigation";
import { revalidateByTag } from "@/actions/revalidate-by-tag";
export type WebinarsListingTableData = Array<{
  sl: number;
  id: number | string;
  title: string;
  category: string;
  date: string;
  startTime: string;
  endTime: string;
  status: "Pending" | "Approved" | "Rejected";
}>;

interface WebinarsListingTableProps {
  data: WebinarsListingTableData;
}

function WebinarsListingTable({ data }: WebinarsListingTableProps) {
  const statusClass = {
    Approved: "text-green-500",
    Rejected: "text-red-500",
    Pending: "text-orange-500",
  };

  const router = useRouter();
  console.log(
    "data",
    data.map((item) => item.id)
  );

  const deleteWebinerList = async (deleteId: string | number) => {
    const session = await getSession();
    const response = await ServerFetch(
      "/webinar/" + (deleteId ? `delete/${deleteId}` : `delete`),
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${session?.user.token}`,
        },
        cache: "no-store",
      }
    );
    //console.log("response", response);
    if (response.status === true) {
      SuccessToast("Webinar Deleted Successfully");
      revalidateByTag("userWebinarsListing");
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
          <TableHead>Date</TableHead>
          <TableHead className="whitespace-nowrap">Start Time</TableHead>
          <TableHead>End Time</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-center">Action</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data?.length > 0 ? (
          data?.map((item) => (
            <TableRow key={item.sl}>
              <TableCell className="whitespace-nowrap">{item.sl}</TableCell>
              <TableCell>{item.title}</TableCell>
              <TableCell>{item.category}</TableCell>
              <TableCell className="whitespace-nowrap">
                {item.date ? moment(item.date).format("MMM d, y") : "-"}
              </TableCell>
              <TableCell className="whitespace-nowrap">
                {item.startTime ? item.startTime : "-"}
              </TableCell>
              <TableCell className="whitespace-nowrap">
                {item.endTime ? item.endTime : "-"}
              </TableCell>

              <TableCell
                className={`font-semibold ${statusClass[item.status]}`}
              >
                {item.status}
              </TableCell>
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
                        onClick={() =>
                          router.push("/dashboard/webinars/edit/" + item.id)
                        }
                      >
                        <Edit stroke="#212121" />
                        <span>Edit</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="cursor-pointer"
                        onClick={() => deleteWebinerList(item.id)}
                      >
                        <TrashIcon stroke="#212121" />
                        <span>Delete</span>
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))
        ) : (
          <tr>
            <td colSpan={8}>
              <div className="flex items-center justify-center h-40">
                No data found
              </div>
            </td>
          </tr>
        )}
      </TableBody>
    </Table>
  );
}

export default WebinarsListingTable;
