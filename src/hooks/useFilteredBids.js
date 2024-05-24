import { useEffect, useState } from "react";
import { getAllDeals } from "../contractcalls/getAllDeals";
import { getOfflineSignerAndCosmWasmClient } from "../GetClient";
import { getBidStore } from "../contractcalls/getBidStore";

export function useFilteredBids() {
  const [bids, setBids] = useState([]);
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAndFilterBids = async () => {
      try {
        // Fetch all deals
        const dealsResponse = await getAllDeals();
        if (dealsResponse.error) {
          throw new Error(dealsResponse.error);
        }
        console.log("deal response is:",dealsResponse)
        
        const deals = dealsResponse.deals || [];

        // Get the user address from Keplr
        const { offlineSigner } = await getOfflineSignerAndCosmWasmClient();
        const accounts = await offlineSigner.getAccounts();
        const currentAddress = accounts[0].address;
        setUser(currentAddress);

        // Fetch and filter bids for each deal
        let allBids = [];
        for (const deal of deals) {
          const bidsResponse = await getBidStore(deal[0]);
          if (bidsResponse.bids) {
            const filteredBids = bidsResponse.bids
              .filter((bid) => bid[1].bidder === currentAddress)
              .map((bid) => ({
                bidId: bid[0],
                dealId: deal[0],
                dealDetails: deal[1],
                amount: bid[1].amount,
                bidPrice: bid[1].price,
              }));
            allBids = allBids.concat(filteredBids);
          }
        }
        console.log("all bids:",allBids);
        setBids(allBids);
       
      } catch (error) {
        setError(error.message);
      }
    };

    fetchAndFilterBids();
  }, []);

  const removeBid = async (bidId, dealId) => {
    try {
      console.log("Removing bid:", bidId, "for deal:", dealId);
      setBids((prevBids) =>
        prevBids.filter((bid) => bid.bidId !== bidId || bid.dealId !== dealId)
      );
    } catch (error) {
      console.error("Error removing bid:", error);
    }
  };

  return { bids, user, error, removeBid };
}
