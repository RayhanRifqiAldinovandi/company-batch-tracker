import { useContext } from "react";
import { HomeContext } from "@/app/context/homeContext";

// Import CSS
import "./style.css";

// Import Component
import ModalBatchInformation from "../modal/ModalBatchInformation";

// Import Icon
import { CogIcon, InformationCircleIcon } from "@heroicons/react/outline";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";

const CardProduksi = () => {
  // Menggunakan useContext untuk mengakses data dari HomeContext
  const { produksiSortConfig, sortedProduksi, handleProduksiSort, totalDataProduksi, handleIconClick, isBatchTrackerOpen, setIsBatchTrackerOpen, selectedBatch } = useContext(HomeContext);

  return (
    <>
      <section className="w-full">
        <div className="card inner-border-hover-produksi bg-white mb-8 p-6 shadow-md hover:shadow-[0_5px_20px_-5px_rgba(0,0,0,0.3)]">
          <div className="flex items-center">
            <h2 className="card-title mr-4">
              <span className="bg-[#F1EF99] bg-opacity-40 p-2 rounded-md">
                <CogIcon className="w-6 h-6 text-[#FFC700]" />
              </span>
            </h2>
            <p className="text-2xl">{totalDataProduksi}</p>
          </div>
          <p className="mt-2">
            <span className="font-bold uppercase">produksi</span>
            <br></br>
            Total Batch Number dalam proses
          </p>
        </div>

        <div className="border bg-white rounded-xl shadow-md">
          <div className="px-5 py-5 flex items-center justify-between">
            {/* Title */}
            <h1 className="text-[#FFC700] font-medium capitalize">
              <span className="uppercase">produksi</span> overview
            </h1>
          </div>

          {/* Card */}
          <div className="min-h-[420px] max-h-[420px] px-5 overflow-auto">
            <div className="flex items-center cursor-pointer capitalize" onClick={() => handleProduksiSort("batchNumber")}>
              <p>Batch Number</p>
              <div className="flex flex-col items-center ml-2">
                <ArrowDropUpIcon className={`-m-2 ${produksiSortConfig.key === "batchNumber" && produksiSortConfig.direction === "ascending" ? "text-gray-500" : ""}`} />
                <ArrowDropDownIcon className={`-m-2 ${produksiSortConfig.key === "batchNumber" && produksiSortConfig.direction === "descending" ? "text-gray-500" : ""}`} />
              </div>
            </div>
            {sortedProduksi.map((item) => (
              <div key={item.uniqueNumber} className="border-b px-2 py-2">
                <div className="flex items-center">
                  <span className="bg-[#F1EF99] bg-opacity-40 cursor-pointer mr-2 p-1 rounded-md" onClick={() => handleIconClick(item)}>
                    <InformationCircleIcon className="w-6 h-6 text-[#FFC700] hover:text-[#F1EF99] transition duration-300" />
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

export default CardProduksi;
