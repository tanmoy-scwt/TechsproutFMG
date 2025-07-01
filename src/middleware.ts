// import { auth } from "@/lib/auth";
// import { links } from "@/lib/constants";

// export default auth(async (req) => {
//   const isLoggedIn = req.auth;
//   const requestedUrl = req.nextUrl.pathname;
//   const searchParams = req.nextUrl.searchParams.toString();

//   // Declare checkStatus in the outer scope
//   let profile_complete = 0;
//   let ifAnySubscriptionTakenTillNow = 0;
//   let ifAnyCourseExists = false;


//   // let subscriptionStatus = 0;

//   // Fetch user details and update checkStatus
//   const getUserDetailsStatus = async () => {
//     try {
//       const response = await fetch(
//         `${process.env.API_URL}/current/user/details`,
//         {
//           method: "GET",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${req.auth?.user.token}`,
//           },
//         }
//       );

//       const userStatus = await response.json();
//       console.log("userStatus1", userStatus);
//       profile_complete = userStatus?.data?.profile_complete;
//       ifAnySubscriptionTakenTillNow = userStatus?.data?.ifAnySubscriptionTakenTillNow;
//       ifAnyCourseExists = userStatus?.data?.ifAnyCourseExists;
//       // subscriptionStatus = userStatus?.data?.subscriptionActiveStatus;
//     } catch (error) {
//       console.error("Error fetching user details:", error);
//     }
//   };

//   // Await the result of getUserDetails before proceeding
//   await getUserDetailsStatus();
//   if (
//     isLoggedIn &&
//     profile_complete === 0 &&
//     requestedUrl !== "/dashboard/profile" &&
//     requestedUrl !== "/dashboard/profile/edit"
//   ) {
//     return Response.redirect(
//       `${process.env.AUTH_URL}/dashboard/profile` ||
//       `${process.env.AUTH_URL}/dashboard/profile/edit`
//     );
//   } else if (!isLoggedIn) {
//     const URL = `${process.env.AUTH_URL}${links.signIn
//       }?callbackUrl=${requestedUrl}${searchParams ? `?${searchParams}` : ""}`;
//     return Response.redirect(URL);
//   }
//   // const editCoursePatternPerticularId =
//   //   /^\/dashboard\/courses\/edit\/([^\/]+)$/;
//   // const eitWebinersPatternPerticularId =
//   //   /^\/dashboard\/webinars\/edit\/([^\/]+)$/;

//   if (!ifAnySubscriptionTakenTillNow && profile_complete === 0) {
//     return Response.redirect(
//       `${process.env.AUTH_URL}/dashboard/profile`
//     );
//   }
//   else if (!ifAnySubscriptionTakenTillNow && profile_complete === 1 && ifAnyCourseExists) {
//     return Response.redirect(
//       `${process.env.AUTH_URL}/dashboard/pricing-and-plans`
//     );
//   }
//   else if (!ifAnySubscriptionTakenTillNow && profile_complete === 1 && !ifAnyCourseExists) {
//     return Response.redirect(
//       `${process.env.AUTH_URL}/dashboard/courses/add`
//     );
//   }

//   // if (subscriptionStatus === 0 && requestedUrl === "/dashboard/courses/add") {
//   //   return Response.redirect(
//   //     `${process.env.AUTH_URL}/dashboard/pricing-and-plans`
//   //   );
//   // } else if (
//   //   subscriptionStatus === 0 &&
//   //   editCoursePatternPerticularId.test(requestedUrl)
//   // ) {
//   //   return Response.redirect(
//   //     `${process.env.AUTH_URL}/dashboard/pricing-and-plans`
//   //   );
//   // }
//   // if (subscriptionStatus === 0 && requestedUrl === "/dashboard/webinars/add") {
//   //   return Response.redirect(
//   //     `${process.env.AUTH_URL}/dashboard/pricing-and-plans`
//   //   );
//   // } else if (
//   //   subscriptionStatus === 0 &&
//   //   eitWebinersPatternPerticularId.test(requestedUrl)
//   // ) {
//   //   return Response.redirect(
//   //     `${process.env.AUTH_URL}/dashboard/pricing-and-plans`
//   //   );
//   // }
// });

// export const config = {
//   matcher: ["/dashboard", "/dashboard/:path*"],
// };



// import { auth } from "@/lib/auth";
// import { links } from "@/lib/constants";
// import { NextResponse } from "next/server";

