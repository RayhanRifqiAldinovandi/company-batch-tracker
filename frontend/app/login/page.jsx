/* LOGIN
Berfungsi untuk halaman login
*/

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

// Import dari react toastify untuk memanggil alert dari react toastify
import { Bounce, toast } from "react-toastify";

// Import Logo
import LogoImage from "@/public/logo-login.png";

const page = () => {
  // UseState berfungsi untuk mendeklarasikan state di dalam functional komponen
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const [loggedInUser, setLoggedInUser] = useState("");

  useEffect(() => {
    // Cek apakah ada pengguna yang sudah login saat komponen dimuat
    const loggedInUserData = localStorage.getItem("loggedInUser");
    if (loggedInUserData) {
      const parsedData = JSON.parse(loggedInUserData);
      // console.log(parsedData); // Menampilkan informasi pengguna yang sudah login
      setLoggedInUser(parsedData);
    }
  }, []);

  // Fungsi untuk login
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/login`, {
        method: "POST",
        headers: {
          // Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        const data = await response.json(); // Parse response JSON
        // Menyimpan data di localstorage
        localStorage.setItem("token", data.token);
        // Simpan informasi pengguna yang berhasil login
        localStorage.setItem("loggedInUser", JSON.stringify(data));
        setLoggedInUser(data);

        // Menampilkan alert login sukses
        toast.success("Login sukses!", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: true,
          closeButton: false,
          closeOnClick: false,
          pauseOnHover: false,
          draggable: false,
          progress: undefined,
          theme: "light",
          transition: Bounce,
        });

        // Setelah 1 detik redirect ke halaman home
        setTimeout(() => {
          router.push("/home");
        }, 1000);

        // Jika username dan password kosong menampilkan error
      } else if (username === "" || password === "") {
        setError("Username atau password tidak boleh kosong");
      } else {
        // Failed login
        setError("username atau password salah");
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
        transition: Bounce,
      });
    }
  };

  return (
    <>
      <section className="flex h-screen">
        {/* Left block */}
        <div className="w-2/5 bg-gray-100 hidden lg:flex items-center justify-center ">
          <Image src={LogoImage} alt="Logo Image" className="w-3/5 h-auto object-cover" />
        </div>

        {/* Right block */}
        <div className="bg-[url('/warehouse.png')] bg-center bg-cover bg-opacity-50 bg-[length:130%] w-full lg:w-3/5 flex flex-col justify-center items-center p-8 ">
          <div className="mt-[-50px]">
            <h1 className="font-family text-center text-2xl font-bold uppercase mb-3">
              welcome to bintang toedjoe <br></br> site cikarang
            </h1>
          </div>

          {/* Start Form Login */}
          <form onSubmit={handleLogin} className="w-full max-w-sm">
            <div className="mb-6">
              <label htmlFor="username" className="block mb-2 font-semibold">
                Username
              </label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="bg-white w-full px-3 py-2 border-2 border-white rounded-xl shadow-md outline-none focus:border-blue-500 placeholder-opactity-100 text-sm"
                placeholder="Enter your Username"
              />
            </div>
            <div className="mb-8">
              <div className="flex">
                <label htmlFor="password" className="block font-semibold mb-2 flex-1">
                  Password
                </label>
                <p className="text-sm text-blue-500 cursor-pointer underline flex-2">
                  <Link href="/forgot-password">Forgot Password?</Link>
                </p>
              </div>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-white w-full px-3 py-2 border-2 border-white rounded-xl shadow-md outline-none focus:border-blue-500 text-sm"
                placeholder="Enter your Password"
              />
            </div>
            <button type="submit" className="w-full bg-blue-500 hover:bg-opacity-70 active:bg-blue-800 text-white font-semibold py-2 mt-4 rounded-lg outline-blue-500 shadow-md transition duration-300">
              Login
            </button>
          </form>
          {/* End Form Login */}

          {/* Menampilkan error */}
          {error && <p className="text-red-500 my-2">{error}</p>}
        </div>
      </section>
    </>
  );
};

export default page;
