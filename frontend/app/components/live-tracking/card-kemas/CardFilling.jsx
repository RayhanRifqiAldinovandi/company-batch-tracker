"use client";

import { useContext } from "react";
import { LiveTrackingContext } from "@/app/context/liveTrackingContext";

// Import Component
import ModalBatchInformation from "../../modal/ModalBatchInformation";

// Import Icon
import { InformationCircleIcon, PaperAirplaneIcon } from "@heroicons/react/outline";

const CardFilling = () => {
  const { dataKemas, userType, totalDataFilling, isBatchTrackerOpen, setIsBatchTrackerOpen, selectedBatch, handleIconClick, handleSendButtonClick } = useContext(LiveTrackingContext);

  const lines = [
    { name: "line a", data: dataKemas?.fillingline_a?.filling },
    { name: "line b", data: dataKemas?.fillingline_b?.filling },
    { name: "line c", data: dataKemas?.fillingline_c?.filling },
    { name: "line d", data: dataKemas?.fillingline_d?.filling },
    { name: "line e", data: dataKemas?.fillingline_e?.filling },
    { name: "line f", data: dataKemas?.fillingline_f?.filling },
    { name: "line g", data: dataKemas?.fillingline_g?.filling },
    { name: "line h", data: dataKemas?.fillingline_h?.filling },
    { name: "line j", data: dataKemas?.fillingline_j?.filling },
    { name: "line k", data: dataKemas?.fillingline_k?.filling },
    { name: "line l", data: dataKemas?.fillingline_l?.filling },
    { name: "line m", data: dataKemas?.fillingline_m?.filling },
    { name: "line n", data: dataKemas?.fillingline_n?.filling },
    { name: "line p", data: dataKemas?.fillingline_p?.filling },
    { name: "line q", data: dataKemas?.fillingline_q?.filling },
    { name: "line r", data: dataKemas?.fillingline_r?.filling },
    { name: "line s", data: dataKemas?.fillingline_s?.filling },
    { name: "line t", data: dataKemas?.fillingline_t?.filling },
    { name: "line v", data: dataKemas?.fillingline_v?.filling },
    { name: "line w", data: dataKemas?.fillingline_w?.filling },
  ];

  const renderCells = (items) => {
    return items.map((item) => (
      <div key={item.uniqueNumber} className="flex justify-between items-center hover:bg-slate-200 transition duration-300">
        <div className="flex items-center">
          <span className="bg-[#C5DFF8] mr-2 p-1 cursor-pointer rounded-md" onClick={() => handleIconClick(item)}>
            <InformationCircleIcon className="w-6 h-6 text-[#3559E0] hover:text-[#8CABFF] transition duration-300" />
          </span>
          <p className="uppercase">
            {item.batchNumber} <span className="text-gray-500">-</span> {item.itemCode}
          </p>
        </div>
        {(userType === "super admin" || userType === "admin produksi" || userType === "operator produksi 1") && (
          <button className="bg-[#3559E0] hover:bg-[#8CABFF] p-1.5 rounded-3xl transition duration-300" onClick={() => handleSendButtonClick(item)}>
            <PaperAirplaneIcon className="w-5 h-5 text-white rotate-90" />
          </button>
        )}
      </div>
    ));
  };

  const renderTable = (startIndex) => (
    <table className="table">
      <thead>
        <tr>
          {lines.slice(startIndex, startIndex + 4).map((line) => (
            <th key={line.name} className="uppercase">
              {line.name}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        <tr>
          {lines.slice(startIndex, startIndex + 4).map((line) => (
            <td key={line.name}>{line.data ? renderCells(line.data) : <p>Tidak ada proses saat ini</p>}</td>
          ))}
        </tr>
      </tbody>
    </table>
  );

  return (
    <>
      <div className="card bg-white border w-full min-w-[300px] rounded-xl shadow-md">
        <div className="px-4 h-[90px] flex flex-col justify-center">
          <div className="flex justify-between">
            <p className="text-xs uppercase">in process</p>
            <p className="text-xs uppercase">total</p>
          </div>
          <div className="flex items-center justify-between mt-2">
            <div>
              <h1 className="uppercase font-bold">filling</h1>
              <p className=""></p>
            </div>
            <h2 className="bg-[#C5DFF8] px-2 text-[#3559E0] font-bold rounded-xl">{totalDataFilling}</h2>
          </div>
        </div>

        <div className="min-h-[420px] pb-10 overflow-auto">
          {renderTable(0)}
          {renderTable(4)}
          {renderTable(8)}
          {renderTable(12)}
          {renderTable(16)}
          {renderTable(20)}
        </div>
      </div>

      {isBatchTrackerOpen && <ModalBatchInformation setIsBatchTrackerOpen={setIsBatchTrackerOpen} batchData={selectedBatch} />}
    </>
  );
};

export default CardFilling;
