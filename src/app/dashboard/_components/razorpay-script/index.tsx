import Script from "next/script";

function RazorpayScript() {
   return <Script id="razorpay-checkout-js" src="https://checkout.razorpay.com/v1/checkout.js" />;
}

export default RazorpayScript;
