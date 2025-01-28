"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

// Auth
import authIsLoggedIn from "../../auth/authIsLoggedIn";

// Framer Motion
import { motion, AnimatePresence } from "framer-motion";

// Import image
import logob7 from "@/public/logob7.svg";
import logob7small from "@/public/logob7-small.png";

// Import icon
import { HomeIcon, PencilIcon, UserCircleIcon, GlobeAltIcon, ChevronLeftIcon, ChevronRightIcon, XIcon, ChartBarIcon, ShieldCheckIcon } from "@heroicons/react/outline";
import { usePathname } from "next/navigation";

// Import CSS
import "../../style/sidebar.css";
import { PiTargetBold } from "react-icons/pi";
import { MdDashboard } from "react-icons/md";

const Sidebar = ({ openSidebar, toggleSidebar, openSideNavBar, toggleNavbar }) => {
  const router = useRouter();

  // Validasi userType
  const { loggedInUser } = authIsLoggedIn();
  const { userType, department } = loggedInUser;

  // Use pathname
  const pathname = usePathname();

  // Data linkcomponent
  const linkComponentTop = [
    {
      title: "home",
      href: `/home`,
      icon: HomeIcon,
    },
    {
      title: "dashboard",
      href: `/home/dashboard`,
      icon: MdDashboard,
    },
    (userType === "super admin" || department === "ppic") && {
      title: "entry wo",
      href: "/home/entry-work-order",
      icon: PencilIcon,
    },
    {
      title: "live tracking",
      href: "/home/live-tracking",
      icon: GlobeAltIcon,
    },
    userType === "super admin" && {
      title: "target",
      href: "/home/target",
      icon: PiTargetBold,
      // disabled: true,
    },
    (userType === "super admin" || (userType === "admin" && department === "ppic")) && {
      title: "report",
      href: "/home/report",
      icon: ChartBarIcon,
      // disabled: true,
    },
  ].filter(Boolean);

  const linkComponentBottom = [
    {
      title: "audit trail",
      href: "/home/audit-trail",
      icon: ShieldCheckIcon,
    },
    // Tampilkan tautan "manage user" hanya jika userType adalah "admin"
    (userType === "super admin" || userType === "admin") && {
      title: "manage user",
      href: "/home/manage-user",
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
        className="w-[225px] flex flex-col transform translate-x-[-125%] lg:translate-x-[0] fixed h-screen bg-[#302F8E] shadow-[0_0_5px_0_rgba(0,0,0,0.8)] z-50"
      >
        {/* Top */}
        <div className="flex items-center">
          {/* Logo */}
          {openSidebar ? (
            <Image src={logob7} alt="logo bintang 7" className="bg-white w-10/12 h-24 mx-auto my-2 rounded-md transition duration-500" />
          ) : (
            <div className="bg-white w-10/12 h-24 p-1 mx-auto my-2 rounded-md transition duration-500">
              <svg width="40" height="95" fill="#9FCF67" viewBox="0 0 50 80" xmlns="http://www.w3.org/2000/svg" className="mx-auto">
                <g clipPath="url(#a)">
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M26.82 0c-1.4.018-1.749 3.556-1.958 4.095-.946 2.433-1.888 3.9-3.443 5.877-1.556 1.977-3.589 4.085-8.117 7.4-4.529 3.314-8.153 4.89-10.247 5.974C.96 24.428.173 24.89.068 26.055c-.254 2.835.038 2.2 3.77 3.854 3.732 1.655 16.034 6.54 17.378 7.1.343.144.628.195.874.175-.256.4-.509.806-.756 1.223-3.159 5.316-5.612 10.807-5.352 12.265.26 1.459 3.024 2.397 5.385 3.123 2.41.74 4.212 1.079 4.212 1.079s-3.335 3.104-6.133 6.881c-2.799 3.778-4.666 7.646-4.677 8.738-.012 1.091.213 1.403.72 1.493.507.09.911-.269 1.262-.873.352-.603 2.697-4.545 5.576-7.928 2.88-3.384 6.813-7.389 7.51-7.742.697-.352.42-2.475.29-3.62-.13-1.144-.573-.544-4.05-1.167-3.477-.624-6.602-1.788-6.602-1.788s1.679-4.026 4.17-8.07c2.49-4.044 5.965-8.665 12.113-13.696 6.148-5.031 9.898-7.134 12.354-8.563 2.456-1.429 2.167-1.137 2.242-3.463.075-2.326.209-1.998-2.503-2.12-2.712-.123-6.483-.823-11.892-4.19-3.85-2.398-6.713-5.111-8.06-6.491.143-1.109 0-2.289-1.078-2.275Zm-.076 6.902a55.643 55.643 0 0 0 6.739 5.58c4.399 3.071 9.026 4.517 9.026 4.517s-5.19 3.344-9.683 7.722c-3.264 3.18-6.18 6.158-8.745 9.586-.052-.447-.335-.853-.897-1.253-1.08-.769-16.636-6.883-16.636-6.883s5.83-3.003 10.354-6.808c4.524-3.806 8.024-7.905 9.842-12.46Z"
                    fill="#9FCF67"
                  ></path>
                </g>
                <defs>
                  <clipPath id="a">
                    <path fill="#9FCF67" d="M0 0h180v72H0z"></path>
                  </clipPath>
                </defs>
              </svg>
            </div>
          )}
          {/* <Image src={logob7} alt="logo bintang 7" className="bg-white w-10/12 h-24 mx-auto my-2 rounded-md transition duration-500" /> */}

          {/* Toggle */}
          <div className="bg-white absolute -right-3 top-[124px] z-50 rounded-xl hover:text-[#11009E] shadow-[0_0_5px_0_rgba(0,0,0,0.8)]">
            <ChevronLeftIcon className={`${openSidebar ? "w-6 h-6 text-[#302F8E] cursor-pointer" : "hidden"}`} onClick={toggleSidebar} />
            <ChevronRightIcon className={`${openSidebar ? "hidden" : "w-6 h-6 text-[#302F8E] cursor-pointer"}`} onClick={toggleSidebar} />
          </div>
        </div>

        <div className={`${openSidebar ? "flex flex-col items-center mt-8" : "flex flex-col items-center mt-8"}`}>
          {/* List item */}
          <ul className={`mt-2 ${openSidebar ? "w-10/12" : "w-2/3"}`}>
            {linkComponentTop.map((item, index) => (
              <li key={index} className={`bg-white text-[#302F8E] text-sm my-4 rounded-xl hover:rounded-xl ${pathname === item.href ? "active" : ""}`}>
                <div
                  className={`transition duration-300 flex items-center ${openSidebar ? "py-2 px-4 hover:bg-[#11009E] hover:text-white rounded-xl" : "py-2 hover:bg-[#11009E] hover:text-white rounded-xl"}`}
                  onClick={() => handleLinkClick(item.href, item.disabled)}
                >
                  <item.icon className={`h-6 w-6 ${openSidebar ? "mr-2" : "ml-3"}`} />
                  {openSidebar && <span className="uppercase cursor-default select-none">{item.title}</span>}
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex-grow"></div>

        {/* List Bottom */}
        <div className={`${openSidebar ? "flex flex-col items-center mb-8" : "flex flex-col items-center mb-8"}`}>
          {/* List item */}
          <ul className={`${openSidebar ? "w-10/12" : "w-2/3"}`}>
            {linkComponentBottom.map((item, index) => (
              <li key={index} className={`bg-white text-[#302F8E] text-sm my-4 rounded-xl hover:rounded-xl ${pathname === item.href ? "active" : ""}`}>
                <div
                  className={`transition duration-300 flex items-center ${openSidebar ? "py-2 px-4 hover:bg-[#11009E] hover:text-white rounded-xl" : "py-2 hover:bg-[#11009E] hover:text-white rounded-xl"}`}
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
          className="w-[225px] relative bg-[#302F8E] h-full flex flex-col" // Menambahkan flex flex-col
        >
          <div className="flex justify-center items-center">
            {/* Logo */}
            <Image src={logob7} alt="logo bintang 7" className="bg-white w-9/12 h-24 mx-auto my-2 rounded-md transition duration-500" />
          </div>

          <XIcon className="h-5 w-5 bg-white hover:bg-black text-black hover:text-white mr-2 cursor-pointer absolute right-3 top-[124px] z-50 rounded-xl duration-300" onClick={toggleNavbar} />

          {/* List Top */}
          <div className={`${openSideNavBar ? "flex flex-col items-center mt-8" : "flex flex-col items-center mt-8"}`}>
            {/* List item */}
            <ul className={`mt-2 ${openSideNavBar ? "w-10/12" : "w-2/3"}`}>
              {linkComponentTop.map((item, index) => (
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

          <div className="flex-grow"></div>

          {/* List bottom */}
          <div className={`${openSideNavBar ? "flex flex-col items-center mb-8" : "flex flex-col items-center mb-8"}`}>
            {/* List item */}
            <ul className={`mt-2 ${openSideNavBar ? "w-10/12" : "w-2/3"}`}>
              {linkComponentBottom.map((item, index) => (
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
