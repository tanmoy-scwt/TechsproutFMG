import { auth } from "@/lib/auth";
import { SignInFormSection } from "./_components";
import { redirect } from "next/navigation";
import { dashboardLinks as dl } from "@/lib/constants";

async function SignInPage({ searchParams }: any) {
   const session = await auth();
   const callbackUrl = searchParams.callbackUrl;

   if (session) redirect(callbackUrl || dl.dashboard);

   return (
      <main>
         <SignInFormSection />
      </main>
   );
}

export default SignInPage;
