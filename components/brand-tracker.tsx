"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";

export function BrandTracker() {
  const searchParams = useSearchParams();

  useEffect(() => {
    const brandParam = searchParams.get("brand");
    if (brandParam) {
      // Save to localStorage
      localStorage.setItem("createsync_brand_ref", brandParam);
      console.log("Brand ref saved:", brandParam);
    }
  }, [searchParams]);

  return null; // This component doesn't render anything
}

