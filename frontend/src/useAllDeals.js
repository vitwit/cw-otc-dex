import { useEffect, useState } from "react";
import { getOfflineSignerAndCosmWasmClient } from "./GetClient";

export function useAllDeals() {
  const [response, setResponse] = useState(null);
  const [user,setUser]=useState(null);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const { offlineSigner, CosmWasmClient } = await getOfflineSignerAndCosmWasmClient();
        const contractAddress = 'osmo1nc5tatafv6eyq7llkr2gv50ff9e22mnf70qgjlv737ktmt4eswrqvlx82r';
        let accounts = await offlineSigner.getAccounts();
        const currentAddress = accounts[0].address;
        setUser(currentAddress);
        const query = {
          "get_all_deals": { }
        };
        const response = await CosmWasmClient.queryClient.wasm.queryContractSmart(contractAddress, query);
        setResponse(response);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
    // Cleanup function if needed
    return () => {
      // Perform cleanup if necessary
    };
  }, []);

  return {user,response};
}
