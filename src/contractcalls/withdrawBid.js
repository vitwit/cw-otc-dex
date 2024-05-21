import { getOfflineSignerAndCosmWasmClient } from "../GetClient";
import { AppConstants } from "../config/constant";
export const withdrawBid=async (bidId, dealId)=>{
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
        const deal_id=parseInt(dealId);
        const bid_id=parseInt(bidId);
        const executeMsg = {
          withdraw_bid: {
             deal_id: deal_id,
             bid_id:bid_id,
          }
        }
        const executeResponse = await CosmWasmClient.execute(
          BidderAddress,
          contractAddress,
          executeMsg,
          defaultFee,
          'Execute withdraw_bid',
          [
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