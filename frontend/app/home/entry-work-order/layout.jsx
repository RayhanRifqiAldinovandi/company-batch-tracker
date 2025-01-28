// Import dari react toastify
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Metadata untuk menampilkan judul halaman
export const metadata = {
  title: "Entry Work Order",
};

export default function EntryWorkOrderLayout({ children }) {
  return (
    <>
      {/* Toast */}
      <ToastContainer />

      {/* Main */}
      <main>{children}</main>
    </>
  );
}
