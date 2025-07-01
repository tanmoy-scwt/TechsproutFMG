"use client";
import { useRouter } from "next/navigation";
import "./style.css";
import Link from "next/link";

interface SuggestionsScrollProps {
   suggestions: Array<{ id: string | number; name: string }>;
   count?: number;
   location?: string | null;
   modetype?: string;
}

function SuggestionsScroll({ suggestions, location, modetype, count = 4 }: SuggestionsScrollProps) {
    const router = useRouter();

   const sugg = suggestions?.length > count ? suggestions.slice(0, count) : suggestions;

   const handleClick = (routeVal: string) => {
        const params = new URLSearchParams();
        params.set("search_key", routeVal);
        params.set("location", location ?? "");
        params.set("t", modetype ?? "");

        router.push(`/${routeVal.replace(/\s+/g, "-").toLowerCase()}-tutors-in-${(location ?? "").replace(/\s+/g, "-").toLowerCase()}?${params.toString()}`);
    };

   return (
      <div className="sug-scroll">
        {suggestions?.length > 0 &&
         <p>Suggestions: </p>
        }

         <div className="sug-scroll__container">
            {sugg?.map((s) => (
               <Link prefetch={false}
               onClick={(e) => {
                e.preventDefault(); // Prevent the default link behavior
                handleClick(s.name); // Call the click handler
             }} href="#" key={s.id} className="sug-scroll__item">
                  {s.name}
               </Link>
            ))}
         </div>
      </div>
   );
}

export default SuggestionsScroll;
