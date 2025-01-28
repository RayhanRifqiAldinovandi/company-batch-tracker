"use client";

import React, { useEffect, useState } from "react";
import * as XLSX from "xlsx";

// Import from MUI
import { TextField, MenuItem, Button } from "@mui/material";
import Pagination from "@mui/material/Pagination";
import PaginationItem from "@mui/material/PaginationItem";
import Stack from "@mui/material/Stack";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import Image from "next/image";

const page = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [actionFilter, setActionFilter] = useState("Sort By");
  const [pageSize, setPageSize] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);

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
        // console.log(data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error.message);
      });
  }, []);

  useEffect(() => {
    let results = data;

    if (actionFilter !== "Sort By") {
      results = results.filter((item) => item.action.toLowerCase() === actionFilter.toLowerCase());
    }

    if (searchTerm) {
      results = results.filter((item) => item.user.toLowerCase().includes(searchTerm.toLowerCase()) || 
      item["request data"].toLowerCase().includes(searchTerm.toLowerCase()));
    }

    setFilteredData(results);
  }, [searchTerm, actionFilter, data]);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleActionFilterChange = (event) => {
    setActionFilter(event.target.value);
  };

  const handleChangePageSize = (e) => {
    setPageSize(parseInt(e.target.value));
  };

  const itemsPerPage = pageSize;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, filteredData.length);
  const paginatedData = filteredData.slice(startIndex, endIndex);

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const handleExportExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Audit Trail");
    XLSX.writeFile(workbook, "audit_trail.xlsx");
  };

  return (
    <>
      <div className="bg-white border">
        <div className="flex justify-between items-center">
          <div className="ml-4 mt-4">
            <label className="input input-bordered flex items-center py-7">
              <input type="text" className="grow" placeholder="Search" value={searchTerm} onChange={handleSearchChange} />
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4 opacity-70">
                <path fillRule="evenodd" d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z" clipRule="evenodd" />
              </svg>
            </label>
          </div>
          <div className="flex items-center mt-4 mr-4 ml-4 lg:ml-0">
            <div>
              <TextField select value={actionFilter} onChange={handleActionFilterChange} size="small" variant="outlined">
                <MenuItem value="Sort By" disabled>
                  Sort By
                </MenuItem>
                <MenuItem value="create user">Create User</MenuItem>
                <MenuItem value="delete work order">Delete Work Order</MenuItem>
                <MenuItem value="entry work order">Entry Work Order</MenuItem>
                <MenuItem value="send">Send</MenuItem>
                <MenuItem value="login">Login</MenuItem>
                <MenuItem value="logout">Logout</MenuItem>
              </TextField>
            </div>
            <button className="btn btn-success ml-4" onClick={handleExportExcel}>
              <Image src="/xsl.png" alt="xsl" width={25} height={25} />
              EXCEL
            </button>
          </div>
        </div>

        <span className="flex mt-4 border-t"></span>

        <div className="overflow-x-auto m-5">
          <table className="table table-zebra">
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
          <Stack spacing={2} marginLeft="10px">
            <Pagination count={Math.ceil(filteredData.length / itemsPerPage)} page={currentPage} 
            onChange={handlePageChange} renderItem={(item) => <PaginationItem slots={{ previous: ArrowBackIcon, next: ArrowForwardIcon }} {...item} />} />
          </Stack>
        </div>
      </div>
    </>
  );
};

export default page;
