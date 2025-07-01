import AddCoinsButton from "../AddCoinsButton/AddCoinsButton";
import PlanRenewalButton from "../PlanRenewalButton/PlanRenewalButton";
import "./style.css";
import { format } from "date-fns";

// export interface SubscriptionDetailsSectionData {
//   data: {
//     package_name: string;
//     last_recharge: string;
//     expiry_date: string;
//     remainingCoins: number;
//     status: string;
//   };
// }

export interface SubscriptionDetailsSectionData {
    data: {
      f_name: string;
      user_type: string;
      currentSubscription: {
        subscription_purchase_id: number;
        package_name: string;
        last_recharge: string;
        expiry_date: string;
      };
      remainingCoins: number;
      status: string;
      upComingSubscriptionDtls?: {
        subscription_purchase_id: number;
        package_name: string;
        last_recharge: string;
        expiry_date: string;
        start_date: string;
      };
    };
  }


interface SubscriptionDetailsSectionProps {
  data: SubscriptionDetailsSectionData;
}
function SubscriptionDetailsSection({ data }: SubscriptionDetailsSectionProps) {
  return (
    <section className="sub__section">
      <p className="subtitle">Subscription Details</p>
      <div className="sub__section--items">
        <div className="sub__section--item">
          <p className="label">Subscription Plan</p>
          {!data?.data?.currentSubscription?.package_name ? (
            <p className="dash-subtitle">-</p>
          ) : (
            <p className="dash-subtitle">
              {data.data.currentSubscription.package_name}
            </p>
          )}
        </div>
        <div className="sub__section--item">
          <p className="label">Last Recharge</p>
          {!data?.data?.currentSubscription?.last_recharge ? (
            <p className="dash-subtitle">-</p>
          ) : (
            <p className="dash-subtitle">
              {format(new Date(data.data.currentSubscription.last_recharge), "LLL dd, y")}
            </p>
          )}
        </div>
        <div className="sub__section--item">
          <p className="label">Expiry Date</p>
          {!data?.data?.currentSubscription?.expiry_date ? (
            <p className="dash-subtitle">-</p>
          ) : (
            <p className="dash-subtitle">
              {format(new Date(data.data.currentSubscription.expiry_date), "LLL dd, y")}
            </p>
          )}
        </div>
        <div className="sub__section--item">
          <p className="label">Coin Balance</p>
          <p className="dash-subtitle">{data.data.remainingCoins}</p>
        </div>
        <div className="sub__section--item">
          <p className="label">Status</p>
          {!data.data.status ? (
            <p className="dash-subtitle">-</p>
          ) : (
            <p className="dash-subtitle">
              {data.data.status}
            </p>
          )}
        </div>
      </div>
      <div className="sub__section--items sub__section--btns">
        <PlanRenewalButton />
        <AddCoinsButton />
      </div>
      {data?.data?.upComingSubscriptionDtls?.package_name ? (
      <div className="up-date-wrapper">
          <p className="subtitle">Upcoming Plan</p>
          <div className="up-date">
          <div className="upname"><b>Plan name</b> : {data?.data?.upComingSubscriptionDtls?.package_name}</div>
          <div className="upstdate"><b>Start date</b> : {data?.data?.upComingSubscriptionDtls?.start_date
  ? format(new Date(data.data.upComingSubscriptionDtls.start_date), "LLL dd, y")
  : "-"}</div>
          <div className="upendate"><b>End date</b> : {data?.data?.upComingSubscriptionDtls?.expiry_date
  ? format(new Date(data.data.upComingSubscriptionDtls.expiry_date), "LLL dd, y")
  : "-"}</div>
          </div>
      </div>
    ):("")}
    </section>
  );
}

export default SubscriptionDetailsSection;
