"use client";
import React, { useState, useEffect } from "react";
import authIsLoggedIn from "@/app/auth/authIsLoggedIn";
import { useRouter } from "next/navigation";
import Image from "next/image";

import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { CSVLink } from "react-csv";
import { saveAs } from "file-saver";

// Import from MUI
import { TextField, MenuItem } from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import Pagination from "@mui/material/Pagination";
import PaginationItem from "@mui/material/PaginationItem";
import Stack from "@mui/material/Stack";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

// Import Icon

const Page = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedAPI, setSelectedAPI] = useState("report-overall"); // Default report
  const [pageSize, setPageSize] = useState(5); // State untuk menyimpan jumlah data yang ditampilkan per halaman
  const [currentPage, setCurrentPage] = useState(1); // Deklarasikan state untuk halaman saat ini

  const { loggedInUser } = authIsLoggedIn();
  const { userType } = loggedInUser;
  const router = useRouter();

  useEffect(() => {
    if (userType && userType !== "super admin" && userType !== "admin") {
      router.back();
    }
  }, [userType]);

  // Fetch Data Report
  const fetchDataReport = async () => {
    if (!startDate || !endDate) return;
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/${selectedAPI}?startDate=${startDate}&endDate=${endDate}`);
      if (!response.ok) {
        throw new Error("Data fetch failed: " + response.status);
      }
      const data = await response.json();
      const formattedData = data.map((item) => {
        const { table_origin, ...rest } = item; // Destructure to exclude table_origin
        return {
          ...rest,
          step_1: formatDate(rest.step_1),
          step_2: formatDate(rest.step_2),
          step_3: formatDate(rest.step_3),
          step_4: formatDate(rest.step_4),
          step_5: formatDate(rest.step_5),
          completion_time: formatDate(rest.completion_time),
        };
      });
      setData(formattedData);
      setFilteredData(formattedData);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Search by batch number
  useEffect(() => {
    const results = data.filter((item) => item.batch_number.toLowerCase().includes(searchTerm.toLowerCase()));
    setFilteredData(results);
  }, [searchTerm, data]);

  // Handle search
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  // Format Date
  const formatDate = (dateString) => {
    if (!dateString) return ""; // Return string kosong jika tanggal tidak ada
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return ""; // Return string kosong jika tanggal tidak ada

    // Mendapatkan masing-masing komponen tanggal dan waktu
    const day = date.toLocaleString("id-ID", { day: "2-digit" });
    const month = date.toLocaleString("id-ID", { month: "2-digit" });
    const year = date.toLocaleString("id-ID", { year: "numeric" });
    const hours = date.toLocaleString("id-ID", { hour: "2-digit", hour12: false });
    const minutes = date.toLocaleString("id-ID", { minute: "2-digit" });
    const seconds = date.toLocaleString("id-ID", { second: "2-digit" });

    // Menyusun format tanggal dengan menggunakan titik dua antara komponen waktu
    return `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;
  };

  // Export Excel
  const handleExportExcel = () => {
    const table = document.getElementById("report-table");
    const ws = XLSX.utils.table_to_sheet(table);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Report");
    XLSX.writeFile(wb, `Report_${startDate}_to_${endDate}.xlsx`);
  };

  // Export PDF
  const handleExportPDF = () => {
    const doc = new jsPDF();
    doc.autoTable({ html: "#report-table" });
    doc.save(`Report_${startDate}_to_${endDate}.pdf`);
  };

  // Export CSV
  const handleExportCSV = () => {
    const table = document.getElementById("report-table");
    const csvData = [];
    const headers = Array.from(table.querySelectorAll("thead th")).map((th) => th.textContent);
    csvData.push(headers.join(","));

    const rows = table.querySelectorAll("tbody tr");
    rows.forEach((row) => {
      const cells = Array.from(row.querySelectorAll("td")).map((td) => td.textContent);
      csvData.push(cells.join(","));
    });

    const csvContent = csvData.join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8" });
    saveAs(blob, `Report_${startDate}_to_${endDate}.csv`);
  };

  useEffect(() => {
    fetchDataReport();
  }, []); // Panggil fetchDataReport() saat komponen diinisialisasi

  useEffect(() => {
    fetchDataReport();
  }, [startDate, endDate, selectedAPI]); // Panggil fetchDataReport() setiap kali startDate, endDate, atau selectedAPI berubah

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

  const getHeaderStep1 = (selectedAPI) => {
    switch (selectedAPI) {
      case "report-minor":
        return "Create WO";
      case "report-ruah":
        return "Create WO";
      case "report-kemas":
        return "Create WO";
      default:
        return "Create WO";
    }
  };
  const getHeaderStep2 = (selectedAPI) => {
    switch (selectedAPI) {
      case "report-minor":
        return "Preparasi Material";
      case "report-ruah":
        return "Dumping";
      case "report-kemas":
        return "Serah Terima PMFR";
      default:
        return "Preparasi Material";
    }
  };
  const getHeaderStep3 = (selectedAPI) => {
    switch (selectedAPI) {
      case "report-minor":
        return "Staging Material";
      case "report-ruah":
        return "Batching";
      case "report-kemas":
        return "Preparasi Kemas";
      default:
        return "Tipping";
    }
  };
  const getHeaderStep4 = (selectedAPI) => {
    switch (selectedAPI) {
      case "report-minor":
        return "Weighing";
      case "report-ruah":
        return "Staging Ruah";
      case "report-kemas":
        return "Staging Kemas";
      default:
        return "Weighing";
    }
  };
  const getHeaderStep5 = (selectedAPI) => {
    switch (selectedAPI) {
      case "report-minor":
        return "Tipping";
      case "report-ruah":
        return "Discharging";
      case "report-kemas":
        return "Filling Packaging";
      default:
        return "Tipping";
    }
  };

  return (
    <>
      <div className="flex justify-between items-center">
        <div className="flex flex-col-reverse md:flex-row items-center">
          {/* Search */}
          <label className="input input-bordered flex items-center gap-2 ml-2 mr-2 py-7">
            <input type="text" className="grow" placeholder="Search" value={searchTerm} onChange={handleSearchChange} />
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4 opacity-70">
              <path fillRule="evenodd" d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z" clipRule="evenodd" />
            </svg>
          </label>
        </div>

        <div className="flex items-center">
          {/* Select Date */}
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

          <div className="flex flex-col md:flex-row items-center">
            {/* Dropdown Choose Report */}
            <div className="mx-2">
              <TextField select label="Choose Report" value={selectedAPI} onChange={(e) => setSelectedAPI(e.target.value)} variant="outlined">
                <MenuItem value="report-overall">Report Overall</MenuItem>
                <MenuItem value="report-minor">Report Minor</MenuItem>
                <MenuItem value="report-ruah">Report Ruah</MenuItem>
                <MenuItem value="report-kemas">Report Kemas</MenuItem>
              </TextField>
            </div>

            {/* Dropdown Choose Export */}
            <div className="dropdown dropdown-end mt-2 md:mt-0">
              <div tabIndex={0} role="button" className="btn btn-success">
                Export
              </div>
              <ul tabIndex={0} className="dropdown-content z-[1] menu border mt-2 p-2 shadow bg-base-100 rounded-box w-32">
                {data && (
                  <>
                    <li>
                      <button onClick={handleExportExcel}>
                        <Image src="/xsl.png" alt="xsl" width={25} height={25} />
                        EXCEL
                      </button>
                    </li>
                    <li>
                      <button onClick={handleExportPDF}>
                        <Image src="/pdf.png" alt="pdf" width={25} height={25} />
                        PDF
                      </button>
                    </li>
                    <li>
                      <CSVLink data={data} filename={`Report_${startDate}_to_${endDate}.csv`} onClick={handleExportCSV}>
                        <Image src="/csv.png" alt="csv" width={25} height={25} />
                        CSV
                      </CSVLink>
                    </li>
                  </>
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Mapping Data Report */}
      {data && (
        <div className="mt-4 overflow-auto">
          <table id="report-table" className="table table-zebra">
            <thead>
              <tr>
                <th>Unique Number</th>
                <th>Work Order Number</th>
                <th>Batch Status</th>
                <th>Item Code</th>
                <th>Product Type</th>
                <th>Batch Number</th>
                <th>{getHeaderStep1(selectedAPI)}</th>
                <th>{getHeaderStep2(selectedAPI)}</th>
                <th>{getHeaderStep3(selectedAPI)}</th>
                <th>{getHeaderStep4(selectedAPI)}</th>
                <th>{getHeaderStep5(selectedAPI)}</th>
                <th>Completed Date</th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((item) => (
                <tr key={item.unique_number} className="uppercase">
                  <td>{item.unique_number}</td>
                  <td>{item.wo_number}</td>
                  <td>n/a</td>
                  <td>{item.item_code}</td>
                  <td>{item.product_type}</td>
                  <td>{item.batch_number}</td>
                  <td>{item.step_1}</td>
                  <td>{item.step_2}</td>
                  <td>{item.step_3}</td>
                  <td>{item.step_4}</td>
                  <td>{item.step_5}</td>
                  <td>{item.completion_time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
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

export default Page;
