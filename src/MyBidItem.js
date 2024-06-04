import React from "react";
import toast from 'react-hot-toast';
import { withdrawBid } from './contractcalls/withdrawBid';
import { Link } from "react-router-dom";
import icons from './assets/icons.json';
import Deal from "./Deal";
import { getUser } from './GetUser';
const MyBidItem = ({ dealTitle, bidAmount, bidId, bidPrice, dealId, onBidRemoved, bid_token_denom, deal_token_denom }) => {
  const address = localStorage.getItem('walletaddress')
  // console.log("bid is:",bid);
  console.log("bidId is:", bidId);
  console.log("dealId is:", dealId);
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
  return <div className="text-md text-black  flex justify-between px-6 py-5 ">
    <div className="w-1/8">
      <Link to={`/deal/${dealId}`} className="text-zinc-700 pr-10 hover:text-black flex justify-start">
        <div>{dealId}</div>
      </Link>
    </div>
    <div className="w-1/5">{dealTitle}</div>
    <div className="w-1/5"><img src={icons[deal_token_denom]} alt={deal_token_denom} className="inline-block w-4 h-4 mr-1" />
      {bidAmount}</div>
    <div className="w-1/5">
      <img src={icons[bid_token_denom]} alt={bid_token_denom} className="inline-block w-4 h-4 mr-1" />
      {bidPrice}
    </div>
    <div className="w-1/5">
      <button
        onClick={handleRemoveBid}
        className="px-5 py-1 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-200 flex items-center"
      >
        <i className="fa-solid fa-xmark mr-2"></i>
        Withdraw
      </button>
    </div>
  </div>

};

export default MyBidItem;
