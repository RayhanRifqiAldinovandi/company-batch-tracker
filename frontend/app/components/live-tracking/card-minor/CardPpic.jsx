"use client";

import { useContext } from "react";

// Import Component
import ModalBatchInformation from "../../modal/ModalBatchInformation";

// Import Icon
import { InformationCircleIcon, PaperAirplaneIcon } from "@heroicons/react/outline";
import { LiveTrackingContext } from "@/app/context/liveTrackingContext";

const CardPpic = () => {
  const {
    dataMinor,
    department,
    userType,
    totalDataPpicMinor,
    isBatchTrackerOpen,
    setIsBatchTrackerOpen,
    isItemSelected,
    isMasterCheckedPpicMinor,
    selectedBatch,
    handleIconClick,
    handleCheckboxChange,
    handleMasterCheckboxChangePpicMinor,
    handleMultipleBatchPpicMinor,
    handleSendSelectedBatch,
    handleSendButtonClick,
  } = useContext(LiveTrackingContext);
  return (
    <>
      <div className="card bg-white border w-full min-w-[300px] rounded-xl shadow-md">
        <div className="px-4 h-[90px] flex flex-col justify-center">
          <div className="flex justify-between">
            <p className="text-xs uppercase">in process</p>
            <p className="text-end text-xs uppercase">total</p>
          </div>
          <div className="flex items-center justify-between mt-2">
            {/* Title */}
            <div>
              <h1 className="uppercase font-bold">ppic</h1>
            </div>

            {/* Total */}
            <h2 className="bg-[#C5DFF8] px-2 text-[#3559E0] font-bold rounded-xl">{totalDataPpicMinor}</h2>
          </div>
        </div>

        {/* Card */}
        <div className="min-h-[420px] max-h-[420px] overflow-auto">
          {handleMultipleBatchPpicMinor && (
            <div className="border-b px-5 py-2">
              <div className="flex items-center">
                <input type="checkbox" className="mr-2" checked={isMasterCheckedPpicMinor} onChange={handleMasterCheckboxChangePpicMinor} />
                <p className="uppercase">Select All</p>
              </div>
            </div>
          )}
          {dataMinor?.ppic?.map((item) => (
            <div key={item.uniqueNumber} className="border-b px-5 py-2 hover:bg-slate-200 transition duration-300">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  {dataMinor?.ppic?.length > 1 && <input type="checkbox" className="mr-2" checked={isItemSelected(item)} onChange={() => handleCheckboxChange(item)} />}
                  <span className="bg-[#C5DFF8] mr-2 p-1 cursor-pointer rounded-md" onClick={() => handleIconClick(item)}>
                    <InformationCircleIcon className="w-6 h-6 text-[#3559E0] hover:text-[#8CABFF] transition duration-300" />
                  </span>
                  <p className="uppercase">
                    {item.batchNumber} <span className="text-gray-500">-</span> {item.itemCode}
                  </p>
                </div>
                <div>
                  {(userType === "super admin" || department === "ppic") && (
                    <button className="bg-[#3559E0] hover:bg-[#8CABFF] p-1.5 rounded-3xl transition duration-300" onClick={() => handleSendButtonClick(item)}>
                      <PaperAirplaneIcon className="w-5 h-5 text-white rotate-90" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {handleMultipleBatchPpicMinor && (userType === "super admin" || department === "ppic") && (
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

export default CardPpic;
