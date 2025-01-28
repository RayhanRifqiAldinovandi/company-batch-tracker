"use client";

import { useContext } from "react";
import { LiveTrackingContext } from "@/app/context/liveTrackingContext";

// Import Component
import BatchTracker from "../../modal/BatchTracker";

// Import Icon
import { InformationCircleIcon, PaperAirplaneIcon } from "@heroicons/react/outline";

const CardDischarging = () => {
  const { dataRuah, department, userType, totalDataDischarging, isBatchTrackerOpen, setIsBatchTrackerOpen, selectedBatch, handleIconClick, handleSendButtonClick } = useContext(LiveTrackingContext);

  const lines = [
    { name: "line a", data: dataRuah?.dischargingline_a?.discharging },
    { name: "line b", data: dataRuah?.dischargingline_b?.discharging },
    { name: "line c", data: dataRuah?.dischargingline_c?.discharging },
    { name: "line d", data: dataRuah?.dischargingline_d?.discharging },
    { name: "line e", data: dataRuah?.dischargingline_e?.discharging },
    { name: "line f", data: dataRuah?.dischargingline_f?.discharging },
    { name: "line g", data: dataRuah?.dischargingline_g?.discharging },
    { name: "line h", data: dataRuah?.dischargingline_h?.discharging },
    { name: "line i", data: dataRuah?.dischargingline_i?.discharging },
    { name: "line j", data: dataRuah?.dischargingline_j?.discharging },
    { name: "line k", data: dataRuah?.dischargingline_k?.discharging },
    { name: "line l", data: dataRuah?.dischargingline_l?.discharging },
    { name: "line m", data: dataRuah?.dischargingline_m?.discharging },
    { name: "line n", data: dataRuah?.dischargingline_n?.discharging },
    { name: "line o", data: dataRuah?.dischargingline_o?.discharging },
    { name: "line p", data: dataRuah?.dischargingline_p?.discharging },
    { name: "line q", data: dataRuah?.dischargingline_q?.discharging },
    { name: "line r", data: dataRuah?.dischargingline_r?.discharging },
    { name: "line s", data: dataRuah?.dischargingline_s?.discharging },
    { name: "line t", data: dataRuah?.dischargingline_t?.discharging },
    { name: "line u", data: dataRuah?.dischargingline_u?.discharging },
    { name: "line v", data: dataRuah?.dischargingline_v?.discharging },
    { name: "line w", data: dataRuah?.dischargingline_w?.discharging },
    { name: "line x", data: dataRuah?.dischargingline_x?.discharging },
  ];

  const renderCells = (items) => {
    return items.map((item) => (
      <div key={item.uniqueNumber} className="flex justify-between items-center hover:bg-slate-200 transition duration-300">
        <div className="flex items-center">
          <span className="bg-[#C5DFF8] mr-2 p-1 cursor-pointer rounded-md" onClick={() => handleIconClick(item)}>
            <InformationCircleIcon className="w-6 h-6 text-[#3559E0] hover:text-[#8CABFF] transition duration-300" />
          </span>
          <p className="uppercase">{item.batchNumber}</p>
        </div>
        {(department === "produksi" || userType === "super admin") && (
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
      <div className="card border w-full min-w-[300px] rounded-xl shadow-md">
        <div className="px-4 h-[90px] flex flex-col justify-center">
          <div className="flex justify-between">
            <p className="text-xs uppercase">the process</p>
            <p className="text-xs uppercase">total</p>
          </div>
          <div className="flex items-center justify-between mt-2">
            <h1 className="uppercase font-bold">discharging</h1>
            <h2 className="bg-[#C5DFF8] px-2 text-[#3559E0] font-bold rounded-xl">{totalDataDischarging}</h2>
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

      {isBatchTrackerOpen && <BatchTracker setIsBatchTrackerOpen={setIsBatchTrackerOpen} batchData={selectedBatch} />}
    </>
  );
};

export default CardDischarging;
