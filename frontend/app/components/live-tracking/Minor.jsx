import { LiveTrackingProvider } from "@/app/context/liveTrackingContext";

// Import Component
import CardWarehouse from "./card-minor/CardWarehouse";
import CardWarehouseStaging from "./card-minor/CardWarehouseStaging";
import CardPenimbangan from "./card-minor/CardPenimbangan";
import CardTipping from "./card-minor/CardTipping";
import CardPpic from "./card-minor/CardPpic";
import CardReadyForTipping from "./card-minor/CardReadyForTipping";
import ModalListPause from "../modal/ModalListPause";

const Minor = () => {
  return (
    <>
      <LiveTrackingProvider>
        <ModalListPause />
        <div className="max-w-svw grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4 py-4">
          <CardPpic />
          <CardWarehouse />
          <CardWarehouseStaging />
          <CardPenimbangan />
          <CardReadyForTipping />
          <CardTipping />
        </div>
      </LiveTrackingProvider>
    </>
  );
};

export default Minor;
