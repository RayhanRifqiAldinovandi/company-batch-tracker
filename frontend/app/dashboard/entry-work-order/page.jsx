"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

// Import dari react toastify
import { Bounce, toast } from "react-toastify";

// Import auth
import authIsLoggedIn from "@/app/auth/authIsLoggedIn";

const page = () => {
  const [ProductType, setProductType] = useState("");
  const [WONumber, setWoNumber] = useState("");
  const [BatchNumber, setBatchNumber] = useState("");
  const [ItemCode, setItemCode] = useState("");

  // Fungsi yang di ambil dari auth
  const { loggedInUser } = authIsLoggedIn();
  // Mengambi userType dari fungsi auth
  const { userType } = loggedInUser;
  const router = useRouter();

  useEffect(() => {
    // Jika userType bukan super admin atau admin redirect ke halaman sebelumnya
    if ((userType && userType !== "super admin") && userType !== "admin") {
      router.back();
    }
  }, [userType]);

  // Fungsi untuk handle product type
  const handleProductType = (e) => {
    setProductType(e.target.value);
  };

  // Fungsi untuk handle entry work order
  const handleEntryWo = async (e) => {
    // Agar halaman tidak auto refresh
    e.preventDefault();

    try {
      // Menyimpan token di localstorage
      const token = localStorage.getItem("token");

      // Menggunakan API dengan endpoint entry-wo
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/entry-wo`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ProductType,
          WONumber,
          BatchNumber,
          ItemCode,
        }),
      });

      if (response.ok) {
        // Jika berhasil kosongkan field input
        setProductType("");
        setWoNumber("");
        setBatchNumber("");
        setItemCode("");

        // Menampilkan alert jika berhasil entry work order
        toast.success("Entry work order successfull!", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeButton: false,
          closeOnClick: false,
          pauseOnHover: false,
          draggable: false,
          progress: undefined,
          theme: "light",
          transition: Bounce,
        });
      } else {
        const errorMessage = await response.text();
        toast.error(errorMessage, {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeButton: false,
          closeOnClick: false,
          pauseOnHover: false,
          draggable: false,
          progress: undefined,
          theme: "light",
          transition: Bounce,
        });
      }
    } catch (error) {
      console.log("error", error.message);
    }
  };

  const handleReset = () => {
    // Reset field input
    setProductType("");
    setWoNumber("");
    setBatchNumber("");
    setItemCode("");
  };

  return (
    <>
      {/* Main page */}
      <section className="border rounded-md shadow-md w-full h-full mt-5 p-5">
        {/* Form */}
        <div className="w-9/12 mx-auto">
          {/* Start Form Entry Work Order */}
          <form onSubmit={handleEntryWo}>
            <div className="form-control">
              <label className="label-text font-medium uppercase">jenis work order :</label>
              <select value={ProductType} onChange={handleProductType} className="select select-bordered uppercase" required>
                <option value="" disabled defaultValue hidden>
                  Choose Jenis Work Order
                </option>
                <option value="minor" className="uppercase">
                  minor
                </option>
                <option value="ruah" className="uppercase">
                  ruah
                </option>
                <option value="kemas" className="uppercase">
                  kemas
                </option>
              </select>
            </div>
            <div className="form-control mt-4">
              <label className="label-number font-medium uppercase">no. work order</label>
              <input type="number" placeholder="Input nomor work order" value={WONumber} onChange={(e) => setWoNumber(e.target.value)} className="input input-bordered" required></input>
            </div>
            <div className="form-control mt-4">
              <label className="label-text font-medium uppercase">no. batch</label>
              <input type="text" placeholder="Input nomor batch" value={BatchNumber} onChange={(e) => setBatchNumber(e.target.value)} className="input input-bordered" required></input>
            </div>
            <div className="form-control mt-4">
              <label className="label-text font-medium uppercase">kode produk</label>
              <input type="text" placeholder="Input kode produk" value={ItemCode} onChange={(e) => setItemCode(e.target.value)} className="input input-bordered" required></input>
              {/* Button */}
              <div className="flex justify-end mt-4">
                <button type="button" onClick={handleReset} className="bg-[#D10000] text-white uppercase px-4 py-2 rounded-md hover:bg-red-700 transition duration-300">
                  reset
                </button>
                <button type="submit" className="bg-blue-700 text-white uppercase ml-4 px-4 py-2 rounded-md hover:bg-[#302F8E] transition duration-300">
                  submit
                </button>
              </div>
            </div>
          </form>
          {/* End Form Entry Work Order */}
        </div>
      </section>
    </>
  );
};

export default page;
