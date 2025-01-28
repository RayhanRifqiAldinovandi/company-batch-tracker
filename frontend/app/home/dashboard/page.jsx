"use client";

import { DashboardProvider } from "@/app/context/dashboardContext";


import CardChartKemas from "@/app/components/dashboard/chart/CardChartKemas";
import FilterCalender from "@/app/components/dashboard/FilterCalender";
import CardColumnChart from "@/app/components/dashboard/chart/CardColumnChart";
import CardBatchTracker from "@/app/components/dashboard/chart/CardBatchTracker";

const page = () => {
  return (
    <>
      <DashboardProvider>
        <div className="flex flex-col">
          <div className="flex justify-end mb-2">
            <FilterCalender />
          </div>
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
            <CardBatchTracker/>
            <CardChartKemas />
            <CardColumnChart />
          </div>
        </div>
      </DashboardProvider>
    </>
  );
};

export default page;
