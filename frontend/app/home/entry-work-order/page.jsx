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
  const [selectedProductKey, setSelectedProductKey] = useState("");

  // Fungsi yang di ambil dari auth
  const { loggedInUser } = authIsLoggedIn();

  // Mengambi userType dari fungsi auth
  const { department, userType } = loggedInUser;
  const router = useRouter();

  useEffect(() => {
    // Jika userType bukan super admin atau admin redirect ke halaman sebelumnya
    if (userType && userType !== "super admin" && department !== "ppic") {
      router.back();
    }
  }, [userType, department]);

  // Fungsi untuk handle product type
  const handleProductType = (e) => {
    setProductType(e.target.value);
    setSelectedProductKey("");
  };

  const handleProductKeyChange = (e) => {
    setSelectedProductKey(e.target.value);
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
        toast.success("Entry work order sukses!", {
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

  const [productKeys, setProductKeys] = useState([]);

  useEffect(() => {
    const fetchProductKeys = async () => {
      if (ProductType) {
        try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/prod-keys?product_type=${ProductType}`);
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          const data = await response.json();
          setProductKeys(data);
        } catch (error) {
          console.error("Error fetching product keys:", error);
        }
      }
    };

    fetchProductKeys();
  }, [ProductType]); // Fetch product keys when ProductType changes

  useEffect(() => {
    const selectedProduct = productKeys.find((key) => key.product_key === selectedProductKey);
    if (selectedProduct) {
      setItemCode(selectedProduct.product_key);
    } else {
      setItemCode("");
    }
  }, [productKeys, selectedProductKey]);

  const handleReset = () => {
    // Reset field input
    setProductType("");
    setWoNumber("");
    setBatchNumber("");
    setItemCode("");
    setSelectedProductKey("");
  };

  return (
    <>
      {/* Main page */}
      <section className="border bg-white rounded-md shadow-md w-full h-full mt-5 p-5">
        {/* Form */}
        <div className="w-9/12 mx-auto">
          {/* Start Form Entry Work Order */}
          <form onSubmit={handleEntryWo}>
            <div className="form-control">
              <label className="label-text font-medium uppercase">jenis work order :</label>
              <select value={ProductType} onChange={handleProductType} className="select select-bordered uppercase bg-white" required>
                <option value="" disabled defaultValue hidden>
                  Pilih Jenis Work Order
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
              <input type="number" placeholder="Input nomor work order" value={WONumber} onChange={(e) => setWoNumber(e.target.value)} className="input input-bordered bg-white" required></input>
            </div>
            <div className="form-control mt-4">
              <label className="label-text font-medium uppercase">no. batch</label>
              <input type="text" placeholder="Input nomor batch" value={BatchNumber} onChange={(e) => setBatchNumber(e.target.value)} className="input input-bordered bg-white" required></input>
            </div>
            <div className="form-control mt-4">
              <label className="label-text font-medium uppercase">kode produk</label>
              <select value={selectedProductKey} onChange={handleProductKeyChange} className="select select-bordered bg-white" required>
                <option value="" disabled hidden>
                  Pilih Kode Produk
                </option>
                {productKeys.map((key) => (
                  <option key={key.product_key} value={key.product_key} className="uppercase">
                    {key.product_key}
                  </option>
                ))}
              </select>

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
