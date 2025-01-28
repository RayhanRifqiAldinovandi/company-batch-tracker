
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const metadata = {
  title: "Manage User",
};

export default function RuahLayout({ children }) {
  return (
    <>
      {/* Toast */}
      <ToastContainer />

      {/* Main */}
      <main>{children}</main>
    </>
  );
}
