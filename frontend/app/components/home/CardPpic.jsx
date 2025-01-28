import { useContext } from "react";
import { HomeContext } from "@/app/context/homeContext";

// Import CSS
import "./style.css";

// Import Component
import ModalBatchInformation from "../modal/ModalBatchInformation";

// Import Icon
import { DocumentDuplicateIcon, InformationCircleIcon } from "@heroicons/react/outline";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";

const CardPpic = () => {
  // Menggunakan useContext untuk mengakses data dari HomeContext
  const { ppicSortConfig, sortedPpic, handlePpicSort, totalDataPpic, handleIconClick, isBatchTrackerOpen, setIsBatchTrackerOpen, selectedBatch } = useContext(HomeContext);

  return (
    <>
      <section className="w-full">
        <div className="card inner-border-hover-ppic bg-white mb-8 p-6 shadow-md hover:shadow-[0_5px_20px_-5px_rgba(0,0,0,0.3)]">
          <div className="flex items-center">
            <h2 className="card-title mr-4">
              <span className="bg-[#9AD0C2] bg-opacity-40 p-2 rounded-md">
                <DocumentDuplicateIcon className="w-6 h-6 text-[#2D9596]" />
              </span>
            </h2>
            <p className="text-2xl">{totalDataPpic}</p>
          </div>
          <p className="mt-2">
            <span className="font-bold uppercase">ppic</span>
            <br />
            Total Batch Number dalam proses
          </p>
        </div>

        {/* Card */}
        <div className="border bg-white rounded-xl shadow-md">
          <div className="px-5 py-5 flex items-center justify-between">
            {/* Title */}
            <h1 className="text-[#2D9596] font-medium capitalize">
              <span className="uppercase">ppic</span> overview
            </h1>
          </div>

          {/* Card Body */}
          <div className="min-h-[420px] max-h-[420px] px-5 overflow-auto">
            <div className="flex items-center cursor-pointer capitalize" onClick={() => handlePpicSort("batchNumber")}>
              <p>Batch Number</p>
              <div className="flex flex-col items-center ml-2">
                <ArrowDropUpIcon className={`-m-2 ${ppicSortConfig.key === "batchNumber" && ppicSortConfig.direction === "ascending" ? "text-gray-500" : ""}`} />
                <ArrowDropDownIcon className={`-m-2 ${ppicSortConfig.key === "batchNumber" && ppicSortConfig.direction === "descending" ? "text-gray-500" : ""}`} />
              </div>
            </div>
            {sortedPpic.map((item) => (
              <div key={item.batchNumber} className="border-b px-2 py-2">
                <div className="flex items-center">
                  <span className="bg-[#9AD0C2] bg-opacity-40 cursor-pointer mr-2 p-1 rounded-md" onClick={() => handleIconClick(item)}>
                    <InformationCircleIcon className="w-6 h-6 text-[#2D9596] hover:text-[#9AD0C2] transition duration-300" />
                  </span>
                  <p className="uppercase">
                    {item.batchNumber} <span className="text-gray-500">-</span> {item.itemCode}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* BatchTracker */}
      {isBatchTrackerOpen && <ModalBatchInformation setIsBatchTrackerOpen={setIsBatchTrackerOpen} batchData={selectedBatch} />}
    </>
  );
};

export default CardPpic;
