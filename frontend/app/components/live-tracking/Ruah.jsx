import { LiveTrackingProvider } from "@/app/context/liveTrackingContext";

// Import Components
import CardPpic from "./card-ruah/CardPpic";
import CardBatching from "./card-ruah/CardBatching";
import CardStaging from "./card-ruah/CardStaging";
import CardWarehouse from "./card-ruah/CardWarehouse";
import CardDischarging from "./card-ruah/CardDischarging";
import CardBlending from "./card-ruah/CardBlending";

const Ruah = () => {
  return (
    <>
      <LiveTrackingProvider>
        {/* Departemen */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 py-4">
          <CardPpic />
          <CardWarehouse />
          <CardBatching />
          <CardBlending/>
          <CardStaging />
        </div>
        <CardDischarging />
      </LiveTrackingProvider>
    </>
  );
};

export default Ruah;
