import { NextResponse } from "next/server";

export async function POST(req: Request) {
   const { token } = await req.json();

   const secretKey = process.env.RECAPTCHA_SECRET_KEY;
   const verificationUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${token}`;

   try {
      const response = await fetch(verificationUrl, { method: "POST" });
      const data = await response.json();

      if (data.success) {
         return NextResponse.json({ success: true });
      } else {
         return NextResponse.json({ success: false, errors: data["error-codes"] });
      }
   } catch (error) {
      return NextResponse.json({ success: false, error: "Server error" });
   }
}
