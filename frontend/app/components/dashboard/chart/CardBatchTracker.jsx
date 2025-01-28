import React, { useContext } from "react";
import { DashboardContext } from "@/app/context/dashboardContext";
import { TbTicket } from "react-icons/tb";
import { CheckCircleOutline } from "@mui/icons-material";
import dynamic from "next/dynamic";

const ReactApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

const CardBatchTracker = () => {
  const { totalCountThisMonth, totalData, totalCompletedData, 
    averageData, selectedMonth } = useContext(DashboardContext);

  const options = {
    series: [averageData, 100 - averageData],
    chart: {
      type: "donut",
      width: "100%",
      height: 350,
    },
    labels: ["Completed", "Incomplete"],
    plotOptions: {
      pie: {
        donut: {
          size: "70%",
          labels: {
            show: true,
            name: {
              show: true,
              fontSize: "13px",
              fontFamily: "Helvetica, Arial, sans-serif",
              fontWeight: 600,
              color: "#373d3f",
              offsetY: -10,
              formatter: () => "Overall",
            },
            value: {
              show: true,
              fontSize: "25px",
              fontFamily: "Helvetica, Arial, sans-serif",
              fontWeight: 400,
              color: "#373d3f",
              offsetY: 0,
              formatter: () => `${averageData.toFixed(2)}%`,
            },
            total: {
              show: true,
              showAlways: true,
              label: "Total",
              fontSize: "13px",
              fontFamily: "Helvetica, Arial, sans-serif",
              fontWeight: 600,
              color: "#373d3f",
              formatter: () => `${averageData.toFixed(2)}%`,
            },
          },
        },
      },
    },
    dataLabels: {
      enabled: false,
    },
    legend: {
      position: "bottom",
    },
    colors: ["#1D24CA", "#E0E0E0"],
  };

  return (
    <>
      <div className="card bg-white shadow-md">
        <div className="card-body gap-0">
          <div className="flex justify-between items-center">
            <h2 className="card-title">Pencapaian Batch Keseluruhan</h2>
            <h3 className="text-gray-400">Bulan {selectedMonth}</h3>
          </div>

          <div className="flex flex-row justify-between">
            <div className="mt-8">
              <div>
                <p className="text-5xl font-semibold">{totalData}</p>
                <p className="text-gray-500">Total Batch Number</p>
              </div>
              <div className="flex items-center mt-10 h-8">
                <div className="flex items-center mr-2 bg-[#98ABEE] bg-opacity-40 px-2 py-2 rounded-md">
                  <TbTicket className="w-6 h-6 text-[#1D24CA]" />
                </div>
                <div>
                  <p>New Batch Number</p>
                  <p className="text-gray-400 text-sm">{totalCountThisMonth}</p>
                </div>
              </div>
              <div className="flex items-center mt-8 h-8">
                <div className="flex items-center mr-2 bg-[#F1EF99] bg-opacity-40 px-2 py-2 rounded-md">
                  <CheckCircleOutline className="w-6 h-6 text-[#FFC700]" />
                </div>
                <div>
                  <p>Completed Batch Number</p>
                  <p className="text-gray-400 text-sm">{totalCompletedData}</p>
                </div>
              </div>
            </div>

            <div className="mt-8 w-2/5">
              <ReactApexChart options={options} series={options.series} type="donut" height={250} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default CardBatchTracker;
