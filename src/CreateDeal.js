import { useRef } from 'react'
import Header from './components/Header'
import axiosInstance from './api/axios'
import { getOfflineSignerAndCosmWasmClient } from './GetClient'
import { AppConstants } from './config/constant'
import { getLatestBlockHeight } from './utils/util'
import toast, { Toaster } from 'react-hot-toast';
const CreateDeal = () => {
  const formRef = useRef(null)
  async function validateAllfields(formData){
    let allFieldsValid=false;
    const {
      bidEndDate,
      bidStartDate,
      dealDescription,
      dealTitle,
      exchangeToken,
      minCapacity,
      minPrice,
      tokenAmount,
      tokenName
    } = formData
    if(!dealDescription){
      toast.error("Enter Deal Description");
      return
    }
    if(!dealTitle){
      toast.error("Enter Deal Title ");
      return
    }
    if(!bidStartDate){
      toast.error("Enter Start Date");
      return
    }
    if(!bidEndDate){
       toast.error("Enter bid End date");
       return
    }
    if(!tokenName){
      toast.error("Enter Deal Token");
      return
    }
    if(!tokenAmount){
      toast.error("Enter Deal Token Amount")
      return
    }
    if(!exchangeToken){
      toast.error("Enter Exchange Token")
      return
    }
    if(!minPrice){
      toast.error("Enter Minimum price to be bidded")
      return
    }
    if(!minCapacity){
      toast.error("Enter Minimum capacity of Deal")
      return
    }
    allFieldsValid=true;
    return allFieldsValid;
  }
  const handleSubmit = async (e) => {
    e.preventDefault()
    const formData = Object.fromEntries(new FormData(formRef.current))
    const {
      bidEndDate,
      bidStartDate,
      dealDescription,
      dealTitle,
      exchangeToken,
      minCapacity,
      minPrice,
      tokenAmount,
      tokenName
    } = formData
    const valid=await validateAllfields(formData);
    console.log("valid",valid);
    if(!valid){
        return ;
    }
    // Convert a date string in ISO 8601 format to epoch time
    function dateToEpoch(dateString) {
      return new Date(dateString).getTime() / 1000 // Convert milliseconds to seconds
    }

    // Convert bid start date and bid end date to epoch time
    const bidStartDateEpoch = Math.floor(dateToEpoch(bidStartDate))
    const bidEndDateEpoch = Math.floor(dateToEpoch(bidEndDate))
    const todayTime = Math.floor(Date.now() / 1000)
    // console.log('Bid Start Date Epoch:', bidStartDateEpoch)
    // console.log('Bid End Date Epoch:', bidEndDateEpoch)
    // console.log('todays time ', todayTime)
    let latestBlockHeight = 0
    try {
      const latest = await getLatestBlockHeight()
      console.log("latest",latest);
      latestBlockHeight = latest
    } catch (e) {
      console.log(e)
    }
    let value = 0
    if (parseInt(Math.floor((bidStartDateEpoch - todayTime) / 5)) > 0) {
      value = parseInt(Math.floor((bidStartDateEpoch - todayTime) / 5))
    }
    console.log(latestBlockHeight)
    const startBlock = parseInt(latestBlockHeight) + value
    const endBlock =
      parseInt(latestBlockHeight) + parseInt(Math.floor((bidEndDateEpoch - todayTime) / 5))
    const start = new String(startBlock)
    const end = new String(endBlock)
    console.log(startBlock + '---' + endBlock)
   
    const submitDeal = async () => {
      if(!localStorage.getItem("walletaddress")){
        const error="Connect Your Wallet "
        return Promise.reject(error);
      }
      try {
        const { offlineSigner, CosmWasmClient } = await getOfflineSignerAndCosmWasmClient()
        const contractAddress = AppConstants.CONTRACT_ADDRESS
        let accounts = await offlineSigner.getAccounts()
        const DealCreatorAddress = localStorage.getItem("walletaddress");
        const defaultFee = {
          amount: [
            {
              denom: 'stake',
              amount: '5000'
            }
          ],
          gas: '200000'
        }

        const executeMsg = {
          create_deal: {
            deal_title:dealTitle,
            deal_description:dealDescription,
            deal_creator: DealCreatorAddress,
            min_cap: minCapacity,
            total_bid: '0',
            deal_token_denom: tokenName,
            deal_token_amount: tokenAmount,
            start_block: start,
            end_block: end,
            bid_token_denom: exchangeToken,
            min_price: minPrice
          }
        }

        const executeResponse = await CosmWasmClient.execute(
          DealCreatorAddress,
          contractAddress,
          executeMsg,
          defaultFee,
          'Execute create_deal',
          [
            {
              amount: tokenAmount,
              denom: tokenName
            },
            {
              amount: '10',
              denom: 'uotc'
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
        const eventData = response.txResponse.events[12].attributes
        const dealIdObject = eventData.find((obj) => obj.key === 'deal_id')
        const dealId = dealIdObject ? dealIdObject.value : null
        // toast.success('Deal Created Successfully');
        console.log('deal value:', dealId)
        // axiosInstance
        //   .post('/create-deal', {
        //     description:dealDescription,
        //     title:dealTitle,
        //     deal_creator: DealCreatorAddress,
        //     min_cap: minCapacity,
        //     total_bid: '0',
        //     deal_token_denom: tokenName,
        //     deal_token_amount: tokenAmount,
        //     start_block: start,
        //     end_block: end,
        //     bid_token: exchangeToken,
        //     min_price: minPrice
        //   })
        //   .then((res) => {
        //     console.log("successfully stored",res);
        //   })
        //   .catch((err) => {
        //     console.log("error when stroing into db",err);
        //   })
        return Promise.resolve(dealId); 
      } catch (error) {
        console.error('Error executing deal:', error)
        return Promise.reject(error.message);
      }
    }
    toast.promise(
      submitDeal(),
       {
         loading: 'Creating Deal...',
         success: (dealId) => <b>Deal Created with Id: {dealId}</b>, // Show the amount value in success message
         error:(error)=><b>{error}!</b>,
       }
     );
  }

  return (
    <>
      <Header />
      <main className="px-4 md:px-24 mt-4 md:mt-9 mb-9">
        <div className="flex mb-7">
          <h3 className="text-3xl font-medium text-black/90 font-['Alata']">Create new deal</h3>
        </div>
        <form ref={formRef} onSubmit={handleSubmit}>
          <div className="w-full border rounded-lg bg-white">
            <div className="px-6 py-4 mt-2 md:mt-5">
              <div className="mb-6 flex flex-col md:flex-row md:items-center">
                <label
                  className="text-sm font-medium text-gray-700 w-full md:w-1/6"
                  htmlFor="dealTitle"
                >
                  Deal title
                  <small className="text-red-600">*</small>
                </label>
                <input
                  type="text"
                  name="dealTitle"
                  placeholder="100k ATOM liquidation"
                  className="border border-gray-300 text-sm rounded-lg focus:ring-emerald-500 focus:border-emerald-500 block w-full md:w-2/3 p-2"
                />
              </div>

              <div className="mb-6 flex flex-col md:flex-row md:items-center">
                <label
                  className="text-sm font-medium text-gray-700 w-full md:w-1/6"
                  htmlFor="dealDescription"
                >
                  Deal description
                  <small className="text-gray-400 ml-2">Optional</small>
                </label>
                <textarea
                  name="dealDescription"
                  type="text"
                  placeholder="Looking for ATOM buyers. Pirce range in between 10$ and 10.5$"
                  className="border border-gray-300 text-sm rounded-lg focus:ring-emerald-500 focus:border-emerald-500 block w-full md:w-2/3 p-2"
                ></textarea>
              </div>

              <div className="mb-6 flex flex-col md:flex-row md:items-center">
                <label
                  className="text-sm font-medium text-gray-700 w-full md:w-1/6"
                  htmlFor="tokenName"
                >
                  Token
                  <small className="text-red-600">*</small>
                </label>
                <input
                  type="text"
                  name="tokenName"
                  placeholder="ATOM"
                  className="border border-gray-300 text-sm rounded-lg focus:ring-emerald-500 focus:border-emerald-500 block w-full md:w-2/3 p-2"
                />
              </div>

              <div className="mb-6 flex flex-col md:flex-row md:items-center">
                <label
                  className="text-sm font-medium text-gray-700 w-full md:w-1/6"
                  htmlFor="tokenAmount"
                >
                  Amount
                  <small className="text-red-600">*</small>
                </label>
                <input
                  name="tokenAmount"
                  type="text"
                  placeholder="100,000 ATOMs"
                  className="border border-gray-300 text-sm rounded-lg focus:ring-emerald-500 focus:border-emerald-500 block w-full md:w-2/3 p-2"
                />
              </div>

              <div className="mb-6 flex flex-col md:flex-row md:items-center">
                <label
                  className="text-sm font-medium text-gray-700 w-full md:w-1/6"
                  htmlFor="exchangeToken"
                >
                  Exchange token
                  <small className="text-red-600">*</small>
                </label>
                <input
                  name="exchangeToken"
                  type="text"
                  placeholder="USDT"
                  className="border border-gray-300 text-sm rounded-lg focus:ring-emerald-500 focus:border-emerald-500 block w-full md:w-2/3 p-2"
                />
              </div>

              <div className="mb-6 flex flex-col md:flex-row md:items-center">
                <label
                  className="text-sm font-medium text-gray-700 w-full md:w-1/6"
                  htmlFor="minPrice"
                >
                  Minimum Price
                  <small className="text-red-600">*</small>
                </label>
                <input
                  name="minPrice"
                  type="text"
                  placeholder="MinPrice"
                  className="border border-gray-300 text-sm rounded-lg focus:ring-emerald-500 focus:border-emerald-500 block w-full md:w-2/3 p-2"
                />
              </div>

              <div className="mb-6 flex flex-col md:flex-row md:items-center">
                <label
                  className="text-sm font-medium text-gray-700 w-full md:w-1/6"
                  htmlFor="minCapacity"
                >
                  Minimum Capacity
                  <small className="text-red-600">*</small>
                </label>
                <input
                  name="minCapacity"
                  type="text"
                  placeholder="MinCap"
                  className="border border-gray-300 text-sm rounded-lg focus:ring-emerald-500 focus:border-emerald-500 block w-full md:w-2/3 p-2"
                />
              </div>
              <div className="mb-6 flex flex-col md:flex-row md:items-center">
                <div className="flex flex-col md:flex-row items-center w-full md:w-5/12">
                  <label
                    className="text-sm font-medium text-gray-700 w-full md:w-2/3"
                    htmlFor="bidStartDate"
                  >
                    Bid start date
                    <small className="text-red-600">*</small>
                  </label>
                  <input
                    name="bidStartDate"
                    type="datetime-local"
                    placeholder="YYYY-MM-DD"
                    className="border border-gray-300 text-sm rounded-lg focus:ring-emerald-500 focus:border-emerald-500 block w-full p-2"
                  />
                </div>
                <div className="flex flex-col md:flex-row items-center w-full md:w-5/12 mt-6 md:mt-0">
                  <label
                    className="text-sm font-medium text-gray-700 w-full md:w-2/3 md:text-center"
                    htmlFor="bidEndDate"
                  >
                    Bid end date
                    <small className="text-red-600">*</small>
                  </label>
                  <input
                    name="bidEndDate"
                    type="datetime-local"
                    laceholder="2024-04-09T12:00"
                    className="border border-gray-300 text-sm rounded-lg focus:ring-emerald-500 focus:border-emerald-500 block w-full p-2"
                  />
                </div>
              </div>
            </div>

            <hr className="border border-gray-100 mt-1 md:mt-3" />
            <div className="p-5 flex">
              <div className="ml-auto">
                <button className="px-6 py-1.5 rounded-xl border border-gray-200 hover:bg-slate-100 text-black/60 font-medium mr-3 transition-colors duration-200 ease-in-out">
                  Cancel
                </button>
                <button className="px-6 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-medium transition-colors duration-200 ease-in-out">
                  Create deal
                </button>
              </div>
            </div>
          </div>
        </form>
      </main>
      <Toaster />
    </>
  )
}

export default CreateDeal
