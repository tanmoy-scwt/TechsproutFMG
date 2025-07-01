'use client';

import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DownloadIcon, MoreHorizontal } from "lucide-react";

export interface PaginatedTableProps<T> {
  data: T[]; // Array of data to render
  columns: { label: string; key: keyof T; render?: (row: T) => JSX.Element }[]; // Configuration for table columns
  totalPages: number; // Total number of pages
  onPageChange: (page: number) => void; // Callback when the page changes
  currentPage: number; // Current active page
  loading: boolean; // Indicates if the table is in a loading state
}

export const PaginatedTable = <T extends Record<string, any>>({
  data,
  columns,
  totalPages,
  onPageChange,
  currentPage,
  loading,
}: PaginatedTableProps<T>) => {
  const [activePage, setActivePage] = useState(currentPage);

  const handlePageChange = (page: number) => {
    setActivePage(page);
    onPageChange(page);
  };

  return (
    <div>
      <Table className="overflow-auto w-full">
        <TableHeader className="bg-[#E9EFF4]">
          <TableRow>
            {columns.map((column, index) => (
              <TableHead key={index} className="text-center">
                {column.label}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading
            ? Array.from({ length: 15 }).map((_, rowIndex) => (
                <TableRow key={rowIndex}>
                  <TableCell colSpan={columns.length} className="text-center">
                    <div className="h-6 bg-gray-200 rounded animate-pulse w-full"></div>
                  </TableCell>
                </TableRow>
              ))
            : data?.map((row, rowIndex) => (
                <TableRow key={rowIndex}>
                  {columns.map((column, colIndex) => (
                    <TableCell key={colIndex} className="text-center">
                      {column.render ? (
                        // If render function is provided, pass the whole row to it
                        column.render(row)
                      ) : (
                        // Default case: display the value from the row
                        row[column.key]
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
          {!loading && data.length === 0 && (
            <TableRow>
              <TableCell colSpan={columns.length} className="text-center">
                No data found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <div className="flex w-full justify-center mt-4">
        <div className="flex items-center space-x-2">
          {Array.from({ length: totalPages }).map((_, index) => (
            <button
              key={index}
              onClick={() => handlePageChange(index + 1)}
              className={`px-3 py-1 rounded ${activePage === index + 1 ? "bg-primary text-white" : "bg-gray-100 text-gray-600"}`}
            >
              {index + 1}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
