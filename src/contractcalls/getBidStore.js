import { getOfflineSignerAndCosmWasmClient } from "../GetClient";
import { AppConstants } from "../config/constant";
export const getBidStore=async (id)=>{
    try{
        const { offlineSigner, CosmWasmClient } = await getOfflineSignerAndCosmWasmClient();
        const contractAddress = AppConstants.CONTRACT_ADDRESS
        const query = {
          "get_bid_store": {"id":`${id}`}
        };
        const response = await CosmWasmClient.queryClient.wasm.queryContractSmart(contractAddress, query);
        return response
    }
    catch(error){   
        console.log(error)
        return error.message;
    }
}