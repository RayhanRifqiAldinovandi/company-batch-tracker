"use client";
import { useContext } from "react";
import { ReportContext } from "@/app/context/reportContext";
import Image from "next/image";
import { CSVLink } from "react-csv";

// Import From MUI
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { TextField, MenuItem } from "@mui/material";
import Pagination from "@mui/material/Pagination";
import PaginationItem from "@mui/material/PaginationItem";
import Stack from "@mui/material/Stack";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

const ReportMinor = () => {
  const {
    searchTerm,
    startDate,
    endDate,
    pageSize,
    currentPage,
    filteredDataMinor,
    handleSearchChange,
    setStartDate,
    setEndDate,
    handleExportExcel,
    handleExportPDF,
    handleExportCSV,
    handleChangePageSize,
    handlePageChange,
    paginatedDataMinor,
  } = useContext(ReportContext);

  return (
    <>
      <div className="border">
        <div className="flex justify-between items-center mx-4 mt-4">
          <div className="flex flex-col-reverse md:flex-row items-center">
            {/* Search */}
            <label className="input input-bordered bg-white flex items-center gap-2 py-7">
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
              {/* Dropdown Choose Export */}
              <div className="dropdown dropdown-end ml-4 mt-2 md:mt-0">
                <div tabIndex={0} role="button" className="btn btn-success text-white">
                  Export
                </div>
                <ul tabIndex={0} className="dropdown-content z-[1] menu border mt-2 p-2 shadow bg-base-100 rounded-box w-32">
                  {paginatedDataMinor && (
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
                        <CSVLink data={paginatedDataMinor} filename={`Report_${startDate}_to_${endDate}.csv`} onClick={handleExportCSV}>
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

        <span className="flex mt-4 border-t"></span>

        {/* Mapping Data Report */}
        <div className="mt-4 overflow-auto">
          <table id="report-table" className="report-table table table-zebra">
            <thead>
              <tr>
                <th>Work Order Number</th>
                <th>Batch Status</th>
                <th>Item Code</th>
                <th>Product Type</th>
                <th>Batch Number</th>
                <th>Create WO</th>
                <th>Preparasi Material</th>
                <th>Staging Material</th>
                <th>Weighing</th>
                <th>Pause Detail</th>
                <th>Time Pause</th>
                <th>Return From Pause</th>
                <th>Ready For Tipping</th>
                <th>Tipping</th>
                <th>Completed Date</th>
              </tr>
            </thead>
            <tbody>
              {startDate && endDate ? (
                paginatedDataMinor.length > 0 ? (
                  paginatedDataMinor.map((item, index) => (
                    <tr key={item.unique_number} className="uppercase">
                      <td>{item.wo_number}</td>
                      <td>n/a</td>
                      <td>{item.item_code}</td>
                      <td>{item.product_type}</td>
                      <td>{item.batch_number}</td>
                      <td>{item.step_1}</td>
                      <td>{item.step_2}</td>
                      <td>{item.step_3}</td>
                      <td>{item.step_4}</td>
                      <td>{item.pause_detail === "none" ? (typeof item.pause_detail === "object" ? item.pause_detail : item.pause_detail || "N/A") : Object.keys(item.pause_detail).length === 0 ? "N/A" : item.pause_detail}</td>
                      <td>{item.pause_timestamp}</td>
                      <td>{item.return_timestamp}</td>
                      <td>{item.step_5}</td>
                      <td>{item.step_6}</td>
                      <td>{item.completion_time}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="12" className="text-center">
                      Data not available
                    </td>
                  </tr>
                )
              ) : (
                <tr>
                  <td colSpan="12" className="text-center">
                    Choose date first
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
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
            <Pagination count={Math.ceil(filteredDataMinor.length / pageSize)} page={currentPage} onChange={handlePageChange} renderItem={(item) => <PaginationItem slots={{ previous: ArrowBackIcon, next: ArrowForwardIcon }} {...item} />} />
          </Stack>
        </div>
      </div>
    </>
  );
};

export default ReportMinor;
