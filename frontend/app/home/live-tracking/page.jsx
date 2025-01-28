"use client";

import { useState } from "react";

// Import component
import Minor from "@/app/components/live-tracking/Minor";
import Ruah from "@/app/components/live-tracking/Ruah";
import Kemas from "@/app/components/live-tracking/Kemas";

// Import icon
import { FaGear } from "react-icons/fa6";
import { SlChemistry } from "react-icons/sl";
import { VscPackage } from "react-icons/vsc";

const page = () => {
  const [currentPage, setCurrentPage] = useState("minor");

  const renderPage = () => {
    switch (currentPage) {
      case "minor":
        return <Minor />;
      case "ruah":
        return <Ruah />;
      case "kemas":
        return <Kemas />;
      default:
        return null;
    }
  };
  return (
    <>
      <div className="flex mt-4">
        <button onClick={() => setCurrentPage("minor")} className={`flex items-center px-6 py-2 ${currentPage === "minor" && "text-[#3559E0]"}`}>
          <FaGear className="w-6 h-6 mr-2" />
          Minor
        </button>
        <button onClick={() => setCurrentPage("ruah")} className={`flex items-center px-6 py-2 ${currentPage === "ruah" && "text-[#3559E0]"}`}>
          <SlChemistry className="w-6 h-6 mr-1" />
          Ruah
        </button>
        <button onClick={() => setCurrentPage("kemas")} className={`flex items-center px-6 py-2 ${currentPage === "kemas" && "text-[#3559E0]"}`}>
          <VscPackage className="w-6 h-6 mr-2" />
          Kemas
        </button>
      </div>
      <div className="h-[80%]">{renderPage()}</div>
    </>
  );
};

export default page;
