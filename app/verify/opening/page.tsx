"use client";

import { useEffect, Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";

function OpeningContent() {
  const searchParams = useSearchParams();
  const [redirectUrl, setRedirectUrl] = useState("https://creator-network-api.createsync.help/");

  useEffect(() => {
    const urlParam = searchParams.get("url");
    if (urlParam) {
      setRedirectUrl(urlParam);
    } else {
      // Fallback: load from API
      fetch("/api/verification-domain")
        .then((res) => res.json())
        .then((data) => {
          if (data.fullUrl) {
            setRedirectUrl(data.fullUrl);
          }
        })
        .catch((err) => {
          console.error("Failed to load verification domain:", err);
        });
    }
  }, [searchParams]);

  useEffect(() => {
    if (redirectUrl) {
      const timer = setTimeout(() => {
        window.location.href = redirectUrl;
      }, 200); // 0.2 second delay

      return () => clearTimeout(timer);
    }
  }, [redirectUrl]);

  return (
    <div style={{
      width: "100%",
      height: "100vh",
      backgroundColor: "#ffffff",
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
      fontSize: "16px",
      color: "#333333",
      margin: 0,
      padding: "20px",
      boxSizing: "border-box"
    }}>
      <div style={{
        textAlign: "left"
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
        backgroundColor: "#ffffff",
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
        fontSize: "16px",
        color: "#333333",
        padding: "20px",
        boxSizing: "border-box"
      }}>
        <div style={{ textAlign: "left" }}>
          Opening verification...
        </div>
      </div>
    }>
      <OpeningContent />
    </Suspense>
  );
}
