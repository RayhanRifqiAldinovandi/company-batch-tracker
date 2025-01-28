"use client";

import { useState } from "react";
import { ReportProvider } from "@/app/context/reportContext";

import ReportMinor from "@/app/components/report/ReportMinor";
import ReportRuah from "@/app/components/report/ReportRuah";
import ReportKemas from "@/app/components/report/ReportKemas";
import ReportOverall from "@/app/components/report/ReportOverall";

const page = () => {
  const [currentPage, setCurrentPage] = useState("minor");

  const renderPage = () => {
    switch (currentPage) {
      case "overall":
        return <ReportOverall />;
      case "minor":
        return <ReportMinor />;
      case "ruah":
        return <ReportRuah />;
      case "kemas":
        return <ReportKemas />;
      default:
        return <ReportMinor />;
    }
  };
  return (
    <>
      <ReportProvider>
        <div className="flex my-4 bg-base-100">
          {/* <button onClick={() => setCurrentPage("overall")} className={`border bg-white font-semibold flex justify-center items-center flex-grow px-6 py-2 ${currentPage === "overall" && "border-[#3559E0] text-[#3559E0]"}`}>
            Overall
          </button> */}
          <button onClick={() => setCurrentPage("minor")} className={`border bg-white font-semibold flex justify-center items-center flex-grow px-6 py-2 
            ${currentPage === "minor" && "border-[#3559E0] text-[#3559E0]"}`}>
            Minor
          </button>
          <button onClick={() => setCurrentPage("ruah")} className={`border bg-white font-semibold flex justify-center items-center flex-grow px-6 py-2 
            ${currentPage === "ruah" && "border-[#3559E0] text-[#3559E0]"}`}>
            Ruah
          </button>
          <button onClick={() => setCurrentPage("kemas")} className={`border bg-white font-semibold flex justify-center items-center flex-grow px-6 py-2 
            ${currentPage === "kemas" && "border-[#3559E0] text-[#3559E0]"}`}>
            Kemas
          </button>
        </div>

        <div className="bg-white h-[80%]">{renderPage()}</div>
      </ReportProvider>
    </>
  );
};

export default page;
