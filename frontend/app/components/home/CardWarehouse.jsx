import { useContext } from "react";
import { HomeContext } from "@/app/context/homeContext";

// Import CSS
import "./style.css";

// Import Component
import ModalBatchInformation from "../modal/ModalBatchInformation";

// Import Icon
import { InformationCircleIcon, TruckIcon } from "@heroicons/react/outline";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";

const CardPpic = () => {
  // Menggunakan useContext untuk mengakses data dari HomeContext
  const { warehouseSortConfig, sortedWarehouse, handleWarehouseSort, totalDataWarehouse, handleIconClick, isBatchTrackerOpen, setIsBatchTrackerOpen, selectedBatch } = useContext(HomeContext);

  return (
    <>
      <section className="w-full">
        <div className="card inner-border-hover-warehouse bg-white mb-8 p-6 shadow-md hover:shadow-[0_5px_20px_-5px_rgba(0,0,0,0.3)]">
          <div className="flex items-center">
            <h2 className="card-title mr-4">
              <span className="bg-[#98ABEE] bg-opacity-40 p-2 rounded-md">
                <TruckIcon className="w-6 h-6 text-[#1D24CA]" />
              </span>
            </h2>
            <p className="text-2xl">{totalDataWarehouse}</p>
          </div>
          <p className="mt-2">
            <span className="font-bold uppercase">warehouse</span>
            <br></br>
            Total Batch Number dalam proses
          </p>
        </div>

        <div className="border bg-white rounded-xl shadow-md">
          <div className="px-5 py-5 flex items-center justify-between">
            {/* Title */}
            <h1 className="text-[#1D24CA] font-medium capitalize">
              <span className="uppercase">warehouse</span> overview
            </h1>
          </div>

          {/* Card */}
          <div className="min-h-[420px] max-h-[420px] px-5 overflow-auto">
            <div className="flex items-center cursor-pointer capitalize" onClick={() => handleWarehouseSort("batchNumber")}>
              <p>Batch Number</p>
              <div className="flex flex-col items-center ml-2">
                <ArrowDropUpIcon className={`-m-2 ${warehouseSortConfig.key === "batchNumber" && warehouseSortConfig.direction === "ascending" ? "text-gray-500" : ""}`} />
                <ArrowDropDownIcon className={`-m-2 ${warehouseSortConfig.key === "batchNumber" && warehouseSortConfig.direction === "descending" ? "text-gray-500" : ""}`} />
              </div>
            </div>
            {sortedWarehouse.map((item) => (
              <div key={item.batchNumber} className="border-b px-2 py-2">
                <div className="flex items-center">
                  <span className="bg-[#98ABEE] bg-opacity-40 cursor-pointer mr-2 p-1 rounded-md" onClick={() => handleIconClick(item)}>
                    <InformationCircleIcon className="w-6 h-6 text-[#1D24CA] hover:text-[#98ABEE] transition duration-300" />
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
