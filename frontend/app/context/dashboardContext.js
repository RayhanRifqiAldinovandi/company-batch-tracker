import { createContext, useEffect, useState } from "react";

export const DashboardContext = createContext();

export const DashboardProvider = ({ children }) => {
  const [data, setData] = useState({ ppic: [], produksi: [], warehouse: [] });
  const [dataMinor, setDataMinor] = useState("");
  const [dataLineChart, setDataLineChart] = useState([]);
  const [totalCompletedData, setTotalCompletedData] = useState(0);
  const [totalCompletedVariancePercentage, setTotalCompletedVariancePercentage] = useState(0);
  const [totalCompletedPebjfPercentage, setTotalCompletedPebjfPercentage] = useState(0);
  const [totalCountThisMonth, setTotalCountThisMonth] = useState(0);
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedTargetYear, setSelectedTargetYear] = useState("");
  const [getTarget, setGetTarget] = useState("");
  
  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const years = Array.from(new Array(21), (_, index) => new Date().getFullYear() - 2 + index);

  useEffect(() => {
    const currentDate = new Date();
    setSelectedMonth(months[currentDate.getMonth()]); // set the month as a string
    setSelectedTargetYear(currentDate.getFullYear());
  }, []);

  useEffect(() => {
    const intervalId = setInterval(() => {
      fetch(`http://localhost:5051/api/dashboard`)
        .then((res) => {
          if (!res.ok) {
            throw new Error("Network response was not ok");
          }
          return res.json();
        })
        .then((data) => {
          const today = new Date();
          const currentYear = today.getFullYear();
          const currentMonth = today.getMonth();

          // Fungsi untuk menghitung jumlah data berdasarkan bulan step1
          const countItemsByMonth = (items) => {
            return items.filter((item) => {
              if (item.step1) {
                const step1Date = new Date(item.step1);
                return step1Date.getFullYear() === currentYear && step1Date.getMonth() === currentMonth;
              }
              return false;
            }).length;
          };

          // Hitung jumlah untuk setiap kategori
          const ppicCount = countItemsByMonth(data.ppic || []);
          const warehouseCount = countItemsByMonth(data.warehouse || []);
          const produksiCount = countItemsByMonth(data.produksi || []);

          // Jumlah total dari semua kategori
          const totalCountThisMonth = ppicCount + warehouseCount + produksiCount;

          // Menyimpan data untuk digunakan di UI jika diperlukan
          setData(data);
          setTotalCountThisMonth(totalCountThisMonth);
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

        fetch("http://localhost:3000/api/dasboard")

      fetch(`${process.env.NEXT_PUBLIC_API_URL}/total-completed?month=${selectedMonth}`)
        .then((res) => {
          if (!res.ok) {
            throw new Error("Network response was not ok");
          }
          return res.json();
        })
        .then((data) => {
          setTotalCompletedData(data.completedBatchData);
        })
        .catch((error) => {
          console.error("Error fetching data:", error.message);
        });

      fetch(`${process.env.NEXT_PUBLIC_API_URL}/total-completed-PEBJF-percentage?month=${selectedMonth}&targetYear=${selectedTargetYear}`)
        .then((res) => {
          if (!res.ok) {
            throw new Error("Network response was not ok");
          }
          return res.json();
        })
        .then((data) => {
          setTotalCompletedPebjfPercentage(data);
        })
        .catch((error) => {
          console.error("Error fetching data:", error.message);
        });

      fetch(`${process.env.NEXT_PUBLIC_API_URL}/total-completed-variance-percentage?month=${selectedMonth}&targetYear=${selectedTargetYear}`)
        .then((res) => {
          if (!res.ok) {
            throw new Error("Network response was not ok");
          }
          return res.json();
        })
        .then((data) => {
          setTotalCompletedVariancePercentage(data);
        })
        .catch((error) => {
          console.error("Error fetching data:", error.message);
        });

      fetch(`${process.env.NEXT_PUBLIC_API_URL}/get-targets`)
        .then((res) => {
          if (!res.ok) {
            throw new Error("Network response was not ok");
          }
          return res.json();
        })
        .then((data) => {
          setGetTarget(data);
        })
        .catch((error) => {
          console.error("error", error.message);
        });

      fetch(`${process.env.NEXT_PUBLIC_API_URL}/line-chart?year=${selectedTargetYear}`)
        .then((res) => {
          if (!res.ok) {
            throw new Error("Network response was not ok");
          }
          return res.json();
        })
        .then((data) => {
          // Assuming `data` is an object like { "January": 0, ..., "December": 0 }
          const formattedData = months.map(month => data[month] || 0);
          setDataLineChart(formattedData);
        })
        .catch((error) => {
          console.error("Error fetching data:", error.message);
        });
    }, 1000);

    return () => clearInterval(intervalId);
  }, [selectedMonth, selectedTargetYear]);

  // Menghitung total data ppic
  const totalDataPpic = data.ppic.length;

  // Menghitung total data produksi
  const totalDataProduksi = data.produksi.length;

  // Menghitung total data warehouse
  const totalDataWarehouse = data.warehouse.length;

  const totalData = totalDataPpic + totalDataProduksi + totalDataWarehouse + totalCompletedData;

  const averageData = totalData > 0 ? (totalCompletedData / totalData) * 100 : 0;

  // Mempersiapkan data untuk dibagikan melalui context
  const value = {
    data,
    dataMinor,
    totalData,
    totalCompletedData,
    totalCountThisMonth,
    totalCompletedVariancePercentage,
    totalCompletedPebjfPercentage,
    averageData,
    months,
    years,
    selectedMonth,
    selectedTargetYear,
    setSelectedMonth,
    setSelectedTargetYear,
    getTarget,
    setGetTarget,
    dataLineChart,
  };

  return <DashboardContext.Provider value={value}>{children}</DashboardContext.Provider>;
};
