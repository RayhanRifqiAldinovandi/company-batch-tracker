"use client";

import React, { useEffect, useState } from "react";

// Import From MUI
import { TextField, MenuItem } from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import Pagination from "@mui/material/Pagination";
import PaginationItem from "@mui/material/PaginationItem";
import Stack from "@mui/material/Stack";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

const page = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [pageSize, setPageSize] = useState(5); // State untuk menyimpan jumlah data yang ditampilkan per halaman
  const [currentPage, setCurrentPage] = useState(1); // Deklarasikan state untuk halaman saat ini

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/audit-trail`)
      .then((res) => {
        if (!res.ok) {
          throw new Error("Network response was not ok");
        }
        return res.json();
      })
      .then((data) => {
        setData(data);
        setFilteredData(data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error.message);
      });
  }, []);

  // Search by batch number
  useEffect(() => {
    const results = data.filter((item) => item.user.toLowerCase().includes(searchTerm.toLowerCase()) || item["request data"].toLowerCase().includes(searchTerm.toLowerCase()));
    setFilteredData(results);
  }, [searchTerm, data]);

  // Handle search
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  // Fungsi untuk mengubah jumlah data yang ditampilkan per halaman
  const handleChangePageSize = (e) => {
    setPageSize(parseInt(e.target.value));
  };

  // Tentukan jumlah item per halaman
  const itemsPerPage = pageSize;

  // Hitung indeks data yang akan ditampilkan
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, filteredData.length);

  // Ambil subset data yang sesuai dengan halaman saat ini
  const paginatedData = filteredData.slice(startIndex, endIndex);

  // Callback untuk perubahan halaman
  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };
  return (
    <>
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          {/* Search */}
          <label className="input input-bordered flex items-center gap-2 ml-2 mr-2 py-7">
            <input type="text" className="grow" placeholder="Search" value={searchTerm} onChange={handleSearchChange} />
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4 opacity-70">
              <path fillRule="evenodd" d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z" clipRule="evenodd" />
            </svg>
          </label>
        </div>
        {/* Select Date */}
        {/* <div>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <div className="md:flex">
              <div className="md:mr-2">
                <DatePicker label="Start Date" value={startDate} onChange={setStartDate} />
              </div>
              <div className="mt-2 md:mt-0">
                <DatePicker label="End Date" value={endDate} onChange={setEndDate} />
              </div>
            </div>
          </LocalizationProvider>
        </div> */}
      </div>

      <div className="overflow-x-auto">
        <table className="table table-zebra">
          {/* head */}
          <thead>
            <tr>
              <th>No</th>
              <th>User</th>
              <th>Action</th>
              <th>Timestamp</th>
              <th>Request Data</th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((audit, index) => (
              <tr key={audit.uniqueNumber}>
                <td>{startIndex + index + 1}</td>
                <td>{audit.user}</td>
                <td>{audit.action}</td>
                <td>{audit.timestamp}</td>
                <td>{audit["request data"]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Select Page Size */}
      <div className="flex justify-end items-center mt-5">
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

        {/* Paginasi */}
        <Stack spacing={2} marginLeft="10px">
          <Pagination count={Math.ceil(filteredData.length / itemsPerPage)} page={currentPage} onChange={handlePageChange} renderItem={(item) => <PaginationItem slots={{ previous: ArrowBackIcon, next: ArrowForwardIcon }} {...item} />} />
        </Stack>
      </div>
    </>
  );
};

export default page;
