/** @type {import('next').NextConfig} */
const nextConfig = {
   images: {
        unoptimized: false,
      remotePatterns: [
         {
            protocol: "https",
            hostname: "apis.findmyguru.com",
            port: "",
            pathname: "**",
         },
         {
            protocol: "https",
            hostname: "simpreative.in",
            port: "",
            pathname: "**",
         },
         {
            protocol: "https",
            hostname: "via.placeholder.com",
            port: "",
            pathname: "**",
         },
      ],
   },

   // experimental: {
   //    serverActions: {
   //       allowedOrigins: ['animated-engine-rqwqxg56x9qfxq7v-3000.app.github.dev', 'localhost:3000']
   //    }
   // }

   async redirects() {
      return [
        {
          source: "/:path*", // Match all paths
          has: [
            {
              type: "host",
              value: "findmyguru.com", // Non-www domain
            },
          ],
          destination: "https://www.findmyguru.com/:path*", // Redirect to www version
          permanent: true, // 301 redirect
        },
      ];
    },

};

export default nextConfig;
