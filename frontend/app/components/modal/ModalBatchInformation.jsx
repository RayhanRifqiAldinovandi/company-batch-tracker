/* ========= BATCH TRACKER ========= 
  Merupakan modal yang digunakan di Dashboard dan Live Tracking untuk melihat nomor batch sudah sampai di proses mana. modal ini di import di file page.js pada folder Dashboard dan di setiap components yang ada di Live Tracking
*/

"use client";

import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";

// Import auth
import authIsLoggedIn from "../../auth/authIsLoggedIn";

// Style CSS
import "../modal/style.css";

// Hero Icon
import { ArrowDownIcon } from "@heroicons/react/outline";

// React Icon
import { IoDocumentOutline } from "react-icons/io5";
import { LiaWarehouseSolid } from "react-icons/lia";
import { TbBuildingWarehouse } from "react-icons/tb";
import { GiWeight, GiChemicalTank, GiValve } from "react-icons/gi";
import { PiWarehouseLight, PiFunnel } from "react-icons/pi";
import { HiArrowPathRoundedSquare } from "react-icons/hi2";
import { MdOutlineOilBarrel } from "react-icons/md";
import { RxBlendingMode } from "react-icons/rx";
import { FaEnvelopeCircleCheck } from "react-icons/fa6";
import { Info } from "@mui/icons-material";

