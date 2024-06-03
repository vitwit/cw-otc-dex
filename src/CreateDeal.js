import { useRef, useState } from 'react'
import Header from './components/Header'
import { Link, useNavigate } from 'react-router-dom'
import axiosInstance from './api/axios'
import { getOfflineSignerAndCosmWasmClient } from './GetClient'
import { AppConstants } from './config/constant'
import { getLatestBlockHeight } from './utils/util'
import toast, { Toaster } from 'react-hot-toast'
import { fetchTokenDetails } from './utils/getDenom'
import { getUserBalancebyDenom } from './utils/fetchKeplrBalance'
import { extractDenomsAndDecimals } from './utils/getDenoms'
const CreateDeal = () => {
  const formRef = useRef(null)
  const result = extractDenomsAndDecimals()
  const [validated,setValidated]=useState(true);
  const [formData, setFormData] = useState({
    dealTitle: '',
    dealDescription: '',
    bidStartDate: '',
    bidEndDate: '',
    tokenName: '',
    tokenAmount: '',
    exchangeToken: '',
    minPrice: '',
    minCapacity: ''
  })
  const navigate = useNavigate()
  const [errors, setErrors] = useState({})
  const [dealToken, setDealToken] = useState()
  const [dealBalance, setDealBalance] = useState()
  const [exchangeToken, setExchangeToken] = useState()
  const address = localStorage.getItem('walletaddress')
  const validateField = async (name, value) => {
    let error = ''
    let valid = true
    console.log(value)
    switch (name) {
      case 'dealTitle':
        if (!value) {
          error = 'Enter Deal Title'
          valid = false
        } else if (!/^[a-zA-Z0-9\s.,-]+$/.test(value)) {
          error = 'Invalid Deal Title'
          valid = false
        }
        break
      case 'dealDescription':
        if (!value) {
          error = 'Enter Deal Description'
          valid = false
        } else if (!/^[a-zA-Z\s.,-]+$/.test(value)) {
          error = 'Invalid Deal Description'
          valid = false
        }
        break
      case 'bidStartDate':
        if (!value) {
          error = 'Enter Start Date'
          valid = false
        }
        break
      case 'bidEndDate':
        if (!value) {
          error = 'Enter bid End date'
          valid = false
        }
        break
      case 'tokenName':
        if (value) {
          setDealToken(value)
          const { denom: deal_denom, decimal: deal_decimal } = await fetchTokenDetails(value)
          const balance = await getUserBalancebyDenom(address, deal_denom, deal_decimal)
          if (balance) {
            setDealBalance(balance.balance)
          } else {
            setDealBalance(null)
          }
        }
        if (!value) {
          error = 'Enter Deal Token'
          valid = false
        }
        break
      case 'tokenAmount':
        if (!value) {
          error = 'Enter Deal Token Amount'
          valid = false
        } else if (isNaN(value)) {
          error = 'Amount should be a number'
          valid = false
        }
        break
      case 'exchangeToken':
        if (!value) {
          error = 'Enter Exchange Token'
          valid = false
        }
        break
      case 'minPrice':
        if (!value) {
          error = 'Enter Minimum price to be bidded'
          valid = false
        } else if (isNaN(value)) {
          error = 'Minimum price should be a number'
          valid = false
        }

        break
      case 'minCapacity':
        if (!value) {
          error = 'Enter Minimum capacity of Deal'
          valid = false
        } else if (isNaN(value)) {
          error = 'Minimum capacity should be a number'
          valid = false
        } else if (formData.tokenAmount != null && Number(value) > parseInt(formData.tokenAmount)) {
          // console.log("toke",formData.tokenAmount)
          error = 'Minimum capacity should be less than Deal Amount'
          valid = false
        }
        break
      default:
        break
    }
    console.log(valid)
    setErrors((prevErrors) => ({ ...prevErrors, [name]: error }))
    return valid
  }

  const validateAllFields = async () => {
    setErrors({})
    let allFieldsValid = true // Set initial state to true
    for (const [key, value] of Object.entries(formData)) {
      if (!(await validateField(key, value))) {
        allFieldsValid = false // Set to false if any field is invalid
      }
    }
    return allFieldsValid // Return true if all fields are valid, false otherwise
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prevFormData) => ({ ...prevFormData, [name]: value }))
    
    validateField(name, value)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const formData = Object.fromEntries(new FormData(formRef.current))
    // const valid = await validateAllfields(formData);

    if (!(await validateAllFields())) {
      console.log('not all')
      return
    }
    setValidated(false);
    console.log(validateAllFields())
    console.log('hello----')
    // Convert a date string in ISO 8601 format to epoch time
    function dateToEpoch(dateString) {
      return new Date(dateString).getTime() / 1000 // Convert milliseconds to seconds
    }

    // Convert bid start date and bid end date to epoch time
    const bidStartDateEpoch = Math.floor(dateToEpoch(formData.bidStartDate))
    const bidEndDateEpoch = Math.floor(dateToEpoch(formData.bidEndDate))
    const todayTime = Math.floor(Date.now() / 1000)

    let latestBlockHeight = 0
    try {
      const latest = await getLatestBlockHeight()
      latestBlockHeight = latest
    } catch (e) {
      console.log(e)
    }

    let value = 0
    if (parseInt(Math.floor((bidStartDateEpoch - todayTime) / 5)) > 0) {
      value = parseInt(Math.floor((bidStartDateEpoch - todayTime) / 5))
    }

    const startBlock = parseInt(latestBlockHeight) + value
    const endBlock =
      parseInt(latestBlockHeight) + parseInt(Math.floor((bidEndDateEpoch - todayTime) / 5))
    const start = new String(startBlock)
    const end = new String(endBlock)

    const submitDeal = async () => {
      if (!localStorage.getItem('walletaddress')) {
        const error = 'Connect Your Wallet '
        return Promise.reject(error)
      }

      // formRef.current.reset();
      try {
        const { offlineSigner, CosmWasmClient } = await getOfflineSignerAndCosmWasmClient()
        const contractAddress = AppConstants.CONTRACT_ADDRESS
        let accounts = await offlineSigner.getAccounts()
        const DealCreatorAddress = localStorage.getItem('walletaddress')
        const defaultFee = {
          amount: [
            {
              denom: 'stake',
              amount: '5000'
            }
          ],
          gas: '250000'
        }

        const { denom: exchangedenom, decimal: exchangedecimal } = await fetchTokenDetails(
          formData.exchangeToken
        )
        console.log('ex', exchangedenom)
        const { denom: deal_denom, decimal: deal_decimal } = await fetchTokenDetails(
          formData.tokenName
        )
        // console.log("deal",denom);
        const amount = Number(formData.tokenAmount) * 10 ** Number(deal_decimal)
        const executeMsg = {
          create_deal: {
            deal_title: formData.dealTitle,
            deal_description: formData.dealDescription,
            deal_creator: DealCreatorAddress,
            min_cap: formData.minCapacity,
            total_bid: '0',
            deal_token_denom: deal_denom,
            deal_token_amount: amount.toString(),
            start_block: start,
            end_block: end,
            bid_token_denom: exchangedenom,
            min_price: formData.minPrice
          }
        }
        // console.log(denom,decimal);

        // console.log("--",amount)
        const executeResponse = await CosmWasmClient.execute(
          DealCreatorAddress,
          contractAddress,
          executeMsg,
          defaultFee,
          'Execute create_deal',
          [
            {
              amount: amount.toString(),
              denom: deal_denom
            },
            {
              amount: '10',
              denom: 'uotc'
            }
          ]
        )
        const txHash = executeResponse.transactionHash
        const response = await CosmWasmClient.queryClient.tx.getTx(txHash)
        const eventData = response.txResponse.events[12].attributes
        const dealIdObject = eventData.find((obj) => obj.key === 'deal_id')
        const dealId = dealIdObject ? dealIdObject.value : null
        return Promise.resolve(dealId)
      } catch (error) {
        const errorMessage = error.message || error.toString()
        const indexOfMessage = errorMessage.indexOf('message index: 0:')

        if (indexOfMessage !== -1) {
          const specificMessage = errorMessage
            .substring(indexOfMessage + 'message index: 0:'.length)
            .trim()
          console.error('Specific error message:', specificMessage)
        }

        return Promise.reject(errorMessage)
        return Promise.reject(error.message)
      }
    }

    toast.promise(submitDeal(), {
      loading: 'Creating Deal...',
      success: (dealId) =>
      toast.success('Deal created successfully!', {
        duration: 3000, // Adjust duration as needed
        onClose: () => navigate(`/deal/${dealId}`), // Navigate after toast is closed
      }),
      // navigate(`/deal/${dealId}`),
      error: (error) => <b>{JSON.stringify(error)}!</b>
    })
  }

  const handleCancel = (e) => {
    e.preventDefault()
    formRef.current.reset()
    setFormData({
      dealTitle: '',
      dealDescription: '',
      bidStartDate: '',
      bidEndDate: '',
      tokenName: '',
      tokenAmount: '',
      exchangeToken: '',
      minPrice: '',
      minCapacity: ''
    })
    setErrors({})
  }

  const handleAmountChange = (e) => {
    const value = e.target.value
    // console.log('hii---')
    if (value) {
      if (errors.tokenAmount) {
        console.log(value)
        errors.tokenAmount = false
      }
    }
  }

  return (
    <>
      <Header />
      <main className="px-4 md:px-24 mt-4 md:mt-9 mb-9">
        <div className="flex mb-7">
          <h3 className="text-3xl font-medium text-black/90 font-['Alata']">Create new deal</h3>
        </div>
        <form ref={formRef} onSubmit={handleSubmit}>
          <div className="w-[70%] border rounded-lg bg-white">
            <div className="px-6 py-4 mt-2 md:mt-5 w-full">
              <div className="md:w-2/3">
                <div className="mb-6 flex flex-col md:flex-col md:items-start">
                  <label
                    className="text-sm font-medium text-gray-700 w-full  text-start"
                    htmlFor="dealTitle"
                  >
                    Deal title <small className="text-red-600">*</small>
                  </label>
                  <input
                    type="text"
                    name="dealTitle"
                    value={formData.dealTitle}
                    onChange={handleChange}
                    placeholder="100k ATOM liquidation"
                    className="border border-gray-300 text-sm rounded-lg focus:ring-emerald-500 focus:border-emerald-500 block w-full  p-2"
                  />
                  {errors.dealTitle && (
                    <p className="text-red-500 text-xs mt-1">{errors.dealTitle}</p>
                  )}
                </div>

                <div className="mb-6 flex flex-col md:flex-col md:items-start">
                  <label
                    className="text-sm font-medium text-gray-700 w-full  text-start"
                    htmlFor="dealDescription"
                  >
                    Deal description <small className="text-red-600">*</small>
                    {/* <small className="text-gray-400 ml-2">Optional</small> */}
                  </label>
                  <textarea
                    name="dealDescription"
                    value={formData.dealDescription}
                    onChange={handleChange}
                    placeholder="Looking for ATOM buyers. Pirce range in between 10$ and 10.5$"
                    className="border border-gray-300 text-sm rounded-lg focus:ring-emerald-500 focus:border-emerald-500 block w-full  p-2"
                  ></textarea>
                  {errors.dealDescription && (
                    <p className="text-red-500 text-xs mt-1">{errors.dealDescription}</p>
                  )}
                </div>

                <div className="mb-6 flex flex-col md:flex-col md:items-start">
                  <label
                    className="text-sm font-medium text-gray-700 w-full  text-start"
                    htmlFor="tokenName"
                  >
                    Deal Token <small className="text-red-600">*</small>
                  </label>

                  <select
                    name="tokenName"
                    value={formData.tokenName}
                    onChange={handleChange}
                    className="border border-gray-300 text-sm rounded-lg focus:ring-emerald-500 focus:border-emerald-500 block w-full p-2"
                    // onChange={(e) => setDealToken(e.target.value)}
                    // value={dealToken}
                  >
                    <option value="">Select a token</option>
                    <option value="BLD">BLD</option>
                    <option value="IST">IST</option>
                    <option value="AKT">AKT</option>
                    <option value="ATOM">ATOM</option>
                    <option value="DSM">DSM</option>
                    <option value="EVMOS">EVMOS</option>
                    <option value="JUNO">JUNO</option>
                    <option value="FLIX">FLIX</option>
                    <option value="OSMO">OSMO</option>
                    <option value="PASG">PASG</option>
                    <option value="DYDX">DYDX</option>
                    <option value="QCK">QCK</option>
                    <option value="REGEN">REGEN</option>
                    <option value="STARS">STARS</option>
                    <option value="DYM">DYM</option>
                    <option value="UMEE">UMEE</option>
                    <option value="TIA">TIA</option>
                    <option value="QSR">QSR</option>
                    <option value="CMDX">CMDX</option>
                    <option value="GRAV">GRAV</option>
                    <option value="MARS">MARS</option>
                    <option value="ARCH">ARCH</option>
                    <option value="CRE">CRE</option>
                  </select>
                  {errors.tokenName && (
                    <p className="text-red-500 text-xs mt-1">{errors.tokenName}</p>
                  )}
                </div>

                <div className="mb-6 flex flex-col md:flex-col md:items-start">
                  <div className="flex justify-between w-full">
                    <label
                      className="text-sm font-medium text-gray-700 w-[200px] text-start"
                      htmlFor="tokenAmount"
                    >
                      Deal Amount <small className="text-red-600">*</small>
                    </label>

                    {dealBalance && (
                      <div className="flex  w-full justify-end ">
                        <div className="text-sm mt-1">Available Balance :</div>
                        <div className="text-sm mt-1">
                          {dealBalance} {dealToken}
                        </div>
                      </div>
                    )}
                  </div>
                  <input
                    name="tokenAmount"
                    type="text"
                    placeholder="100,000"
                    value={formData.tokenAmount}
                    onChange={handleChange}
                    className="border border-gray-300 text-sm rounded-lg focus:ring-emerald-500 focus:border-emerald-500 block w-full md:w-1/3 p-2"
                  />
                  {errors.tokenAmount && (
                    <p className="text-red-500 text-xs mt-1">{errors.tokenAmount}</p>
                  )}
                </div>

                <div className="mb-6 flex flex-col md:flex-col md:items-start">
                  <label
                    className="text-sm font-medium text-gray-700 w-full text-start"
                    htmlFor="exchangeToken"
                  >
                    Exchange token <small className="text-red-600">*</small>
                  </label>
                  <select
                    name="exchangeToken"
                    className="border text-sm rounded-lg focus:ring-emerald-500 focus:border-emerald-500 block w-full md:w-2/3 p-2"
                    value={formData.exchangeToken}
                    onChange={handleChange}
                    // onChange={(e) => setExchangeToken(e.target.value)}
                    // value={exchangeToken}
                    disabled={!dealToken}
                  >
                    <option value="">Select a token</option>
                    <option value="BLD" disabled={dealToken === 'BLD'}>
                      BLD
                    </option>
                    <option value="IST" disabled={dealToken === 'IST'}>
                      IST
                    </option>
                    <option value="AKT" disabled={dealToken === 'AKT'}>
                      AKT
                    </option>
                    <option value="ATOM" disabled={dealToken === 'ATOM'}>
                      ATOM
                    </option>
                    <option value="DSM" disabled={dealToken === 'DSM'}>
                      DSM
                    </option>
                    <option value="EVMOS" disabled={dealToken === 'EVMOS'}>
                      EVMOS
                    </option>
                    <option value="JUNO" disabled={dealToken === 'JUNO'}>
                      JUNO
                    </option>
                    <option value="FLIX" disabled={dealToken === 'FLIX'}>
                      FLIX
                    </option>
                    <option value="OSMO" disabled={dealToken === 'OSMO'}>
                      OSMO
                    </option>
                    <option value="PASG" disabled={dealToken === 'PASG'}>
                      PASG
                    </option>
                    <option value="DYDX" disabled={dealToken === 'DYDX'}>
                      DYDX
                    </option>
                    <option value="QCK" disabled={dealToken === 'QCK'}>
                      QCK
                    </option>
                    <option value="REGEN" disabled={dealToken === 'REGEN'}>
                      REGEN
                    </option>
                    <option value="STARS" disabled={dealToken === 'STARS'}>
                      STARS
                    </option>
                    <option value="DYM" disabled={dealToken === 'DYM'}>
                      DYM
                    </option>
                    <option value="UMEE" disabled={dealToken === 'UMEE'}>
                      UMEE
                    </option>
                    <option value="TIA" disabled={dealToken === 'TIA'}>
                      TIA
                    </option>
                    <option value="QSR" disabled={dealToken === 'QSR'}>
                      QSR
                    </option>
                    <option value="CMDX" disabled={dealToken === 'CMDX'}>
                      CMDX
                    </option>
                    <option value="GRAV" disabled={dealToken === 'GRAV'}>
                      GRAV
                    </option>
                    <option value="MARS" disabled={dealToken === 'MARS'}>
                      MARS
                    </option>
                    <option value="ARCH" disabled={dealToken === 'ARCH'}>
                      ARCH
                    </option>
                    <option value="CRE" disabled={dealToken === 'CRE'}>
                      CRE
                    </option>
                  </select>
                  {errors.exchangeToken && (
                    <p className="text-red-500 text-xs mt-1">{errors.exchangeToken}</p>
                  )}
                </div>

                <div className="mb-6 flex flex-col md:flex-col md:items-start">
                  <label
                    className="text-sm font-medium text-gray-700 w-full  text-start"
                    htmlFor="minPrice"
                  >
                    Minimum Price <small className="text-red-600">*</small>
                  </label>
                  <input
                    name="minPrice"
                    type="text"
                    placeholder="MinPrice"
                    value={formData.minPrice}
                    onChange={handleChange}
                    className="border border-gray-300 text-sm rounded-lg focus:ring-emerald-500 focus:border-emerald-500 block w-full md:w-1/3 p-2"
                  />
                  {errors.minPrice && (
                    <p className="text-red-500 text-xs mt-1">{errors.minPrice}</p>
                  )}
                </div>

                <div className="mb-6 flex flex-col md:flex-col md:items-start">
                  <label
                    className="text-sm font-medium text-gray-700 w-full  text-start"
                    htmlFor="minCapacity"
                  >
                    Min Cap <small className="text-red-600">*</small>
                  </label>
                  <input
                    name="minCapacity"
                    type="text"
                    value={formData.minCapacity}
                    onChange={handleChange}
                    placeholder="MinCap"
                    className="border border-gray-300 text-sm rounded-lg focus:ring-emerald-500 focus:border-emerald-500 block w-full  md:w-1/3 p-2"
                  />
                  {errors.minCapacity && (
                    <p className="text-red-500 text-xs mt-1">{errors.minCapacity}</p>
                  )}
                </div>

                <div className="mb-6 flex flex-col md:flex-row md:items-center space-x-4">
                  <div className="flex flex-col md:flex-col  w-[225px] ">
                    <label
                      className="text-sm font-medium text-gray-700 w-full md:w-2/3 text-start"
                      htmlFor="bidStartDate"
                    >
                      Bid start date <small className="text-red-600">*</small>
                    </label>
                    <input
                      name="bidStartDate"
                      type="datetime-local"
                      value={formData.bidStartDate}
                      onChange={handleChange}
                      className="border border-gray-300 text-sm rounded-lg focus:ring-emerald-500 focus:border-emerald-500 block w-full p-2"
                    />
                    {errors.bidStartDate && (
                      <p className="text-red-500 text-xs mt-1">{errors.bidStartDate}</p>
                    )}
                  </div>
                  <div className="flex flex-col md:flex-col w-[225px]">
                    <label
                      className="text-sm font-medium text-gray-700 w-full md:w-2/3 md:text-start"
                      htmlFor="bidEndDate"
                    >
                      Bid end date <small className="text-red-600">*</small>
                    </label>
                    <input
                      name="bidEndDate"
                      type="datetime-local"
                      value={formData.bidEndDate}
                      onChange={handleChange}
                      className="border border-gray-300 text-sm rounded-lg focus:ring-emerald-500 focus:border-emerald-500 block w-full p-2"
                    />
                    {errors.bidEndDate && (
                      <p className="text-red-500 text-xs mt-1">{errors.bidEndDate}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <hr className="border border-gray-100 mt-1 md:mt-3" />
            <div className="p-5 flex">
              <div className="ml-auto mx-auto">
                <button
                  onClick={handleCancel}
                  className="px-6 py-1.5 rounded-xl border border-gray-200 hover:bg-slate-100 text-black/60 font-medium mr-3 transition-colors duration-200 ease-in-out"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  // className="px-6 py-1.5 rounded-xl bg-green-600 hover:bg-green-700 text-white font-medium transition-colors duration-200 ease-in-out"
                // >
                className={`px-6 py-1.5 rounded-xl text-white font-medium transition-colors duration-200 ease-in-out ${
                  validated
                    ? 'bg-green-300 cursor-not-allowed'
                    : 'bg-green-500 hover:bg-green-600'
                }`}
                disabled={validated}>
                  Create deal
                </button>
              </div>
            </div>
          </div>
        </form>
      </main>
      <Toaster position="top-right" width="550px" reverseOrder={false}
      toastOptions={{
        style: {
          width: 'auto', // Adjust the width dynamically based on content
          maxWidth: '550px', // Set maximum width for the toast
        },
      }} 
      />
    </>
  )
}

export default CreateDeal
