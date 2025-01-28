"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

// Auth
import authIsLoggedIn from "../../auth/authIsLoggedIn";

// Framer Motion
import { motion } from "framer-motion";

// Import image
import logob7 from "@/public/logob7.svg";
import logob7small from "@/public/logob7-small.png";

// Import icon
import { HomeIcon, PencilIcon, UserCircleIcon, GlobeAltIcon, ChevronLeftIcon, ChevronRightIcon, XIcon, ChartBarIcon, ShieldCheckIcon } from "@heroicons/react/outline";
import { usePathname } from "next/navigation";

// Import CSS
import "../../style/sidebar.css";

const Sidebar = ({ openSidebar, toggleSidebar, openSideNavBar, toggleNavbar }) => {
  const router = useRouter();

  // Validasi userType
  const { loggedInUser } = authIsLoggedIn();
  const { userType, department } = loggedInUser;

  // Use pathname
  const pathname = usePathname();

  // Data linkcomponent
  const linkComponent = [
    {
      title: "home",
      href: `/dashboard`,
      icon: HomeIcon,
    },
    {
      title: "live tracking",
      href: "/dashboard/live-tracking",
      icon: GlobeAltIcon,
    },
    (userType === "super admin" || userType === "admin") && {
      title: "entry wo",
      href: "/dashboard/entry-work-order",
      icon: PencilIcon,
    },
    {
      title: "audit trail",
      href: "/dashboard/audit-trail",
      icon: ShieldCheckIcon,
    },
    (userType === "super admin" || (userType === "admin" && department === "ppic")) && {
      title: "report",
      href: "/dashboard/report",
      icon: ChartBarIcon,
      // disabled: true,
    },
    // Tampilkan tautan "manage user" hanya jika userType adalah "admin"
    (userType === "super admin" || userType === "admin") && {
      title: "manage user",
      href: "/dashboard/manage-user",
      icon: UserCircleIcon,
    },
  ].filter(Boolean);

  const handleLinkClick = (href, disabled) => {
    if (disabled) {
      // Menampilkan alert maintenance jika tautan dinonaktifkan
      alert("Maintenance is ongoing. This feature is temporarily unavailable.");
    } else {
      // Navigasi ke tautan jika tautan aktif
      router.push(href);
    }
  };

  return (
    <>
      {/* Min Width Large */}
      <motion.aside
        transition={{
          duration: 0.4,
        }}
        animate={{ width: openSidebar ? "225px" : "70px" }}
        className="w-[225px] transform translate-x-[-125%] lg:translate-x-[0] fixed h-full min-h-screen bg-[#302F8E] shadow-[0_0_5px_0_rgba(0,0,0,0.8)] z-50"
      >
        {/* Top */}
        <div className="flex justify-center items-center">
          {/* Logo */}
          {/* {openSidebar ? (
            <Image src={logob7} alt="logo bintang 7" className="bg-white w-10/12 h-20 mx-auto my-2 rounded-md transition duration-500" />
          ) : (
            <Image src={logob7small} alt="logo bintang 7" className="w-10/12 h-20 mx-auto my-2 rounded-md transition duration-500" />
          )} */}
          <Image src={logob7} alt="logo bintang 7" className="bg-white w-10/12 h-20 mx-auto my-2 rounded-md transition duration-500" />

          {/* Toggle */}
          <div className="bg-white absolute -right-3 top-[110px] z-50 rounded-xl hover:text-[#11009E] shadow-[0_0_5px_0_rgba(0,0,0,0.8)]">
            <ChevronLeftIcon className={`${openSidebar ? "w-6 h-6 text-[#302F8E]  cursor-pointer" : "hidden"}`} onClick={toggleSidebar} />
            <ChevronRightIcon className={`${openSidebar ? "hidden" : "w-6 h-6 text-[#302F8E]  cursor-pointer"}`} onClick={toggleSidebar} />
          </div>
        </div>

        <div className={`${openSidebar ? "flex flex-col items-center mt-8" : "flex flex-col items-center mt-8"}`}>
          {/* List item */}
          <ul className={`mt-2 ${openSidebar ? "w-10/12" : "w-2/3"}`}>
            {linkComponent.map((item, index) => (
              <li key={index} className={`bg-white text-[#302F8E] text-sm my-4 rounded-xl hover:rounded-xl ${pathname === item.href ? "active" : ""}`}>
                <div
                  className={`transition duration-300 flex items-center ${openSidebar ? "py-2 px-4 hover:bg-[#11009E] hover:text-white rounded-xl" : " py-2 hover:bg-[#11009E] hover:text-white rounded-xl"}`}
                  onClick={() => handleLinkClick(item.href, item.disabled)}
                >
                  <item.icon className={`h-6 w-6 ${openSidebar ? "mr-2" : "ml-3"}`} />
                  {openSidebar && <span className="uppercase cursor-default select-none">{item.title}</span>}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </motion.aside>

      {/* Max Width Large */}
      <aside className={`fixed h-full min-h-screen lg:hidden bg-slate-900 bg-opacity-50 shadow-[0_0_5px_0_rgba(0,0,0,0.8)] translate-x-[0] lg:translate-x-[100%] z-50 ${openSideNavBar ? "w-full" : "w-0"}`}>
        {/* Top */}
        <motion.div
          transition={{
            duration: 0.2,
          }}
          animate={{ width: openSideNavBar ? "225px" : "0" }}
          className="w-[225px] bg-[#302F8E] h-full"
        >
          <div className="flex justify-center items-center">
            {/* Logo */}
            <Image src={logob7} alt="logo bintang 7" className="bg-white w-9/12 h-20 mx-auto my-2 rounded-md transition duration-500" />
            <XIcon className="h-5 w-5 text-white mr-2 cursor-pointer" onClick={toggleNavbar} />
          </div>

          <div className={`${openSideNavBar ? "flex flex-col items-center mt-8" : "flex flex-col items-center mt-8"}`}>
            {/* List item */}
            <ul className={`mt-2 ${openSideNavBar ? "w-10/12" : "w-2/3"}`}>
              {linkComponent.map((item, index) => (
                <li key={index} className={`bg-white text-[#302F8E] text-sm my-4 rounded-xl hover:rounded-xl ${pathname === item.href ? "active" : ""}`}>
                  <Link
                    href={item.href}
                    className={`transition duration-300 ${openSideNavBar ? "flex items-center py-2 px-4 hover:bg-[#11009E] hover:text-white rounded-xl" : "flex items-center py-2 hover:bg-[#11009E] hover:text-white rounded-xl"}`}
                  >
                    <item.icon className={`h-6 w-6 ${openSideNavBar ? "mr-2" : "ml-3"}`} />
                    {openSideNavBar && <span className="uppercase">{item.title}</span>}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </motion.div>
      </aside>
    </>
  );
};

export default Sidebar;
