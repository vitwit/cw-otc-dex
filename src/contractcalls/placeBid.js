import { getOfflineSignerAndCosmWasmClient } from "../GetClient";
import { AppConstants } from "../config/constant";
export const placeBid=async (amount,price,denom,dealId)=>{
    // const { amount, price, denom } = formData;
    try {
        const { offlineSigner, CosmWasmClient } = await getOfflineSignerAndCosmWasmClient()
        const contractAddress = AppConstants.CONTRACT_ADDRESS
        let accounts = await offlineSigner.getAccounts()
        const BidderAddress = localStorage.getItem("walletaddress");
        const defaultFee = {
          amount: [
            {
              denom: 'stake',
              amount: '5000'
            }
          ],
          gas: '200000'
        }
       const id=parseInt(dealId)
        const executeMsg = {
          place_bid: {
             deal_id:id,
             bidder: BidderAddress,
             amount: amount,
             denom: denom,
             price: price,
          }
        }
        const total_amount=""+amount*price;
        const executeResponse = await CosmWasmClient.execute(
          BidderAddress,
          contractAddress,
          executeMsg,
          defaultFee,
          'Execute place_bid',
          [
            {
              amount:total_amount,
              denom: denom
            }
          ]
        )
        console.log('Execute response:', executeResponse)
        const txHash=executeResponse.transactionHash;
        console.log("transation hash",txHash)
        const response = await CosmWasmClient.queryClient.tx.getTx(
          txHash
        )
        console.log("response of hash",response);
        return Promise.resolve(response);
      } catch (error) {
        console.error('Error executing bid:', error)
        return Promise.reject(error.message);
      }
}