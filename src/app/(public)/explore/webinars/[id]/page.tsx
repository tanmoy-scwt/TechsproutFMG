import "./style.css";
import { WebinarDetailsSection, WebinarFormSection, WebinarTitleSection } from "../_components";
import { WebinarDetailsPageContent } from "../types";
import WebinarSliderSection from "@/components/webinars-slider-section";
import { ServerFetch } from "@/actions/server-fetch";
import { ClientFetch } from "@/actions/client-fetch";
import { notFound } from "next/navigation";

async function WebinarDetailsPage({ params }: { params: { id: string } }) {
   const { id } = params;

   const res = await ClientFetch(`${process.env.API_URL}/webinar/details/${id}`, { cache: "no-store" });
   const webinarDetails = await res.json();
   if (!webinarDetails.status) {
        notFound();
    }

   const content: WebinarDetailsPageContent = {
      id: webinarDetails?.data?.id,
      host: webinarDetails?.data?.f_name,
      availableSeats: webinarDetails?.data?.no_of_seats,
      date: webinarDetails?.data?.start_date,
      startTime: webinarDetails?.data?.start_time,
      endTime: webinarDetails?.data?.end_time,
      title: webinarDetails?.data?.title,
      description: webinarDetails?.data?.content,
      subtitle: webinarDetails?.data?.agenda,
      image: `${process.env.NEXT_PUBLIC_IMAGE_URL}/${webinarDetails?.data?.logo}`,
      previewImage: webinarDetails?.data?.preview_logo,
      price: webinarDetails?.data?.fee,
      thingsToDo: [
         "Lorem ipsum dolor sit amet consectetur. Vestibulum proin vulputate curabitur sit.",
         "At quis ac pellentesque bibendum. Nullam mi enim nec duis netus integer pellentesque ipsum.Consectetur turpis ultrices natoque dui ac purus.",
         "Turpis odio porta pellentesque ornare. Vel habitant id platea feugiat ac imperdiet urna interdum. Iaculis orci non lorem leo ultrices placerat. Vel massa diam a faucibus.",
      ],
      webinarFor: [
         "Lorem ipsum dolor sit amet consectetur. Vestibulum proin vulputate curabitur sit. At quis ac pellentesque bibendum. Nullam mi enim nec duis netus integer pellentesque ipsum.Consectetur turpis ultrices natoque dui ac purus. Turpis odio porta pellentesque ornare. Vel habitant id platea feugiat ac imperdiet urna interdum. Iaculis orci non lorem leo ultrices placerat. Vel massa diam a faucibus.",
         "Lorem ipsum dolor sit amet consectetur. Vestibulum proin vulputate curabitur sit. At quis ac pellentesque bibendum. Nullam mi enim nec duis netus integer pellentesque ipsum.Consectetur turpis ultrices natoque dui ac purus. Turpis odio porta pellentesque ornare. Vel habitant id platea feugiat ac imperdiet urna interdum. Iaculis orci non lorem leo ultrices placerat. Vel massa diam a faucibus.",
      ],
      webinars: webinarDetails?.data?.related_webinar,
   };

   return (
      <main>
         <div className="web-details container">
            <WebinarTitleSection
               content={{
                  id: content.id,
                  title: content.title,
                  subtitle: content.subtitle,
                  description: content.description,
                  date: content.date,
                  startTime: content.startTime,
                  endTime: content.endTime,
                  price: content.price,
                  availableSeats: content.availableSeats,
                  host: content.host,
                  image: content.image,
                  previewImage: content.previewImage,
               }}
               className="web__sec-1"
            />
            <WebinarDetailsSection
               className="web__sec-2"
               content={{
                  thingsToDo: content.thingsToDo,
                  webinarFor: content.webinarFor,
                  description: content.description,
               }}
            />
            <WebinarFormSection className="web__sec-3" id={content.id} title={content.title} host={content.host} />
         </div>
        {content?.webinars?.length > 0 &&
         <WebinarSliderSection
            webinars={content.webinars}
            sliderClassName="web-details__webinars-section"
            title="Related Webinars"
            containerClassName="container"
            headingClass="subtitle"
         />
         }
      </main>
   );
}

export default WebinarDetailsPage;