// export default auth(async (req) => {
//   const isLoggedIn = req.auth;
//   const requestedUrl = req.nextUrl.pathname;
//   const searchParams = req.nextUrl.searchParams.toString();

//   // Allow API routes
//   if (requestedUrl.startsWith("/dashboard/api")) {
//     return NextResponse.next();
//   }

//   if (!isLoggedIn) {
//     const redirectUrl = `${process.env.AUTH_URL}${links.signIn}${searchParams ? `?callbackUrl=${requestedUrl}?${searchParams}` : `?callbackUrl=${requestedUrl}`
//       }`;
//     return NextResponse.redirect(redirectUrl);
//   }

//   const responseToReturn = NextResponse.next(); // This one will carry cookies

//   try {
//     const response = await fetch(`${process.env.API_URL}/current/user/details`, {
//       method: "GET",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${req.auth?.user.token}`,
//       },
//     });

//     const userStatus = await response.json();
//     const profile_complete = userStatus?.data?.profile_complete ?? 0;
//     const ifAnySubscriptionTakenTillNow = userStatus?.data?.ifAnySubscriptionTakenTillNow ?? 0;
//     const ifAnyCourseExists = userStatus?.data?.ifAnyCourseExists ?? false;

//     console.log("userStatus", userStatus);

//     // 🍪 Save user status into cookies
//     responseToReturn.cookies.set("profile_complete", profile_complete.toString());
//     responseToReturn.cookies.set("ifAnySubscriptionTakenTillNow", ifAnySubscriptionTakenTillNow.toString());
//     responseToReturn.cookies.set("ifAnyCourseExists", ifAnyCourseExists.toString());

//     // if (ifAnySubscriptionTakenTillNow === true && !["/dashboard/profile", "/dashboard/profile/edit"].includes(requestedUrl)) {
//     //   const redirectRes = NextResponse.redirect(`${process.env.AUTH_URL}/dashboard`);
//     //   return redirectRes;
//     // }
//     // Step 1: Force profile completion
//     if (
//       profile_complete === 0 &&
//       !["/dashboard/profile", "/dashboard/profile/edit"].includes(requestedUrl)
//     ) {
//       const redirectRes = NextResponse.redirect(`${process.env.AUTH_URL}/dashboard/profile`);
//       // Add cookies to the redirect response too!
//       redirectRes.cookies.set("profile_complete", profile_complete.toString());
//       redirectRes.cookies.set("ifAnySubscriptionTakenTillNow", ifAnySubscriptionTakenTillNow.toString());
//       redirectRes.cookies.set("ifAnyCourseExists", ifAnyCourseExists.toString());
//       return redirectRes;
//     }

//     // Step 2: Profile is complete, but no subscription taken
//     if (profile_complete === 1 && !ifAnySubscriptionTakenTillNow) {
//       const allowedRoutes = [
//         "/dashboard/profile",
//         "/dashboard/profile/edit",
//         "/dashboard/courses",
//         "/dashboard/courses/add",
//         "/dashboard/pricing-and-plans",
//       ];

//       const isCourseEdit = /^\/dashboard\/courses\/edit(\/.*)?$/.test(requestedUrl);
//       const isAllowed = allowedRoutes.includes(requestedUrl) || isCourseEdit;

//       if (!isAllowed) {
//         const redirectUrl = ifAnyCourseExists === true
//           ? `${process.env.AUTH_URL}/dashboard/pricing-and-plans`
//           : `${process.env.AUTH_URL}/dashboard/courses/add`;

//         console.log("Redirecting to:", redirectUrl);
//         const redirectRes = NextResponse.redirect(redirectUrl);
//         // Include cookies on redirect too
//         redirectRes.cookies.set("profile_complete", profile_complete.toString());
//         redirectRes.cookies.set("ifAnySubscriptionTakenTillNow", ifAnySubscriptionTakenTillNow.toString());
//         redirectRes.cookies.set("ifAnyCourseExists", ifAnyCourseExists.toString());

//         return redirectRes;
//       }
//     }

//     // ✅ All conditions passed, return the response with cookies
//     return responseToReturn;

//   } catch (error) {
//     console.error("Middleware fetch error:", error);
//     return responseToReturn; // still return the cookie-carrying response
//   }
// });

// export const config = {
//   matcher: ["/dashboard", "/dashboard/:path((?!api).*)"],
// };


// import { auth } from "@/lib/auth";
// import { links } from "@/lib/constants";
// import { NextResponse } from "next/server";

