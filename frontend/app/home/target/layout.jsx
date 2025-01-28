// Import dari react toastify
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const metadata = {
  title: "Target Batch",
};

export default function TargetLayout({ children }) {
  return (
    <>
      {/* Toast */}
      <ToastContainer />

      {/* Main */}
      <main>{children}</main>
    </>
  );
}
