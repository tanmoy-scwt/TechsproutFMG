import { ClientFetch } from "@/actions/client-fetch";
import Footer from "@/components/footer";
import Header from "@/components/header";

async function PublicLayout({ children }: { children: React.ReactNode }) {

   const res = await ClientFetch(`${process.env.API_URL}/home/default`, { cache: "no-store" });
   const footerData = await res.json();

   const resHeader = await ClientFetch(`${process.env.API_URL}/menus`, { cache: "no-store" });
   const headerData = await resHeader.json();

   return (
      <>
         <Header data={headerData?.data} />
         {children}
         <Footer data={footerData?.data} />
      </>
   );
}

export default PublicLayout;
