
// import React from 'react';
// import toast from 'react-hot-toast';
// import { withdrawBid } from './contractcalls/withdrawBid';
// import moment from 'moment';
// import icons from './assets/icons.json';
// const calculateTimeAgo = (timestampInNanoSeconds) => {
//   const timestampInMilliseconds = timestampInNanoSeconds *1000;
//   return moment(timestampInMilliseconds).fromNow();
// };
// const BidItem = ({ bid,bidId, dealId, onBidRemoved, dealDenom,isWinning}) => {
//   const timeAgo = calculateTimeAgo(bid.seconds);
//   const handleRemoveBid = async () => {
//     try {
//       const confirmWithdraw = window.confirm('Are you sure you want to withdraw this bid?');
//         toast.promise(
//             withdrawBid(bidId, dealId), //(formData),
//             {
//               loading: 'Withdrawing Bid...',
//               success: (response) => <b>Withdrawn Successfully</b>, // Show the amount value in success message
//               error: (error) => <b>{JSON.stringify(error)}</b>
//             }
//           )
//     //   await withdrawBid(bidId, dealId);
//     //   toast.success('Bid removed successfully');
//       onBidRemoved(bidId); // Notify parent to remove the bid from the state
//     } catch (error) {
//       console.error("Error removing bid: ", error);
//       toast.error('Error removing bid');
//     }
//   };

//   return (
//     <div className="border-t border-gray-200">
//       <div className="bg-white flex justify-between items-center px-6 py-3">
//         <div className="w-1/3">
//         <img src={icons[dealDenom]} alt={dealDenom} className="inline-block w-4 h-4 mr-1" />{bid.amount}</div>
//         <div className="w-1/3">
//         <img src={icons[bid.denom]} alt={bid.denom} className="inline-block w-4 h-4 mr-1" />{bid.price}</div>
//         <div className="w-1/3">
//           <button
//             onClick={handleRemoveBid}
//             className="px-5 py-1 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-200 flex items-center"
//           >
//             <i className="fa-solid fa-xmark mr-2"></i>
//             Withdraw
//           </button>
//         </div>
//       </div>
//       <div className="flex px-6 pb-2">
//         <div className="text-gray-500 flex-grow">
//           <span>
//             <i className="fa-regular fa-clock text-xs mr-1"></i>
//             {/* 20 mins ago */}
//             {timeAgo}
//             {/* {new Date(bid.seconds * 1000).toLocaleTimeString()} */}
//           </span>
          
//           <span className="ml-4 text-blue-600">
//             {/* might not win due to high demand */}
//             {isWinning==1 ? 'You might win' : (isWinning==0?'You might not win due to high demand':'You might partially win')}
//             </span>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default  BidItem;


import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { withdrawBid } from './contractcalls/withdrawBid';
import moment from 'moment';
import icons from './assets/icons.json';
import Modal from './Modal';

const calculateTimeAgo = (timestampInNanoSeconds) => {
  const timestampInMilliseconds = timestampInNanoSeconds * 1000;
  return moment(timestampInMilliseconds).fromNow();
};

const BidItem = ({ bid, bidId, dealId, onBidRemoved, dealDenom, isWinning,deal_Decimal}) => {
  const [showModal, setShowModal] = useState(false);
  const timeAgo = calculateTimeAgo(bid.seconds);
  // console.log("deal decimal", Number(bid.amount) / (10 ** Number(deal_Decimal)));
  const quantity= Number(bid.amount) / (10 ** Number(deal_Decimal));
  const handleRemoveBid = async () => {
    try {
      setShowModal(true);
    } catch (error) {
      console.error("Error removing bid: ", error);
      toast.error('Error removing bid');
    }
  };

  const confirmBidWithdrawal = async () => {
    setShowModal(false);
    try {
      await withdrawBid(bidId, dealId);
      toast.success('Bid removed successfully');
      onBidRemoved(bidId);
      setShowModal(false);
    } catch (error) {
        
    const errorMessage = error.message || error.toString();
    const indexOfMessage = errorMessage.indexOf('message index: 0:');
    
    if (indexOfMessage !== -1) {
      const specificMessage = errorMessage.substring(indexOfMessage + 'message index: 0:'.length).trim();
      console.error('Specific error message:', specificMessage);
      toast.error(specificMessage);
    }

    }
  };

  return (
    <div className="border-t border-gray-200">
      <div className="bg-white flex justify-between items-center px-6 py-3">
        <div className="w-1/3">
          <img src={icons[dealDenom]} alt={dealDenom} className="inline-block w-4 h-4 mr-1" />{quantity}
        </div>
        <div className="w-1/3">
          <img src={icons[bid.denom]} alt={bid.denom} className="inline-block w-4 h-4 mr-1" />{bid.price}
        </div>
        <div className="w-1/3">
          <button
            onClick={handleRemoveBid}
            className="px-5 py-1 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-200 flex items-center"
          >
            <i className="fa-solid fa-xmark mr-2"></i>
            Withdraw
          </button>
        </div>
      </div>
      <div className="flex px-6 pb-2">
        <div className="text-gray-500 flex-grow">
          <span>
            <i className="fa-regular fa-clock text-xs mr-1"></i>
            {timeAgo}
          </span>
          <span className="ml-4 text-blue-600">
            {isWinning === 1 ? 'You might win' : (isWinning === 0 ? 'You might not win due to high demand' : 'You might partially win')}
          </span>
        </div>
      </div>
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={confirmBidWithdrawal}
        title="Confirm Bid Withdrawal"
        message="Are you sure you want to withdraw this bid?"
      />
    </div>
  );
};

export default BidItem;

