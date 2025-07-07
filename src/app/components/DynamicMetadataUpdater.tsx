"use client";

import { useEffect, useState } from "react";

interface User {
  _id?: string;
  id?: string;
  companyName?: string;
  primaryColor?: string;
  name?: string;
}

export default function DynamicMetadataUpdater() {
  const [logoUrl, setLogoUrl] = useState<string | null>(null);

  useEffect(() => {
    const updateMetadata = async () => {
      try {
        // Get user data from localStorage
        const stored = localStorage.getItem("user");
        if (!stored) return;

        const user: User = JSON.parse(stored);

        // Update document title with company name
        const title = user.companyName
          ? `${user.companyName} - Insurance App`
          : "Insurance App";
        document.title = title;

        // Update meta description
        const description = user.companyName
          ? `${user.companyName} comprehensive insurance management platform`
          : "Comprehensive insurance management platform";

        updateMetaTag("description", description);

        // Update theme color if available
        if (user.primaryColor) {
          updateMetaTag("theme-color", user.primaryColor);
        }

        // Fetch and update favicon with user's logo
        const userId = user._id || user.id;
        if (userId) {
          await updateFavicon(userId);
        }
      } catch (error) {}
    };

    updateMetadata();

    // Cleanup function
    return () => {
      if (logoUrl) {
        URL.revokeObjectURL(logoUrl);
      }
    };
  }, []);

  const updateMetaTag = (name: string, content: string) => {
    let metaTag = document.querySelector(
      `meta[name="${name}"]`
    ) as HTMLMetaElement;
    if (metaTag) {
      metaTag.setAttribute("content", content);
    } else {
      metaTag = document.createElement("meta");
      metaTag.setAttribute("name", name);
      metaTag.setAttribute("content", content);
      document.head.appendChild(metaTag);
    }
  };

  const updateFavicon = async (userId: string) => {
    try {
      const baseUrl =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";
      const response = await fetch(`${baseUrl}/auth/me`, {
        credentials: "include",
      });

      if (response.ok) {
        const userData = await response.json();
        let url: string = "";
        let blob: Blob | null = null;
        if (userData.logo) {
          const byteArray = userData.logo.split(",").map(Number);
          const uint8Array = new Uint8Array(byteArray);
          blob = new Blob([uint8Array], { type: "image/png" });
          url = URL.createObjectURL(blob);
          setLogoUrl(url);
        } else {
          setLogoUrl(null);
        }

        // Remove existing favicon links first
        const existingLinks = document.querySelectorAll('link[rel*="icon"]');
        existingLinks.forEach((link) => link.remove());

        // Create new favicon links
        const createFaviconLink = (
          rel: string,
          href: string,
          type?: string
        ) => {
          const link = document.createElement("link");
          link.rel = rel;
          link.href = href;
          if (type) link.type = type;
          document.head.appendChild(link);
          return link;
        };

        // Add all favicon variants
        createFaviconLink("icon", url, blob?.type);
        createFaviconLink("shortcut icon", url, blob?.type);
        createFaviconLink("apple-touch-icon", url);
      } else {
      }
    } catch (error) {}
  };

  // This component doesn't render anything visible
  return null;
}
