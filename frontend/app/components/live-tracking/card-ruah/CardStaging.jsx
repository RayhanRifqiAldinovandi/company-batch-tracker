"use client";

import { useContext, useEffect, useState } from "react";
import { LiveTrackingContext } from "@/app/context/liveTrackingContext";

// Import Component
import ModalBatchInformation from "../../modal/ModalBatchInformation";

// Import Icon
import { InformationCircleIcon, PaperAirplaneIcon } from "@heroicons/react/outline";
import { HiArrowUturnLeft } from "react-icons/hi2";
import ModalQueueRuah from "../../modal/ModalQueueRuah";

const CardStaging = () => {
  const { dataRuah, userType, totalDataStagingRuah, isBatchTrackerOpen, setIsBatchTrackerOpen, selectedBatch, handleIconClick, handleReverseWoClick, handleSendButtonClickStaging, lineSelection, setLineSelection, handleSendConfirmStaging } =
    useContext(LiveTrackingContext);

  return (
    <>
      <div className="card bg-white border w-full min-w-[250px] rounded-xl shadow-md">
        <div className="px-4 h-[90px] flex flex-col justify-center">
          <div className="flex justify-between items-center">
            <div className="flex flex-col">
              <p className="text-xs uppercase mb-2">in process</p>
              <h1 className="uppercase font-bold">staging</h1>
            </div>

            <div className="flex items-center">
              <div className="flex flex-col items-center">
                {/* Title */}
                <p className="text-xs uppercase mb-2">total</p>

                {/* Total */}
                <h2 className="bg-[#C5DFF8] w-6 h-6 ml-2 pl-1.5 text-[#3559E0] font-bold rounded-xl">{totalDataStagingRuah}</h2>
              </div>
              <div className="ml-4">
                <p className="text-xs uppercase mb-0.5">Queue</p>
                <ModalQueueRuah />
              </div>
            </div>
          </div>
        </div>

        {/* Card */}
        <div className="min-h-[420px] max-h-[420px] overflow-auto">
          {dataRuah?.staging?.staging
            ?.filter((item) => !item.queue)
            .map((item) => (
              <div key={item.uniqueNumber} className="border-b px-5 py-2 hover:bg-slate-200 transition duration-300">
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <span className="bg-[#C5DFF8] mr-2 p-1 cursor-pointer rounded-md" onClick={() => handleIconClick(item)}>
                      <InformationCircleIcon className="w-6 h-6 text-[#3559E0] hover:text-[#8CABFF] transition duration-300" />
                    </span>
                    <p className="uppercase">
                      {item.batchNumber} <span className="text-gray-500">-</span> {item.itemCode}
                    </p>
                  </div>
                  <div>
                    {(userType === "super admin" || userType === "admin produksi" || userType === "operator produksi 2") && (
                      <>
                        <button className="bg-[#FF8F00] hover:bg-[#FFBF78] mr-1 p-1.5 rounded-3xl transition duration-300">
                          <HiArrowUturnLeft className="w-5 h-5 text-white" onClick={() => handleReverseWoClick(item)} />
                        </button>
                        <button className="bg-[#3559E0] hover:bg-[#8CABFF] p-1.5 rounded-3xl transition duration-300" onClick={() => handleSendButtonClickStaging(item)}>
                          <PaperAirplaneIcon className="w-5 h-5 text-white rotate-90" />
                        </button>
                        <dialog id="my_modal_2" className="modal">
                          <div className="modal-box">
                            <h2>Batch Number: {selectedBatch?.batchNumber}</h2>
                            <h3 className="font-bold mb-2">Select the line you want to go to!</h3>
                            <select value={lineSelection} onChange={(e) => setLineSelection(e.target.value)} className="w-full select select-bordered uppercase" required>
                              <option value="" disabled selected hidden>
                                Choose Line
                              </option>
                              <option value="line_a" className="uppercase">
                                line a
                              </option>
                              <option value="line_b" className="uppercase">
                                line b
                              </option>
                              <option value="line_c" className="uppercase">
                                line c
                              </option>
                              <option value="line_d" className="uppercase">
                                line d
                              </option>
                              <option value="line_e" className="uppercase">
                                line e
                              </option>
                              <option value="line_f" className="uppercase">
                                line f
                              </option>
                              <option value="line_g" className="uppercase">
                                line g
                              </option>
                              <option value="line_h" className="uppercase">
                                line h
                              </option>
                              <option value="line_i" className="uppercase">
                                line i
                              </option>
                              <option value="line_j" className="uppercase">
                                line j
                              </option>
                              <option value="line_k" className="uppercase">
                                line k
                              </option>
                              <option value="line_l" className="uppercase">
                                line l
                              </option>
                              <option value="line_m" className="uppercase">
                                line m
                              </option>
                              <option value="line_n" className="uppercase">
                                line n
                              </option>
                              <option value="line_o" className="uppercase">
                                line o
                              </option>
                              <option value="line_p" className="uppercase">
                                line p
                              </option>
                              <option value="line_q" className="uppercase">
                                line q
                              </option>
                              <option value="line_r" className="uppercase">
                                line r
                              </option>
                              <option value="line_s" className="uppercase">
                                line s
                              </option>
                              <option value="line_t" className="uppercase">
                                line t
                              </option>
                              <option value="line_u" className="uppercase">
                                line u
                              </option>
                              <option value="line_v" className="uppercase">
                                line v
                              </option>
                              <option value="line_w" className="uppercase">
                                line w
                              </option>
                              <option value="line_x" className="uppercase">
                                line x
                              </option>
                            </select>
                            <button onClick={handleSendConfirmStaging} className="bg-blue-700 text-white uppercase mt-4 px-4 py-2 rounded-md hover:bg-[#302F8E] transition duration-300">
                              send
                            </button>
                          </div>
                          <form method="dialog" className="modal-backdrop">
                            <button>close</button>
                          </form>
                        </dialog>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* BatchTracker */}
      {isBatchTrackerOpen && <ModalBatchInformation setIsBatchTrackerOpen={setIsBatchTrackerOpen} batchData={selectedBatch} />}
    </>
  );
};

export default CardStaging;
