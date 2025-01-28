"use client";

import { useContext } from "react";
import { LiveTrackingContext } from "@/app/context/liveTrackingContext";

// Import Component
import BatchTracker from "../../modal/BatchTracker";

// Import Icon
import { InformationCircleIcon, PaperAirplaneIcon } from "@heroicons/react/outline";

const CardTipping = () => {
  const { dataMinor, department, userType, totalDataTippingMinor, isBatchTrackerOpen, setIsBatchTrackerOpen, selectedBatch, handleIconClick, handleSendButtonClick } = useContext(LiveTrackingContext);
  return (
    <>
      <div className="card border w-full min-w-[300px] rounded-xl shadow-md">
        <div className="px-4 h-[90px] flex flex-col justify-center">
          <div className="flex justify-between">
            <p className="text-xs uppercase">today's process</p>
            <p className="text-xs uppercase">total</p>
          </div>
          <div className="flex items-center justify-between mt-2">
            {/* Title */}
            <h1 className="uppercase font-bold">tipping</h1>

            {/* Total */}
            <h2 className="bg-[#C5DFF8] px-2 text-[#3559E0] font-bold rounded-xl">{totalDataTippingMinor}</h2>
          </div>
        </div>

        {/* Card */}
        <div className="min-h-[420px] max-h-[420px] overflow-auto">
          {dataMinor?.tipping?.map((item) => (
            <div key={item.uniqueNumber} className="border-b px-5 py-2 hover:bg-slate-200 transition duration-300">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <span className="bg-[#C5DFF8] mr-2 p-1 cursor-pointer rounded-md" onClick={() => handleIconClick(item)}>
                    <InformationCircleIcon className="w-6 h-6 text-[#3559E0] hover:text-[#8CABFF] transition duration-300" />
                  </span>
                  <p className="uppercase">{item.batchNumber}</p>
                </div>
                <div>
                  {(department === "produksi" || userType === "super admin") && (
                    <button className="bg-[#3559E0] hover:bg-[#8CABFF] p-1.5 rounded-3xl transition duration-300" onClick={() => handleSendButtonClick(item)}>
                      <PaperAirplaneIcon className="w-5 h-5 text-white rotate-90" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* BatchTracker */}
      {isBatchTrackerOpen && <BatchTracker setIsBatchTrackerOpen={setIsBatchTrackerOpen} batchData={selectedBatch} />}
    </>
  );
};

export default CardTipping;
