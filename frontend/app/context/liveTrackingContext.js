import { createContext, useEffect, useState } from "react";

// Import Auth
import authIsLoggedIn from "../auth/authIsLoggedIn";

import Swal from "sweetalert2";

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
        console.log(dataMinor)
      })
      .catch((error) => {
        console.error("Error fetching data:", error.message);
      });
  };

  // Menghitung total data di minor
  const totalDataPpicMinor = dataMinor?.ppic?.length || 0;
  const totalDataWarehouseMinor = dataMinor?.warehouse?.length || 0;
  const totalDataWarehouseStaingMinor = dataMinor?.warehouse_staging?.length || 0;
  const totalDataPenimbanganMinor = dataMinor?.penimbangan?.length || 0;
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
        // console.log(dataRuah)
      })
      .catch((error) => {
        console.error("Error fetching data:", error.message);
      });
  };

  // Menghitung total data di ruah
  const totalDataPpicRuah = dataRuah?.ppic?.ppic?.length || 0;
  const totalDataWarehouseRuah = dataRuah?.warehouse?.warehouse?.length || 0;
  const totalDataBatchingRuah = dataRuah?.batching?.batching?.length || 0;
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
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [lineSelection, setLineSelection] = useState("");

  const handleIconClick = (batchData) => {
    setSelectedBatch(batchData);
    setIsBatchTrackerOpen(true);
  };

  const handleSendButtonClick = async (batchData) => {
    Swal.fire({
      title: `Do you want to send ${batchData.batchNumber}?`,
      text: "You won't to unsend this from the process!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, send it!",
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
          } else {
            // Handle error response
            console.error("Error sending data:", response.statusText);
          }
        } catch (error) {
          console.error("Error sending data:", error.message);
        }
        Swal.fire({
          title: "Send!",
          text: "Your work order has been send from our process.",
          icon: "success",
        });
      }
    });
  };

  const handleSendButtonClickStaging = async (batchData) => {
    setSelectedBatch(batchData);
    document.getElementById("my_modal_2").showModal();
  };

  const handleSendConfirmStaging = async () => {
    document.getElementById("my_modal_2").close();
    if (!selectedBatch) return;

    Swal.fire({
      title: `Do you want to send ${selectedBatch.batchNumber}?`,
      text: "You won't to unsend this from the process!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, send it!",
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
              text: "Your work order has been send from our process.",
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

  const value = {
    loggedInUser,
    department,
    userType,
    dataMinor,
    fetchDataMinor,
    totalDataPpicMinor,
    totalDataWarehouseMinor,
    totalDataWarehouseStaingMinor,
    totalDataPenimbanganMinor,
    totalDataTippingMinor,
    dataRuah,
    fetchDataRuah,
    totalDataPpicRuah,
    totalDataWarehouseRuah,
    totalDataBatchingRuah,
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
    setIsBatchTrackerOpen,
    selectedBatch,
    setSelectedBatch,
    lineSelection,
    setLineSelection,
    totalDataDischarging,
    totalDataFilling,
    handleIconClick,
    handleSendButtonClick,
    handleSendButtonClickStaging,
    handleSendConfirmStaging,
  };

  return <LiveTrackingContext.Provider value={value}>{children}</LiveTrackingContext.Provider>;
};
