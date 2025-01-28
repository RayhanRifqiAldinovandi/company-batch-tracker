import { useContext } from "react";
import { HomeContext } from "@/app/context/homeContext";

const ListPause = () => {
  // Menggunakan useContext untuk mengakses data dari HomeContext
  const { dataMinor } = useContext(HomeContext);
  return (
    <>
      <div className="bg-white p-8 w-full border rounded-3xl shadow-lg overflow-auto">
        {/* Header */}
        <header>
          <h2 className="text-xl mb-4">List Pause</h2>
        </header>

        {/* Table container with a set max height */}
        <div className="overflow-auto max-h-[60vh]">
          {/* Table data list pause */}
          <table className="report-table table table-zebra table-pin-rows table-pin-cols w-full">
            <thead>
              <tr>
                <th>#</th>
                <th>Work Order Number</th>
                <th>Batch Status</th>
                <th>Item Code</th>
                <th>Product Type</th>
                <th>Batch Number</th>
                <th>Keterangan</th>
                <th>Pause Sender</th>
                <th>Jam dan Tanggal Pause</th>
              </tr>
            </thead>
            <tbody>
              {dataMinor?.pause?.map((item, index) => (
                <tr key={item.uniqueNumber}>
                  <td>{index + 1}</td>
                  <td>{item.woNumber}</td>
                  <td>n/a</td>
                  <td>{item.itemCode}</td>
                  <td>{item.productType}</td>
                  <td>{item.batchNumber}</td>
                  <td>{item.pauseDetail}</td>
                  <td>{item.pause_sender}</td>
                  <td>{new Date(item.pause_timestamp).toLocaleString("en-US", { year: "numeric", month: "long", day: "numeric", hour: "numeric", minute: "numeric", hour12: true })}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default ListPause;
