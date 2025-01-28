// Import dari react toastify
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Metadata Reset Password untuk memberikan judul halaman
export const metadata = {
  title: "Reset Password",
};

export default function ResetPasswordLayout({ children }) {
  return (
    <>
      {/* Toast */}
      <ToastContainer />

      {/* Main */}
      <main>{children}</main>
    </>
  );
}
