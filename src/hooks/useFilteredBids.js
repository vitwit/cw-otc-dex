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
        console.log('All Deals Response:', dealsResponse);
        if (dealsResponse.error) {
          throw new Error(dealsResponse.error);
        }
        
        const deals = dealsResponse.deals || [];
        console.log("Deals:", deals);

        // Get the user address from Keplr
        const { offlineSigner } = await getOfflineSignerAndCosmWasmClient();
        const accounts = await offlineSigner.getAccounts();
        const currentAddress = accounts[0].address;
        console.log('Current User Address:', currentAddress);
        setUser(currentAddress);

        // Fetch and filter bids for each deal
        let allBids = [];
        for (const deal of deals) {
           console.log("deal id is ",deal[0])
          const bidsResponse = await getBidStore(deal[0]);
           console.log(`Bids for Deal ${deal[0]}:`, bidsResponse);
          // if (bidsResponse.error) {
          //   throw new Error(bidsResponse.error);
          // }

          // allBids = allBids.concat(bidsResponse.bids || []);
        }
        // console.log("all bids are:",allBids)

        // // Filter bids where bidder address matches the current address
        // const filteredBids = allBids.filter(bid => bid[1].bidder === currentAddress);
        // console.log('Filtered Bids:', filteredBids);
        // setBids(filteredBids);
      } catch (error) {
        console.error("Error fetching or filtering bids:", error);
        setError(error.message);
      }
    };

    fetchAndFilterBids();
  }, []);

  return { bids, user, error };
}
