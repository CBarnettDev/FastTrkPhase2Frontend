"use client";

import {
  HomeIcon,
  UserIcon,
  CheckCircleIcon,
  DocumentTextIcon,
  CogIcon,
  ArrowLeftOnRectangleIcon,
  TruckIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useLocalStorage } from "@/hooks/useLocalStorage";

const navigation = [
  {
    name: "Verification",
    href: "/dashboard/verification",
    icon: CheckCircleIcon,
    enabled: true,
  },
  { name: "Dashboard", href: "/dashboard", icon: HomeIcon, enabled: false },
  { name: "Profile", href: "/profile", icon: UserIcon, enabled: false },
  {
    name: "Vehicles",
    href: "/dashboard/vehicles",
    icon: TruckIcon,
    enabled: true,
  },
  {
    name: "Documents",
    href: "/documents",
    icon: DocumentTextIcon,
    enabled: false,
  },
  { name: "Settings", href: "/settings", icon: CogIcon, enabled: false },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [logoLoading, setLogoLoading] = useState(true);
  const [user, setUser, isUserLoading] = useLocalStorage("user", {
    id: "",
    companyName: "",
  });

  // Fetch logo when component mounts or user changes
  useEffect(() => {
    const fetchUserData = async () => {
      if (!user?.id) {
        setLogoLoading(false);
        return;
      }

      try {
        setLogoLoading(true);
        const baseUrl =
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";
        const response = await fetch(`${baseUrl}/auth/me`, {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          const userData = await response.json();

          // Extract logo from user data if available
          if (userData.logo) {
            const byteArray = userData.logo.split(",").map(Number);
            const uint8Array = new Uint8Array(byteArray);
            const blob = new Blob([uint8Array], { type: "image/png" });
            const url = URL.createObjectURL(blob);
            setLogoUrl(url);
          } else {
            setLogoUrl(null);
          }

          // Update user data in local storage
          setUser(userData);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLogoLoading(false);
      }
    };

    fetchUserData();

    // Cleanup function to revoke blob URL if it was created
    return () => {
      if (logoUrl && logoUrl.startsWith("blob:")) {
        URL.revokeObjectURL(logoUrl);
      }
    };
  }, [user?.id]);

  const handleLogout = async () => {
    setIsLoading(true);

    try {
      const baseUrl =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";
      await fetch(`${baseUrl}/auth/logout`, {
        method: "POST",
        credentials: "include",
      });

      // Cleanup logo URL
      if (logoUrl) {
        URL.revokeObjectURL(logoUrl);
        setLogoUrl(null);
      }

      // Remove client-side storage
      localStorage.removeItem("user");

      // Redirect to login
      router.push("/login");
    } catch (error) {
      setIsLoading(false);
    }
  };

  return (
    <aside className="fixed inset-y-0 left-0 z-40 w-64 flex flex-col border-r border-gray-200 bg-white shadow-sm">
      <div className="flex h-16 items-center px-6 border-b border-gray-100">
        <div className="flex items-center gap-3">
          {/* Logo container */}
          <div className="flex-shrink-0">
            {logoLoading ? (
              // Loading skeleton
              <div className="w-8 h-8 bg-gray-200 rounded animate-pulse"></div>
            ) : logoUrl ? (
              // Display logo
              <img
                src={logoUrl}
                alt={`${user?.companyName || "Company"} logo`}
                className="w-8 h-8 object-contain rounded"
                onError={() => {
                  setLogoUrl(null);
                }}
              />
            ) : (
              // Fallback icon when no logo
              <div className="w-8 h-8 bg-indigo-100 rounded flex items-center justify-center">
                <span
                  style={{ color: "#0091FF" }}
                  className="font-semibold text-sm"
                >
                  {user?.companyName?.charAt(0)?.toUpperCase() || "I"}
                </span>
              </div>
            )}
          </div>

          {/* Company name and subtitle */}
          <div className="flex flex-col">
            <h1
              style={{ color: "#0091FF" }}
              className="text-2xl font-bold truncate leading-tight drop-shadow-sm"
            >
              {user?.companyName || "Insurance"}
            </h1>
            <p className="text-xs text-gray-500 font-medium tracking-wide">
              FastTrk AI
            </p>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-4 py-4 overflow-y-auto">
        <ul className="space-y-2">
          {navigation.map((item) => (
            <li key={item.name}>
              {item.enabled ? (
                <Link
                  href={item.href}
                  className={`flex items-center gap-x-3 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                    pathname === item.href
                      ? "bg-indigo-100 text-blue-400"
                      : "text-gray-700 hover:bg-indigo-50 hover:text-blue-400"
                  } ${isLoading ? "pointer-events-none opacity-50" : ""}`}
                >
                  <item.icon
                    className={`h-5 w-5 ${
                      pathname === item.href
                        ? "text-blue-400"
                        : "text-gray-400 group-hover:text-blue-400"
                    }`}
                  />
                  {item.name}
                </Link>
              ) : (
                <div className="flex items-center gap-x-3 rounded-md px-3 py-2 text-sm font-medium text-gray-400 cursor-not-allowed">
                  <item.icon className="h-5 w-5 text-gray-300" />
                  {item.name}
                </div>
              )}
            </li>
          ))}
        </ul>
      </nav>

      {/* Development notice */}
      <div className="px-4 py-3">
        <div className="flex items-center gap-2 px-3 py-2 bg-orange-50 border border-orange-200 rounded-lg">
          <ExclamationTriangleIcon className="h-4 w-4 text-orange-500 flex-shrink-0" />
          <p className="text-xs text-orange-700 font-medium">
            Some features are under development
          </p>
        </div>
      </div>

      <div className="px-4 py-3 border-t border-gray-300">
        <button
          onClick={handleLogout}
          disabled={isLoading}
          className={`flex w-full items-center gap-x-3 rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-indigo-50 hover:text-blue-400 ${
            isLoading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          <ArrowLeftOnRectangleIcon className="h-5 w-5 text-gray-400 group-hover:text-blue-400" />
          {isLoading ? "Signing out..." : "Sign out"}
        </button>
      </div>
    </aside>
  );
}
