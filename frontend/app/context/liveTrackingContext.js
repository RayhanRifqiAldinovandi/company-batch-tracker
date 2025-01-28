import { createContext, useEffect, useState } from "react";

// Import Auth
import authIsLoggedIn from "../auth/authIsLoggedIn";

import Swal from "sweetalert2";

// Import dari react toastify untuk memanggil alert dari react toastify
import { Bounce, toast } from "react-toastify";

export const LiveTrackingContext = createContext();

export const LiveTrackingProvider = ({ children }) => {
  // Validasi departemen
  const { loggedInUser } = authIsLoggedIn();
  const { department, userType } = loggedInUser;

  // ====================== MINOR ========================== //
  // State untuk fetch data
  const [dataMinor, setDataMinor] = useState("");

  // Function untuk fetch data
  const fetchDataMinor = () => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/minor`)
      .then((res) => {
        if (!res.ok) {
          throw new Error("Network response was not ok");
        }
        return res.json();
      })
      .then((dataMinor) => {
        setDataMinor(dataMinor);
        // console.log(dataMinor);
      })
      .catch((error) => {
        console.error("Error fetching data:", error.message);
      });
  };

  const warehouse_staging = "warehouse staging";
  const ready_for_tipping = "ready for tipping";

  // Menghitung total data di minor
  const totalDataPpicMinor = dataMinor?.ppic?.length || 0;
  const totalDataWarehouseMinor = dataMinor?.warehouse?.length || 0;
  const totalDataWarehouseStagingMinor = dataMinor?.[warehouse_staging]?.length || 0;
  const totalDataPenimbanganMinor = dataMinor?.penimbangan?.length || 0;
  const totalDataReadyForTippingMinor = dataMinor?.[ready_for_tipping]?.length || 0;
  const totalDataTippingMinor = dataMinor?.tipping?.length || 0;

  // ====================== RUAH ========================== //
  // State untuk fetch data
  const [dataRuah, setDataRuah] = useState("");

  // Fetch data ruah
  const fetchDataRuah = () => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/ruah`)
      .then((res) => {
        if (!res.ok) {
          throw new Error("Network response was not ok");
        }
        return res.json();
      })
      .then((dataRuah) => {
        setDataRuah(dataRuah);
        console.log(dataRuah);
      })
      .catch((error) => {
        console.error("Error fetching data:", error.message);
      });
  };

  const ready_for_batching = "ready for batching";
  // Menghitung total data di ruah
  const totalDataPpicRuah = dataRuah?.ppic?.ppic?.length || 0;
  const totalDataWarehouseRuah = dataRuah?.warehouse?.warehouse?.length || 0;
  const totalDataReadyForBatchingRuah = dataRuah?.[ready_for_batching]?.[ready_for_batching]?.length || 0;
  const totalDataBatchingRuah = dataRuah?.batching?.batching?.length || 0;
  const totalDataBlendingRuah = dataRuah?.blending?.blending?.length || 0;
  const totalDataStagingRuah = dataRuah?.staging?.staging?.length || 0;

  // Menghitung total data line discharging
  const totalDataLineADischarging = dataRuah?.dischargingline_a?.discharging?.length || 0;
  const totalDataLineBDischarging = dataRuah?.dischargingline_b?.discharging?.length || 0;
  const totalDataLineCDischarging = dataRuah?.dischargingline_c?.discharging?.length || 0;
  const totalDataLineDDischarging = dataRuah?.dischargingline_d?.discharging?.length || 0;
  const totalDataLineEDischarging = dataRuah?.dischargingline_e?.discharging?.length || 0;
  const totalDataLineFDischarging = dataRuah?.dischargingline_f?.discharging?.length || 0;
  const totalDataLineGDischarging = dataRuah?.dischargingline_g?.discharging?.length || 0;
  const totalDataLineHDischarging = dataRuah?.dischargingline_h?.discharging?.length || 0;
  const totalDataLineIDischarging = dataRuah?.dischargingline_i?.discharging?.length || 0;
  const totalDataLineJDischarging = dataRuah?.dischargingline_j?.discharging?.length || 0;
  const totalDataLineKDischarging = dataRuah?.dischargingline_k?.discharging?.length || 0;
  const totalDataLineLDischarging = dataRuah?.dischargingline_l?.discharging?.length || 0;
  const totalDataLineMDischarging = dataRuah?.dischargingline_m?.discharging?.length || 0;
  const totalDataLineNDischarging = dataRuah?.dischargingline_n?.discharging?.length || 0;
  const totalDataLineODischarging = dataRuah?.dischargingline_o?.discharging?.length || 0;
  const totalDataLinePDischarging = dataRuah?.dischargingline_p?.discharging?.length || 0;
  const totalDataLineQDischarging = dataRuah?.dischargingline_q?.discharging?.length || 0;
  const totalDataLineRDischarging = dataRuah?.dischargingline_r?.discharging?.length || 0;
  const totalDataLineSDischarging = dataRuah?.dischargingline_s?.discharging?.length || 0;
  const totalDataLineTDischarging = dataRuah?.dischargingline_t?.discharging?.length || 0;
  const totalDataLineUDischarging = dataRuah?.dischargingline_u?.discharging?.length || 0;
  const totalDataLineVDischarging = dataRuah?.dischargingline_v?.discharging?.length || 0;
  const totalDataLineWDischarging = dataRuah?.dischargingline_w?.discharging?.length || 0;
  const totalDataLineXDischarging = dataRuah?.dischargingline_x?.discharging?.length || 0;

  const totalDataDischarging =
    totalDataLineADischarging +
    totalDataLineBDischarging +
    totalDataLineCDischarging +
    totalDataLineDDischarging +
    totalDataLineEDischarging +
    totalDataLineFDischarging +
    totalDataLineGDischarging +
    totalDataLineHDischarging +
    totalDataLineIDischarging +
    totalDataLineJDischarging +
    totalDataLineKDischarging +
    totalDataLineLDischarging +
    totalDataLineMDischarging +
    totalDataLineNDischarging +
    totalDataLineODischarging +
    totalDataLinePDischarging +
    totalDataLineQDischarging +
    totalDataLineRDischarging +
    totalDataLineSDischarging +
    totalDataLineTDischarging +
    totalDataLineUDischarging +
    totalDataLineVDischarging +
    totalDataLineWDischarging +
    totalDataLineXDischarging;

  // ====================== KEMAS ========================== //
  // State untuk menampung data
  const [dataKemas, setDataKemas] = useState("");

  // Handle fetch data kemas
  const fetchDataKemas = () => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/kemas`)
      .then((res) => {
        if (!res.ok) {
          throw new Error("Network response was not ok");
        }
        return res.json();
      })
      .then((dataKemas) => {
        setDataKemas(dataKemas);
        // console.log(dataKemas);
      })
      .catch((error) => {
        console.error("Error fetching data:", error.message);
      });
  };

  // Menghitung total data di kemas
  const totalDataPpicKemas = dataKemas?.ppic?.ppic?.length || 0;
  const totalDataProduksiKemas = dataKemas?.produksi?.produksi?.length || 0;
  const totalDataWarehouseKemas = dataKemas?.warehouse?.warehouse?.length || 0;
  const totalDataStagingKemas = dataKemas?.staging?.staging?.length || 0;

  // Menghitung total data filling
  const totalDataLineAFilling = dataKemas?.fillingline_a?.filling?.length || 0;
  const totalDataLineBFilling = dataKemas?.fillingline_b?.filling?.length || 0;
  const totalDataLineCFilling = dataKemas?.fillingline_c?.filling?.length || 0;
  const totalDataLineDFilling = dataKemas?.fillingline_d?.filling?.length || 0;
  const totalDataLineEFilling = dataKemas?.fillingline_e?.filling?.length || 0;
  const totalDataLineFFilling = dataKemas?.fillingline_f?.filling?.length || 0;
  const totalDataLineGFilling = dataKemas?.fillingline_g?.filling?.length || 0;
  const totalDataLineHFilling = dataKemas?.fillingline_h?.filling?.length || 0;
  const totalDataLineIFilling = dataKemas?.fillingline_i?.filling?.length || 0;
  const totalDataLineJFilling = dataKemas?.fillingline_j?.filling?.length || 0;
  const totalDataLineKFilling = dataKemas?.fillingline_k?.filling?.length || 0;
  const totalDataLineLFilling = dataKemas?.fillingline_l?.filling?.length || 0;
  const totalDataLineMFilling = dataKemas?.fillingline_m?.filling?.length || 0;
  const totalDataLineNFilling = dataKemas?.fillingline_n?.filling?.length || 0;
  const totalDataLineOFilling = dataKemas?.fillingline_o?.filling?.length || 0;
  const totalDataLinePFilling = dataKemas?.fillingline_p?.filling?.length || 0;
  const totalDataLineQFilling = dataKemas?.fillingline_q?.filling?.length || 0;
  const totalDataLineRFilling = dataKemas?.fillingline_r?.filling?.length || 0;
  const totalDataLineSFilling = dataKemas?.fillingline_s?.filling?.length || 0;
  const totalDataLineTFilling = dataKemas?.fillingline_t?.filling?.length || 0;
  const totalDataLineUFilling = dataKemas?.fillingline_u?.filling?.length || 0;
  const totalDataLineVFilling = dataKemas?.fillingline_v?.filling?.length || 0;
  const totalDataLineWFilling = dataKemas?.fillingline_w?.filling?.length || 0;
  const totalDataLineXFilling = dataKemas?.fillingline_x?.filling?.length || 0;

  const totalDataFilling =
    totalDataLineAFilling +
    totalDataLineBFilling +
    totalDataLineCFilling +
    totalDataLineDFilling +
    totalDataLineEFilling +
    totalDataLineFFilling +
    totalDataLineGFilling +
    totalDataLineHFilling +
    totalDataLineIFilling +
    totalDataLineJFilling +
    totalDataLineKFilling +
    totalDataLineLFilling +
    totalDataLineMFilling +
    totalDataLineNFilling +
    totalDataLineOFilling +
    totalDataLinePFilling +
    totalDataLineQFilling +
    totalDataLineRFilling +
    totalDataLineSFilling +
    totalDataLineTFilling +
    totalDataLineUFilling +
    totalDataLineVFilling +
    totalDataLineWFilling +
    totalDataLineXFilling;

  // Polling untuk minor ruah dan kemas
  useEffect(() => {
    fetchDataMinor();
    fetchDataRuah();
    fetchDataKemas();

    const intervalId = setInterval(() => {
      fetchDataMinor();
      fetchDataRuah();
      fetchDataKemas();
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  // ====================== STATE DAN FUNCTION UNTUK CARD DI MINOR, RUAH DAN KEMAS ========================== //

  const [isBatchTrackerOpen, setIsBatchTrackerOpen] = useState(false);
  const [selectedBatch, setSelectedBatch] = useState("");
  const [lineSelection, setLineSelection] = useState("");

  // Batch Information
  const handleIconClick = (batchData) => {
    setSelectedBatch(batchData);
    setIsBatchTrackerOpen(true);
  };

  // Penimbangan
  const handlePenimbanganClick = (batchData) => {
    setSelectedBatch(batchData);
    document.getElementById("my_modal_3").showModal();
  };

  // Pause Batching
  const [pauseDetails, setPauseDetails] = useState("");

  const handlePenimbanganPauseClick = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/pause`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...selectedBatch, PauseDetail: pauseDetails }),
      });

      if (response.ok) {
        toast.success(`Batch Number ${selectedBatch.batchNumber} berhasil di pause`, {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: true,
          closeButton: false,
          closeOnClick: false,
          pauseOnHover: false,
          draggable: false,
          progress: undefined,
          theme: "light",
          transition: Bounce,
        });
        setPauseDetails("");
      } else {
        console.error("Error mengirim data:", response.statusText);
      }
    } catch (error) {
      console.error("Error mengirim data:", error.message);
    }
  };

  // Return Pause Batching
  const handleReturnPauseClick = async (batchData) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/return-pause`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(batchData),
      });

      if (response.ok) {
        toast.success(`Batch Number ${selectedBatch.batchNumber} berhasil di return ke batching`, {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: true,
          closeButton: false,
          closeOnClick: false,
          pauseOnHover: false,
          draggable: false,
          progress: undefined,
          theme: "light",
          transition: Bounce,
        });
      } else {
        console.error("Error mengirim data:", response.statusText);
      }
    } catch (error) {
      console.error("Error mengirim data:", error.message);
    }
  };

  // Return Staging
  const handleReturnStaging = async (batchData) => {
    Swal.fire({
      title: `Apakah anda ingin mengembalikan ${batchData.batchNumber}?`,
      text: `Apakah anda ingin mengembalikan dari proses ${batchData.subDepartment}?`,
      icon: "peringatan",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Ya, kembalikan!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const token = localStorage.getItem("token");
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/return-staging`, {
            method: "PUT",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify(batchData),
          });

          if (response.ok) {
            // Do something after successful send, e.g., navigate to another page
            // Change the path as needed

            Swal.fire({
              title: "Terkirim!",
              text: `Nomor WO ${batchData.woNumber} berhasil di kembalikan dari proses ${batchData.subDepartment}`,
              icon: "success",
            });
          } else {
            // Handle error response
            const errorMessage = await response.text();
            Swal.fire({
              title: "Gagal!",
              text: errorMessage,
              icon: "error",
            });
          }
        } catch (error) {
          console.error("Error mengirim data:", error.message);
        }
      }
    });
  };

  // Reverse WO
  const handleReverseWoClick = async (batchData) => {
    Swal.fire({
      title: `Apakah anda ingin mengembalikan ${batchData.batchNumber}?`,
      text: `Apakah anda ingin mengembalikan dari proses ${batchData.subDepartment}?`,
      icon: "peringatan",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Ya, kembalikan!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const token = localStorage.getItem("token");
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/reverse-wo`, {
            method: "PUT",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify(batchData),
          });

          if (response.ok) {
            // Do something after successful send, e.g., navigate to another page
            // Change the path as needed

            Swal.fire({
              title: "Terkirim!",
              text: `Nomor WO ${batchData.woNumber} berhasil di kembalikan dari proses ${batchData.subDepartment}`,
              icon: "success",
            });
          } else {
            // Handle error response
            const errorMessage = await response.text();
            Swal.fire({
              title: "Gagal!",
              text: errorMessage,
              icon: "error",
            });
          }
        } catch (error) {
          console.error("Error mengirim data:", error.message);
        }
      }
    });
  };

  // Send WO
  const handleSendButtonClick = async (batchData) => {
    Swal.fire({
      title: `Apakah anda ingin mengirim ${batchData.batchNumber}?`,
      text: "Apakah anda ingin mengirim dari proses ini?",
      icon: "peringatan",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Ya, kirim!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const token = localStorage.getItem("token");
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/send`, {
            method: "PUT",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify(batchData),
          });

          if (response.ok) {
            // Do something after successful send, e.g., navigate to another page
            // Change the path as needed

            Swal.fire({
              title: "Terkirim!",
              text: `Nomor WO ${batchData.woNumber} berhasil di kirim`,
              icon: "success",
            });
          } else {
            // Handle error response
            const errorMessage = await response.text();
            Swal.fire({
              title: "Gagal!",
              text: errorMessage,
              icon: "error",
            });
            console.log(errorMessage);
          }
        } catch (error) {
          console.error("Error mengirim data:", error.message);
          Swal.fire({
            title: "Gagal!",
            text: "Terjadi kesalahan saat mengirim batch.",
            icon: "error",
          });
        }
      }
    });
  };

  // Multiple Checkbox
  const handleCheckboxChange = (item) => {
    if (Array.isArray(selectedBatch) && selectedBatch.some((batch) => batch.uniqueNumber === item.uniqueNumber)) {
      setSelectedBatch(selectedBatch.filter((batch) => batch.uniqueNumber !== item.uniqueNumber));
    } else {
      setSelectedBatch([...selectedBatch, item]);
    }

    // Deselect all master checkboxes
    setIsMasterCheckedPpicRuah(false);
    setIsMasterCheckedWarehouseRuah(false);
    setIsMasterCheckedReadyForBatchingRuah(false);
  };

  const isItemSelected = (item) => Array.isArray(selectedBatch) && selectedBatch.some((selected) => selected.uniqueNumber === item.uniqueNumber);

  /* ==================== START CHECKBOX BUTTON MINOR ================== */
  const [isMasterCheckedPpicMinor, setIsMasterCheckedPpicMinor] = useState(false);
  const [isMasterCheckedWarehouseMinor, setIsMasterCheckedWarehouseMinor] = useState(false);
  const [isMasterCheckedWarehouseStagingMinor, setIsMasterCheckedWarehouseStagingMinor] = useState(false);
  const [isMasterCheckedPenimbanganMinor, setIsMasterCheckedPenimbanganMinor] = useState(false);
  const [isMasterCheckedReadyForTippingMinor, setIsMasterCheckedReadyForTippingMinor] = useState(false);

  const handleMasterCheckboxChangePpicMinor = () => {
    setIsMasterCheckedWarehouseMinor(false);
    setIsMasterCheckedWarehouseStagingMinor(false);
    setIsMasterCheckedPenimbanganMinor(false);
    setIsMasterCheckedReadyForTippingMinor(false);

    if (isMasterCheckedPpicMinor) {
      setSelectedBatch([]);
    } else {
      const allItems = dataMinor?.ppic || [];
      setSelectedBatch(allItems);
    }

    setIsMasterCheckedPpicMinor(!isMasterCheckedPpicMinor);
  };

  const handleMasterCheckboxChangeWarehouseMinor = () => {
    setIsMasterCheckedPpicMinor(false);
    setIsMasterCheckedWarehouseStagingMinor(false);
    setIsMasterCheckedPenimbanganMinor(false);
    setIsMasterCheckedReadyForTippingMinor(false);

    if (isMasterCheckedWarehouseMinor) {
      setSelectedBatch([]);
    } else {
      const allItems = dataMinor?.warehouse || [];
      setSelectedBatch(allItems);
    }

    setIsMasterCheckedWarehouseMinor(!isMasterCheckedWarehouseMinor);
  };

  const handleMasterCheckboxChangeWarehouseStagingMinor = () => {
    setIsMasterCheckedPpicMinor(false);
    setIsMasterCheckedWarehouseMinor(false);
    setIsMasterCheckedPenimbanganMinor(false);
    setIsMasterCheckedReadyForTippingMinor(false);

    if (isMasterCheckedWarehouseStagingMinor) {
      setSelectedBatch([]);
    } else {
      const allItems = dataMinor?.[warehouse_staging] || [];
      setSelectedBatch(allItems);
    }

    setIsMasterCheckedWarehouseStagingMinor(!isMasterCheckedWarehouseStagingMinor);
  };

  const handleMasterCheckboxChangePenimbanganMinor = () => {
    setIsMasterCheckedPpicMinor(false);
    setIsMasterCheckedWarehouseMinor(false);
    setIsMasterCheckedWarehouseStagingMinor(false);
    setIsMasterCheckedReadyForTippingMinor(false);

    if (isMasterCheckedPenimbanganMinor) {
      setSelectedBatch([]);
    } else {
      const allItems = dataMinor?.penimbangan || [];
      setSelectedBatch(allItems);
    }

    setIsMasterCheckedPenimbanganMinor(!isMasterCheckedPenimbanganMinor);
  };

  const handleMasterCheckboxChangeReadyForTippingMinor = () => {
    setIsMasterCheckedPpicMinor(false);
    setIsMasterCheckedWarehouseMinor(false);
    setIsMasterCheckedWarehouseStagingMinor(false);
    setIsMasterCheckedReadyForTippingMinor(false);

    if (isMasterCheckedReadyForTippingMinor) {
      setSelectedBatch([]);
    } else {
      const allItems = dataMinor?.[ready_for_tipping] || [];
      setSelectedBatch(allItems);
    }

    setIsMasterCheckedReadyForTippingMinor(!isMasterCheckedReadyForTippingMinor);
  };

  const handleMultipleBatchPpicMinor = dataMinor?.ppic?.length > 1;
  const handleMultipleBatchWarehouseMinor = dataMinor?.warehouse?.length > 1;
  const handleMultipleBatchWarehouseStagingMinor = dataMinor?.[warehouse_staging]?.length > 1;
  const handleMultipleBatchPenimbanganMinor = dataMinor?.penimbangan?.length > 1;
  const handleMultipleBatchReadyForTippingMinor = dataMinor?.[ready_for_tipping]?.length > 1;

  /* ==================== END CHECKBOX BUTTON MINOR ================== */

  /* ==================== START CHECKBOX BUTTON RUAH ================== */

  // Select All Checkbox PPIC Ruah
  const [isMasterCheckedPpicRuah, setIsMasterCheckedPpicRuah] = useState(false);
  const [isMasterCheckedWarehouseRuah, setIsMasterCheckedWarehouseRuah] = useState(false);
  const [isMasterCheckedReadyForBatchingRuah, setIsMasterCheckedReadyForBatchingRuah] = useState(false);
  const [isMasterCheckedBlendingRuah, setIsMasterCheckedBlendingRuah] = useState(false);

  const handleMasterCheckboxChangePpicRuah = () => {
    setIsMasterCheckedWarehouseRuah(false);
    setIsMasterCheckedReadyForBatchingRuah(false);
    setIsMasterCheckedBlendingRuah(false);

    if (isMasterCheckedPpicRuah) {
      setSelectedBatch([]);
    } else {
      const allItems = dataRuah?.ppic?.ppic || [];
      setSelectedBatch(allItems);
    }

    setIsMasterCheckedPpicRuah(!isMasterCheckedPpicRuah);
  };

  // Warehouse Ruah
  const handleMasterCheckboxChangeWarehouseRuah = () => {
    setIsMasterCheckedPpicRuah(false);
    setIsMasterCheckedReadyForBatchingRuah(false);
    setIsMasterCheckedBlendingRuah(false);

    if (isMasterCheckedWarehouseRuah) {
      setSelectedBatch([]);
    } else {
      const allItems = dataRuah?.warehouse?.warehouse || [];
      setSelectedBatch(allItems);
    }

    setIsMasterCheckedWarehouseRuah(!isMasterCheckedWarehouseRuah);
  };

  // Batching Ruah
  const handleMasterCheckboxChangeReadyForBatchingRuah = () => {
    setIsMasterCheckedPpicRuah(false);
    setIsMasterCheckedWarehouseRuah(false);
    setIsMasterCheckedBlendingRuah(false);

    if (isMasterCheckedReadyForBatchingRuah) {
      setSelectedBatch([]);
    } else {
      const allItems = dataRuah?.[ready_for_batching]?.[ready_for_batching] || [];
      setSelectedBatch(allItems);
    }

    setIsMasterCheckedReadyForBatchingRuah(!isMasterCheckedReadyForBatchingRuah);
  };

  const handleMasterCheckboxChangeBlendingRuah = () => {
    setIsMasterCheckedPpicRuah(false);
    setIsMasterCheckedWarehouseRuah(false);
    setIsMasterCheckedReadyForBatchingRuah(false);

    if (isMasterCheckedBlendingRuah) {
      setSelectedBatch([]);
    } else {
      const allItems = dataRuah?.blending?.blending || [];
      setSelectedBatch(allItems);
    }

    setIsMasterCheckedBlendingRuah(!isMasterCheckedBlendingRuah);
  };

  const handleMultipleBatchPpicRuah = dataRuah?.ppic?.ppic?.length > 1;
  const handleMultipleBatchWarehouseRuah = dataRuah?.warehouse?.warehouse?.length > 1;
  const handleMultipleBatchBlendingRuah = dataRuah?.blending?.blending?.length > 1;

  /* =================== END CHECKBOX BUTTON RUAH ======================= */

  /* =================== START CHECKBOX BUTTON KEMAS ======================= */

  const [isMasterCheckedPpicKemas, setIsMasterCheckedPpicKemas] = useState(false);
  const [isMasterCheckedProduksiKemas, setIsMasterCheckedProduksiKemas] = useState(false);
  const [isMasterCheckedWarehouseKemas, setIsMasterCheckedWarehouseKemas] = useState(false);

  const handleMasterCheckboxChangePpicKemas = () => {
    setIsMasterCheckedProduksiKemas(false);
    setIsMasterCheckedWarehouseKemas(false);

    if (isMasterCheckedPpicKemas) {
      setSelectedBatch([]);
    } else {
      const allItems = dataKemas?.ppic?.ppic || [];
      setSelectedBatch(allItems);
    }

    setIsMasterCheckedPpicKemas(!isMasterCheckedPpicKemas);
  };

  const handleMasterCheckboxChangeProduksiKemas = () => {
    setIsMasterCheckedPpicKemas(false);
    setIsMasterCheckedWarehouseKemas(false);

    if (isMasterCheckedProduksiKemas) {
      setSelectedBatch([]);
    } else {
      const allItems = dataKemas?.produksi?.produksi || [];
      setSelectedBatch(allItems);
    }

    setIsMasterCheckedProduksiKemas(!isMasterCheckedProduksiKemas);
  };

  const handleMasterCheckboxChangeWarehouseKemas = () => {
    setIsMasterCheckedPpicKemas(false);
    setIsMasterCheckedProduksiKemas(false);

    if (isMasterCheckedWarehouseKemas) {
      setSelectedBatch([]);
    } else {
      const allItems = dataKemas?.warehouse?.warehouse || [];
      setSelectedBatch(allItems);
    }

    setIsMasterCheckedWarehouseKemas(!isMasterCheckedWarehouseKemas);
  };

  const handleMultipleBatchPpicKemas = dataKemas?.ppic?.ppic?.length > 1;
  const handleMultipleBatchProduksiKemas = dataKemas?.produksi?.produksi?.length > 1;
  const handleMultipleBatchWarehouseKemas = dataKemas?.warehouse?.warehouse?.length > 1;

  /* =================== END CHECKBOX BUTTON KEMAS ======================= */

  // Select Batch
  const handleSendSelectedBatch = async () => {
    if (selectedBatch.length === 0) {
      Swal.fire({
        title: "Tidak ada batch yang dipilih",
        text: "Pilih batch yang ingin dikirim.",
        icon: "warning",
      });
      return;
    }

    Swal.fire({
      title: "Apakah anda ingin mengirim batch yang dipilih?",
      text: `Anda akan mengirim ${selectedBatch.length} batch.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Ya, kirim!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const token = localStorage.getItem("token");
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/send-multiple`, {
            method: "PUT",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify(selectedBatch),
          });

          if (response.ok) {
            // Do something after successful send, e.g., navigate to another page
            // Change the path as needed
            setSelectedBatch([]);
            Swal.fire({
              title: "Terkirim!",
              text: "Batch yang dipilih telah terkirim.",
              icon: "success",
            });
          } else {
            // Handle error response
            console.error("Error mengirim data:", response.statusText);
            Swal.fire({
              title: "Gagal!",
              text: "Batch yang dipilih gagal dikirim.",
              icon: "error",
            });
          }
        } catch (error) {
          console.error("Error mengirim data:", error.message);
          Swal.fire({
            title: "Gagal!",
            text: "Terjadi kesalahan saat mengirim batch.",
            icon: "error",
          });
        }
      }
    });
  };

  // Send Staging
  const handleSendButtonClickStaging = async (batchData) => {
    setSelectedBatch(batchData);
    document.getElementById("my_modal_2").showModal();
  };

  // Send Confirm Staging
  const handleSendConfirmStaging = async () => {
    document.getElementById("my_modal_2").close();
    if (!selectedBatch) return;

    Swal.fire({
      title: `Apakah anda ingin mengirim ${selectedBatch.batchNumber}?`,
      text: "Anda ingin mengirim dari proses ini!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Ya, kirim!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const token = localStorage.getItem("token");
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/send`, {
            method: "PUT",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ ...selectedBatch, lineSelection }),
          });

          if (response.ok) {
            Swal.fire({
              title: "Send!",
              text: "Work order telah dikirim dari proses ini",
              icon: "success",
            });
          } else {
            const errorMessage = await response.text();
            Swal.fire({
              title: "Error!",
              text: errorMessage,
              icon: "error",
            });
          }
        } catch (error) {
          console.log(error.message);
        }
      }
    });
  };

  // Format Line
  const formatLineName = (lineName) => {
    // Mengganti semua '_' dengan spasi dan mengubah setiap kata menjadi Capitalize
    return lineName
      .replace(/_/g, " ") // Ganti semua '_' dengan spasi
      .split(" ") // Pisahkan string menjadi array kata-kata
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1)) // Kapitalisasi setiap kata
      .join(" "); // Gabungkan kembali menjadi string
  };

  // State for sorting
  const [lineSortConfigRuah, setLineSortConfigRuah] = useState({ key: "queue", direction: "ascending" });
  const [lineSortConfigKemas, setLineSortConfigKemas] = useState({ key: "queue", direction: "ascending" });

  // Sorting function for line
  const sortedLineRuah = dataRuah?.staging?.staging?.sort((a, b) => {
    if (a[lineSortConfigRuah.key] < b[lineSortConfigRuah.key]) {
      return lineSortConfigRuah.direction === "ascending" ? -1 : 1;
    }
    if (a[lineSortConfigRuah.key] > b[lineSortConfigRuah.key]) {
      return lineSortConfigRuah.direction === "ascending" ? 1 : -1;
    }
    return 0;
  });

  const sortedLineKemas = dataKemas?.staging?.staging?.sort((a, b) => {
    if (a[lineSortConfigKemas.key] < b[lineSortConfigKemas.key]) {
      return lineSortConfigKemas.direction === "ascending" ? -1 : 1;
    }
    if (a[lineSortConfigKemas.key] > b[lineSortConfigKemas.key]) {
      return lineSortConfigKemas.direction === "ascending" ? 1 : -1;
    }
    return 0;
  });

  // Handle sorting for line
  const handleLineSortRuah = (key) => {
    let direction = "ascending";
    if (lineSortConfigRuah.key === key && lineSortConfigRuah.direction === "ascending") {
      direction = "descending";
    }
    setLineSortConfigRuah({ key, direction });
  };

  const handleLineSortKemas = (key) => {
    let direction = "ascending";
    if (lineSortConfigKemas.key === key && lineSortConfigKemas.direction === "ascending") {
      direction = "descending";
    }
    setLineSortConfigKemas({ key, direction });
  };

  const value = {
    loggedInUser,
    department,
    userType,
    dataMinor,
    fetchDataMinor,
    totalDataPpicMinor,
    totalDataWarehouseMinor,
    totalDataWarehouseStagingMinor,
    totalDataPenimbanganMinor,
    totalDataReadyForTippingMinor,
    totalDataTippingMinor,
    dataRuah,
    fetchDataRuah,
    totalDataPpicRuah,
    totalDataWarehouseRuah,
    totalDataReadyForBatchingRuah,
    totalDataBatchingRuah,
    totalDataBlendingRuah,
    totalDataStagingRuah,
    totalDataDischarging,
    dataKemas,
    fetchDataKemas,
    totalDataPpicKemas,
    totalDataProduksiKemas,
    totalDataWarehouseKemas,
    totalDataStagingKemas,
    totalDataFilling,
    isBatchTrackerOpen,
    isItemSelected,
    isMasterCheckedPpicMinor,
    isMasterCheckedWarehouseMinor,
    isMasterCheckedWarehouseStagingMinor,
    isMasterCheckedPenimbanganMinor,
    isMasterCheckedReadyForTippingMinor,
    isMasterCheckedPpicRuah,
    isMasterCheckedWarehouseRuah,
    isMasterCheckedReadyForBatchingRuah,
    isMasterCheckedBlendingRuah,
    isMasterCheckedPpicKemas,
    isMasterCheckedProduksiKemas,
    isMasterCheckedWarehouseKemas,
    setIsBatchTrackerOpen,
    selectedBatch,
    setSelectedBatch,
    lineSelection,
    setLineSelection,
    totalDataDischarging,
    totalDataFilling,
    handleIconClick,
    handlePenimbanganClick,
    pauseDetails,
    setPauseDetails,
    handlePenimbanganPauseClick,
    handleReturnPauseClick,
    handleReturnStaging,
    handleReverseWoClick,
    handleCheckboxChange,
    handleSendSelectedBatch,
    handleMasterCheckboxChangePpicMinor,
    handleMasterCheckboxChangeWarehouseMinor,
    handleMasterCheckboxChangeWarehouseStagingMinor,
    handleMasterCheckboxChangePenimbanganMinor,
    handleMasterCheckboxChangeReadyForTippingMinor,
    handleMasterCheckboxChangePpicRuah,
    handleMasterCheckboxChangeWarehouseRuah,
    handleMasterCheckboxChangeReadyForBatchingRuah,
    handleMasterCheckboxChangeBlendingRuah,
    handleMasterCheckboxChangePpicKemas,
    handleMasterCheckboxChangeProduksiKemas,
    handleMasterCheckboxChangeWarehouseKemas,
    handleMultipleBatchPpicMinor,
    handleMultipleBatchWarehouseMinor,
    handleMultipleBatchWarehouseStagingMinor,
    handleMultipleBatchPenimbanganMinor,
    handleMultipleBatchReadyForTippingMinor,
    handleMultipleBatchPpicRuah,
    handleMultipleBatchWarehouseRuah,
    handleMultipleBatchBlendingRuah,
    handleMultipleBatchPpicKemas,
    handleMultipleBatchProduksiKemas,
    handleMultipleBatchWarehouseKemas,
    handleSendButtonClick,
    handleSendButtonClickStaging,
    handleSendConfirmStaging,
    formatLineName,
    lineSortConfigRuah,
    setLineSortConfigRuah,
    sortedLineRuah,
    handleLineSortRuah,
    lineSortConfigKemas,
    setLineSortConfigKemas,
    sortedLineKemas,
    handleLineSortKemas,
  };

  return <LiveTrackingContext.Provider value={value}>{children}</LiveTrackingContext.Provider>;
};
