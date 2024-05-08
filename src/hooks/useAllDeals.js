import { useEffect, useState } from "react";
import { getOfflineSignerAndCosmWasmClient } from "../GetClient";
import { AppConstants } from "../config/constant";

export function useAllDeals() {
  const [response, setResponse] = useState(null);
  const [user, setUser] = useState(null);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const { offlineSigner, CosmWasmClient } = await getOfflineSignerAndCosmWasmClient();
        const contractAddress = AppConstants.CONTRACT_ADDRESS
        let accounts = await offlineSigner.getAccounts();
        const currentAddress = accounts[0].address;
        setUser(currentAddress);
        const query = {
          "get_all_deals": {}
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

  return { user, response };
}
