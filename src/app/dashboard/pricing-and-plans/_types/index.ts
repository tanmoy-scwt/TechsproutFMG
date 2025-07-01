export interface CoinPackage {
    id: number; // Unique identifier for the package
    title: string; // Title of the package
    description: string; // Description of the package
    duration_in_months: number | null; // Duration of the package in months, null if not applicable
    min_amount: string; // Minimum amount for the package
    max_amount: string; // Maximum amount for the package
    coin_to_rupee_ratio: string; // Ratio of coins to rupees
    expiry_date: string; // Expiry date of the package in ISO string format
    bonus_coins: number; // Number of bonus coins provided
    status: string; // Current status of the package (e.g., "Active", "Inactive")
    most_popular: number;
    email_automatoin: number;
    premium_support: number;
 }
 

export interface Subscription {
   id: number;
   razorpay_plan_id: string;
   title: string;
   duration_in_months: number;
   actual_price: string;
   offer_price: string;
   free_coins: number;
   is_course_listing: number;
   featured_listing: number;
   description: string | null;
   status: string;
   created_at: string;
   updated_at: string;
}