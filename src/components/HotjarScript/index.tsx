"use client";

import { useEffect } from "react";

export function HotjarScript(): JSX.Element | null {
  useEffect(() => {
    (function (
      h: any,
      o: Document,
      t: string,
      j: string,
      a?: HTMLHeadElement,
      r?: HTMLScriptElement
    ) {
      h.hj =
        h.hj ||
        function (...args: any[]) {
          (h.hj.q = h.hj.q || []).push(args);
        };
      h._hjSettings = { hjid: 6433324, hjsv: 6 };
      a = o.getElementsByTagName("head")[0] as HTMLHeadElement;
      r = o.createElement("script");
      r.async = true;
      r.src = t + h._hjSettings.hjid + j + h._hjSettings.hjsv;
      a.appendChild(r);
    })(window as any, document, "https://static.hotjar.com/c/hotjar-", ".js?sv=");
  }, []);

  return null;
}
