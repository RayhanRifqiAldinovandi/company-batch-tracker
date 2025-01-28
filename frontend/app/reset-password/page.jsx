"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

// Import dari toast
import { toast } from "react-toastify";

// Import logo
import LogoImage from "../../public/logo-login.png";

const page = () => {
  const [username, setUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  const router = useRouter();

  // Fungsi untuk reset password
  const resetPassword = async (e) => {
    e.preventDefault();

    // Jika new password tidak sesuai dengan confirm password tampilkan message password do not match
    if (newPassword !== confirmNewPassword) {
      toast.error("password tidak cocok", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: true,
        closeButton: false,
        closeOnClick: false,
        pauseOnHover: false,
        draggable: false,
        progress: undefined,
        theme: "light",
      });
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/reset-password`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, newPassword, confirmNewPassword }), // Menyesuaikan struktur data yang dikirimkan
      });

      const data = await response.text(); // Mengambil data JSON dari respons

      if (response.ok) {
        setUsername("");
        setNewPassword("");
        setConfirmNewPassword("");
        setTimeout(() => {
          router.push("/login");
        }, 1000);
        // Menampikan alert respon yang dikirimkan oleh backend
        toast.success(data, {
          position: "top-right",
          autoClose: 500,
          hideProgressBar: true,
          closeButton: false,
          closeOnClick: false,
          pauseOnHover: false,
          draggable: false,
          progress: undefined,
          theme: "light",
        });
      } else {
        // Error message
        toast.error(data, {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: true,
          closeButton: false,
          closeOnClick: false,
          pauseOnHover: false,
          draggable: false,
          progress: undefined,
          theme: "light",
        });
      }
    } catch (error) {
      // Error message
      toast.error(error.message, {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: true,
        closeButton: false,
        closeOnClick: false,
        pauseOnHover: false,
        draggable: false,
        progress: undefined,
        theme: "light",
      });
    }
  };

  return (
    <>
      <section className="flex h-screen bg">
        {/* Left block */}
        <div className="hidden w-2/5 sm:flex items-center justify-center bg-gray-100">
          <Image src={LogoImage} alt="Logo Image" className="w-3/5 h-auto object-cover" />
        </div>

        {/* Right block */}
        <div className="w-full sm:w-3/5 flex flex-col justify-center items-center p-8 bg-center bg-cover bg-opacity-50" style={{ backgroundImage: "url('/warehouse.png')", backgroundSize: "130%" }}>
          <div className="mt-[-50px]">
            <h1 className="font-family text-center text-2xl font-bold mb-3 uppercase">change password </h1>
          </div>

          {/* Start Form Reset Password */}
          <form onSubmit={resetPassword} className="w-full max-w-sm">
            <div className="mb-6">
              <label htmlFor="username" className="block mb-2 font-semibold">
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-3 py-2 border-2 rounded-xl shadow-md outline-none focus:border-blue-500 placeholder-opactity-100 text-sm"
                placeholder="Input username"
              />
            </div>
            <div className="mb-8">
              <div className="flex">
                <label htmlFor="new password" className="block font-semibold mb-2 flex-1">
                  New Password
                </label>
              </div>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-3 py-2 border-2 rounded-xl shadow-md outline-none focus:border-blue-500 text-sm"
                placeholder="Min 8 character, 1 uppercase, 1 number"
              />
            </div>
            <div className="mb-8">
              <div className="flex">
                <label htmlFor="new password" className="block font-semibold mb-2 flex-1">
                  Confirm New Password
                </label>
              </div>
              <input
                type="password"
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
                className="w-full px-3 py-2 border-2 rounded-xl shadow-md outline-none focus:border-blue-500 text-sm"
                placeholder="Confirm new password"
              />
            </div>
            <button type="submit" className="w-full bg-blue-500 hover:bg-opacity-70 active:bg-blue-800 text-white font-semibold py-2 mt-4 rounded-lg outline-blue-500 shadow-md transition duration-500">
              Reset Password
            </button>
          </form>
          {/* End Form Reset Password */}
        </div>
      </section>
    </>
  );
};

export default page;
