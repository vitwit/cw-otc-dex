import { useEffect, useState } from "react";
import { getOfflineSignerAndCosmWasmClient } from "../GetClient";
import { getAllDeals } from "../contractcalls/getAllDeals";

export function useFilteredDeals() {
  const [filtereddeals, setDeals] = useState([]);
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAndFilterDeals = async () => {
      try {
        const response = await getAllDeals();
        if (response.error) {
          throw new Error(response.error);
        }

        const { offlineSigner } = await getOfflineSignerAndCosmWasmClient();
        const accounts = await offlineSigner.getAccounts();
        const currentAddress = accounts[0].address;
        console.log('Current User Address:', currentAddress);
        setUser(currentAddress);
 
           // Assuming the deals are stored in response.deals
           const allDeals = response.deals || [];

        // Assuming the deals are stored in response.deals
        const filteredDeals = allDeals.filter(deal => deal[1].deal_creator === currentAddress);
        console.log("all deals",allDeals)
        setDeals(filteredDeals);
      } catch (error) {
        console.error("Error fetching or filtering deals:", error);
        setError(error.message);
      }
    };

    fetchAndFilterDeals();
  }, []);

  return { filtereddeals, user, error };
}
