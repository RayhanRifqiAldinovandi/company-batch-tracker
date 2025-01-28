/* ========= BATCH TRACKER ========= 
  Merupakan modal yang digunakan di Dashboard dan Live Tracking untuk melihat nomor batch sudah sampai di proses mana. modal ini di import di file page.js pada folder Dashboard dan di setiap components yang ada di Live Tracking
*/

"use client";
import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";

// Import auth
import authIsLoggedIn from "../../auth/authIsLoggedIn";

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

const BatchTracker = ({ setIsBatchTrackerOpen, batchData }) => {
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
        productStages = ["ppic", "warehouse", "warehouse_staging", "penimbangan", "ready for tipping", "tipping"];
        break;
      case "ruah":
        productStages = ["ppic", "warehouse", "batching", "blending", "staging", "discharging"];
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
      console.log(batchData);
      setFormData({
        productType: batchData.productType || "",
        woNumber: batchData.woNumber || "",
        batchNumber: batchData.batchNumber || "",
        itemCode: batchData.itemCode || "",
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

  return (
    <>
      <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-40 flex justify-center items-center overflow-auto z-50">
        <div className="relative bg-white w-11/12 h-11/12 lg:ml-16 px-4 py-5 rounded-lg">
          {/* Header */}
          <header>
            <h1 className="uppercase font-bold">batch tracker</h1>
            <button onClick={() => setIsBatchTrackerOpen(false)} className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
              ✕
            </button>
          </header>

          {/* Detail Batch */}
          <div className="relative bg-white flex justify-center p-4">
            <span class="absolute top-6 inline-flex items-center rounded-md bg-red-50 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-600/10">Status : N/A</span>
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
                  {userType === "super admin" || userType === "admin"
                    ? !hiddenButton() && (
                        <button onClick={handleDelete} className="btn bg-[#D10000] uppercase px-4 rounded-md hover:bg-red-700 transition duration-300">
                          delete
                        </button>
                      )
                    : null}
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
                  <li className={`md:shrink md:basis-0 flex-1 group flex gap-x-2 md:block`} key={index}>
                    <div className="min-w-7 min-h-7 flex flex-col items-center md:w-full md:flex-row text-xs align-middle">
                      {/* Sebelum lingkaran */}
                      <span className={`w-2 min-h-2 h-full md:w-2/5 md:h-2 md:flex transition-duration-300 ease-in-out ${index === 0 ? "bg-transparent" : stages[index - 1]?.completed ? "bg-[#302F8E] text-white" : "bg-gray-200"}`}></span>

                      {/* Lingkaran */}
                      <span
                        className={`size-10 flex justify-center items-center flex-shrink-0 font-bold text-base text-gray-800 rounded-full transition-duration-300 ease-in-out ${
                          stage.processing ? (stage.bgColor === "bg-[#302F8E]" ? "bg-gray-200" : "bg-[#302F8E]") : stage.completed ? "bg-[#302F8E] text-white" : "bg-gray-200"
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
                          {(stage.name === "ppic" && <IoDocumentOutline className="w-6 h-6" />) ||
                            (stage.name === "warehouse" && <LiaWarehouseSolid className="w-6 h-6" />) ||
                            (stage.name === "produksi" && <HiArrowPathRoundedSquare className="w-6 h-6" />) ||
                            (stage.name === "warehouse_staging" && <TbBuildingWarehouse className="w-6 h-6" />) ||
                            (stage.name === "penimbangan" && <GiWeight className="w-6 h-6" />) ||
                            (stage.name === "staging" && <PiWarehouseLight className="w-6 h-6" />) ||
                            (stage.name === "batching" && <GiChemicalTank className="w-6 h-6" />) ||
                            (stage.name === "blending" && <RxBlendingMode className="w-6 h-6" />) ||
                            (stage.name === "ready for tipping" && <FaEnvelopeCircleCheck className="w-6 h-6" />) ||
                            (stage.name === "tipping" && <PiFunnel className="w-6 h-6" />) ||
                            (stage.name === "discharging" && <GiValve className="w-6 h-6" />) ||
                            (stage.name === "filling" && <MdOutlineOilBarrel className="w-6 h-6" />)}
                        </span>

                        {/* Start name process */}
                        <span className="block text-sm font-bold">{formatStageName(stage.name)}</span>
                        {/* End name process */}
                      </div>

                      <p className="text-sm md:text-center">
                        {(stage.name === "discharging" || stage.name === "filling") && batchData.lineSelection ? (
                          <>
                            <ArrowDownIcon className="w-6 h-3 mx-auto text-black" />
                            <p className="font-bold">{formatStageName(batchData.lineSelection)}</p>
                          </>
                        ) : (
                          ""
                        )}
                        {batchData[`step${stages.indexOf(stage) + 1}`]
                          ? new Date(batchData[`step${stages.indexOf(stage) + 1}`]).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric", hour: "numeric", minute: "numeric", hour12: true })
                          : ""}
                      </p>

                      {/* Start sender === mengambil step sender dari index pertama */}
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
        </div>
      </div>
    </>
  );
};

export default BatchTracker;
