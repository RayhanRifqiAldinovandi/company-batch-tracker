"use client";

import React, { useState } from "react";
import { toast } from "react-toastify";
import { Bounce } from "react-toastify";

const Page = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [department, setDepartment] = useState("");
  const [userType, setUserType] = useState("");
  const [error, setError] = useState("");

  const handleUserTypeChange = (e) => {
    setUserType(e.target.value);
  };

  const handleDeptChange = (e) => {
    setDepartment(e.target.value);
  };

  const handleRegistration = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/register`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password, email, name, department, userType }),
      });
      if (response.ok) {
        // Reset the form fields
        setUsername("");
        setPassword("");
        setEmail("");
        setName("");
        setDepartment("");
        setUserType("");

        toast.success("Registrasi sukses!", {
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
        toast.error("Username sudah ada!", {
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
      console.error("Error saat registrasi: ", error);
      setError("Error terjadi saat registrasi");
    }
  };

  const handleReset = () => {
    // Reset the form fields
    setUsername("");
    setPassword("");
    setEmail("");
    setName("");
    setDepartment("");
    setUserType("");
  };

  return (
    <>
      {/* Main */}
      <div className="border bg-base-100 w-full h-full mt-5 p-5 rounded-xl shadow-lg">
        <div className="w-9/12 mx-auto">
          <form onSubmit={handleRegistration}>
            <div className="form-control">
              <label className="label-text font-medium uppercase">nama</label>
              <input type="text" placeholder="Input nama staff" value={name} onChange={(e) => setName(e.target.value)} className="input input-bordered" required></input>
            </div>
            <div className="form-control mt-4">
              <label className="label-text font-medium uppercase">username</label>
              <input type="text" placeholder="Input username" value={username} onChange={(e) => setUsername(e.target.value)} className="input input-bordered" required></input>
            </div>
            <div className="form-control mt-4">
              <label className="label-text font-medium uppercase">password</label>
              <input type="password" placeholder="Input password" value={password} onChange={(e) => setPassword(e.target.value)} className="input input-bordered" required></input>
            </div>
            <div className="form-control">
              <label className="label-text font-medium uppercase">email</label>
              <input
                type="text"
                placeholder="Input email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                pattern="^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$"
                title="Enter a valid email address"
                className="input input-bordered"
                required
              ></input>
            </div>
            <div className="flex flex-col mt-4">
              <label className="label-text font-medium uppercase">user type</label>
              <select value={userType} onChange={handleUserTypeChange} className="select select-bordered uppercase" required>
                <option value="" disabled selected hidden>
                  Choose User Type
                </option>
                <option value="admin ppic" className="uppercase">
                  admin ppic
                </option>
                <option value="admin produksi" className="uppercase">
                  admin produksi
                </option>
                <option value="admin warehouse" className="uppercase">
                  admin warehouse
                </option>
                <option value="operator produksi 1" className="uppercase">
                  operator produksi 1
                </option>
                <option value="operator produksi 2" className="uppercase">
                  operator produksi 2
                </option>
                <option value="operator warehouse" className="uppercase">
                  operator warehouse
                </option>
                <option value="operator timbang" className="uppercase">
                  operator timbang
                </option>
              </select>
            </div>
            <div className="flex flex-col mt-4">
              <label className="label-text font-medium uppercase">departemen</label>
              <select value={department} onChange={handleDeptChange} className="select select-bordered uppercase" required>
                <option value="" disabled selected hidden>
                  Choose Departemen
                </option>
                <option value="ppic" className="uppercase">
                  ppic
                </option>
                <option value="warehouse" className="uppercase">
                  warehouse
                </option>
                <option value="produksi" className="uppercase">
                  produksi
                </option>
              </select>
            </div>
            <div className="flex justify-end mt-4">
              <button type="button" onClick={handleReset} className="bg-[#D10000] text-white uppercase px-4 py-2 rounded-md hover:bg-red-700 transition duration-300">
                reset
              </button>
              <button type="submit" className="bg-blue-700 text-white uppercase ml-4 px-4 py-2 rounded-md hover:bg-[#302F8E] transition duration-300">
                submit
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default Page;
