/* LAYOUT HALAMAN LOGIN */
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

// Import dari react toastify
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Import komponen
import Loading from "@/app/components/Loading";

export default function LoginLayout({ children }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true); // Mengubah initial state loading menjadi true

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      // Decode token untuk memeriksa waktu kedaluwarsa
      const tokenData = parseJwt(token);
      if (tokenData.exp * 1000 < Date.now()) {
        // Jika token sudah kedaluwarsa, redirect ke halaman login
        router.push("/login");
        setLoading(false);
      } else {
        // Jika token masih berlaku, redirect ke dashboard
        router.push("/home");
      }
    } else {
      setLoading(false); // Set loading menjadi false ketika tidak ada token
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
          <ToastContainer />
          <main>{children}</main>
        </>
      )}
    </>
  );
}
