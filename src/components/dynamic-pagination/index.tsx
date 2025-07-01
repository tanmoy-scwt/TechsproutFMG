"use client";

import {
   Pagination,
   PaginationContent,
   PaginationEllipsis,
   PaginationItem,
   PaginationLink,
   PaginationNext,
   PaginationPrevious,
} from "@/components/ui/pagination";
import { useSearchParams } from "next/navigation";

interface DynamicPaginationProps {
   total: number;
   perPage: number;
   currentPage: number;
   urlParamOnChange: string;
}

function DynamicPagination({
   currentPage = 0,
   perPage = 0,
   total = 0,
   urlParamOnChange = "page",
}: DynamicPaginationProps) {
   const queryParams = useSearchParams();
   const totalPage = Math.ceil(+total / +perPage);
   const activeClass = "bg-primary text-white";

   const generatePaginationLink = (pageNum: number) => {
      const params = new URLSearchParams(queryParams);
      params.set(urlParamOnChange, `${pageNum}`);
      return "?" + params.toString();
   };

   const renderPagination = (loopCount: number, current: number, startPage = 1) => {
      const items = [];

      for (let index = 0; index < loopCount; index++) {
         const pageNum = startPage + index;
         const isActive = pageNum === current;

         items.push(
            <PaginationItem key={pageNum}>
               <PaginationLink
                  href={generatePaginationLink(pageNum)}
                  isActive={isActive}
                  className={isActive ? "bg-primary text-white" : ""}
               >
                  {pageNum}
               </PaginationLink>
            </PaginationItem>
         );
      }

      return items;
   };

   return (
      <Pagination>
         <PaginationContent>
            {currentPage !== 1 && (
               <PaginationItem>
                  <PaginationPrevious href={generatePaginationLink(currentPage - 1)} />
               </PaginationItem>
            )}

            {totalPage <= 5 ? (
               renderPagination(totalPage, currentPage)
            ) : (
               <>
                  <PaginationItem>
                     <PaginationLink
                        href={generatePaginationLink(1)}
                        isActive={currentPage === 1}
                        className={currentPage === 1 ? activeClass : ""}
                     >
                        1
                     </PaginationLink>
                  </PaginationItem>

                  {currentPage > 2 ? (
                     <PaginationItem>
                        <PaginationEllipsis />
                     </PaginationItem>
                  ) : (
                     <PaginationItem>
                        <PaginationLink
                           href={generatePaginationLink(2)}
                           isActive={currentPage === 2}
                           className={currentPage === 2 ? activeClass : ""}
                        >
                           2
                        </PaginationLink>
                     </PaginationItem>
                  )}

                  {currentPage >= 3 && currentPage < totalPage - 1 && renderPagination(1, currentPage, currentPage)}

                  {currentPage < totalPage - 1 && currentPage !== totalPage ? (
                     <PaginationItem>
                        <PaginationEllipsis />
                     </PaginationItem>
                  ) : (
                     <PaginationItem>
                        <PaginationLink
                           href={generatePaginationLink(totalPage - 1)}
                           isActive={currentPage === totalPage - 1}
                           className={currentPage === totalPage - 1 ? activeClass : ""}
                        >
                           {totalPage - 1}
                        </PaginationLink>
                     </PaginationItem>
                  )}

                  <PaginationItem>
                     <PaginationLink
                        href={generatePaginationLink(totalPage)}
                        isActive={currentPage === totalPage}
                        className={currentPage === totalPage ? activeClass : ""}
                     >
                        {totalPage}
                     </PaginationLink>
                  </PaginationItem>
               </>
            )}

            {currentPage !== totalPage && (
               <PaginationItem>
                  <PaginationNext href={generatePaginationLink(currentPage + 1)} />
               </PaginationItem>
            )}
         </PaginationContent>
      </Pagination>
   );
}

export default DynamicPagination;
