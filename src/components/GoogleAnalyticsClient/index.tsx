"use client";

import { useEffect, useState } from "react";
import { GoogleAnalytics } from "@next/third-parties/google";

export default function GoogleAnalyticsClient() {
    const [gaId, setGaId] = useState<string | null>(null);

    useEffect(() => {
        const fetchGA = async () => {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/home/default`, {
                cache: "no-store",
            });
            const data = await res.json();
            setGaId(data?.data?.google_analytics);
        };

        fetchGA();
    }, []);

    if (!gaId) return null;

    return <GoogleAnalytics gaId={gaId} />;
}
