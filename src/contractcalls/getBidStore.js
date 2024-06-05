
import { AppConstants } from '../config/constant'
import { CosmWasmClient } from "cosmwasm";
export const getBidStore = async (id) => {
  // const deal_id=parseInt(id);
  try {
    const  client = await CosmWasmClient.connect(AppConstants.RPC_URL)
    const contractAddress = AppConstants.CONTRACT_ADDRESS
    const queryMessage = {
      get_bid_store: { id: `${id}` }
    };
    const response= await client.queryClient.wasm.queryContractSmart(
        contractAddress,
        queryMessage
      )
    return { bids: response.bids, error: '' }
    //return response
    console.log("response is:",response);
  } catch (error) {
    console.log(error)
    return { bids: [], error: error.message }
   // return error
  }
}