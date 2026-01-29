"use client";

import { useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";

function OpeningContent() {
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("url") || "https://creator-network-api.createsync.help/";

  useEffect(() => {
    const timer = setTimeout(() => {
      window.location.href = redirectUrl;
    }, 1000); // 1 second delay

    return () => clearTimeout(timer);
  }, [redirectUrl]);

  return (
    <div style={{
      width: "100%",
      height: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "#ffffff",
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
      fontSize: "16px",
      color: "#333333",
      margin: 0,
      padding: 0
    }}>
      <div style={{
        textAlign: "center"
      }}>
        Opening verification...
      </div>
    </div>
  );
}

export default function OpeningPage() {
  return (
    <Suspense fallback={
      <div style={{
        width: "100%",
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#ffffff",
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
        fontSize: "16px",
        color: "#333333"
      }}>
        Opening verification...
      </div>
    }>
      <OpeningContent />
    </Suspense>
  );
}
