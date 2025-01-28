import { useContext } from "react";
import { DashboardContext } from "@/app/context/dashboardContext";

// Import CSS
import "./style.css";

// Import Component
import BatchTracker from "../modal/BatchTracker";

// Import Icon
import { CogIcon, InformationCircleIcon } from "@heroicons/react/outline";

const CardProduksi = () => {
  // Menggunakan useContext untuk mengakses data dari DashboardContext
  const { data, totalDataProduksi, handleIconClick, isBatchTrackerOpen, setIsBatchTrackerOpen, selectedBatch } = useContext(DashboardContext);

  return (
    <>
      <section className="w-full">
        <div className="card inner-border-hover-produksi bg-base-100 mb-8 p-4 shadow-md hover:shadow-[0_5px_20px_-5px_rgba(0,0,0,0.3)]">
          <div className="flex items-center p-2">
            <h2 className="card-title mr-4">
              <span className="bg-[#F1EF99] bg-opacity-40 p-2 rounded-md">
                <CogIcon className="w-6 h-6 text-[#FFC700]" />
              </span>
            </h2>
            <p className="text-2xl">{totalDataProduksi}</p>
          </div>
          <p>
            Total <span className="font-bold uppercase">produksi</span> on process
          </p>
        </div>

        <div className="border rounded-xl shadow-md">
          <div className="px-5 py-5 flex items-center justify-between">
            {/* Title */}
            <h1 className="text-[#FFC700] font-medium capitalize">
              <span className="uppercase">produksi</span> overview
            </h1>
          </div>

          {/* Card */}
          <div className="min-h-[420px] max-h-[420px] px-5 overflow-auto">
            <p className="capitalize">batch number</p>
            {data?.produksi?.map((item) => (
              <div key={item.uniqueNumber} className="border-b px-2 py-2">
                <div className="flex items-center">
                  <span className="bg-[#F1EF99] bg-opacity-40 cursor-pointer mr-2 p-1 rounded-md" onClick={() => handleIconClick(item)}>
                    <InformationCircleIcon className="w-6 h-6 text-[#FFC700] hover:text-[#F1EF99] transition duration-300" />
                  </span>
                  <p>{item.batchNumber}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* BatchTracker */}
      {isBatchTrackerOpen && <BatchTracker setIsBatchTrackerOpen={setIsBatchTrackerOpen} batchData={selectedBatch} />}
    </>
  );
};

export default CardProduksi;
