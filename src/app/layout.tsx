import "./globals.css";

import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import { Toaster } from "sonner";
import { SessionProvider } from "next-auth/react";
// import { ClientFetch } from "@/actions/client-fetch";
// import { GoogleAnalytics } from "@next/third-parties/google";
import type { Viewport } from 'next'
import { HotjarScript } from "@/components/HotjarScript";
import GoogleAnalyticsClient from "@/components/GoogleAnalyticsClient";

const poppins = Poppins({
   style: ["normal"],
   subsets: ["latin"],
   display: "swap",
   variable: "--font-poppins",
   weight: ["300", "400", "500", "600", "700"],
});
const inter = Inter({
   style: ["normal"],
   subsets: ["latin"],
   display: "swap",
   variable: "--font-inter",
});

const fonts = `${poppins.variable} ${inter.variable}`;

// Fetch Google Analytics Tracking ID
// async function getGoogleAnalytics() {
//    const res = await ClientFetch(`${process.env.API_URL}/home/default`, { cache: "no-store" });
//    return await res.json();
// }

export const metadata: Metadata = {
   title: {
      default: "Find My Guru",
      template: "%s - Find My Guru",
   },
   description: "Find My Guru",
};

export const viewport: Viewport = {
   width: 'device-width',
   initialScale: 1,
   maximumScale: 1,
   userScalable: false,
   // Also supported but less commonly used
   // interactiveWidget: 'resizes-visual',
}

export default async function RootLayout({
   children,
}: Readonly<{
   children: React.ReactNode;
}>) {
   // const defaultData = await getGoogleAnalytics();
   return (
      <html lang="en">
         <body className={`${fonts} antialiased`}>
            <SessionProvider>
               {children}
               <div id="portal"></div>
               <Toaster />
            </SessionProvider>
         </body>

         {/* <GoogleAnalytics gaId={defaultData?.data?.google_analytics} /> */}
         {/* replacing the upper one with client side component for increasing application performance */}
         <GoogleAnalyticsClient />


         {/* Hotjar Tracking Script */}
         {/* <script
               dangerouslySetInnerHTML={{
                  __html: `(function(h,o,t,j,a,r){
                        h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
                        h._hjSettings={hjid:6433324,hjsv:6};
                        a=o.getElementsByTagName('head')[0];
                        r=o.createElement('script');r.async=1;
                        r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
                        a.appendChild(r);
                     })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');`
               }}
            /> */}
         {/* here use sepearate client component for this for increasing application performance  */}
         <HotjarScript />
      </html>
   );
}
