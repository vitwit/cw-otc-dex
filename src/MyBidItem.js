// import React from "react";
// import toast from 'react-hot-toast';
// import { withdrawBid } from './contractcalls/withdrawBid';
// import { Link } from "react-router-dom";

// const MyBidItem = ({ bid, bidId, dealId, onBidRemoved }) => {
// const handleRemoveBid = async () => {
//     try {
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
//     <div className="flex justify-between px-6 py-5">
//       <div className="w-1/5">{dealId}</div>
//       <div className="w-1/5">{bid.dealDetails}</div>
//       <div className="w-1/5">{bid.amount}</div>
//       <div className="w-1/5">{bid.bidPrice}</div>
//       {/* <div className="w-1/5">
//         <Link to={`/deal/${dealId}`}>View</Link>
//         <button onClick={handleRemove}>Remove</button>
//   </div> */}

//           <div className="w-1/5">
//           <button
//             onClick={handleRemoveBid}
//             className="px-5 py-1 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-200 flex items-center"
//           >
//             <i className="fa-solid fa-xmark mr-2"></i>
//             Remove
//           </button>
//         </div>
//     </div>
//   );
// };

// export default MyBidItem;



import React from "react";
import toast from 'react-hot-toast';
import { withdrawBid } from './contractcalls/withdrawBid';
import { Link } from "react-router-dom";

const MyBidItem = ({dealTitle,bidAmount, bidId,bidPrice, dealId, onBidRemoved }) => {
    // console.log("bid is:",bid);
    console.log("bidId is:",bidId);
    console.log("dealId is:",dealId);
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

//   const { dealDetails } = bid;
  
  return (
    <div className="flex px-6 py-5">
      <div className="w-1/5">{dealId}</div>
      <div className="w-1/4 ">
        <p>{ dealTitle}</p>
      </div><br></br>
      <div className="w-1/4">{bidAmount}</div>
      <div className="w-1/5">{bidPrice}</div>
      <div className="w-1/5">
        <button
          onClick={handleRemoveBid}
          className="px-5 py-1 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-200 flex items-center"
        >
          <i className="fa-solid fa-xmark mr-2"></i>
          Remove
        </button>
      </div>
    </div>
  );
};

export default MyBidItem;
