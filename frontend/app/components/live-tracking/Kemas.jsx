import { LiveTrackingProvider } from "@/app/context/liveTrackingContext";

// Import Card Components
import CardProduksi from "./card-kemas/CardProduksi";
import CardWarehouse from "./card-kemas/CardWarehouse";
import CardStaging from "./card-kemas/CardStaging";
import CardFilling from "./card-kemas/CardFilling";
import CardPpic from "./card-kemas/CardPpic";

const Kemas = () => {
  return (
    <>
      <LiveTrackingProvider>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 py-4">
          <CardPpic />
          <CardProduksi />
          <CardWarehouse />
          <CardStaging />
        </div>
        <CardFilling />
      </LiveTrackingProvider>
    </>
  );
};

export default Kemas;
