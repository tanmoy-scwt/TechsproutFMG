'use client';
import Image from "next/image";
import "./style.css";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface BlogSearchSectionProps {
   categories: Array<{
      id: number;
      name: string;
      value: string;
   }>;
}
function BlogSearchSection({ categories }: BlogSearchSectionProps) {

    const [searchQuery, setSearchQuery] = useState('');
    const router = useRouter();
    const [selectedCategory, setSelectedCategory] = useState("");

    const handleSearch = () => {
        const queryParams = new URLSearchParams();

         if (searchQuery.trim() !== '') {
            queryParams.append('query', searchQuery.trim());
         }
        if (selectedCategory) {
            queryParams.append('category', selectedCategory);
        }
        const queryString = queryParams.toString();

         router.push(`/blog?${queryString}`);
      };

      const handleKeyPress = (e:any) => {
        if (e.key === 'Enter') {
          handleSearch();
        }
      };

   const handleChange = (event:any) => {
        setSelectedCategory(event.target.value);

         const queryParams = new URLSearchParams();

         if (searchQuery.trim() !== '') {
            queryParams.append('query', searchQuery.trim());
         }
        if (event.target.value) {
            queryParams.append('category', event.target.value);
        }
        const queryString = queryParams.toString();

         router.push(`/blog?${queryString}`);

   };

   return (
      <section className="blog-search__section section">
         <div className="blog-search__input--container">
            <input type="text" className="input blog-search__input" placeholder="Search"
             id="blog-search__input"
             value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleKeyPress}
         />
            <Image
               src="/img/icons/search-glass.svg"
               className="blog-search__icon"
               unoptimized
               alt="search blog icon"
               width={30}
               height={30}
               onClick={handleSearch}
            />
         </div>
         <div className="blog-search__categories--container">
            <select className="select blog-search__categories" id="blog-search__categories"
            value={selectedCategory}
            onChange={handleChange}>
               <option value="">Categories (All)</option>
               {categories?.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                     {cat.name}
                  </option>
               ))}
            </select>
         </div>
      </section>
   );
}

export default BlogSearchSection;
