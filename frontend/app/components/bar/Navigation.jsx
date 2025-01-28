"use client";

import { useState } from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

const Navigation = () => {
  const [openSidebar, setOpenSidebar] = useState(false);
  const toggleSidebar = () => setOpenSidebar(!openSidebar);

  const [openSideNavBar, setOpenSideNavbar] = useState(false);
  const toggleNavbar = () => setOpenSideNavbar(!openSideNavBar);

  return (
    <>
      <Sidebar openSidebar={openSidebar} openSideNavBar={openSideNavBar} toggleSidebar={toggleSidebar} toggleNavbar={toggleNavbar} />
      <Navbar toggleNavbar={toggleNavbar} />
    </>
  );
};

export default Navigation;
