"use client";

// Mengimport state dan function dari Dashboard Context
import { DashboardProvider } from "../context/dashboardContext";

// Import Component
import CardPpic from "../components/dashboard/CardPpic";
import CardProduksi from "../components/dashboard/CardProduksi";
import CardWarehouse from "../components/dashboard/CardWarehouse";

const Page = () => {
  return (
    <>
      {/* Mengimport provider agar bisa mengelola state global */}
      <DashboardProvider>
        {/* Main page */}
        <div className="grid grid-cols-1 gap-5 sm:grid sm:grid-cols-2 sm:gap-5 lg:flex flex-wrap md:flex-nowrap">
          <CardPpic />
          <CardProduksi />
          <CardWarehouse />
        </div>
      </DashboardProvider>
    </>
  );
};

export default Page;
