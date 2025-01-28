import { createContext, useEffect, useState } from "react";

import authIsLoggedIn from "@/app/auth/authIsLoggedIn";

import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { saveAs } from "file-saver";

export const ReportContext = createContext();

export const ReportProvider = ({ children }) => {
  const { loggedInUser } = authIsLoggedIn();
  const { userType } = loggedInUser;

  const [loading, setLoading] = useState("");
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [pageSize, setPageSize] = useState(5); // State untuk menyimpan jumlah data yang ditampilkan per halaman
  const [currentPage, setCurrentPage] = useState(1); // Deklarasikan state untuk halaman saat ini

  // Fetch Data Report Minor
  const [dataReportMinor, setDataReportMinor] = useState([]);
  const [filteredDataMinor, setFilteredDataMinor] = useState([]);

  const fetchDataReportMinor = async () => {
    if (!startDate || !endDate) return;
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/report-minor?startDate=${startDate}&endDate=${endDate}`);
      if (!response.ok) {
        throw new Error("Data fetch failed: " + response.status);
      }
      const dataReportMinor = await response.json();
      const formattedData = dataReportMinor.map((item) => {
        const { table_origin, ...rest } = item; // Destructure to exclude table_origin
        return {
          ...rest,
          step_1: formatDate(rest.step_1),
          step_2: formatDate(rest.step_2),
          step_3: formatDate(rest.step_3),
          step_4: formatDate(rest.step_4),
          pause_timestamp: formatDate(rest.pause_timestamp),
          return_timestamp: formatDate(rest.return_timestamp),
          step_5: formatDate(rest.step_5),
          step_6: formatDate(rest.step_6),
          completion_time: formatDate(rest.completion_time),
        };
      });
      setDataReportMinor(formattedData);
      setFilteredDataMinor(formattedData);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch Data Report Ruah
  const [dataReportRuah, setDataReportRuah] = useState([]);
  const [filteredDataRuah, setFilteredDataRuah] = useState([]);

  const fetchDataReportRuah = async () => {
    if (!startDate || !endDate) return;
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/report-ruah?startDate=${startDate}&endDate=${endDate}`);
      if (!response.ok) {
        throw new Error("Data fetch failed: " + response.status);
      }
      const dataReportRuah = await response.json();
      const formattedData = dataReportRuah.map((item) => {
        const { table_origin, ...rest } = item; // Destructure to exclude table_origin
        return {
          ...rest,
          step_1: formatDate(rest.step_1),
          step_2: formatDate(rest.step_2),
          step_3: formatDate(rest.step_3),
          step_4: formatDate(rest.step_4),
          step_5: formatDate(rest.step_5),
          step_6: formatDate(rest.step_6),
          moveline_step: formatDate(rest.moveline_step),
          completion_time: formatDate(rest.completion_time),
        };
      });
      setDataReportRuah(formattedData);
      setFilteredDataRuah(formattedData);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch Data Report Kemas
  const [dataReportKemas, setDataReportKemas] = useState([]);
  const [filteredDataKemas, setFilteredDataKemas] = useState([]);

  const fetchDataReportKemas = async () => {
    if (!startDate || !endDate) return;
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/report-kemas?startDate=${startDate}&endDate=${endDate}`);
      if (!response.ok) {
        throw new Error("Data fetch failed: " + response.status);
      }
      const dataReportKemas = await response.json();
      const formattedData = dataReportKemas.map((item) => {
        const { table_origin, ...rest } = item; // Destructure to exclude table_origin
        return {
          ...rest,
          step_1: formatDate(rest.step_1),
          step_2: formatDate(rest.step_2),
          step_3: formatDate(rest.step_3),
          step_4: formatDate(rest.step_4),
          step_5: formatDate(rest.step_5),
          moveline_step: formatDate(rest.moveline_step),
          completion_time: formatDate(rest.completion_time),
        };
      });
      setDataReportKemas(formattedData);
      setFilteredDataKemas(formattedData);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Search by batch number
  useEffect(() => {
    // Filter each dataset based on the search term
    const resultsMinor = dataReportMinor.filter((item) => item.batch_number.toLowerCase().includes(searchTerm.toLowerCase()));
    const resultsRuah = dataReportRuah.filter((item) => item.batch_number.toLowerCase().includes(searchTerm.toLowerCase()));
    const resultsKemas = dataReportKemas.filter((item) => item.batch_number.toLowerCase().includes(searchTerm.toLowerCase()));

    // Set the filtered data with the combined results
    setFilteredDataMinor(resultsMinor);
    setFilteredDataRuah(resultsRuah);
    setFilteredDataKemas(resultsKemas);
  }, [searchTerm, dataReportMinor, dataReportRuah, dataReportKemas]);

  // Handle search
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  // Format Date
  const formatDate = (dateString) => {
    if (!dateString) return "N/A"; // Return string kosong jika tanggal tidak ada
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "N/A"; // Return string kosong jika tanggal tidak ada

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

  const handleExportExcel = () => {
    const tables = document.querySelectorAll(".report-table");
    const wb = XLSX.utils.book_new();
    var repName;
    tables.forEach((table, index) => {
      const ws = XLSX.utils.table_to_sheet(table);
      if (index == 0) {
        repName = "Kemas";
      } else if (index == 1) {
        repName = "Ruah";
      } else if (index == 2) {
        repName = "Minor";
      }
      XLSX.utils.book_append_sheet(wb, ws, `Report ${repName}`);
    });

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
    const table = document.querySelectorAll("report-table");
    table.forEach((tables, index) => {
      const csvData = [];
      const headers = Array.from(tables.querySelectorAll("thead th")).map((th) => th.textContent);
      csvData.push(headers.join(","));

      const rows = table.querySelectorAll("tbody tr");
      rows.forEach((row) => {
        const cells = Array.from(row.querySelectorAll("td")).map((td) => td.textContent);
        csvData.push(cells.join(","));
      });
      const csvContent = csvData.join("\n");
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8" });
      saveAs(blob, `Report_${startDate}_to_${endDate}.csv`);
    });
  };

  useEffect(() => {
    fetchDataReportMinor();
    fetchDataReportRuah();
    fetchDataReportKemas();
  }, [startDate, endDate]); // Panggil fetchDataReport setiap kali startDate, endDate, atau selectedAPI berubah

  // Fungsi untuk mengubah jumlah data yang ditampilkan per halaman
  const handleChangePageSize = (e) => {
    setPageSize(parseInt(e.target.value));
  };

  // Tentukan jumlah item per halaman
  const itemsPerPage = pageSize;

  // Hitung indeks data yang akan ditampilkan
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndexMinor = Math.min(startIndex + itemsPerPage, filteredDataMinor.length);
  const endIndexRuah = Math.min(startIndex + itemsPerPage, filteredDataRuah.length);
  const endIndexKemas = Math.min(startIndex + itemsPerPage, filteredDataKemas.length);

  // Ambil subset data yang sesuai dengan halaman saat ini
  const paginatedDataMinor = filteredDataMinor.slice(startIndex, endIndexMinor);
  const paginatedDataRuah = filteredDataRuah.slice(startIndex, endIndexRuah);
  const paginatedDataKemas = filteredDataKemas.slice(startIndex, endIndexKemas);

  // Callback untuk perubahan halaman
  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const value = {
    searchTerm,
    startDate,
    endDate,
    pageSize,
    currentPage,
    filteredDataMinor,
    filteredDataRuah,
    filteredDataKemas,
    handleSearchChange,
    setStartDate,
    setEndDate,
    handleExportExcel,
    handleExportPDF,
    handleExportCSV,
    handleChangePageSize,
    handlePageChange,
    paginatedDataMinor,
    paginatedDataRuah,
    paginatedDataKemas,
  };

  return <ReportContext.Provider value={value}>{children}</ReportContext.Provider>;
};
