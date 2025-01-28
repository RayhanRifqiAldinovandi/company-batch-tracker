import { LiveTrackingProvider } from "@/app/context/liveTrackingContext";

// Import Component
import CardWarehouse from "./card-minor/CardWarehouse";
import CardWarehouseStaging from "./card-minor/CardWarehouseStaging";
import CardPenimbangan from "./card-minor/CardPenimbangan";
import CardTipping from "./card-minor/CardTipping";
import CardPpic from "./card-minor/CardPpic";
import CardReadyForTipping from "./card-minor/CardReadyForTipping";

const Minor = () => {
  return (
    <>
      <LiveTrackingProvider>
        <div className="max-w-svw grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 py-4">
          <CardPpic />
          <CardWarehouse />
          <CardWarehouseStaging />
          <CardPenimbangan />
          <CardReadyForTipping/>
          <CardTipping />
        </div>
      </LiveTrackingProvider>
    </>
  );
};

export default Minor;