// export default auth(async (req) => {
//   const isLoggedIn = req.auth;
//   const requestedUrl = req.nextUrl.pathname;
//   const searchParams = req.nextUrl.searchParams.toString();

//   // Allow API routes
//   if (requestedUrl.startsWith("/dashboard/api")) {
//     return NextResponse.next();
//   }

//   if (!isLoggedIn) {
//     const redirectUrl = `${process.env.AUTH_URL}${links.signIn}${searchParams ? `?callbackUrl=${requestedUrl}?${searchParams}` : `?callbackUrl=${requestedUrl}`}`;
//     return NextResponse.redirect(redirectUrl);
//   }

//   const responseToReturn = NextResponse.next();

//   try {
//     const response = await fetch(`${process.env.API_URL}/current/user/details`, {
//       method: "GET",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${req.auth?.user.token}`,
//       },
//     });

//     const userStatus = await response.json();
//     const profile_complete = userStatus?.data?.profile_complete ?? 0;
//     const ifAnySubscriptionTakenTillNow = userStatus?.data?.ifAnySubscriptionTakenTillNow ?? 0;
//     const ifAnyCourseExists = userStatus?.data?.ifAnyCourseExists ?? false;

//     // 🍪 Save cookies
//     responseToReturn.cookies.set("profile_complete", profile_complete.toString());
//     responseToReturn.cookies.set("ifAnySubscriptionTakenTillNow", ifAnySubscriptionTakenTillNow.toString());
//     responseToReturn.cookies.set("ifAnyCourseExists", ifAnyCourseExists.toString());

//     // ✅ If subscription is taken, allow full access without any redirection
//     if (ifAnySubscriptionTakenTillNow === true) {
//       return responseToReturn;
//     }

//     // 🟡 Step 1: Force profile completion
//     if (
//       profile_complete === 0 &&
//       !["/dashboard/profile", "/dashboard/profile/edit"].includes(requestedUrl)
//     ) {
//       const redirectRes = NextResponse.redirect(`${process.env.AUTH_URL}/dashboard/profile`);
//       redirectRes.cookies.set("profile_complete", profile_complete.toString());
//       redirectRes.cookies.set("ifAnySubscriptionTakenTillNow", ifAnySubscriptionTakenTillNow.toString());
//       redirectRes.cookies.set("ifAnyCourseExists", ifAnyCourseExists.toString());
//       return redirectRes;
//     }

//     // 🟠 Step 2: Profile complete but no subscription yet
//     if (profile_complete === 1 && !ifAnySubscriptionTakenTillNow) {
//       const allowedRoutes = [
//         "/dashboard/profile",
//         "/dashboard/profile/edit",
//         "/dashboard/courses",
//         "/dashboard/courses/add",
//         "/dashboard/pricing-and-plans",
//       ];

//       const isCourseEdit = /^\/dashboard\/courses\/edit(\/.*)?$/.test(requestedUrl);
//       const isAllowed = allowedRoutes.includes(requestedUrl) || isCourseEdit;

//       if (!isAllowed) {
//         const redirectUrl = ifAnyCourseExists === true
//           ? `${process.env.AUTH_URL}/dashboard/pricing-and-plans`
//           : `${process.env.AUTH_URL}/dashboard/courses/add`;

//         const redirectRes = NextResponse.redirect(redirectUrl);
//         redirectRes.cookies.set("profile_complete", profile_complete.toString());
//         redirectRes.cookies.set("ifAnySubscriptionTakenTillNow", ifAnySubscriptionTakenTillNow.toString());
//         redirectRes.cookies.set("ifAnyCourseExists", ifAnyCourseExists.toString());
//         return redirectRes;
//       }
//     }

//     // ✅ All conditions passed
//     return responseToReturn;

//   } catch (error) {
//     console.error("Middleware fetch error:", error);
//     return responseToReturn; // fallback if API fails
//   }
// });

// export const config = {
//   matcher: ["/dashboard", "/dashboard/:path((?!api).*)"],
// };


import { auth } from "@/lib/auth";
import { links } from "@/lib/constants";
import { NextResponse } from "next/server";

