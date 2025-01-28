"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSelectedLayoutSegments } from "next/navigation";

// Import komponen
import Loading from "@/app/components/Loading";
import Navigation from "../components/bar/Navigation";
import Footer from "../components/Footer";

const Layout = ({ children }) => {
  const router = useRouter();
  const [loading, setIsLoading] = useState(true);
  const segments = useSelectedLayoutSegments();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const tokenData = parseJwt(token);
      if (tokenData.exp * 1000 < Date.now()) {
        router.push("/login");
      } else {
        setIsLoading(false);
      }
    } else {
      router.push("/login"); // Redirect ke halaman login jika tidak ada token
    }
  }, [router]);

  // Fungsi untuk mendekode token JWT
  const parseJwt = (token) => {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  };

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <>
          {/* Main page */}
          <main className="flex flex-col min-h-screen">
            {/* Navigation */}
            <Navigation />

            <div className="flex-1 px-3 pb-5 lg:pl-[90px]">
              <ul className="my-4">
                {/* Menampilkan segments */}
                {segments.map((segment, index) => (
                  <li key={index}>
                    <span className="text-gray-400 capitalize">
                      <Link href="/home">home</Link> /
                    </span>{" "}
                    <span className="font-semibold">{segment.replace(/-/g, " ")}</span>
                  </li>
                ))}
              </ul>

              {children}
            </div>

            <Footer />
          </main>
        </>
      )}
    </>
  );
};

export default Layout;
