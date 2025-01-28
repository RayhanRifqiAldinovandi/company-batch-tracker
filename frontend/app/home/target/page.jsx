"use client";

import { useState, useEffect } from "react";

// Import file
import authIsLoggedIn from "@/app/auth/authIsLoggedIn";

// Import dari react toastify
import { Bounce, toast } from "react-toastify";

import { CiEdit } from "react-icons/ci";
import { useRouter } from "next/navigation";
import { MenuItem, Pagination, PaginationItem, Stack, TextField } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

const Page = () => {
  const [targetValue, setTargetValue] = useState("");
  const [targetMonth, setTargetMonth] = useState("");
  const [targetYear, setTargetYear] = useState("");
  const [targetFor, setTargetFor] = useState("");
  const [productKeys, setProductKeys] = useState([]);
  const [fetchDataTarget, setFetchDataTarget] = useState([]);
  const [currentId, setCurrentId] = useState(-1);
  const [pageSize, setPageSize] = useState(5); // State untuk menyimpan jumlah data yang ditampilkan per halaman
  const [currentPage, setCurrentPage] = useState(1); // Deklarasikan state untuk halaman saat ini

  const { loggedInUser } = authIsLoggedIn();
  const { userType } = loggedInUser;

  const router = useRouter();

  useEffect(() => {
    if (userType && userType !== "super admin") {
      router.back();
    }
  }, [userType]);

  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const years = Array.from(new Array(21), (_, index) => new Date().getFullYear() - 2 + index);

  useEffect(() => {
    const fetchProductKeys = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/prod-keys?product_type=kemas`);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setProductKeys(data);
      } catch (error) {
        console.error("Error fetching product keys:", error);
      }
    };

    const currentDate = new Date();
    setTargetMonth(months[currentDate.getMonth()]); // set the month as a string
    setTargetYear(currentDate.getFullYear());

    setInterval(() => {
      const fetchTarget = async () => {
        try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/get-targets`);
          const data = await response.json();
          setFetchDataTarget(data);
          // console.log(data);
        } catch (error) {
          console.log(error.message);
        }
      };

      fetchTarget();
    }, 1000);

    fetchProductKeys();
    return () => clearInterval();
  }, []);

  const handleUploadTarget = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/upload-target`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          target_value: targetValue,
          month: targetMonth,
          target_year: targetYear,
          target_for: targetFor,
        }),
      });

      if (response.ok) {
        // Clear form fields after successful creation
        setTargetValue("");
        setTargetFor("");
        setTargetMonth(months[new Date().getMonth()]);
        setTargetYear(new Date().getFullYear());

        toast.success(`Nilai target ${targetValue} sukses dimasukkan `, {
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
      console.log(error.message);
    }
  };

  const handleUpdateTarget = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/update-target`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          uniqueNumber: currentId,
          target_value: targetValue,
          month: targetMonth,
          target_year: targetYear,
          target_for: targetFor,
        }),
      });

      if (response.ok) {
        // Clear form fields after successful update
        setTargetValue("");
        setTargetFor("");
        setTargetMonth(months[new Date().getMonth()]);
        setTargetYear(new Date().getFullYear());
        setCurrentId(-1);

        toast.success(`Nilai target ${targetValue} sukses dimasukkan `, {
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
      console.log(error.message);
    }
  };

  const handleEdit = (item) => {
    setTargetValue(item.target_value);
    setTargetMonth(item.month);
    setTargetYear(item.target_year);
    setTargetFor(item.target_for);
    setCurrentId(item.uniqueNumber);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (currentId === -1) {
      handleUploadTarget();
    } else {
      handleUpdateTarget();
    }
  };

  // Fungsi untuk mengubah jumlah data yang ditampilkan per halaman
  const handleChangePageSize = (e) => {
    setPageSize(parseInt(e.target.value));
  };

  // Tentukan jumlah item per halaman
  const itemsPerPage = pageSize;

  // Hitung indeks data yang akan ditampilkan
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, fetchDataTarget.length);

  // Ambil subset data yang sesuai dengan halaman saat ini
  const paginatedData = fetchDataTarget.slice(startIndex, endIndex);

  // Callback untuk perubahan halaman
  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  return (
    <div className="sm:flex sm:justify-between">
      <div className="bg-white p-8 sm:mr-4 w-max h-max border rounded-3xl shadow-lg">
        <h1 className="font-semibold">Form Input Target</h1>
        <hr className="mb-4" />

        <form onSubmit={handleSubmit}>
          <div>
            <input type="number" placeholder="Input nilai target" value={targetValue} onChange={(e) => setTargetValue(e.target.value)} className="input input-bordered" />
          </div>
          <div className="mt-2">
            <select value={targetFor} onChange={(e) => setTargetFor(e.target.value)} className="select select-bordered">
              <option value="" disabled>
                Pilih Kode item
              </option>
              {productKeys.map((key, index) => (
                <option key={index} value={key.product_key}>
                  {key.product_key}
                </option>
              ))}
            </select>
          </div>
          <div className="mt-2">
            <select value={targetMonth} onChange={(e) => setTargetMonth(e.target.value)} className="select select-bordered mr-2">
              {months.map((month, index) => (
                <option key={index} value={month}>
                  {month}
                </option>
              ))}
            </select>
            <select value={targetYear} onChange={(e) => setTargetYear(e.target.value)} className="select select-bordered">
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>
          {currentId === -1 ? (
            <button type="submit" className="btn btn-success mt-2">
              Submit
            </button>
          ) : (
            <button type="button" className="btn btn-warning mt-2" onClick={handleUpdateTarget}>
              Update
            </button>
          )}
        </form>
      </div>

      <div className="bg-white p-8 flex flex-col mt-4 sm:mt-0 sm:flex-grow border rounded-3xl shadow-lg overflow-auto">
        {/* Search */}
        <div className="w-2/5 mb-4">
          <label className="input input-bordered bg-white flex items-center gap-2 py-7">
            <input type="text" className="grow" placeholder="Search" />
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4 opacity-70">
              <path fillRule="evenodd" d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z" clipRule="evenodd" />
            </svg>
          </label>
        </div>
        <table className="report-table table table-zebra table-pin-rows table-pin-cols w-full">
          <thead>
            <tr>
              <th>#</th>
              <th>Nilai target</th>
              <th>Kode item</th>
              <th>Bulan</th>
              <th>Tahun</th>
              <th className="text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((item, index) => (
              <tr key={item.uniqueNumber}>
                <td>{index + 1}</td>
                <td>{item.target_value}</td>
                <td>{item.target_for}</td>
                <td>{item.month}</td>
                <td>{item.target_year}</td>
                <td className="text-center">
                  <button onClick={() => handleEdit(item)} className="bg-[#D10000] text-white uppercase px-4 py-2 rounded-md hover:bg-red-700 transition duration-300">
                    <CiEdit className="w-6 h-6" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {/* Select Page Size */}
        <div className="flex justify-end items-center my-5 mr-2">
          <p>Showing</p>
          <div className="mx-2">
            <TextField select value={pageSize} onChange={handleChangePageSize} size="small" variant="outlined">
              <MenuItem value={5}>5</MenuItem>
              <MenuItem value={10}>10</MenuItem>
              <MenuItem value={15}>15</MenuItem>
              <MenuItem value={20}>20</MenuItem>
              <MenuItem value={25}>25</MenuItem>
              <MenuItem value={50}>50</MenuItem>
              <MenuItem value={75}>75</MenuItem>
              <MenuItem value={100}>100</MenuItem>
            </TextField>
          </div>
          <p>Entries</p>

          {/* Pagination */}
          <Stack spacing={2} marginLeft="10px">
            <Pagination count={Math.ceil(fetchDataTarget.length / pageSize)} page={currentPage} onChange={handlePageChange} renderItem={(item) => <PaginationItem slots={{ previous: ArrowBackIcon, next: ArrowForwardIcon }} {...item} />} />
          </Stack>
        </div>
      </div>
    </div>
  );
};

export default Page;
