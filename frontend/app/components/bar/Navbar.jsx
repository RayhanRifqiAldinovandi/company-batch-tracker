"use client";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import Image from "next/image";

// Import Auth
import authIsLoggedIn from "../../auth/authIsLoggedIn";

// Import Icon
import { InformationCircleIcon, LogoutIcon, MenuIcon, SearchIcon, XIcon } from "@heroicons/react/outline";

// Import Component
import BatchTracker from "../modal/ModalBatchInformation";

const Navbar = ({ toggleNavbar }) => {
  // Show Profile
  const { loggedInUser } = authIsLoggedIn();

  // Search
  const [showSearch, setShowSearch] = useState(false);
  const searchRef = useRef();
  const [searched, setSearched] = useState(false); // State to track if search has been performed
  const pathname = usePathname();
  // Fetch Data

  const [data, setData] = useState(null);
  const [search, setSearch] = useState("");
  const [filtered, setFiltered] = useState(null); // State to store filtered data

  const [ppicData, setPpicData] = useState(null);
  const [produksiData, setProduksiData] = useState(null);
  const [warehouseData, setWarehouseData] = useState(null);

  // Modal Batch Tracker
  const [isBatchTrackerOpen, setIsBatchTrackerOpen] = useState(false);
  const [selectedBatch, setSelectedBatch] = useState(null);

  const handleIconClick = (batchData) => () => {
    setSelectedBatch(batchData);
    setIsBatchTrackerOpen(true);
  };

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/dashboard`)
      .then((res) => {
        if (!res.ok) {
          throw new Error("Network response was not ok");
        }
        return res.json();
      })
      .then((data) => {
        setData(data);
        // console.log(data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error.message);
      });
  }, []);

  // Update filtered data when search input changes
  useEffect(() => {
    if (!data) return; // Return early if data is not available
    if (search.trim() === "") {
      setPpicData(null);
      setProduksiData(null);
      setWarehouseData(null);
      // setFiltered(null); // Clear filtered data if search is empty
      setSearched(false); // Reset searched state if search is empty
      return;
    }
    const ppicData = data.ppic.filter((item) => item.batchNumber.toLowerCase().includes(search.toLowerCase())) || [];
    const produksiData = data.produksi.filter((item) => item.batchNumber.toLowerCase().includes(search.toLowerCase())) || [];
    const warehouseData = data.warehouse.filter((item) => item.batchNumber.toLowerCase().includes(search.toLowerCase())) || [];

    // const ppicFilteredData = data.ppic.filter((item) => item.batchNumber.toLowerCase().includes(search.toLowerCase())) || [];
    // const produksiFilteredData = data.produksi.filter((item) => item.batchNumber.toLowerCase().includes(search.toLowerCase())) || [];
    // const warehouseFilteredData = data.warehouse.filter((item) => item.batchNumber.toLowerCase().includes(search.toLowerCase())) || [];

    // const filteredData = ppicFilteredData.concat(produksiFilteredData, warehouseFilteredData);

    // setFiltered(filteredData);
    setPpicData(ppicData);
    setProduksiData(produksiData);
    setWarehouseData(warehouseData);
    setSearched(true); // Set searched to true when search is performed
  }, [data, search]);

  // Router push
  const router = useRouter();

  useEffect(() => {
    if (showSearch && searchRef.current) {
      searchRef.current.focus();

      const handleClickOutside = (e) => {
        if (searchRef.current && !searchRef.current.contains(e.target)) {
          setShowSearch(false);
          setFiltered(null);
        }
      };

      document.addEventListener("click", handleClickOutside);

      return () => {
        document.removeEventListener("click", handleClickOutside);
      };
    }
  }, [showSearch]);

  const handleSearchClick = () => {
    setShowSearch(true);
  };

  const handleClearSearch = () => {
    setShowSearch(false);
  };

  // Handle logout
  // const HandleLogout = async () => {
  //   localStorage.removeItem("token");
  //   localStorage.removeItem("loggedInUser");
  //   router.push("/");
  // };

  const HandleLogout = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/logout`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json", // Tambahkan header sesuai kebutuhan
        },
      });

      if (response.ok) {
        localStorage.removeItem("token");
        localStorage.removeItem("loggedInUser");
        // Lakukan navigasi atau tindakan lain setelah logout berhasil
        router.push("/");
      } else {
        console.error("Failed to logout:", response.statusText);
      }
    } catch (error) {
      console.error("Error:", error.message);
    }
  };

  return (
    <>
      <nav className="navbar w-full bg-white lg:pl-[90px] sticky top-0 bg-opacity-20 backdrop-blur flex justify-center z-10">
        <nav className="border bg-white w-full mt-2 px-5 py-2 flex items-center rounded-xl shadow-md">
          <div className="w-full z-50" ref={searchRef}>
            {showSearch ? (
              <>
                <div className="w-full">
                  {/* Search Input */}
                  <div className="w-full h-10 relative flex items-center">
                    <input ref={searchRef} onChange={(e) => setSearch(e.target.value)} type="text" placeholder="Search No. Work Order / No. Batch" className="w-11/12 px-4 pl-7 rounded-lg outline-none" />
                    <button className="absolute left-0 top-1/2 transform -translate-y-1/2">
                      <SearchIcon className="h-5 w-5" />
                    </button>
                    <button
                      onClick={handleClearSearch} // Tambahkan event handler
                      className="absolute right-2 top-1/2 transform -translate-y-1/2"
                    >
                      <XIcon className="h-5 w-5 text-gray-400" />
                    </button>
                  </div>

                  {/* Result Search */}
                  <div className="absolute top-20 transform -translate-y-0.5 w-[90%] bg-white p-4 border rounded-xl shadow-lg">
                    <div className="flex">
                      {/* PPIC */}
                      <div>
                        <h1 className="text-[#2D9596] font-bold uppercase">ppic</h1>
                        {searched ? (
                          ppicData && ppicData.length > 0 ? (
                            ppicData.map((item) => (
                              <div key={item.uniqueNumber} className="px-2 py-2 flex items-center hover:bg-gray-100">
                                <div className="flex cursor-pointer" onClick={handleIconClick(item)}>
                                  <span className="mr-2">
                                    <InformationCircleIcon className="w-6 h-6 text-[#2D9596] hover:text-black transition duration-300" />
                                  </span>
                                  <p className="capitalize">{item.batchNumber}</p>
                                </div>
                              </div>
                            ))
                          ) : (
                            <div className="flex px-2 py-2">
                              <span className="mr-2">
                                <InformationCircleIcon className="w-6 h-6" />
                              </span>
                              No result found
                            </div>
                          )
                        ) : null}
                      </div>

                      {/* PRODUKSI */}
                      <div className="mx-10">
                        <h1 className="text-[#FFC700] font-bold uppercase">produksi</h1>
                        {searched ? (
                          produksiData && produksiData.length > 0 ? (
                            produksiData.map((item) => (
                              <div key={item.uniqueNumber} className="px-2 py-2 flex items-center hover:bg-gray-100">
                                <div className="flex cursor-pointer" onClick={handleIconClick(item)}>
                                  <span className="mr-2">
                                    <InformationCircleIcon className="w-6 h-6 text-[#2D9596] hover:text-black transition duration-300" />
                                  </span>
                                  <p className="capitalize">{item.batchNumber}</p>
                                </div>
                              </div>
                            ))
                          ) : (
                            <div className="flex px-2 py-2">
                              <span className="mr-2">
                                <InformationCircleIcon className="w-6 h-6" />
                              </span>
                              No result found
                            </div>
                          )
                        ) : null}
                      </div>

                      {/* WAREHOUSE */}
                      <div>
                        <h1 className="text-[#1D24CA] font-bold uppercase">warehouse</h1>
                        {searched ? (
                          warehouseData && warehouseData.length > 0 ? (
                            warehouseData.map((item) => (
                              <div key={item.uniqueNumber} className="px-2 py-2 flex items-center hover:bg-gray-100">
                                <div className="flex cursor-pointer" onClick={handleIconClick(item)}>
                                  <span className="mr-2">
                                    <InformationCircleIcon className="w-6 h-6 text-[#2D9596] hover:text-black transition duration-300" />
                                  </span>
                                  <p className="capitalize">{item.batchNumber}</p>
                                </div>
                              </div>
                            ))
                          ) : (
                            <div className="flex px-2 py-2">
                              <span className="mr-2">
                                <InformationCircleIcon className="w-6 h-6" />
                              </span>
                              No result found
                            </div>
                          )
                        ) : null}
                      </div>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex items-center h-10">
                <MenuIcon onClick={toggleNavbar} className="w-8 h-8 lg:hidden mr-2 cursor-pointer" />
                <div onClick={handleSearchClick} className="relative bg-white w-auto flex items-center cursor-pointer">
                  <SearchIcon className="h-5 w-5" />
                  <span className="text-gray-400 ml-2 select-none">Search...</span>
                </div>
                <div className="w-full flex justify-end">
                  {/* Dropdown */}
                  <div className="dropdown dropdown-bottom dropdown-end">
                    <div tabIndex={0} role="button">
                      <Image src="/1.png" alt="user" width={40} height={40} className="ms-auto rounded-3xl" />
                      <span className="absolute -bottom-0.5 right-0.5 rounded-full h-3 w-3 bg-green-500 border-2 border-white"></span>
                    </div>
                    <ul tabIndex={0} className="menu dropdown-content z-[1] p-2 shadow-[0_0_5px_0_rgba(0,0,0,0.3)] bg-base-100 rounded-lg w-max mt-2">
                      {/* Profile User */}
                      <li>
                        <div>
                          <div className="relative">
                            <Image src="/1.png" alt="user" width={40} height={40} className="rounded-3xl mr-2" />
                            <span className="absolute -bottom-0.5 right-2 rounded-full h-3 w-3 bg-green-500 border-2 border-white"></span>
                          </div>
                          <div>
                            <p className="font-semibold capitalize">{loggedInUser.name}</p>
                            <p className="text-gray-400 capitalize">
                              {loggedInUser.userType} | <span className="uppercase">{loggedInUser.department}</span>{" "}
                            </p>
                          </div>
                        </div>
                      </li>
                      <span className="border my-2"></span>

                      {/* Logout */}
                      <li onClick={HandleLogout}>
                        <span className="">
                          <LogoutIcon className="w-5 h-5" />
                          Log out
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>
        </nav>
      </nav>

      {/* BatchTracker */}
      {isBatchTrackerOpen && <BatchTracker setIsBatchTrackerOpen={setIsBatchTrackerOpen} batchData={selectedBatch} />}
    </>
  );
};

export default Navbar;
