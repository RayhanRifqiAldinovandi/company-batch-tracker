import React, { useContext } from "react";

// Dashboard Context
import { DashboardContext } from "@/app/context/dashboardContext";

// Chart from react apex chart
import dynamic from "next/dynamic";

const ReactApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

const CardChartKemas = () => {
  const { totalCompletedVariancePercentage, 
          totalCompletedPebjfPercentage, 
          getTarget } = useContext(DashboardContext);

  const optionsPebjf = {
    series: [totalCompletedPebjfPercentage, 100 - totalCompletedPebjfPercentage],
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
              formatter: () => "PEBJF",
            },
            value: {
              show: true,
              fontSize: "25px",
              fontFamily: "Helvetica, Arial, sans-serif",
              fontWeight: 400,
              color: "#373d3f",
              offsetY: 0,
              formatter: () => `${totalCompletedPebjfPercentage}%`,
            },
            total: {
              show: true,
              showAlways: true,
              label: "Total",
              fontSize: "13px",
              fontFamily: "Helvetica, Arial, sans-serif",
              fontWeight: 600,
              color: "#373d3f",
              formatter: () => `${totalCompletedPebjfPercentage}%`,
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

  const optionsVarian = {
    series: [totalCompletedVariancePercentage, 100 - totalCompletedVariancePercentage],
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
              formatter: () => "Varian",
            },
            value: {
              show: true,
              fontSize: "25px",
              fontFamily: "Helvetica, Arial, sans-serif",
              fontWeight: 400,
              color: "#373d3f",
              offsetY: 0,
              formatter: () => `${totalCompletedVariancePercentage}%`,
            },
            total: {
              show: true,
              showAlways: true,
              label: "Total",
              fontSize: "13px",
              fontFamily: "Helvetica, Arial, sans-serif",
              fontWeight: 600,
              color: "#373d3f",
              formatter: () => `${totalCompletedVariancePercentage}%`,
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

  // Ensure getTarget is an array before proceeding
  const targets = Array.isArray(getTarget) ? getTarget : [];

  // Find the target value for PEBJF
  const pebjfTarget = targets.filter((item) => ["PEBJF"]
  .includes(item.target_for)).reduce((sum, item) => sum + item.target_value, 0);

  // Find the total target value for PEBJN, PEBJX, and PEBXX
  const varianTarget = targets
    .filter((item) => 
      ["PEBJE", "PEJMF", "PEBPD", "PEBMZ", "PEBWA", 
        "PEBKA", "PENTC", "PEMAB", "PEMMA", "PEGAB", 
        "PEGMC", "PBSJC", "PBSJB", "PFKSA", "PFMAA", "PFELA"]
    .includes(item.target_for))
    .reduce((sum, item) => sum + item.target_value, 0);

  return (
    <>
      <div className="card bg-white shadow-md">
        <div className="card-body gap-0">
          <div className="flex justify-between items-center">
            <h2 className="card-title">Pencapaian Batch Kemas</h2>
            <div className="flex justify-between">
              <h3 className="text-gray-400">
                Target <span className="uppercase">pebjf</span>: <span className="text-black font-semibold">{pebjfTarget}</span>
              </h3>
              <h3 className="text-gray-400 ml-4">
                Target <span className="uppercase">varian</span>: <span className="text-black font-semibold">{varianTarget}</span>
              </h3>
            </div>
          </div>

          <div className="flex flex-row justify-between">
            <div className="mt-8 w-2/5">
              <ReactApexChart options={optionsPebjf} series={optionsPebjf.series} type="donut" height={250} />
            </div>
            <div className="mt-8 w-2/5">
              <ReactApexChart options={optionsVarian} series={optionsVarian.series} type="donut" height={250} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default CardChartKemas;
