import React, { useContext } from "react";

// Dashboard Context
import { DashboardContext } from "@/app/context/dashboardContext";

// Chart from react apex chart
import dynamic from "next/dynamic";

const ReactApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

const CardColumnChart = () => {
  const { dataLineChart, selectedTargetYear } = useContext(DashboardContext);

  const options = {
    series: [
      {
        name: "Total Batch Number",
        data: dataLineChart,
      },
    ],
    options: {
      chart: {
        height: 350,
        type: "bar",
      },
      plotOptions: {
        bar: {
          borderRadius: 10,
          columnWidth: "50%",
        },
      },
      dataLabels: {
        enabled: true,
      },
      stroke: {
        width: 0,
      },
      grid: {
        row: {
          colors: ["#fff", "#f2f2f2"],
        },
      },
      xaxis: {
        labels: {
          rotate: -45,
        },
        categories: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
        tickPlacement: "on",
      },
      yaxis: {
        title: {
          text: "Total Batch Number",
        },
      },
      fill: {
        type: "gradient",
        gradient: {
          shade: "light",
          type: "horizontal",
          shadeIntensity: 0.25,
          gradientToColors: undefined,
          inverseColors: true,
          opacityFrom: 0.85,
          opacityTo: 0.85,
          stops: [50, 0, 100],
        },
      },
    },
  };

  return (
    <>
      <div className="card bg-white shadow-md">
        <div className="card-body gap-0">
          <div className="flex justify-between items-center">
            <h2 className="card-title">Pencapaian Batch Tahun {selectedTargetYear}</h2>
          </div>

          <div className="flex flex-row justify-between">
            <div className="mt-8 w-full">
              <ReactApexChart options={options.options} series={options.series} type="bar" height={250} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CardColumnChart;
