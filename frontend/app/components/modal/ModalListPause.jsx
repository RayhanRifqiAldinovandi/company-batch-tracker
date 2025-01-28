import { useState, useContext } from "react";
import { LiveTrackingContext } from "@/app/context/liveTrackingContext";

const ModalListPause = () => {
  const { dataMinor, handleReturnPauseClick } = useContext(LiveTrackingContext);
  const [openModal, setOpenModal] = useState(false);

  // Handler for clicking outside the modal
  const handleCloseModal = (e) => {
    if (e.target.id === "outerModal") {
      setOpenModal(false);
    }
  };

  return (
    <>
      <button className="absolute top-[128px] right-3 btn btn-primary" onClick={() => setOpenModal(true)}>
        List Pause
      </button>

      {openModal && (
        <div id="outerModal" className="fixed inset-0 bg-gray-400/50 z-50 flex justify-center items-center" 
        onClick={handleCloseModal}>
          <div className="bg-white p-8 w-11/12 max-h-[80%] rounded-3xl shadow-lg overflow-auto">
            {/* Header */}
            <header className="flex justify-between">
              <h2 className="text-xl mb-4">List Pause</h2>
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
                    <th>Product Type</th>
                    <th>Batch Number</th>
                    <th>Keterangan</th>
                    <th>Pause Sender</th>
                    <th>Jam dan Tanggal Pause</th>
                    <th>Button</th>
                  </tr>
                </thead>
                <tbody>
                  {dataMinor?.pause?.map((item, index) => (
                    <tr key={item.uniqueNumber}>
                      <td>{index + 1}</td>
                      <td>{item.woNumber}</td>
                      <td>n/a</td>
                      <td>{item.itemCode}</td>
                      <td>{item.productType}</td>
                      <td>{item.batchNumber}</td>
                      <td>{item.pauseDetail}</td>
                      <td>{item.pause_sender}</td>
                      <td>{new Date(item.pause_timestamp).toLocaleString("en-US", 
                        { year: "numeric", month: "long", day: "numeric", hour: "numeric", minute: "numeric", hour12: true })}</td>
                      <td>
                        <button onClick={() => handleReturnPauseClick(item)} className="btn btn-primary">
                          Return
                        </button>
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

export default ModalListPause;
