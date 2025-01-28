import { useState, useContext } from "react";
import { LiveTrackingContext } from "@/app/context/liveTrackingContext";
import authIsLoggedIn from "@/app/auth/authIsLoggedIn";

// Icon
import { PaperAirplaneIcon } from "@heroicons/react/outline";
import { HiArrowUturnLeft } from "react-icons/hi2";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import { PiQueueBold } from "react-icons/pi";

const ModalQueueRuah = () => {
  const { handleReturnStaging, handleSendButtonClick, formatLineName, lineSortConfigRuah, sortedLineRuah, handleLineSortRuah, userType } = useContext(LiveTrackingContext);
  const [openModal, setOpenModal] = useState(false);

  // Handler for clicking outside the modal
  const handleCloseModal = (e) => {
    if (e.target.id === "outerModal") {
      setOpenModal(false);
    }
  };

  return (
    <>
      <button className="bg-blue-600 focus:bg-blue-400 p-1 text-white rounded-md" onClick={() => setOpenModal(true)}>
        <PiQueueBold className="w-6 h-6" />
      </button>
      {openModal && (
        <div id="outerModal" className="fixed inset-0 bg-gray-400/50 z-50 flex justify-center items-center" onClick={handleCloseModal}>
          <div className="bg-white p-8 w-11/12 max-h-[80%] rounded-3xl shadow-lg overflow-auto">
            {/* Header */}
            <header className="flex justify-between">
              <h2 className="text-xl mb-4">Queue</h2>
              <button onClick={() => setOpenModal(false)} className="btn btn-sm btn-circle btn-ghost">
                ✕
              </button>
            </header>

            {/* Table container with a set max height */}
            <div className="overflow-auto max-h-[60vh]">
              {/* Table data list pause */}
              <table id="report-table" className="report-table table table-zebra table-pin-rows table-pin-cols w-full">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Work Order Number</th>
                    <th>Batch Status</th>
                    <th>Item Code</th>
                    <th>Batch Number</th>
                    <td className="flex items-center cursor-pointer capitalize" onClick={() => handleLineSortRuah("queue")}>
                      Line Selection
                      <div className="flex flex-col items-center ml-2">
                        <ArrowDropUpIcon className={`-m-2 ${lineSortConfigRuah.key === "batchNumber" && lineSortConfigRuah.direction === "ascending" ? "text-gray-500" : ""}`} />
                        <ArrowDropDownIcon className={`-m-2 ${lineSortConfigRuah.key === "batchNumber" && lineSortConfigRuah.direction === "descending" ? "text-gray-500" : ""}`} />
                      </div>
                    </td>
                    <th>Button</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedLineRuah
                    ?.filter((item) => item.queue)
                    .map((item, index) => (
                      <tr key={item.uniqueNumber}>
                        <td>{index + 1}</td>
                        <td>{item.woNumber}</td>
                        <td>n/a</td>
                        <td>{item.itemCode}</td>
                        <td>{item.batchNumber}</td>
                        <td>{formatLineName(item.queue)}</td>
                        <td>
                          {(userType === "super admin" || userType === "admin produksi" || userType === "operator produksi 2") && (
                            <>
                              <button className="bg-[#FF8F00] hover:bg-[#FFBF78] mr-1 p-1.5 rounded-3xl transition duration-300">
                                <HiArrowUturnLeft className="w-5 h-5 text-white" onClick={() => handleReturnStaging(item)} />
                              </button>
                              <button className="bg-[#3559E0] hover:bg-[#8CABFF] ml-2 p-1.5 rounded-3xl transition duration-300" onClick={() => handleSendButtonClick(item)}>
                                <PaperAirplaneIcon className="w-5 h-5 text-white rotate-90" />
                              </button>
                            </>
                          )}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ModalQueueRuah;
