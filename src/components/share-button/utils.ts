import { isMobile } from "@/lib/utils";
import { FacebookShareProps, TwitterShareProps, WhatsappShareProps } from "./types";

export const twitterShare = async ({ text, tagPerson, hashtags, url }: TwitterShareProps) => {
   if (!url) throw new Error("Please provide the share link for Twitter Share");

   const twitterIntentUrl = `https://www.twitter.com/intent/tweet`;

   const searchParams = new URLSearchParams({ url: `${url}\n\n` });

   //Adding optional search param values
   if (text) {
      searchParams.append("text", `${text}\n`);
   }
   if (tagPerson) {
      searchParams.append("via", `${tagPerson}\n`);
   }
   if (hashtags) {
      searchParams.append("hashtags", `${hashtags}`);
   }

   const URI = twitterIntentUrl + `?${searchParams.toString()}`;

   window.open(URI, "_blank");
};

export const whatsappShare = ({ text, url }: WhatsappShareProps) => {
   const mobile = isMobile();
   const shareText = encodeURIComponent(`${text}:\n\n${url}`);

   const whatsappIntentUrl = mobile
      ? `https://api.whatsapp.com/send?text=${shareText}`
      : `https://web.whatsapp.com/send?text=${shareText}`;

   window.open(whatsappIntentUrl, "_blank");
};

export const FacebookShare = async ({ url }: FacebookShareProps) => {
   window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, "_blank");
};
