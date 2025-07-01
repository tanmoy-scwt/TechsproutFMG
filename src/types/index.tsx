export interface NavLink {
   id: string | number;
   link: string;
   title: string;
   icon?: string | React.ReactNode;
   subMenus?: Array<NavLink>;
}
export type UserType = "tutor" | "institute";
export interface Formfield {
   value: string | number | boolean | Date | Array<string> | null | File | Array<{label : string, value : string | number}>;
   isValid: boolean;
   placeholder?: string;
   regex?: RegExp;
   minLength?: number;
   maxLength?: number;
   errorText?: string;
   isVisible?: boolean;
   type?: string;
   autoCapitalize?: "none" | "sentences" | "words" | "characters";
   label?: string;
   icon?: React.ReactNode;
   multiline?: boolean;
   required?: boolean;
   options?: { value: string; label: string }[];
   multiple?: boolean;
   isLoading?: boolean;
   searchParams?: { [key: string]: string | string[] };
   [key: string]: any;
 }
 
 export interface FormDataType {
   [key: string]: Formfield;
 }
