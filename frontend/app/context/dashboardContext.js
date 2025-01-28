import { createContext, useEffect, useState } from "react";

export const DashboardContext = createContext();

export const DashboardProvider = ({ children }) => {
  const [data, setData] = useState({ ppic: [], produksi: [], warehouse: [] });
  const [isBatchTrackerOpen, setIsBatchTrackerOpen] = useState(false);
  const [selectedBatch, setSelectedBatch] = useState(null);

  useEffect(() => {
    const intervalId = setInterval(() => {
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/dashboard`)
        .then((res) => {
          if (!res.ok) {
            throw new Error("Network response was not ok");
          }
          return res.json();
        })
        .then((data) => {
          setData(data);
        })
        .catch((error) => {
          console.error("Error fetching data:", error.message);
        });
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  const handleIconClick = (batchData) => {
    setSelectedBatch(batchData);
    setIsBatchTrackerOpen(true);
  };

  // Menghitung total data ppic
  const totalDataPpic = data.ppic.length;

  // Menghitung total data produksi
  const totalDataProduksi = data.produksi.length;

  // Menghitung total data warehouse
  const totalDataWarehouse = data.warehouse.length;

  // Mempersiapkan data untuk dibagikan melalui context
  const value = {
    data,
    totalDataPpic,
    totalDataProduksi,
    totalDataWarehouse,
    isBatchTrackerOpen,
    selectedBatch,
    handleIconClick,
    setIsBatchTrackerOpen,
    setSelectedBatch,
  };

  return <DashboardContext.Provider value={value}>{children}</DashboardContext.Provider>;
};