const ModalBatchInformation = ({ setIsBatchTrackerOpen, batchData }) => {
  // Mengambil fungsi dari auth
  const { loggedInUser } = authIsLoggedIn();

  // Mengambil userType dari fungsi
  const { userType } = loggedInUser;

  const [stages, setStages] = useState([]);
  const [formData, setFormData] = useState({
    productType: "",
    woNumber: "",
    batchNumber: "",
    itemCode: "",
  });

  useEffect(() => {
    // Variable ProductType
    let productStages = [];

    switch (batchData.productType) {
      case "minor":
        productStages = ["ppic", "warehouse", "warehouse staging", "penimbangan", "ready for tipping", "tipping"];
        break;
      case "ruah":
        productStages = ["ppic", "warehouse", "ready for batching", "batching", "blending", "staging", "discharging"];
        break;
      case "kemas":
        productStages = ["ppic", "produksi", "warehouse", "staging", "filling"];
        break;
      default:
        productStages = [];
        break;
    }

    setStages(productStages);

    // Form
    if (batchData) {
      setFormData({
        productType: batchData.productType || "",
        woNumber: batchData.woNumber || "",
        batchNumber: batchData.batchNumber || "",
        itemCode: batchData.itemCode || "",
        movable: batchData.moveable,
      });

      // Inisialisasi status untuk setiap stage
      const stagesWithStatus = productStages.map((stage) => ({
        name: stage,
        completed: false,
        processing: false, // Menambahkan flag processing
      }));

      // Update status berdasarkan current stage dari batchData
      const currentStageIndex = stagesWithStatus.findIndex((stage) => stage.name === batchData.subDepartment);

      if (currentStageIndex !== -1) {
        for (let i = 0; i < currentStageIndex; i++) {
          stagesWithStatus[i].completed = true;
        }
        // Menandai stage saat ini sebagai 'processing' jika tidak di akhir daftar
        if (currentStageIndex < stagesWithStatus.length) {
          stagesWithStatus[currentStageIndex].processing = true;
          // Copy sender information to the current stage
          stagesWithStatus[currentStageIndex].sender = batchData.sender || "";
        }
      }

      setStages(stagesWithStatus);
    }
  }, [batchData]);

  // Interval untuk stage proses
  useEffect(() => {
    // Interval untuk mengubah status processing
    const intervalId = setInterval(() => {
      setStages((prevStages) => {
        const stagesCopy = [...prevStages];
        const processingIndex = stagesCopy.findIndex((stage) => stage.processing);

        if (processingIndex < stagesCopy.length) {
          stagesCopy[processingIndex].processing = true;
        }

        return stagesCopy.map((stage) => ({
          ...stage,
          bgColor: stage.processing ? (stage.bgColor === "bg-[#302F8E]" ? "bg-white" : "bg-[#302F8E]") : stage.completed ? "bg-[#302F8E] text-white" : "bg-white",
        }));
      });
    }, 800); // Setiap 1000 ms (1 detik) untuk mengubah warna hijau

    return () => clearInterval(intervalId);
  }, []);

  const formatStageName = (stageName) => {
    // Mengganti semua '_' dengan spasi dan mengubah setiap kata menjadi Capitalize
    return stageName
      .replace(/_/g, " ") // Ganti semua '_' dengan spasi
      .split(" ") // Pisahkan string menjadi array kata-kata
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1)) // Kapitalisasi setiap kata
      .join(" "); // Gabungkan kembali menjadi string
  };

  // Handle delete
  const handleDelete = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't to delete this from the process!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        try {
          const uniqueNumber = batchData.uniqueNumber; // Extract uniqueNumber from batchData
          const batchNumber = batchData.batchNumber; // Extract uniqueNumber from batchData
          const token = localStorage.getItem("token");
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/delete-work-order`, {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ uniqueNumber, batchNumber }), // Send uniqueNumber in the request body
          })
            .then(async (response) => {
              if (response.ok) {
                const data = await response.json();
                console.log(data.message);
                Swal.fire({
                  title: "Deleted!",
                  text: "Your work order has been deleted from our process.",
                  icon: "success",
                }).then(() => {
                  // Close batchTracker after successful deletion
                  setIsBatchTrackerOpen(false);
                });
              } else {
                const errorData = await response.json();
                console.error("Error:", errorData.message);
              }
            })
            .catch((error) => {
              console.error("Network error:", error);
            });
        } catch (error) {}
      }
    });
  };

  const hiddenButton = () => {
    // Mencari indeks dari "filling" dan "tipping"
    const fillingOrTippingIndex = stages.findIndex((stage) => stage.name === "discharging" || stage.name === "tipping" || stage.name === "filling");
    // Mencari indeks dari tahap saat ini
    const currentStageIndex = stages.findIndex((stage) => stage.processing);
    // Jika tahap saat ini lebih besar atau sama dengan indeks "filling" atau "tipping", kembalikan true
    return currentStageIndex >= fillingOrTippingIndex;
  };

  const showMoveLine = () => {
    const currentStageIndex = stages.findIndex((stage) => stage.processing);
    const fillingStageIndex = stages.findIndex((stage) => stage.name === "filling");
    const dischargingStageIndex = stages.findIndex((stage) => stage.name === "discharging");

    // Memastikan bahwa currentStageIndex telah melewati tahap filling atau discharging
    return (fillingStageIndex !== -1 && currentStageIndex >= fillingStageIndex) || (dischargingStageIndex !== -1 && currentStageIndex >= dischargingStageIndex);
  };

  const [lineSelection, setLineSelection] = useState("");

  const handleButtonMoveLine = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "Anda ingin memindahkan work order ke line yang dipilih",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, move it!",
    }).then((result) => {
      if (result.isConfirmed) {
        const token = localStorage.getItem("token");
        const uniqueNumber = batchData.uniqueNumber;
        const currentLine = batchData.lineSelection;
        const productType = batchData.productType;
        if (batchData.movable !== false) {
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/move-line`, {
            method: "POST", // Change to POST since you're sending a request body
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ uniqueNumber, lineSelection, currentLine, productType }), // Send the UniqueNumber as a JSON object
          })
            .then((response) => {
              if (!response.ok) {
                throw new Error("Network response was not ok");
              }
              Swal.fire({
                title: "Success",
                text: `Work Order pindah ke ${lineSelection}`,
                icon: "success",
              });
              return response.json();
            })
            .catch((error) => {
              console.error("There was a problem with the fetch operation:", error);
              Swal.fire({
                title: "Error!",
                text: "Line Sedang digunakan",
                icon: "error",
              });
            });
        } else {
          Swal.fire({
            title: "Error!",
            text: "Item sudah pernah dipindahkan",
            icon: "error",
          });
        }
      }
    });
  };

  const currentStage = stages.find((stage) => stage.processing || !stage.completed)?.name;

  return (
    <>
      <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-40 flex justify-center items-center z-50">
        <div className={`hide-scrollbar relative bg-white w-11/12 ${["discharging", "filling"].includes(currentStage) ? "h-4/5" : ""} lg:ml-16 px-4 py-5 rounded-lg overflow-auto`}>
          {/* Header */}
          <header>
            <h1 className="uppercase font-bold">batch tracker</h1>
            <button onClick={() => setIsBatchTrackerOpen(false)} className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
              ✕
            </button>
          </header>

          {/* Detail Batch */}
          <div className="relative bg-white flex justify-center p-4">
            <span className="absolute top-6 inline-flex items-center rounded-md bg-red-50 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-600/10">Status : N/A</span>
            <div className="flex flex-col xl:flex-row px-4 pt-10 rounded-md">
              {/* Show Data Batch Tracker */}
              <div className="grid grid-cols-2 lg:grid-flow-col lg:auto-cols-max gap-4">
                <div>
                  <p className="text-[#302F8E] font-bold uppercase">jenis work order</p>
                  <p className="capitalize">{formData.productType}</p>
                </div>
                <div>
                  <p className="text-[#302F8E] font-bold uppercase">no. work order</p>
                  <p className="capitalize">{formData.woNumber}</p>
                </div>
                <div>
                  <p className="text-[#302F8E] font-bold uppercase">no. batch</p>
                  <p className="capitalize">{formData.batchNumber}</p>
                </div>
                <div>
                  <p className="text-[#302F8E] font-bold uppercase">kode produk</p>
                  <p className="capitalize">{formData.itemCode}</p>
                </div>

                {/* Start Button */}
                <div className="flex justify-center">
                  {(userType === "super admin" || userType === "admin") && !hiddenButton() && (
                    <button onClick={handleDelete} className="btn bg-[#D10000] uppercase px-4 rounded-md hover:bg-red-700 transition duration-300">
                      <p className=" text-white">Delete</p>
                    </button>
                  )}
                </div>
                {/* End Button */}
              </div>
            </div>
          </div>
          {/* End Detail Batch */}

          <div className="p-1 mt-5">
            {/* Stepper */}
            <div className="data-hs-stepper">
              {/* Stepper Nav */}
              <ul className="relative ml-24 md:ml-0 flex flex-col md:flex-row py-5">
                {stages.map((stage, index) => (
                  <li className="md:shrink md:basis-0 flex-1 group flex gap-x-2 md:block" key={index}>
                    <div className="min-w-7 min-h-7 flex flex-col items-center md:w-full md:flex-row text-xs align-middle">
                      {/* Sebelum lingkaran */}
                      <span className={`w-2 min-h-2 h-full md:w-2/5 md:h-2 md:flex transition-duration-300 ease-in-out ${index === 0 ? "bg-transparent" : stages[index - 1]?.completed ? "bg-[#302F8E] text-white" : "bg-gray-200"}`}></span>

                      {/* Lingkaran */}
                      <span
                        className={`size-10 flex justify-center items-center flex-shrink-0 font-bold text-base text-gray-800 rounded-full transition-duration-300 ease-in-out ${
                          stage.processing ? (stage.bgColor === "bg-[#302F8E]" ? "bg-gray-200" : "bg-[#302F8E] text-white") : stage.completed ? "bg-[#302F8E] text-white" : "bg-gray-200"
                        }`}
                      >
                        {index + 1}
                      </span>

                      {/* Setelah lingkaran */}
                      <span
                        className={`w-2 min-h-2 h-full md:mt-0 md:w-2/4 md:h-2 md:flex transition-duration-300 ease-in-out ${index === stages.length - 1 ? "bg-transparent" : stage.completed ? "bg-[#302F8E] text-white" : "bg-gray-200"}`}
                      ></span>
                    </div>

                    {/* Batch Detail */}
                    <div className="grow md:grow-0 md:mt-3 py-2 md:py-0">
                      <div className="flex md:justify-center items-center">
                        <span className="mr-1">
                          {stage.name === "ppic" && <IoDocumentOutline className="w-6 h-6" />}
                          {stage.name === "warehouse" && <LiaWarehouseSolid className="w-6 h-6" />}
                          {stage.name === "produksi" && <HiArrowPathRoundedSquare className="w-6 h-6" />}
                          {stage.name === "warehouse staging" && <TbBuildingWarehouse className="w-6 h-6" />}
                          {stage.name === "penimbangan" && <GiWeight className="w-6 h-6" />}
                          {stage.name === "staging" && <PiWarehouseLight className="w-6 h-6" />}
                          {stage.name === "batching" && <GiChemicalTank className="w-6 h-6" />}
                          {stage.name === "blending" && <RxBlendingMode className="w-6 h-6" />}
                          {stage.name === "ready for batching" && <FaEnvelopeCircleCheck className="w-6 h-6" />}
                          {stage.name === "ready for tipping" && <FaEnvelopeCircleCheck className="w-6 h-6" />}
                          {stage.name === "tipping" && <PiFunnel className="w-6 h-6" />}
                          {stage.name === "discharging" && <GiValve className="w-6 h-6" />}
                          {stage.name === "filling" && <MdOutlineOilBarrel className="w-6 h-6" />}
                        </span>

                        {/* Start name process */}
                        <span className="block text-sm font-bold">{formatStageName(stage.name)}</span>
                        {/* End name process */}
                      </div>

                      <p className="text-sm md:text-center">
                        {(stage.name === "discharging" || stage.name === "filling") && batchData.lineSelection && batchData.lineSelection !== "none" ? (
                          <>
                            {/* Line selection */}
                            <ArrowDownIcon className="w-6 h-3 mx-auto text-black" /> <p className="font-bold">{formatStageName(batchData.lineSelection)}</p>
                            {batchData[`step${stages.indexOf(stage) + 1}`]
                              ? new Date(batchData[`step${stages.indexOf(stage) + 1}`]).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric", hour: "numeric", minute: "numeric", hour12: true })
                              : ""}
                            <p className="text-[#302F8E] md:text-center font-medium">{batchData.step_moveline_sender || ""}</p>
                          </>
                        ) : (
                          ""
                        )}
                        {(stage.name === "ppic" ||
                          stage.name === "warehouse" ||
                          stage.name === "warehouse staging" ||
                          stage.name === "penimbangan" ||
                          stage.name === "ready for tipping" ||
                          stage.name === "tipping" ||
                          stage.name === "ready for batching" ||
                          stage.name === "batching" ||
                          stage.name === "blending" ||
                          stage.name === "staging" ||
                          stage.name === "produksi") && (
                          <>
                            {batchData[`step${stages.indexOf(stage) + 1}`]
                              ? new Date(batchData[`step${stages.indexOf(stage) + 1}`]).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric", hour: "numeric", minute: "numeric", hour12: true })
                              : ""}
                          </>
                        )}
                        {(stage.name === "discharging" || stage.name === "filling") && batchData.line_record && batchData.moved_to_line ? (
                          <>
                            {/* Moved line */}
                            <ArrowDownIcon className="w-6 h-3 mx-auto text-black" /> <p className="font-bold">{formatStageName(batchData.line_record)}</p>
                            {batchData[`step${stages.indexOf(stage) + 1}`]
                              ? new Date(batchData[`step${stages.indexOf(stage) + 1}`]).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric", hour: "numeric", minute: "numeric", hour12: true })
                              : ""}
                            <p className="text-[#302F8E] md:text-center font-medium">{batchData.step_moveline_sender || ""}</p>
                            <ArrowDownIcon className="w-6 h-3 mx-auto text-black" />
                            <p className="font-bold">{formatStageName(batchData.moved_to_line)}</p>
                            {batchData.moveline_step
                              ? new Date(batchData.moveline_step).toLocaleDateString("en-US", {
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                  hour: "numeric",
                                  minute: "numeric",
                                  hour12: true,
                                })
                              : ""}
                          </>
                        ) : (
                          ""
                        )}
                      </p>

                      {/* Start sender */}
                      <p className="text-[#302F8E] md:text-center font-medium">{batchData[`step_${stages.indexOf(stage) + 1}_sender`]}</p>
                      {/* End sender */}
                    </div>
                  </li>
                ))}
              </ul>
              {/* End Stepper Nav */}
            </div>
            {/* End Stepper */}
          </div>

          {/* Move line */}
          {showMoveLine() && batchData.movable !== false && (
            <>
              <hr className="text-black my-4" />
              <div className="w-full flex flex-col justify-center items-center mx-auto mt-10">
                {/* Information */}
                <div className="bg-gray-50 border border-gray-400 rounded-lg mb-5 p-5">
                  <h1 className="text-sm font-bold text-red-500">
                    <Info /> Penting!
                  </h1>
                  <p>
                    Fitur ini digunakan ketika terjadi <span className="italic">"kebutuhan khusus"</span> seperti <span className="font-semibold italic">Breakdown</span> dan <span className="font-semibold italic uppercase">gt</span>
                  </p>
                </div>

                {/* Select line */}
                <h3 className="font-bold mb-2">Pilih line yang ingin Anda tuju!</h3>
                <select value={lineSelection} onChange={(e) => setLineSelection(e.target.value)} className="w-full lg:w-1/2 bg-white select select-bordered uppercase" required>
                  <option value="" disabled selected hidden>
                    Pilih Line
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
                <button onClick={handleButtonMoveLine} className="btn btn-primary mt-4 rounded-md">
                  Move Line
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default ModalBatchInformation;
