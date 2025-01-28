import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const metadata = {
  title: "Live Tracking",
};

export default function MinorLayout({ children }) {
  return (
    <>
      <ToastContainer />
      <main>{children}</main>
    </>
  );
}
