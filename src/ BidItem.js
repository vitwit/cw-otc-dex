
import React from 'react';
import toast from 'react-hot-toast';
import { withdrawBid } from './contractcalls/withdrawBid';
const BidItem = ({ bid,bidId, dealId, onBidRemoved }) => {

  console.log("bid details",bid);
  console.log("bid Id",bidId);
  console.log("bid details",dealId);

  const handleRemoveBid = async () => {
    try {
        toast.promise(
            withdrawBid(bidId, dealId), //(formData),
            {
              loading: 'Withdrawing Bid...',
              success: (response) => <b>Withdrawn Successfully</b>, // Show the amount value in success message
              error: (error) => <b>{JSON.stringify(error)}</b>
            }
          )
    //   await withdrawBid(bidId, dealId);
    //   toast.success('Bid removed successfully');
      onBidRemoved(bidId); // Notify parent to remove the bid from the state
    } catch (error) {
      console.error("Error removing bid: ", error);
      toast.error('Error removing bid');
    }
  };

  return (
    <div className="border-t border-gray-200">
      <div className="bg-white flex justify-between items-center px-6 py-3">
        <div className="w-1/3">${bid.amount}</div>
        <div className="w-1/3">${bid.price}</div>
        <div className="w-1/3">
          <button
            onClick={handleRemoveBid}
            className="px-5 py-1 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-200 flex items-center"
          >
            <i className="fa-solid fa-xmark mr-2"></i>
            Remove
          </button>
        </div>
      </div>
      <div className="flex px-6 pb-2">
        <div className="text-gray-500 flex-grow">
          <span>
            <i className="fa-regular fa-clock text-xs mr-1"></i>
            20 mins ago
          </span>
          <span className="ml-4 text-blue-600">might not win due to high demand</span>
        </div>
      </div>
    </div>
  );
};

export default  BidItem;
