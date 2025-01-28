"use client";

import { useState } from "react";
import Link from "next/link";

// Import dari react toastify
import { toast, Flip } from "react-toastify";

// Import icon
import { ArrowLeftIcon } from "@heroicons/react/outline";

const page = () => {
  const [email, setEmail] = useState("");

  // Fungsi forgot password
  const handleForgotPassword = async (e) => {
    // Agar halaman tidak di refresh secara otomatis
    e.preventDefault();
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/forgot-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        // Menampilkan alert
        toast.success("Reset password dikirim ke email anda", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: true,
          closeButton: false,
          closeOnClick: false,
          pauseOnHover: false,
          draggable: false,
          progress: undefined,
          theme: "light",
          transition: Flip,
        });
      } else {
        // Jika email tidak ada di database maka tampilkan alert email not found
        if (response.status === 404) {
          toast.error("Email tidak ditemukan", {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: true,
            closeButton: false,
            closeOnClick: false,
            pauseOnHover: false,
            draggable: false,
            progress: undefined,
            theme: "light",
            transition: Flip,
          });
        } else {
          // Failed to send password reset email
          toast.error("Gagal mengirim reset password", {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: true,
            closeButton: false,
            closeOnClick: false,
            pauseOnHover: false,
            draggable: false,
            progress: undefined,
            theme: "light",
            transition: Flip,
          });
        }
      }
    } catch (error) {
      // Error message
      toast.error("Gagal terhubung ke server", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: true,
        closeButton: false,
        closeOnClick: false,
        pauseOnHover: false,
        draggable: false,
        progress: undefined,
        theme: "light",
        transition: Flip,
      });
    }
  };

  return (
    <>
      <section className="bg-[url('/warehouse.png')] bg-[length:110%] flex items-center justify-center h-screen bg-center bg-cover">
        <div className="bg-blue-900 py-20 px-24 rounded-xl shadow-xl bg-opacity-50">
          <div className="bg-white p-8 rounded-lg shadow-md">
            <Link href="/">
              <ArrowLeftIcon className="w-6 h-6 mt-[-15px] ml-[-15px]" />
            </Link>
            <h1 className="text-2xl font-extrabold mb-2 text-center tracking-wide uppercase">forgot password?</h1>
            <p className="text-gray-600 mb-8 text-sm text-center">Enter your email to receive a URL to reset your password.</p>

            {/* Start Form Forgot Password */}
            <form onSubmit={handleForgotPassword} className="flex flex-col items-center">
              <div className="mb-4 w-full max-w-md">
                <p className="mb-2 text-center">Email :</p>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full text-sm text-center px-4 py-2 border-2 border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                  placeholder="Enter your Email"
                  required
                />
              </div>
              <button type="submit" className="w-full bg-blue-500 hover:bg-opacity-70 active:bg-blue-800 text-white font-semibold py-2 rounded-lg outline-blue-500 border-2 tracking-wider transition duration-300">
                Reset Password
              </button>
            </form>
            {/* End Form Forgot Password */}
          </div>
        </div>
      </section>
    </>
  );
};

export default page;
