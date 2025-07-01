import "./style.css";
import Image from "next/image";

interface propType {
   coinBalance: number;
   coinBalanceError: string;
}

function PricingPlansTitleSection(props: propType) {
   return (
      <section className="ppts__section">
         <h1 className="subtitle">Pricing & Plans</h1>

         <div className="ppts__coins--container">
            <Image
               src="/img/dashboard/coins.svg"
               width={40}
               height={36.15}
               alt="Coin Balance"
               className="ppts__coins--image"
            />
            <div className="overflow-hidden">
               {props.coinBalanceError ? (
                  <p>{props.coinBalanceError}</p>
               ) : (
                  <p className="dash-value">{props?.coinBalance}</p>
               )}

               <p className="label">Coins Balance</p>
            </div>
         </div>
      </section>
   );
}

export default PricingPlansTitleSection;
