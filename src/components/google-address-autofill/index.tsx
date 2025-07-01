import React, { useEffect, useRef, useState } from "react";

type Restriction = "cities" | "regions" | "sublocality" | "country";
interface GoogleAddressAutofillProps {
   restrictionType?: Array<Restriction>;
   restrictionCountry?: Array<string>;
   onSelect?: (place: string, placeObj: any) => void;
   defaultValue?: string;
   focus?: boolean;
}
function GoogleAddressAutofill({
   restrictionType,
   onSelect,
   defaultValue,
   focus,
   restrictionCountry = ["in"],
}: GoogleAddressAutofillProps) {
   const inputRef = useRef<HTMLInputElement>(null);
   const [place, setPlace] = useState(defaultValue);

   useEffect(() => {
      // Check if the script is already loaded
      const existingScript = document.querySelector('script[src^="https://maps.googleapis.com/maps/api/js"]');

      if (!existingScript) {
         const script = document.createElement("script");
         script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`;
         script.async = true;
         script.defer = true;
         script.onload = initializeAutocomplete;
         document.body.appendChild(script);
      } else {
         initializeAutocomplete();
      }
   }, []);

   useEffect(() => {
      if (focus) {
         inputRef.current?.focus();
      }
   }, [focus]);

   const initializeAutocomplete = () => {
      if (inputRef.current && (window as any).google) {
         const autocomplete = new (window as any).google.maps.places.Autocomplete(inputRef.current, {
            types: restrictionType || [], // Restrict to cities
            componentRestrictions: { country: restrictionCountry || [] },
         });
         autocomplete.addListener("place_changed", () => {
            const selectedPlace = autocomplete.getPlace();
            onSelect?.(selectedPlace.name, selectedPlace);
            setPlace(selectedPlace.name);
         });
      }
   };

   return (
      <div>
         <input
            type="text"
            className="input"
            ref={inputRef}
            value={place}
            onChange={(e) => {
               setPlace(e.target.value);
               onSelect?.("", {});
            }}
         />
      </div>
   );
}

export default GoogleAddressAutofill;
