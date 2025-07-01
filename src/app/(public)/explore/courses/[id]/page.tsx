import "./style.css";

import {
   CourseDetailsSection,
   CourseDetailsIntroVideoSection,
   CourseInfoSection,
   CourseDetailsContentSection,
   CourseDetailsRatingsSection,
   CourseDetailsBlogsSection,
} from "../_components";
import CourseSliderSection from "@/components/courses-slider-section";
import { links } from "@/lib/constants";
import { ClientFetch } from "@/actions/client-fetch";
import { notFound } from "next/navigation";

async function CourseDetailsPage({ params }: { params: { id: string } }) {
   const { id } = params;

   const res = await ClientFetch(`${process.env.API_URL}/course/details/${id}`, { cache: "no-store" });
   const courseDetails = await res.json();

   if (!courseDetails.status) {
        notFound();
    }

   //    const content: CourseDetailsPageContent = {
   //       id: 1,
   //       creatorId: 2,
   //       title: "The Complete Ui/UX Web Design & Graphic design",
   //       description:
   //          "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dolores optio vitae quas nostrum commodi numquam, soluta enim voluptatibus quae alias repellat. Quaerat quia nobis culpa officiis rem quasi magnam sed. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dolores optio vitae quas nostrum commodi numquam, soluta enim voluptatibus quae alias repellat. Quaerat quia nobis culpa officiis rem quasi magnam sed. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dolores optio vitae quas nostrum commodi numquam, soluta enim voluptatibus quae alias repellat. Quaerat quia nobis culpa officiis rem quasi magnam sed.",
   //       averageRatings: 4.1,
   //       totalRatings: 810,
   //       ratingDetails: [
   //          {
   //             id: 5,
   //             stars: 5,
   //             count: 317,
   //          },
   //          {
   //             id: 4,
   //             stars: 4,
   //             count: 213,
   //          },
   //          {
   //             id: 3,
   //             stars: 3,
   //             count: 110,
   //          },
   //          {
   //             id: 2,
   //             stars: 2,
   //             count: 70,
   //          },
   //          {
   //             id: 1,
   //             stars: 1,
   //             count: 100,
   //          },
   //       ],
   //       totalStudents: 2780,
   //       badge: "Featured",
   //       introVideoUrl: "https://www.youtube-nocookie.com/embed/or6iDy210Kc?si=RANBwcxpY1pfoHfX",
   //       amount: 10000,
   //       batchType: "Weekend",
   //       classType: "Online",
   //       duration: 10,
   //       period: "Day",
   //       languages: ["English"],
   //       skills: ["Figma", "Adobe XD"],
   //       courseBy: "Institute",
   //       courses: [
   //          {
   //             id: 12,
   //             badge: "Design",
   //             image: "/img/home/popular-course-demo.png",
   //             previewImage:
   //                "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEASABIAAD/4gHYSUNDX1BST0ZJTEUAAQEAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADb/2wBDABALDA4MChAODQ4SERATGCgaGBYWGDEjJR0oOjM9PDkzODdASFxOQERXRTc4UG1RV19iZ2hnPk1xeXBkeFxlZ2P/2wBDARESEhgVGC8aGi9jQjhCY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2P/wAARCAAUABsDASIAAhEBAxEB/8QAFwABAQEBAAAAAAAAAAAAAAAABQMABP/EACUQAAICAQMEAQUAAAAAAAAAAAECAxEABBIxBRMhQRQVMlGBof/EABUBAQEAAAAAAAAAAAAAAAAAAAIB/8QAFxEBAQEBAAAAAAAAAAAAAAAAAQARMf/aAAwDAQACEQMRAD8Al052+k6lA1SS/aR+ay02kX4cHdcksQSl+x5rB+maooz8EXZB4OIzTQyBS9gq1qAfdYR1SvCOmTVwTTamKRu1ExKqzmquuMe0eoi1OljmA2bxe2+M44XiZi9bkI27W8ivfjJjRRRjZG8gUcDdxjzKLsHEvbTcpN2R/MtE7uylnJs8frNmwyJILtjAUkUMoCa5ObNjhf/Z",
   //             ratings: 1.2,
   //             title: "The Complete Ui/UX Web Design & Graphic design",
   //             duration: 10,
   //             experience: 5,
   //             author: "Praneeth",
   //             classMethod: "Online",
   //          },
   //          {
   //             id: 13,
   //             badge: "Design",
   //             image: "/img/home/popular-course-demo.png",
   //             previewImage:
   //                "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEASABIAAD/4gHYSUNDX1BST0ZJTEUAAQEAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADb/2wBDABALDA4MChAODQ4SERATGCgaGBYWGDEjJR0oOjM9PDkzODdASFxOQERXRTc4UG1RV19iZ2hnPk1xeXBkeFxlZ2P/2wBDARESEhgVGC8aGi9jQjhCY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2P/wAARCAAUABsDASIAAhEBAxEB/8QAFwABAQEBAAAAAAAAAAAAAAAABQMABP/EACUQAAICAQMEAQUAAAAAAAAAAAECAxEABBIxBRMhQRQVMlGBof/EABUBAQEAAAAAAAAAAAAAAAAAAAIB/8QAFxEBAQEBAAAAAAAAAAAAAAAAAQARMf/aAAwDAQACEQMRAD8Al052+k6lA1SS/aR+ay02kX4cHdcksQSl+x5rB+maooz8EXZB4OIzTQyBS9gq1qAfdYR1SvCOmTVwTTamKRu1ExKqzmquuMe0eoi1OljmA2bxe2+M44XiZi9bkI27W8ivfjJjRRRjZG8gUcDdxjzKLsHEvbTcpN2R/MtE7uylnJs8frNmwyJILtjAUkUMoCa5ObNjhf/Z",
   //             ratings: 1.2,
   //             title: "The Complete Ui/UX Web Design & Graphic design",
   //             duration: 10,
   //             experience: 5,
   //             author: "Praneeth",
   //             classMethod: "Online",
   //          },
   //          {
   //             id: 14,
   //             badge: "Design",
   //             image: "/img/home/popular-course-demo.png",
   //             previewImage:
   //                "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEASABIAAD/4gHYSUNDX1BST0ZJTEUAAQEAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADb/2wBDABALDA4MChAODQ4SERATGCgaGBYWGDEjJR0oOjM9PDkzODdASFxOQERXRTc4UG1RV19iZ2hnPk1xeXBkeFxlZ2P/2wBDARESEhgVGC8aGi9jQjhCY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2P/wAARCAAUABsDASIAAhEBAxEB/8QAFwABAQEBAAAAAAAAAAAAAAAABQMABP/EACUQAAICAQMEAQUAAAAAAAAAAAECAxEABBIxBRMhQRQVMlGBof/EABUBAQEAAAAAAAAAAAAAAAAAAAIB/8QAFxEBAQEBAAAAAAAAAAAAAAAAAQARMf/aAAwDAQACEQMRAD8Al052+k6lA1SS/aR+ay02kX4cHdcksQSl+x5rB+maooz8EXZB4OIzTQyBS9gq1qAfdYR1SvCOmTVwTTamKRu1ExKqzmquuMe0eoi1OljmA2bxe2+M44XiZi9bkI27W8ivfjJjRRRjZG8gUcDdxjzKLsHEvbTcpN2R/MtE7uylnJs8frNmwyJILtjAUkUMoCa5ObNjhf/Z",
   //             ratings: 1.2,
   //             title: "The Complete Ui/UX Web Design & Graphic design",
   //             duration: 10,
   //             experience: 5,
   //             author: "Praneeth",
   //             classMethod: "Online",
   //          },
   //          {
   //             id: 15,
   //             badge: "Design",
   //             image: "/img/home/popular-course-demo.png",
   //             previewImage:
   //                "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEASABIAAD/4gHYSUNDX1BST0ZJTEUAAQEAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADb/2wBDABALDA4MChAODQ4SERATGCgaGBYWGDEjJR0oOjM9PDkzODdASFxOQERXRTc4UG1RV19iZ2hnPk1xeXBkeFxlZ2P/2wBDARESEhgVGC8aGi9jQjhCY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2P/wAARCAAUABsDASIAAhEBAxEB/8QAFwABAQEBAAAAAAAAAAAAAAAABQMABP/EACUQAAICAQMEAQUAAAAAAAAAAAECAxEABBIxBRMhQRQVMlGBof/EABUBAQEAAAAAAAAAAAAAAAAAAAIB/8QAFxEBAQEBAAAAAAAAAAAAAAAAAQARMf/aAAwDAQACEQMRAD8Al052+k6lA1SS/aR+ay02kX4cHdcksQSl+x5rB+maooz8EXZB4OIzTQyBS9gq1qAfdYR1SvCOmTVwTTamKRu1ExKqzmquuMe0eoi1OljmA2bxe2+M44XiZi9bkI27W8ivfjJjRRRjZG8gUcDdxjzKLsHEvbTcpN2R/MtE7uylnJs8frNmwyJILtjAUkUMoCa5ObNjhf/Z",
   //             ratings: 1.2,
   //             title: "The Complete Ui/UX Web Design & Graphic design",
   //             duration: 10,
   //             experience: 5,
   //             author: "Praneeth",
   //             classMethod: "Online",
   //          },
   //       ],
   //       experience: 4,
   //       location: "Hyderabad",
   //       image: "/img/home/top-institute-demo.webp",
   //       previewImage:
   //          "data:image/webp;base64,UklGRlQAAABXRUJQVlA4IEgAAADQAQCdASoKAAcAAgA0JQBOgCbFp0ZH4AD8NBYvWNsM2VRSxllpexWDOA+diVls4r1Un9kariIL/QvZmMtYJM1XBKNs95dSAAA=",
   //       name: "DigiKonneKT",
   //       about: "igiConnekt is an experienced digital marketing company with headquarters in Singapore. Our primary focus is to provide highly efficient designs. DigiKonneKT was established on 1998 by XYZ.",
   //       reviews: [
   //          {
   //             id: 1,
   //             date: "03-10-2024",
   //             image: "/img/home/popular-course-demo.png",
   //             previewImage:
   //                "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEASABIAAD/4gHYSUNDX1BST0ZJTEUAAQEAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADb/2wBDABALDA4MChAODQ4SERATGCgaGBYWGDEjJR0oOjM9PDkzODdASFxOQERXRTc4UG1RV19iZ2hnPk1xeXBkeFxlZ2P/2wBDARESEhgVGC8aGi9jQjhCY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2P/wAARCAAUABsDASIAAhEBAxEB/8QAFwABAQEBAAAAAAAAAAAAAAAABQMABP/EACUQAAICAQMEAQUAAAAAAAAAAAECAxEABBIxBRMhQRQVMlGBof/EABUBAQEAAAAAAAAAAAAAAAAAAAIB/8QAFxEBAQEBAAAAAAAAAAAAAAAAAQARMf/aAAwDAQACEQMRAD8Al052+k6lA1SS/aR+ay02kX4cHdcksQSl+x5rB+maooz8EXZB4OIzTQyBS9gq1qAfdYR1SvCOmTVwTTamKRu1ExKqzmquuMe0eoi1OljmA2bxe2+M44XiZi9bkI27W8ivfjJjRRRjZG8gUcDdxjzKLsHEvbTcpN2R/MtE7uylnJs8frNmwyJILtjAUkUMoCa5ObNjhf/Z",
   //             name: "Dummy Student",
   //             rating: 4,
   //             review:
   //                "Turpis odio porta pellentesque ornare. Vel habitant id platea feugiat ac imperdiet urna interdum. Iaculis orci non lorem leo ultrices placerat. Vel massa diam a faucibus.",
   //          },
   //          {
   //             id: 2,
   //             date: "01-10-2024",
   //             image: "/img/home/popular-course-demo.png",
   //             previewImage:
   //                "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEASABIAAD/4gHYSUNDX1BST0ZJTEUAAQEAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADb/2wBDABALDA4MChAODQ4SERATGCgaGBYWGDEjJR0oOjM9PDkzODdASFxOQERXRTc4UG1RV19iZ2hnPk1xeXBkeFxlZ2P/2wBDARESEhgVGC8aGi9jQjhCY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2P/wAARCAAUABsDASIAAhEBAxEB/8QAFwABAQEBAAAAAAAAAAAAAAAABQMABP/EACUQAAICAQMEAQUAAAAAAAAAAAECAxEABBIxBRMhQRQVMlGBof/EABUBAQEAAAAAAAAAAAAAAAAAAAIB/8QAFxEBAQEBAAAAAAAAAAAAAAAAAQARMf/aAAwDAQACEQMRAD8Al052+k6lA1SS/aR+ay02kX4cHdcksQSl+x5rB+maooz8EXZB4OIzTQyBS9gq1qAfdYR1SvCOmTVwTTamKRu1ExKqzmquuMe0eoi1OljmA2bxe2+M44XiZi9bkI27W8ivfjJjRRRjZG8gUcDdxjzKLsHEvbTcpN2R/MtE7uylnJs8frNmwyJILtjAUkUMoCa5ObNjhf/Z",
   //             name: "Dummy Student",
   //             rating: 3,
   //             review:
   //                "Turpis odio porta pellentesque ornare. Vel habitant id platea feugiat ac imperdiet urna interdum. Iaculis orci non lorem leo ultrices placerat. Vel massa diam a faucibus.",
   //          },
   //       ],
   //       blogs: [
   //          {
   //             id: 1,
   //             date: "03 Oct 24",
   //             title: "Blog Title 1",
   //             description:
   //                "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dolores optio vitae quas nostrum commodi numquam, soluta enim voluptatibus quae alias repellat. Quaerat quia nobis culpa officiis rem quasi magnam sed. Lorem ipsum dolor sit amet, consectetur adipisicing elit.",
   //             commentsCount: 15,
   //             image: "/img/search/blog-demo.webp",
   //             previewImage:
   //                "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAHCAMAAAAGcixRAAAAilBMVEXFqIO9mW/As6nTzsa2m4CtiW2agmqkgWiehm/IrovU1teXfF0sKCSceFSzn4qXgWSnmYS/pYV0c2+JfGO0lW+Vo6J0cliUdVyIaV7AqpG4i2FdTz2Mc1W7rZ+QiXy+v7yupJmelX6plHoOCwnMxL+Qh4Wgg2LIysusmHegeWmXjXERDgtNRTufnpNmlh1bAAAAC3RSTlP++v7+/v79/fz+/kqDElIAAABPSURBVAjXBcEFAoAgAASwMwEBURSxu+P/33MD4We+c9vmDua7yMSzNACSqVCvEBkDzOenvdZJzGC2axy6KqU+ypKsR1xLFYLYwIvcQHL6A9x6BUC9zidyAAAAAElFTkSuQmCC",
   //             slug: "blog-title-1",
   //          },
   //          {
   //             id: 2,
   //             date: "03 Oct 24",
   //             title: "Blog Title 2",
   //             description:
   //                "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dolores optio vitae quas nostrum commodi numquam, soluta enim voluptatibus quae alias repellat. Quaerat quia nobis culpa officiis rem quasi magnam sed. Lorem ipsum dolor sit amet, consectetur adipisicing elit.",
   //             commentsCount: 10,
   //             image: "/img/search/blog-demo.webp",
   //             previewImage:
   //                "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAHCAMAAAAGcixRAAAAilBMVEXFqIO9mW/As6nTzsa2m4CtiW2agmqkgWiehm/IrovU1teXfF0sKCSceFSzn4qXgWSnmYS/pYV0c2+JfGO0lW+Vo6J0cliUdVyIaV7AqpG4i2FdTz2Mc1W7rZ+QiXy+v7yupJmelX6plHoOCwnMxL+Qh4Wgg2LIysusmHegeWmXjXERDgtNRTufnpNmlh1bAAAAC3RSTlP++v7+/v79/fz+/kqDElIAAABPSURBVAjXBcEFAoAgAASwMwEBURSxu+P/33MD4We+c9vmDua7yMSzNACSqVCvEBkDzOenvdZJzGC2axy6KqU+ypKsR1xLFYLYwIvcQHL6A9x6BUC9zidyAAAAAElFTkSuQmCC",
   //             slug: "blog-title-2",
   //          },
   //          {
   //             id: 3,
   //             date: "03 Oct 24",
   //             title: "Blog Title 3",
   //             description:
   //                "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dolores optio vitae quas nostrum commodi numquam, soluta enim voluptatibus quae alias repellat. Quaerat quia nobis culpa officiis rem quasi magnam sed. Lorem ipsum dolor sit amet, consectetur adipisicing elit.",
   //             commentsCount: 10,
   //             image: "/img/search/blog-demo.webp",
   //             previewImage:
   //                "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAHCAMAAAAGcixRAAAAilBMVEXFqIO9mW/As6nTzsa2m4CtiW2agmqkgWiehm/IrovU1teXfF0sKCSceFSzn4qXgWSnmYS/pYV0c2+JfGO0lW+Vo6J0cliUdVyIaV7AqpG4i2FdTz2Mc1W7rZ+QiXy+v7yupJmelX6plHoOCwnMxL+Qh4Wgg2LIysusmHegeWmXjXERDgtNRTufnpNmlh1bAAAAC3RSTlP++v7+/v79/fz+/kqDElIAAABPSURBVAjXBcEFAoAgAASwMwEBURSxu+P/33MD4We+c9vmDua7yMSzNACSqVCvEBkDzOenvdZJzGC2axy6KqU+ypKsR1xLFYLYwIvcQHL6A9x6BUC9zidyAAAAAElFTkSuQmCC",
   //             slug: "blog-title-3",
   //          },
   //          {
   //             id: 4,
   //             date: "03 Oct 24",
   //             title: "Blog Title 4",
   //             description:
   //                "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dolores optio vitae quas nostrum commodi numquam, soluta enim voluptatibus quae alias repellat. Quaerat quia nobis culpa officiis rem quasi magnam sed. Lorem ipsum dolor sit amet, consectetur adipisicing elit.",
   //             commentsCount: 10,
   //             image: "/img/search/blog-demo.webp",
   //             previewImage:
   //                "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAHCAMAAAAGcixRAAAAilBMVEXFqIO9mW/As6nTzsa2m4CtiW2agmqkgWiehm/IrovU1teXfF0sKCSceFSzn4qXgWSnmYS/pYV0c2+JfGO0lW+Vo6J0cliUdVyIaV7AqpG4i2FdTz2Mc1W7rZ+QiXy+v7yupJmelX6plHoOCwnMxL+Qh4Wgg2LIysusmHegeWmXjXERDgtNRTufnpNmlh1bAAAAC3RSTlP++v7+/v79/fz+/kqDElIAAABPSURBVAjXBcEFAoAgAASwMwEBURSxu+P/33MD4We+c9vmDua7yMSzNACSqVCvEBkDzOenvdZJzGC2axy6KqU+ypKsR1xLFYLYwIvcQHL6A9x6BUC9zidyAAAAAElFTkSuQmCC",
   //             slug: "blog-title-4",
   //          },
   //       ],
   //    };
   //console.log(courseDetails)
   //console.log("courseDetails", courseDetails);
   return (
      <main>
         <div className="container td__container">
            <div className="td__top--container section">
               {/* <CourseDetailsIntroVideoSection
                  className="sec-1"
                  content={{
                     title: courseDetails?.data?.course_name,
                     introVideoUrl: courseDetails?.data?.demo_video_url,
                  }}
               /> */}
               <CourseDetailsSection
                  content={{
                     title: courseDetails?.data?.course_name,
                     description: courseDetails?.data?.course_content,
                     averageRatings: courseDetails?.data?.average_rating,
                     totalRatings: courseDetails?.data?.total_rating,
                     totalStudents: courseDetails?.data?.total_students,
                     badge: courseDetails?.data?.featured,
                     highlights: courseDetails?.data?.highlights,
                  }}
                  className="sec-2"
               />

               <CourseInfoSection
                  className="sec-3"
                  content={{
                     id: courseDetails?.data?.id,
                     title: courseDetails?.data?.course_name,
                     duration: courseDetails?.data?.duration_value,
                     period: courseDetails?.data?.duration_unit,
                     batchType: courseDetails?.data?.batch_type,
                     languages: courseDetails?.data?.languages,
                     classType: courseDetails?.data?.teaching_mode,
                     amount: courseDetails?.data?.fee,
                     courseBy: courseDetails?.data?.f_name,
                     feesUponEnquiry: courseDetails?.data?.fee_upon_enquiry,
                     address: courseDetails?.data?.address,
                     city: courseDetails?.data?.city_name,
                     area_name: courseDetails?.data?.area_name,
                     fee_unit: courseDetails?.data?.fee_unit,
                     introVideoUrl: courseDetails?.data?.demo_video_url
                  }}
               />

               <CourseDetailsContentSection
                  content={{
                     creatorId: courseDetails?.data?.id,
                     creatorSlug: courseDetails?.data?.slug,
                     description: courseDetails?.data?.course_content,
                     skills: courseDetails?.data?.skill,
                     averageRatings: courseDetails?.data?.average_rating,
                     totalRatings: courseDetails?.data?.total_rating,
                     courseBy: courseDetails?.data?.user_type,
                     experience: courseDetails?.data?.year_of_exp,
                     image: `${process.env.NEXT_PUBLIC_IMAGE_URL}/${courseDetails?.data?.profile_pic}`,
                     previewImage: courseDetails?.data?.course_logo_preview,
                     location: courseDetails?.data?.city_name,
                     name: courseDetails?.data?.f_name,
                     about: courseDetails?.data?.bio,
                     address: courseDetails?.data?.address,
                  }}
                  className="sec-4"
               />
               <CourseDetailsRatingsSection
                  content={{
                     ratingDetails: courseDetails?.data?.ratingDetails,
                     averageRatings: courseDetails?.data?.average_rating,
                     totalRatings: courseDetails?.data?.total_rating,
                     reviews: courseDetails?.data?.reviews,
                     courseId: courseDetails?.data?.id,
                     totalReviews: courseDetails?.data?.totalReviews,
                  }}
                  className="sec-5"
               />
            </div>
            {courseDetails?.data?.relatedCourses.length > 0 && (
               <CourseSliderSection
                  sliderClassName="td__all-courses1"
                  title="Related Courses"
                  link={links.exploreCourses}
                  courses={courseDetails?.data?.relatedCourses}
                  headingClass="subtitle"
               />
            )}
            {courseDetails?.data?.relatedBlogs.length > 0 && (
               <CourseDetailsBlogsSection blogs={courseDetails?.data?.relatedBlogs} className="td__all-blogs" />
            )}
         </div>
      </main>
   );
}

export default CourseDetailsPage;
