"use client";

import { useContext } from "react";
import { LiveTrackingContext } from "@/app/context/liveTrackingContext";

// Import Component
import ModalBatchInformation from "../../modal/ModalBatchInformation";

// Import Icon
import { InformationCircleIcon, PaperAirplaneIcon } from "@heroicons/react/outline";
import { HiArrowUturnLeft } from "react-icons/hi2";

const CardWarehouse = () => {
  const {
    dataRuah,
    userType,
    totalDataWarehouseRuah,
    isBatchTrackerOpen,
    isItemSelected,
    isMasterCheckedWarehouseRuah,
    setIsBatchTrackerOpen,
    selectedBatch,
    handleIconClick,
    handleReverseWoClick,
    handleCheckboxChange,
    handleMasterCheckboxChangeWarehouseRuah,
    handleMultipleBatchWarehouseRuah,
    handleSendSelectedBatch,
    handleSendButtonClick,
  } = useContext(LiveTrackingContext);

  return (
    <>
      <div className="card bg-white border w-full min-w-[250px] rounded-xl shadow-md">
        <div className="px-4 h-[90px] flex flex-col justify-center">
          <div className="flex justify-between">
            <p className="text-xs uppercase">in process</p>
            <p className="text-xs uppercase">total</p>
          </div>
          <div className="flex items-center justify-between mt-2">
            {/* Title */}
            <h1 className="uppercase font-bold">warehouse</h1>

            {/* Total */}
            <h2 className="bg-[#C5DFF8] px-2 text-[#3559E0] font-bold rounded-xl">{totalDataWarehouseRuah}</h2>
          </div>
        </div>

        {/* Card */}
        <div className="min-h-[420px] max-h-[420px] overflow-auto">
          {handleMultipleBatchWarehouseRuah && (
            <div className="border-b px-5 py-2">
              <div className="flex items-center">
                <input type="checkbox" className="mr-2" checked={isMasterCheckedWarehouseRuah} onChange={handleMasterCheckboxChangeWarehouseRuah} />
                <p className="uppercase">Select All</p>
              </div>
            </div>
          )}
          {dataRuah?.warehouse?.warehouse?.map((item) => (
            <div key={item.uniqueNumber} className="border-b px-5 py-2 hover:bg-slate-200 transition duration-300">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  {dataRuah?.warehouse?.warehouse?.length > 1 && <input type="checkbox" className="mr-2" checked={isItemSelected(item)} onChange={() => handleCheckboxChange(item)} />}
                  <span className="bg-[#C5DFF8] mr-2 p-1 cursor-pointer rounded-md" onClick={() => handleIconClick(item)}>
                    <InformationCircleIcon className="w-6 h-6 text-[#3559E0] hover:text-[#8CABFF] transition duration-300" />
                  </span>
                  <p className="uppercase">
                    {item.batchNumber} <span className="text-gray-500">-</span> {item.itemCode}
                  </p>
                </div>
                <div className="flex">
                  {(userType === "super admin" || userType === "admin warehouse") && (
                    <button className="bg-[#FF8F00] hover:bg-[#FFBF78] mr-1 p-1.5 rounded-3xl transition duration-300">
                      <HiArrowUturnLeft className="w-5 h-5 text-white" onClick={() => handleReverseWoClick(item)} />
                    </button>
                  )}
                  {(userType === "super admin" || userType === "admin warehouse" || userType === "operator warehouse" || userType === "admin produksi" || userType === "operator ptoduksi 2") && (
                    <button className="bg-[#3559E0] hover:bg-[#8CABFF] p-1.5 rounded-3xl transition duration-300" onClick={() => handleSendButtonClick(item)}>
                      <PaperAirplaneIcon className="w-5 h-5 text-white rotate-90" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {handleMultipleBatchWarehouseRuah && (userType === "super admin" || userType === "admin warehouse" || userType === "operator warehouse" || userType === "admin produksi" || userType === "operator ptoduksi 2") && (
          <div className="p-4">
            <button className="flex items-center justify-center bg-[#3559E0] hover:bg-[#8CABFF] text-white p-2 w-full rounded-xl transition duration-300" onClick={handleSendSelectedBatch}>
              Kirim Batch Terpilih
              <PaperAirplaneIcon className="w-5 h-5 text-white rotate-90 inline-block ml-2" />
            </button>
          </div>
        )}
      </div>

      {/* BatchTracker */}
      {isBatchTrackerOpen && <ModalBatchInformation setIsBatchTrackerOpen={setIsBatchTrackerOpen} batchData={selectedBatch} />}
    </>
  );
};

export default CardWarehouse;
