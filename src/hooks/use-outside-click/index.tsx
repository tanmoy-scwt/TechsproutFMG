import { useEffect, useRef } from "react";

function useOutsideClick<T>(onOutsideClick?: () => void) {
   const ref = useRef<T>(null);

   useEffect(() => {
      function handleClick(e: MouseEvent) {
         e.stopPropagation();
         const el = e.target as HTMLElement;
         const refEl = ref.current as HTMLElement;
         if (el && !refEl?.contains(el)) {
            onOutsideClick?.();
         }
      }

      document.addEventListener("click", handleClick);

      return () => {
         document.removeEventListener("click", handleClick);
      };
   }, [onOutsideClick]);

   return ref;
}

export default useOutsideClick;
