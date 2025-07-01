import "./style.css";

import dynamic from "next/dynamic";
import Loading from "@/components/loading";
import { CoinPackage } from "../../_types";
import { Dispatch, SetStateAction } from "react";

// Dynamically import CoinPackageCard with a loading fallback
const CoinPackageCard = dynamic(() => import("../coin-package-card"), {
   ssr: false,
   loading: () => <Loading />,
});

// Define props for CoinPackagesSection
interface CoinPackagesSectionProps {
   data: CoinPackage[]; // Array of coin package data,
   setLoading: Dispatch<SetStateAction<boolean>>,
   fetchCoinBalance: () => void
}

function CoinPackagesSection({ data, setLoading, fetchCoinBalance }: CoinPackagesSectionProps) {
   // Handle empty data scenario
   if (!data || data.length === 0) {
      return (
         <section className="coin-p__section text-center">
            <p className="text-gray-500">No coin packages available at the moment.</p>
         </section>
      );
   }

   return (
      <section className="coin-p__section">
         {data.map((coinData) => (
            <CoinPackageCard data={coinData} key={coinData.id} setLoading={setLoading} fetchCoinBalance={fetchCoinBalance}/>
         ))}
      </section>
   );
}

export default CoinPackagesSection;
