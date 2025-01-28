// Metadata untuk menampilkan judul halaman
export const metadata = {
  title: "Dashboard",
};

export default function DashboardLayout({ children }) {
  return (
    <>
      <main>{children}</main>
    </>
  );
}
