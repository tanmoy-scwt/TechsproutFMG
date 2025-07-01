import { PlusCircleIcon } from "lucide-react";
import { CoursesFilter } from "../../_components";
import Link from "next/link";
import { dashboardLinks as dl } from "@/lib/constants";

function CoursesTitleSection() {
   return (
      <section className="flex flex-col gap-[15px]">
         <div className="w-full flex flex-row items-center justify-between gap-4">
            <h1 className="subtitle">My Courses</h1>
            <Link
               href={dl.addCourses}
               className="bg-primary text-white px-3 py-2 rounded-sm text-xs mob:text-sm flex items-center gap-1"
            >
               Add Course
               <PlusCircleIcon stroke="#fff" size={22} className="ml-1" />
            </Link>
         </div>

         <CoursesFilter />
      </section>
   );
}

export default CoursesTitleSection;
