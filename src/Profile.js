// import { Link } from "react-router-dom";
// import Header from "./components/Header";
// import React, { useState, useEffect } from "react";
// import { useFilteredDeals } from "./hooks/useFilteredDeals";
// import { useFilteredBids } from "./hooks/useFilteredBids";
// import Deal from "./Deal";
// import MyBidItem from "./MyBidItem";

// const Profile = () => {
//   const { filtereddeals, user, error: dealsError } = useFilteredDeals();
//   const { bids, error: bidsError, removeBid } = useFilteredBids();
//   const [deals, setDeals] = useState(null);

//   useEffect(() => {
//     if (filtereddeals) {
//       setDeals(filtereddeals);
//     }
//   }, [filtereddeals]);

//   if (dealsError || bidsError) {
//     return <p>Error: {dealsError || bidsError}</p>;
//   }

//   const handleBidRemoved = (bidId) => {
//     removeBid(bidId);
//   };

//   return (
//     <>
//       <Header />
//       <div className="h-20"></div>
//       <main className="px-4 md:px-24 mt-9 mb-9">
//         <div className="flex">
//           <h3 className="text-3xl font-medium text-black/90 font-['Alata']">
//             My deals
//           </h3>
//         </div>
//         <div className="grid grid-cols-4 gap-4 mt-5 mb-9 md:mb-14">
//           {deals && deals.length > 0 ? (
//             <>
//               {deals.map((deal, index) => (
//                 <Deal
//                   dealId={deal[0]}
//                   dealDetails={deal[1]}
//                   key={index}
//                 />
//               ))}
//             </>
//           ) : (
//             <p>No deals available</p>
//           )}
//         </div>

//         <div className="flex">
//           <h3 className="text-3xl font-medium text-black/90 font-['Alata']">
//             My bids
//           </h3>
//         </div>
//         <div className="overflow-x-auto border border-gray-300 rounded-lg mt-5 bg-white">
//           <div className="min-w-full text-sm text-left text-gray-800 mb-4">
//             <div className="text-xs text-gray-700 uppercase bg-gray-50 flex justify-between px-6 py-5 font-semibold">
//               <div className="w-1/5">Deal id</div>
//               <div className="w-1/5">Deal</div>
//               <div className="w-1/5">Amount</div>
//               <div className="w-1/5">Bid price</div>
//               <div className="w-1/5">Actions</div>
//             </div>
//             {bids.length === 0 ? (
//               <div className="mx-auto text-center">
//                 <b>No bids placed yet.</b>
//               </div>
//             ) : (
//               bids.map((bid) => (
//                 <MyBidItem
//                   key={bid.bidId}
//                   bid={bid}
//                   bidId={bid.bidId}
//                   dealId={bid.dealId}
//                   onBidRemoved={removeBid}
//                 />
//               ))
//             )}
//           </div>
//         </div>
//       </main>
//     </>
//   );
// };
// export default Profile;

import Header from "./components/Header";
import React, { useState, useEffect } from "react";
import { useFilteredBids } from "./hooks/useFilteredBids";
import {useFilteredDeals} from "./hooks/useFilteredDeals";
import MyBidItem from "./MyBidItem";
import Deal from "./Deal";
import toast, { Toaster } from 'react-hot-toast'
const Profile = () => {
  const { filtereddeals, user, error: dealsError } = useFilteredDeals();
  const { bids, error: bidsError, removeBid } = useFilteredBids();
  const [deals, setDeals] = useState(null);

  useEffect(() => {
    if (filtereddeals) {
      setDeals(filtereddeals);
    }
  }, [filtereddeals]);

  if (dealsError || bidsError) {
    return <p>Error: {dealsError || bidsError}</p>;
  }
  if (bidsError) {
    return <p>Error: {bidsError}</p>;
  }
  const handleBidRemoved = (bidId) => {
     bids.filter((bid) => bid.id !== bidId)
  }

  return (
    <>
      <Header />
      <div className="h-20"></div>
       <main className="px-4 md:px-24 mt-9 mb-9">
         <div className="flex">
           <h3 className="text-3xl font-medium text-black/90 font-['Alata']">
             My deals
           </h3>
         </div>
         <div className="grid grid-cols-4 gap-4 mt-5 mb-9 md:mb-14">
           {deals && deals.length > 0 ? (
            <>
              {deals.map((deal, index) => (
                <Deal
                  dealId={deal[0]}
                  dealDetails={deal[1]}
                  key={index}
                />
              ))}
            </>
          ) : (
            <p>No deals available</p>
          )}
        </div>

      <div className="flex">
        <h3 className="text-3xl font-medium text-black/90 font-['Alata']">
          My bids
        </h3>
      </div>
      <div className="overflow-x-auto border border-gray-300 rounded-lg mt-5 bg-white">
        <div className="min-w-full text-sm text-left text-gray-800 mb-4">
          <div className="text-xs text-gray-700 uppercase bg-gray-50 flex justify-between px-6 py-5 font-semibold">
            <div className="w-1/5">Deal id</div>
            <div className="w-1/5">Deal</div>
            <div className="w-1/5">Amount</div>
            <div className="w-1/5">Bid price</div>
            <div className="w-1/5">Actions</div>
          </div>
          {bids.length === 0 ? (
            <div className="mx-auto text-center">
              <b>No bids placed yet.</b>
            </div>
          ) : (
            bids.map((bid) => {
              console.log("bids are:",bid);
              return (
              <MyBidItem
                key={bid.bidId}
                bidAmount={bid.amount}
                dealId={bid.dealId}
                dealTitle={bid.dealDetails.deal_title}
                bidPrice={bid.bidPrice}
                onBidRemoved={handleBidRemoved}
                bidId={bid.bidId}
              />
              );
            })
          )}
        </div>
        <Toaster />
      </div>
      </main>
    </>
  );
};

export default Profile;
