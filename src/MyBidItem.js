import React from "react";
import toast from 'react-hot-toast';
import { withdrawBid } from './contractcalls/withdrawBid';
import { Link } from "react-router-dom";
import icons from './assets/icons.json';
import Deal from "./Deal";

const MyBidItem = ({dealTitle,bidAmount, bidId,bidPrice, dealId, onBidRemoved ,bid_token_denom,deal_token_denom}) => {
    // console.log("bid is:",bid);
    console.log("bidId is:",bidId);
    console.log("dealId is:",dealId);
    //console.log("dealdetails:",dealDetails);
    //console.log("dealtoken denom is:",dealDetails.deal_token_denom)
  const handleRemoveBid = async () => {
    try {
      toast.promise(
        withdrawBid(bidId, dealId),
        {
          loading: 'Withdrawing Bid...',
          success: 'Withdrawn Successfully',
          error: (error) => <b>{JSON.stringify(error)}</b>
        }
      );
      onBidRemoved(bidId); // Notify parent to remove the bid from the state
    } catch (error) {
      console.error("Error removing bid: ", error);
      toast.error('Error removing bid');
    }
  };
  return (
    <div className="flex px-6 py-5">
      <Link to={`/deal/${dealId}`} className="text-zinc-700 pr-10 hover:text-black flex justify-start">
      <div className="w-1/5 ml-3">{dealId}</div>
      </Link>
      <div className="w-1/4 ml-20 ">
        <p>{ dealTitle}</p>
      </div><br></br>
      <div className="w-1/3 ml-20">
      <img src={icons[deal_token_denom]} alt={deal_token_denom} className="inline-block w-4 h-4 mr-1"/>
      {bidAmount}</div>
      <div className="w-1/5 ml-30">
        <img src={icons[bid_token_denom]} alt={bid_token_denom} className="inline-block w-4 h-4 mr-1"/>
        {bidPrice}</div>
      <div className="w-1/5">
        <button
          onClick={handleRemoveBid}
          className="px-5 py-1 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-200 flex"
        >
          <i className="fa-solid fa-xmark mr-2"></i>
          Withdraw
        </button>
      </div>
    </div>
  );
};

export default MyBidItem;
