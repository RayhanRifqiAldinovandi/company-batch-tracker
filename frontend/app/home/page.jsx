"use client";

// Mengimport state dan function dari Home Context
import { HomeProvider } from "../context/homeContext";

// Import Component
import CardPpic from "../components/home/CardPpic";
import CardProduksi from "../components/home/CardProduksi";
import CardWarehouse from "../components/home/CardWarehouse";
import ListPause from "../components/home/ListPause";

const Page = () => {
  return (
    <>
      {/* Mengimport provider agar bisa mengelola state global */}
      <HomeProvider>
        {/* Main page */}

        <div className="grid grid-cols-1 gap-5 sm:grid sm:grid-cols-2 sm:gap-5 lg:flex flex-wrap md:flex-nowrap mt-5">
          <CardPpic />
          <CardProduksi />
          <CardWarehouse />
        </div>
        <div className="mt-8">
          <ListPause />
        </div>
      </HomeProvider>
    </>
  );
};

export default Page;
