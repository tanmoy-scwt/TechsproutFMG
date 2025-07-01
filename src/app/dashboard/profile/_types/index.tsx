import { UserType } from "@/types";

export interface Country {
   label: string;
   value: string;
}

export interface UserProfile {
   id: number;
   user_type: UserType;
   f_name: string;
   email: string;
   phone: string;
   profile_pic: string | null;
   preview_profile_pic?: string;
   bio: string | null;
   highlights: string | null;
   country: string | null;
   country_name: string | null;
   state: string | null;
   state_name: string | null;
   city: string | null;
   city_name: string | null;
   area: string | null;
   address: string | null;
   qualification: Array<{
      label: string;
      value: string;
   }>;
   language: Array<{
      label: string;
      value: string;
   }>;
   postcode: string | null;
   gst_no: string | null;
   skill: Array<{
      label: string;
      value: string;
   }>;
   countries: Array<Country>;
   year_of_exp: number | null;
}
