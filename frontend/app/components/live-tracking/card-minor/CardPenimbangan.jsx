"use client";

import { useContext } from "react";
import { LiveTrackingContext } from "@/app/context/liveTrackingContext";

// Import Component
import ModalBatchInformation from "../../modal/ModalBatchInformation";

// Import Icon
import { InformationCircleIcon, PaperAirplaneIcon } from "@heroicons/react/outline";
import { HiArrowUturnLeft } from "react-icons/hi2";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

const CardPenimbangan = () => {
  const {
    dataMinor,
    userType,
    totalDataPenimbanganMinor,
    isBatchTrackerOpen,
    setIsBatchTrackerOpen,
    isItemSelected,
    isMasterCheckedPenimbanganMinor,
    selectedBatch,
    handleIconClick,
    handleReverseWoClick,
    handlePenimbanganClick,
    handlePenimbanganPauseClick,
    pauseDetails,
    setPauseDetails,
    handleCheckboxChange,
    handleMasterCheckboxChangePenimbanganMinor,
    handleMultipleBatchPenimbanganMinor,
    handleSendSelectedBatch,
    handleSendButtonClick,
  } = useContext(LiveTrackingContext);
  return (
    <>
      <div className="card bg-white border w-full min-w-[300px] rounded-xl shadow-md">
        <div className="px-4 h-[90px] flex flex-col justify-center">
          <div className="flex justify-between">
            <p className="text-xs uppercase">in process</p>
            <p className="text-xs uppercase">total</p>
          </div>
          <div className="flex items-center justify-between mt-2">
            {/* Title */}
            <h1 className="uppercase font-bold">penimbangan</h1>

            {/* Total */}
            <h2 className="bg-[#C5DFF8] px-2 text-[#3559E0] font-bold rounded-xl">{totalDataPenimbanganMinor}</h2>
          </div>
        </div>

        {/* Card */}
        <div className="min-h-[420px] max-h-[420px] overflow-auto">
          {handleMultipleBatchPenimbanganMinor && (
            <div className="border-b px-5 py-2">
              <div className="flex items-center">
                <input type="checkbox" className="mr-2" checked={isMasterCheckedPenimbanganMinor} onChange={handleMasterCheckboxChangePenimbanganMinor} />
                <p className="uppercase">Select All</p>
              </div>
            </div>
          )}
          {dataMinor?.penimbangan?.map((item) => (
            <div key={item.uniqueNumber} className="border-b px-5 py-2 hover:bg-slate-200 transition duration-300">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  {dataMinor?.penimbangan?.length > 1 && <input type="checkbox" className="mr-2" checked={isItemSelected(item)} onChange={() => handleCheckboxChange(item)} />}
                  <span className="bg-[#C5DFF8] mr-2 p-1 cursor-pointer rounded-md" onClick={() => handleIconClick(item)}>
                    <InformationCircleIcon className="w-6 h-6 text-[#3559E0] hover:text-[#8CABFF] transition duration-300" />
                  </span>
                  <p className="uppercase">
                    {item.batchNumber} <span className="text-gray-500">-</span> {item.itemCode}
                  </p>
                </div>
                <div>
                  {(userType === "super admin" || userType === "admin warehouse") && (
                    <button className="bg-[#FF8F00] hover:bg-[#FFBF78] mr-1 p-1.5 rounded-3xl transition duration-300">
                      <HiArrowUturnLeft className="w-5 h-5 text-white" onClick={() => handleReverseWoClick(item)} />
                    </button>
                  )}
                  {(userType === "super admin" || userType === "admin warehouse" || userType === "operator timbang") && (
                    <>
                      <div className="dropdown dropdown-end">
                        <div tabIndex={0} role="button" className="m-1">
                          <KeyboardArrowDownIcon className="hover:text-blue-500 transition duration-500" />
                        </div>
                        <ul tabIndex={0} className="dropdown-content menu bg-white rounded-box z-[1] w-52 p-2 drop-shadow-xl">
                          <li>
                            <div className="flex items-center justify-between">
                              <p className="text-xs">Pause</p>
                              <button className="bg-[#3559E0] hover:bg-[#8CABFF] p-1.5 rounded-3xl transition duration-300" onClick={() => handlePenimbanganClick(item)}>
                                <PaperAirplaneIcon className="w-5 h-5 text-white rotate-90" />
                              </button>
                            </div>
                          </li>
                          <hr className="my-2"></hr>
                          <li>
                            <div className="flex items-center justify-between">
                              <p className="text-xs">Kirim ke Ready for Tipping</p>
                              <button className="bg-[#3559E0] hover:bg-[#8CABFF] ml-2 p-1.5 rounded-3xl transition duration-300" onClick={() => handleSendButtonClick(item)}>
                                <PaperAirplaneIcon className="w-5 h-5 text-white rotate-90" />
                              </button>
                            </div>
                          </li>
                        </ul>
                      </div>

                      <dialog id="my_modal_3" className="modal">
                        <div className="modal-box">
                          <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2" onClick={() => document.getElementById("my_modal_3").close()}>
                            ✕
                          </button>
                          <h3 className="font-bold text-lg">Penimbangan</h3>
                          <form onSubmit={handlePenimbanganPauseClick}>
                            <hr className="my-2" />
                            <div>
                              <h4 className="font-bold text-lg">Pause {selectedBatch?.batchNumber}</h4>
                              <div className="flex">
                                <input type="text" placeholder="Keterangan..." className="input input-bordered w-full max-w-xs" value={pauseDetails} onChange={(e) => setPauseDetails(e.target.value)} required />
                                <button type="submit" className="btn btn-primary ml-2">
                                  Submit
                                </button>
                              </div>
                            </div>
                          </form>
                        </div>
                      </dialog>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {handleMultipleBatchPenimbanganMinor && (userType === "super admin" || userType === "admin warehouse" || userType === "operator timbang") && (
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

export default CardPenimbangan;
