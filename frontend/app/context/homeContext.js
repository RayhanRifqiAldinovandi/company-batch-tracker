import { createContext, useEffect, useState } from "react";

export const HomeContext = createContext();

export const HomeProvider = ({ children }) => {
  const [data, setData] = useState({ ppic: [], produksi: [], warehouse: [] });
  const [dataMinor, setDataMinor] = useState("");
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
          console.log(data)
        })
        .catch((error) => {
          console.error("Error fetching data:", error.message);
        });

      fetch(`${process.env.NEXT_PUBLIC_API_URL}/minor`)
        .then((res) => {
          if (!res.ok) {
            throw new Error("Network response was not ok");
          }
          return res.json();
        })
        .then((dataMinor) => {
          setDataMinor(dataMinor);
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

  // State for sorting
  const [ppicSortConfig, setPpicSortConfig] = useState({ key: "batchNumber", direction: "ascending" });
  const [produksiSortConfig, setProduksiSortConfig] = useState({ key: "batchNumber", direction: "ascending" });
  const [warehouseSortConfig, setWarehouseSortConfig] = useState({ key: "batchNumber", direction: "ascending" });

  // Sorting function for ppic
  const sortedPpic = [...data.ppic].sort((a, b) => {
    if (a[ppicSortConfig.key] < b[ppicSortConfig.key]) {
      return ppicSortConfig.direction === "ascending" ? -1 : 1;
    }
    if (a[ppicSortConfig.key] > b[ppicSortConfig.key]) {
      return ppicSortConfig.direction === "ascending" ? 1 : -1;
    }
    return 0;
  });

  // Sorting function for produksi
  const sortedProduksi = [...data.produksi].sort((a, b) => {
    if (a[produksiSortConfig.key] < b[produksiSortConfig.key]) {
      return produksiSortConfig.direction === "ascending" ? -1 : 1;
    }
    if (a[produksiSortConfig.key] > b[produksiSortConfig.key]) {
      return produksiSortConfig.direction === "ascending" ? 1 : -1;
    }
    return 0;
  });

  // Sorting function for warehouse
  const sortedWarehouse = [...data.warehouse].sort((a, b) => {
    if (a[warehouseSortConfig.key] < b[warehouseSortConfig.key]) {
      return warehouseSortConfig.direction === "ascending" ? -1 : 1;
    }
    if (a[warehouseSortConfig.key] > b[warehouseSortConfig.key]) {
      return warehouseSortConfig.direction === "ascending" ? 1 : -1;
    }
    return 0;
  });

  // Handle sorting for ppic
  const handlePpicSort = (key) => {
    let direction = "ascending";
    if (ppicSortConfig.key === key && ppicSortConfig.direction === "ascending") {
      direction = "descending";
    }
    setPpicSortConfig({ key, direction });
  };

  // Handle sorting for produksi
  const handleProduksiSort = (key) => {
    let direction = "ascending";
    if (produksiSortConfig.key === key && produksiSortConfig.direction === "ascending") {
      direction = "descending";
    }
    setProduksiSortConfig({ key, direction });
  };

  // Handle sorting for warehouse
  const handleWarehouseSort = (key) => {
    let direction = "ascending";
    if (warehouseSortConfig.key === key && warehouseSortConfig.direction === "ascending") {
      direction = "descending";
    }
    setWarehouseSortConfig({ key, direction });
  };

  /* ================= START DASHBOARD ================= */

  /* ================= END DASHBOARD ================= */

  // Mempersiapkan data untuk dibagikan melalui context
  const value = {
    data,
    dataMinor,
    totalDataPpic,
    totalDataProduksi,
    totalDataWarehouse,
    isBatchTrackerOpen,
    selectedBatch,
    handleIconClick,
    ppicSortConfig,
    produksiSortConfig,
    warehouseSortConfig,
    sortedPpic,
    sortedProduksi,
    sortedWarehouse,
    handlePpicSort,
    handleProduksiSort,
    handleWarehouseSort,
    setIsBatchTrackerOpen,
    setSelectedBatch,
  };

  return <HomeContext.Provider value={value}>{children}</HomeContext.Provider>;
};
