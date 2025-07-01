import { useEffect, useState } from "react";

function useWindowDimension() {
   const [width, setWidth] = useState<number | null>(null);
   const [height, setHeight] = useState<number | null>(null);

   //Set Initial Width & Height
   useEffect(() => {
      setHeight(window.innerHeight);
      setWidth(window.innerWidth);
   }, []);

   //Set Width & Height on Window Resize
   useEffect(() => {
      const handleResizeWindow = () => {
         setHeight(window.innerHeight);
         setWidth(window.innerWidth);
      };

      window.addEventListener("resize", handleResizeWindow);

      return () => {
         window.removeEventListener("resize", handleResizeWindow);
      };
   }, []);

   return { width, height };
}

export default useWindowDimension;