export default auth(async (req) => {
  const isLoggedIn = req.auth;
  const requestedUrl = req.nextUrl.pathname;
  const searchParams = req.nextUrl.searchParams.toString();

  // Allow API routes
  if (requestedUrl.startsWith("/dashboard/api")) {
    return NextResponse.next();
  }

  if (!isLoggedIn) {
    const redirectUrl = `${process.env.AUTH_URL}${links.signIn}${searchParams ? `?callbackUrl=${requestedUrl}?${searchParams}` : `?callbackUrl=${requestedUrl}`
      }`;
    return NextResponse.redirect(redirectUrl);
  }

  const responseToReturn = NextResponse.next();

  try {
    const response = await fetch(`${process.env.API_URL}/current/user/details`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${req.auth?.user.token}`,
      },
    });

    const userStatus = await response.json();
    const profile_complete = userStatus?.data?.profile_complete ?? 0;
    const ifAnySubscriptionTakenTillNow = userStatus?.data?.ifAnySubscriptionTakenTillNow ?? 0;
    const ifAnyCourseExists = userStatus?.data?.ifAnyCourseExists ?? false;

    // 🔒 Read existing cookie values
    const currentProfile = req.cookies.get("profile_complete")?.value;
    const currentSubscription = req.cookies.get("ifAnySubscriptionTakenTillNow")?.value;
    const currentCourseExist = req.cookies.get("ifAnyCourseExists")?.value;

    // 🍪 Set only if values have changed
    if (currentProfile !== profile_complete.toString()) {
      responseToReturn.cookies.set("profile_complete", profile_complete.toString());
    }

    if (currentSubscription !== ifAnySubscriptionTakenTillNow.toString()) {
      responseToReturn.cookies.set("ifAnySubscriptionTakenTillNow", ifAnySubscriptionTakenTillNow.toString());
    }

    if (currentCourseExist !== ifAnyCourseExists.toString()) {
      responseToReturn.cookies.set("ifAnyCourseExists", ifAnyCourseExists.toString());
    }

    // ✅ If subscription is taken, allow full access
    if (ifAnySubscriptionTakenTillNow === true) {
      return responseToReturn;
    }

    // 🟡 Step 1: Force profile completion
    if (
      profile_complete === 0 &&
      !["/dashboard/profile", "/dashboard/profile/edit"].includes(requestedUrl)
    ) {
      const redirectRes = NextResponse.redirect(`${process.env.AUTH_URL}/dashboard/profile`);
      if (currentProfile !== profile_complete.toString()) {
        redirectRes.cookies.set("profile_complete", profile_complete.toString());
      }
      if (currentSubscription !== ifAnySubscriptionTakenTillNow.toString()) {
        redirectRes.cookies.set("ifAnySubscriptionTakenTillNow", ifAnySubscriptionTakenTillNow.toString());
      }
      if (currentCourseExist !== ifAnyCourseExists.toString()) {
        redirectRes.cookies.set("ifAnyCourseExists", ifAnyCourseExists.toString());
      }
      return redirectRes;
    }

    // 🟠 Step 2: Profile complete but no subscription yet
    if (profile_complete === 1 && !ifAnySubscriptionTakenTillNow) {
      const allowedRoutes = [
        "/dashboard/profile",
        "/dashboard/profile/edit",
        "/dashboard/courses",
        "/dashboard/courses/add",
        "/dashboard/pricing-and-plans",
      ];

      const isCourseEdit = /^\/dashboard\/courses\/edit(\/.*)?$/.test(requestedUrl);
      const isAllowed = allowedRoutes.includes(requestedUrl) || isCourseEdit;

      if (!isAllowed) {
        const redirectUrl = ifAnyCourseExists === true
          ? `${process.env.AUTH_URL}/dashboard/pricing-and-plans`
          : `${process.env.AUTH_URL}/dashboard/courses/add`;

        const redirectRes = NextResponse.redirect(redirectUrl);

        if (currentProfile !== profile_complete.toString()) {
          redirectRes.cookies.set("profile_complete", profile_complete.toString());
        }
        if (currentSubscription !== ifAnySubscriptionTakenTillNow.toString()) {
          redirectRes.cookies.set("ifAnySubscriptionTakenTillNow", ifAnySubscriptionTakenTillNow.toString());
        }
        if (currentCourseExist !== ifAnyCourseExists.toString()) {
          redirectRes.cookies.set("ifAnyCourseExists", ifAnyCourseExists.toString());
        }

        return redirectRes;
      }
    }

    // ✅ All checks passed
    return responseToReturn;

  } catch (error) {
    console.error("Middleware fetch error:", error);
    return responseToReturn; // fallback on failure
  }
});

export const config = {
  matcher: ["/dashboard", "/dashboard/:path((?!api).*)"],
};
