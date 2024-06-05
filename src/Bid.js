import { useParams } from 'react-router-dom'
import Header from './components/Header'
import { getDeal } from './contractcalls/getdeal'
import { useState, useRef } from 'react'
import { useEffect } from 'react'
import BidForm from './BidForm'
import toast, { Toaster } from 'react-hot-toast'
import { getLatestBlockHeight } from './utils/util'
import { executeDeal } from './contractcalls/executeDeal'
import { getBidStore } from './contractcalls/getBidStore'
import BidItem from './ BidItem'
import ActivityItem from './ActivityItem'
import { fetchMarketPrices } from './utils/fetchPrices'
import { fetchTokenDenom } from './utils/getDecimalByDenom'
import icons from './assets/icons.json'
import moment from 'moment'
import { getUser } from './GetUser'
import BidsOverview from './BidsOverView'

const Bid = () => {
  const intervalRef = useRef(null)
  const { id } = useParams()
  const [dealData, setDealData] = useState(null)
  const [showBidForm, setShowBidForm] = useState(false)
  const [bidStoreData, setBidStoreData] = useState([])
  const [latestBlockHeight, setLatestBlockHeight] = useState(null)
  const [dealExecuted, setDealExecuted] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activityLoading, setActivityLoading] = useState(true)
  const [myBids, setMyBids] = useState([])
  const [expireTime, setExpireTime] = useState(null)
  const [expireDate, setExpireDate] = useState(null)
  const [progress, setProgress] = useState(null)
  const [isLive, setIsLive] = useState(false)
  const [walletAddress, setWalletAddress] = useState(null)
  const [bidStatusMap, setBidStatusMap] = useState(null)
  const [expectedResult, setExpectedResult] = useState(null)
  const [dealDenom, setDealDenom] = useState(null)
  const [bidDenom, setBidDenom] = useState(null)
  const [dealDecimal, setDealDecimal] = useState(null)
  const [activate, setActivate] = useState(null)
  const address = localStorage.getItem('walletaddress')

  const [marketRate, setMarketRate] = useState(null)
  const [percentageDifference, setPercentageDifference] = useState(null)
  const [error, setError] = useState(null)

  const calculateMarketExchangeRate = (dealTokenPrice, bidTokenPrice) => {
    return dealTokenPrice / bidTokenPrice
  }

  const calculatePercentageDifference = (dealerRate, marketRate) => {
    return ((dealerRate - marketRate) / marketRate) * 100
  }

  const getMarketRates = async () => {
  
    try {
      // console.log("called",bidDenom)
      const prices = await fetchMarketPrices(dealDenom, bidDenom)
      const marketExchangeRate = calculateMarketExchangeRate(
        prices.dealTokenPrice,
        prices.bidTokenPrice
      )
      setMarketRate(marketExchangeRate)
      // console.log('OSMO', prices.dealTokenPrice, 'ATOM', prices.bidTokenPrice)
      const difference = calculatePercentageDifference(dealData.min_price, marketExchangeRate)
      // console.log("difference",difference);
      setPercentageDifference(difference)
    } catch (e) {
      console.log('errss',e)
      setError(e.message)
    }
  }
  useEffect(() => {
    if(dealData){
      getMarketRates()
    }
  }, [dealData])

  const fetchDeal = async () => {
    try {
      const result = await getDeal(id)
      setDealData(result.deal)
      setLoading(false)
      setActivityLoading(false)

      const { denom: bid_denom, decimal: bid_decimal } = await fetchTokenDenom(
        result.deal.bid_token_denom
      )
      setBidDenom(bid_denom)
      const { denom: deal_denom, decimal: deal_decimal } = await fetchTokenDenom(
        result.deal.deal_token_denom
      )
      setDealDenom(deal_denom)
      setDealDecimal(deal_decimal)
    } catch (e) {
      console.log(e.message)
    }
  }

  useEffect(() => {
    fetchDeal()
  }, [id])

  
  const FetchDealDetails=async ()=>{
    if(dealData){
      if (parseInt(dealData.total_bid) >= parseInt(dealData.min_cap)) {
        setExpectedResult(true)
      }
      const progressbar =
        (dealData.total_bid / dealData.deal_token_amount) * 100 >= 100
          ? 100
          : (dealData.total_bid / dealData.deal_token_amount) * 100
      setProgress(progressbar)
  
      if (dealData.deal_status === 'Completed') {
        setDealExecuted('Completed')
      }
    }
  }
  useEffect(() => {
    // const fetchLatestBlockHeight = async () => {
    //   try {
    //     const latestBlockHeight = await getLatestBlockHeight()
    //     setLatestBlockHeight(latestBlockHeight)

    //     if (latestBlockHeight >= dealData.end_block || latestBlockHeight <= dealData.start_block) {
    //       setIsLive(false)
    //     } else {
    //       setIsLive(true)
    //     }

    //     if (latestBlockHeight !== null && dealData) {
    //       let remainingSeconds=0;
    //       if(latestBlockHeight<=dealData.start_block){
    //         remainingSeconds=(dealData.start_block- latestBlockHeight) * 5
    //       }else{
    //         remainingSeconds=(dealData.end_block - latestBlockHeight) * 5
    //       }
    //       calculateTime(remainingSeconds);
    //     }
    //   } catch (e) {
    //     console.error(e.message)
    //   }
    // }

    const fetchLatestBlockHeight = async () => {
      try {
        const latestBlockHeight = await getLatestBlockHeight()
        setLatestBlockHeight(latestBlockHeight)

        if (latestBlockHeight >= dealData.start_block && latestBlockHeight <= dealData.end_block) {
          setIsLive(true)
        } else {
          setIsLive(false)
        }

        if (intervalRef.current) {
          clearInterval(intervalRef.current)
        }
        if (latestBlockHeight !== null && dealData.end_block !== null) {
          let remainingSeconds
          let expirationDate
          if (latestBlockHeight < dealData.start_block) {
            // Starts in functionality
            remainingSeconds = (dealData.start_block - latestBlockHeight) * 5
            expirationDate = moment().add(remainingSeconds, 'seconds')
            setExpireDate(expirationDate.format('MMMM D, YYYY [at] h:mm A'))

            intervalRef.current = setInterval(() => {
              if (remainingSeconds <= 0) {
                clearInterval(intervalRef.current)
                setExpireTime('started')
                fetchLatestBlockHeight() // Recursively call to start the "closes in" timer
                return
              }

              const duration = moment.duration(remainingSeconds, 'seconds')
              const days = Math.floor(duration.asDays())
              const hours = duration.hours()
              const minutes = duration.minutes()
              const seconds = duration.seconds()

              let formattedTime = ''
              if (days > 0) {
                formattedTime += `${days} ${days === 1 ? 'day' : 'days'} `
              }
              if (hours > 0) {
                formattedTime += `${hours} h `
              }
              if (minutes > 0) {
                formattedTime += `${minutes} m `
              }
              if (seconds > 0) {
                formattedTime += `${seconds} s`
              }

              formattedTime = formattedTime.trim()
              setExpireTime(`starts in ${formattedTime}`)
              remainingSeconds -= 1
            }, 1000)
          } else {
            // Closes in functionality
            remainingSeconds = (dealData.end_block - latestBlockHeight) * 5

            if (remainingSeconds <= 0) {
              setExpireTime(0)
              expirationDate = moment().add(remainingSeconds, 'seconds')
              setExpireDate(expirationDate.format('MMMM D, YYYY [at] h:mm A'))
              clearInterval(intervalRef.current)
            } else {
              expirationDate = moment().add(remainingSeconds, 'seconds')
              setExpireDate(expirationDate.format('MMMM D, YYYY [at] h:mm A'))

              intervalRef.current = setInterval(() => {
                if (remainingSeconds <= 0) {
                  clearInterval(intervalRef.current)
                  setExpireTime(0)
                  return
                }

                const duration = moment.duration(remainingSeconds, 'seconds')
                const days = Math.floor(duration.asDays())
                const hours = duration.hours()
                const minutes = duration.minutes()
                const seconds = duration.seconds()

                let formattedTime = ''
                if (days > 0) {
                  formattedTime += `${days} ${days === 1 ? 'day' : 'days'} `
                }
                if (hours > 0) {
                  formattedTime += `${hours} h `
                }
                if (minutes > 0) {
                  formattedTime += `${minutes} m `
                }
                if (seconds > 0) {
                  formattedTime += `${seconds} s`
                }

                formattedTime = formattedTime.trim()
                // setExpireTime(formattedTime);
                setExpireTime(`closes in ${formattedTime}`)
                remainingSeconds -= 1
              }, 1000)
              return () => clearInterval(intervalRef.current)
            }
          }
        }
      } catch (e) {
        console.error(e.message)
      }
    }


    if (dealData) {
      FetchDealDetails();
      fetchLatestBlockHeight()
    }
  }, [dealData])

  const fetchBidStore = async () => {
    try {
      const { bids: bidsResponse, error } = await getBidStore(id)
      // console.log('len', bidsResponse.length)
      if (bidsResponse.length > 0) {
        setBidStoreData(bidsResponse)
        console.log('--->', bidsResponse)
      }
      else{
        setBidStoreData([])
      }
    } catch (e) {
      console.log(e.message)
    }
  }
  useEffect(() => {
    console.log('in bidstore')
    fetchBidStore()
  }, [id, showBidForm])

  const fetchMyBids = async () => {
    // if(walletAddress!= localStorage.getItem('walletaddress')){
    const address = localStorage.getItem('walletaddress')
    // console.log("add",address);
    //   setWalletAddress(address)
    // }
    if (address) {
      try {
        const { bids: bidsResponse, error } = await getBidStore(id)
        if (dealData && bidsResponse.length > 0) {
          // console.log('All BIDS IN MINE func', bidsResponse)
          const sortedBids = bidsResponse.sort((a, b) => {
            const priceComparison = parseInt(b[1].price) - parseInt(a[1].price)
            if (priceComparison !== 0) {
              return priceComparison
            } else {
              // If prices are equal, sort by bid id
              return a[0] - b[0]
            }
          })

          
          let cumulativeAmount = 0
          const dealAmount = dealData.deal_token_amount // Set your deal amount here
          
          // Create a map to store the bid ID and a boolean value
          const bidStatusMap = new Map()
          // Iterate through the sorted bids to calculate the cumulative amount
          sortedBids.forEach((bid) => {
            const diff = Number(dealAmount) - Number(cumulativeAmount)
            let isWinning = 0  //not wins 
            if (diff > 0) {
              if (Number(bid[1].amount) <= Number(diff)) {
                isWinning = 1//might win 
              } else {
                isWinning = 2 //might not win 
              }
            }
            cumulativeAmount += Number(bid[1].amount)
            bidStatusMap.set(bid[0], isWinning)
          })
          console.log('Bid Status Map:', bidStatusMap)
          const myBids = bidsResponse.filter((bid) => bid[1].bidder === address)
          setMyBids(myBids)
          setBidStatusMap(bidStatusMap)
          console.log('My Bids', myBids)
        }
        else{
          setMyBids([])
        }
      } catch (error) {
        console.error('Error fetching my bids: ', error)
      }
    }
  }
  window.addEventListener('keplr_keystorechange', async () => {
    const {user,error}= await getUser();
    localStorage.setItem('walletaddress', user)
    setWalletAddress(localStorage.getItem('walletaddress'))
  })
  useEffect(() => {
    fetchMyBids()
    FetchDealDetails();
  }, [id, dealData, walletAddress, showBidForm])
  const toggleBidForm = () => {
    setShowBidForm(!showBidForm)
    
  }

  const handlePlaceBid = async () => {
    setShowBidForm(false)
    FetchDealDetails();
  }
  const handleCancel = () => {
    console.log('Bid canceled!')
    // Hide bid form after canceling bid
    setShowBidForm(false)
  }
  const handleBidRemoved = (bidId) => {
    setMyBids(myBids.filter((bid) => bid.id !== bidId))
    setBidStatusMap((prevMap) => {
      const newMap = new Map(prevMap)
      newMap.delete(bidId)
      return newMap
    })
    fetchBidStore()
    fetchMyBids()
    FetchDealDetails();
    // FetchDealDetails();
  }
  const handleDealExecution = () => {
    toast.promise(executeDeal(id), {
      loading: 'Executing Deal...',
      success: (response) => <b>Deal Executed Successfully</b>, // Show the amount value in success message
      error: (error) => <b>{JSON.stringify(error)}</b>
    })
  }
  return (
    <>
      <Header />
      <div className="h-20"></div>
      {showBidForm && (
        <BidForm
          onCancel={handleCancel}
          onPlaceBid={handlePlaceBid}
          dealData={dealData}
          dealId={id}
          bidDenom={bidDenom}
          dealDecimal={dealDecimal}
        />
      )}
      <main className="px-4 md:px-24 mt-5 md:mt-9 mb-9">
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2 md:col-span-1">
            <div className="bg-white px-5 py-5 border border-gray-200 rounded-lg">
              <h4
                className="text-2xl font-medium text-gray-800"
                title="Selling 1,000,000 ATOMs in exchange for USDT"
              >
                {/* Selling 1,000,000 ATOMs in exchange for USDT */}
                {dealData && dealData.deal_title}
              </h4>

              <div className="mt-2 flex flex-wrap items-start">
                {isLive && (
                  <div className="inline-flex items-center justify-center text-green-600 rounded text-sm mr-2.5 mb-2.5">
                    <div className="relative flex items-center justify-center">
                      <div className="animate-ping absolute inline-flex h-3 w-3 rounded-full bg-green-400 opacity-75"></div>
                      <div className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></div>
                    </div>
                    <span className="font-medium ml-2">Live</span>
                  </div>
                )}

                {/* <div className="inline-flex items-center justify-center text-green-600 rounded text-sm mr-2.5 mb-2.5">
                  <div className="relative flex items-center justify-center">
                  
                    <div className="animate-ping absolute inline-flex h-3 w-3 rounded-full bg-green-400 opacity-75"></div>
                    <div className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></div>
                  </div>
                  <span className="font-medium ml-2">Live</span>
                </div> */}
                <span className="border border-gray-300 rounded-lg text-sm px-3 py-0.5 mr-1.5 mb-2.5 text-neutral-700 flex items-center">
                  {/* <i className="fa-solid fa-dollar-sign text-xs mr-1"></i>   */}
                  <img
                    src={icons[dealData && dealData.bid_token_denom]}
                    alt={dealData && dealData.bid_token_denom}
                    className="inline-block w-4 h-4 mr-1"
                  />
                  {/* min 1,000 USDT */}
                  min {dealData && dealData.min_price} {bidDenom != null && bidDenom}
                </span>
                <span className="border border-gray-300 rounded-lg text-sm px-3 py-0.5 mr-1.5 mb-2.5 text-neutral-600 flex items-center">
                  <i className="fa-regular fa-clock text-xs mr-1"></i>
                  {expireTime && expireTime != 0 ? <>bidding {expireTime}</> : <>bidding closed</>}
                </span>
              </div>

              <p className="mt-6 text-gray-700 text-base text-pretty text-start">
                {/* Dive into a unique opportunity to acquire 1,000,000 ATOM tokens, a cornerstone asset in the rapidly evolving cosmos of digital currencies. This exclusive offer allows you to exchange your USDT for ATOMs, providing a seamless gateway to engage with a network designed for interoperability and scalability. Leverage this chance to enhance your portfolio with ATOMs, known for their pioneering role in connecting diverse blockchains. Take advantage of the stability and liquidity of USDT while securing a position in the groundbreaking ecosystem of ATOM, setting the stage for potential growth and innovation in your investments. */}
                {dealData && dealData.deal_description}
              </p>
              <div className="w-full mt-5 flex">
                <p className="w-1/2 md:w-1/3 font-['Raleway']  text-start">Deal Token Amount</p>
                <div className="text-gray-600 font-medium ml-1">
                  {/* 78%/60% */}
                  {dealData && dealData.deal_token_amount / 10 ** dealDecimal}
                </div>
                <div className="text-gray-600 font-medium ml-1">
                  {/* 78%/60% */}
                  {dealData && dealDenom}
                </div>
              </div>
              <div className="w-full mt-5 flex items-start">
                <p className="w-1/2 md:w-1/3 font-['Raleway'] text-start">Expected result</p>
                <div
                  className={
                    dealData && expectedResult
                      ? 'text-green-600 rounded-lg font-medium ml-2'
                      : 'text-red-600 rounded-lg font-medium ml-2'
                  }
                >
                  <i
                    className={
                      dealData && expectedResult
                        ? 'fas fa-check-circle mr-1'
                        : 'fas fa-times-circle mr-1'
                    }
                  />
                  {dealData && expectedResult ? 'will be executed' : 'will not be executed'}
                </div>
              </div>
              <div className="w-full mt-5 flex items-start">
                <p className="w-1/2 md:w-1/3 font-['Raleway'] text-start">Turnout/mincap</p>
                <div className="text-gray-600 font-medium ml-4">
                  {/* 78%/60% */}
                  {dealData && dealData.min_cap}
                </div>
                <div className="text-gray-600 font-medium ml-1">
                  {/* 78%/60% */}
                  {dealData && dealDenom}
                </div>
              </div>
              <div className="w-full mt-5 flex items-center">
                <p className="w-1/2 md:w-1/3 font-['Raleway'] text-start">Progress</p>
                <div className="px-2 md:px-14 w-full font-medium">
                  <div className="flex items-center">
                    <div className="w-full bg-gray-200 rounded-full h-3 relative">
                      {dealData&&<div
                        className="bg-green-500 h-3 rounded-full"
                        style={{ width: `${progress}%` }}
                      ></div>}
                    </div>
                    <span className="ml-2 text-xs text-gray-600">{progress&&progress.toFixed(0)}%</span>
                  </div>
                  <div className="text-xs text-gray-600 mt-1">
                    {expireTime && expireTime != 0 ? <>{expireTime}</> : <>Expired</>} |{' '}
                    {expireDate}
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-5 bg-white px-5 py-3 border border-gray-200 rounded-lg h-[400px]">
              <div className="grid">
                {bidStoreData && <BidsOverview data={bidStoreData} deal_decimal={dealDecimal} />}
                {/* <div className="">
                  <h4 className="text-lg">Bids overview</h4>

                  <div className="mt-4 bg-emerald-50 h-44"></div>
                </div> */}
                {/* <div className="">
                  <h4 className="text-lg">Bid settlement</h4>

                  <div className="mt-4 bg-cyan-50 h-44"></div>
                </div> */}
              </div>
            </div>
          </div>

          <div className="col-span-2 md:col-span-1 py-5 md:px-7">
            <div className="px-2 md:px-0">
              <h4 className="text-xl font-medium text-black/80">
                Dealer price: 1 {dealData && dealDenom} = {dealData && dealData.min_price}{' '}
                {dealData && bidDenom}
              </h4>
              {percentageDifference && percentageDifference > 5 ? (
                <>
                  <p className="text-red-600">
                    {percentageDifference && Math.abs(percentageDifference).toFixed(2)}%{' '}
                    {percentageDifference > 0 ? 'higher' : 'lower'} than the market rate.
                    {/* 20% lower than market price */}
                  </p>
                </>
              ) : (
                <>
                  <p className="text-gray-600">
                    {percentageDifference && Math.abs(percentageDifference).toFixed(2)}%{' '}
                    {percentageDifference > 0 ? 'higher' : 'lower'} than the market rate.
                    {/* 20% lower than market price */}
                  </p>
                </>
              )}

              {loading ? (
                <button
                  className="mt-4 w-full md:w-2/3 border py-1.5 rounded-xl border border-rose-500 text-rose-600"
                  disabled
                >
                  Loading...
                </button>
              ) : dealData && dealExecuted ? (
                <button className="mt-4 w-full md:w-2/3 border py-1.5 rounded-xl border border-rose-500  text-rose-600">
                  Deal Executed
                </button>
              ) : dealData && latestBlockHeight && latestBlockHeight >= dealData.end_block ? (
                <button
                  onClick={handleDealExecution}
                  className="mt-4 w-full md:w-2/3 border py-1.5 rounded-xl border border-rose-500 hover:bg-rose-500 text-rose-600 hover:text-white"
                >
                  Execute Deal
                </button>
              ) : isLive && isLive ? (
                <button
                  onClick={toggleBidForm}
                  className="mt-4 w-full md:w-2/3 border py-1.5 rounded-xl border border-green-500 hover:bg-green-500 text-white-600"
                >
                  Place new bid
                </button>
              ) : (
                <button className="mt-4 w-full md:w-2/3 border py-1.5 rounded-xl border border-green-500 text-white-600">
                  Place new bid
                </button>
              )}
            </div>

            <div className="overflow-x-auto border border-gray-300 rounded-lg mt-9 bg-white">
              <h4 className="text-lg font-medium text-black/80 p-5 text-left">
                <i className="fa-solid fa-user-check mr-1"></i>
                Your bids
              </h4>

              <div className="min-w-full text-sm text-left text-gray-800 mb-4">
                {/* <div className="border-t border-gray-200">
                  <div className="bg-white flex justify-between items-center px-6 py-3">
                    <div className="w-1/3">$1000</div>
                    <div className="w-1/3">$10.50</div>
                    <div className="w-1/3">
                      <button className="px-5 py-1 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-200 flex items-center">
                        <i className="fa-solid fa-xmark mr-2"></i>
                        Remove
                      </button>
                    </div>
                  </div>
                  <div className="flex px-6 pb-2">
                    <div className="text-gray-500 flex-grow">
                      <span>
                        <i className="fa-regular fa-clock text-xs mr-1"></i>
                        20 mins ago
                      </span>
                      <span className="ml-4 text-blue-600">might not win due to high demand</span>
                    </div>
                  </div>
                </div>
                <div className="border-t border-gray-200">
                  <div className="bg-white flex justify-between items-center px-6 py-3">
                    <div className="w-1/3">$1000</div>
                    <div className="w-1/3">$10.50</div>
                    <div className="w-1/3">
                      <button className="px-5 py-1 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-200 flex items-center">
                        <i className="fa-solid fa-xmark mr-2"></i>
                        Remove
                      </button>
                    </div>
                  </div>
                  <div className="flex px-6 pb-2">
                    <div className="text-gray-500 flex-grow">
                      <span>
                        <i className="fa-regular fa-clock text-xs mr-1"></i>
                        20 mins ago
                      </span>
                      <span className="ml-4 text-blue-600">might not win due to high demand</span>
                    </div>
                  </div>
                </div> */}

                {myBids.length === 0 ? (
                  <p className="text-gray-500 text-sm py-8 text-center">No bids placed yet.</p>
                ) : (
                  <>
                    <div className="text-xs text-gray-700 uppercase bg-gray-50 flex justify-between px-6 py-3 font-semibold">
                      <div className="w-1/3">Quantity</div>
                      <div className="w-1/3">Bid price</div>
                      <div className="w-1/3">Actions</div>
                    </div>
                    {myBids.map((bid) => (
                      <BidItem
                        key={bid[0]}
                        bid={bid[1]}
                        bidId={bid[0]}
                        dealId={id}
                        onBidRemoved={handleBidRemoved}
                        dealDenom={dealData.deal_token_denom}
                        isWinning={bidStatusMap.get(bid[0])}
                        deal_Decimal={dealDecimal}
                      />
                    ))}
                  </>
                )}
              </div>
            </div>

            <div className="overflow-x-auto border border-gray-300 rounded-lg mt-5 bg-white">
              <h4 className="text-lg font-medium text-black/80 p-5 text-left">
                <i className="fa-solid fa-check-double mr-1"></i>
                All bids
              </h4>
              <table className="min-w-full table-auto text-sm text-left text-gray-800">
                {bidStoreData?.length > 0 ? (
                  <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                    <tr>
                      <th scope="col" className="py-3 px-6">
                        Type
                      </th>
                      <th scope="col" className="py-3 px-6">
                        Quantity
                      </th>
                      <th scope="col" className="py-3 px-6">
                        Bid price
                      </th>
                      <th scope="col" className="py-3 px-6">
                        From
                      </th>
                      <th scope="col" className="py-3 px-6">
                        Date
                      </th>
                    </tr>
                  </thead>
                ) : (
                  <></>
                )}

                <tbody>
                  {/* {
                activityLoading ? (
                  <div class="mx-auto text-center">
                    <b>Activity Store Loading...</b>
                  </div>
                ) :(
                bidStoreData.length <= 0 ? (
                  <div class="mx-auto text-center">
                    <b>No bids placed yet.</b>
                  </div>
                ) : (
                  // <div>Data retrieved</div>
                  bidStoreData&&bidStoreData.map((bid) => (
                    <ActivityItem
                      bid={bid[1]}
                    />
                  ))
                ))} */}
                  {/* {
                JSON.stringify(bidStoreData)
                } */}
                  {activityLoading ? (
                    <p>Loading activities...</p>
                  ) : bidStoreData?.length > 0 ? (
                    bidStoreData?.map((bid, index) => {
                      return (
                        <ActivityItem
                          key={index}
                          bid={bid[1]}
                          dealDenom={dealData.deal_token_denom}
                          deal_Decimal={dealDecimal}
                        />
                      )
                    })
                  ) : (
                    <p className="text-gray-500 text-sm py-8 text-center">No activities yet.</p>
                  )}

                  {/* <tr className="bg-white border-b hover:bg-slate-50">
                    <td className="py-4 px-6">
                      <span className="border border-slate-100 px-3 py-0.5 rounded-lg bg-zinc-200 text-gray-600 font-medium">
                        Bid
                      </span>
                    </td>
                    <td className="py-4 px-6">$1000</td>
                    <td className="py-4 px-6">$10.50</td>
                    <td className="py-4 px-6">
                      <a href="#" className="text-rose-600">
                        deotcabc..xyz
                      </a>
                    </td>
                    <td className="py-4 px-6">2h</td>
                  </tr>
                  <tr className="bg-white border-b hover:bg-slate-50">
                    <td className="py-4 px-6">
                      <span className="border border-slate-100 px-3 py-0.5 rounded-lg bg-zinc-200 text-gray-600 font-medium">
                        Bid
                      </span>
                    </td>
                    <td className="py-4 px-6">$2100</td>
                    <td className="py-4 px-6">$11.50</td>
                    <td className="py-4 px-6">
                      <a href="#" className="text-rose-600">
                        deotc123..xyz
                      </a>
                    </td>
                    <td className="py-4 px-6">3h</td>
                  </tr>
                  <tr className="bg-white border-b hover:bg-slate-50">
                    <td className="py-4 px-6">
                      <span className="border border-slate-100 px-3 py-0.5 rounded-lg bg-zinc-200 text-gray-600 font-medium">
                        Remove
                      </span>
                    </td>
                    <td className="py-4 px-6">$1900</td>
                    <td className="py-4 px-6">$11.10</td>
                    <td className="py-4 px-6">
                      <a href="#" className="text-rose-600">
                        deotc123..999
                      </a>
                    </td>
                    <td className="py-4 px-6">3h</td>
                  </tr>
                  <tr className="bg-white border-b hover:bg-slate-50">
                    <td className="py-4 px-6">
                      <span className="border border-slate-100 px-3 py-0.5 rounded-lg bg-zinc-200 text-gray-600 font-medium">
                        Bid
                      </span>
                    </td>
                    <td className="py-4 px-6">$1900</td>
                    <td className="py-4 px-6">$11.10</td>
                    <td className="py-4 px-6">
                      <a href="#" className="text-rose-600">
                        deotc123..999
                      </a>
                    </td>
                    <td className="py-4 px-6">3h</td>
                  </tr>
                  <tr className="bg-white border-b hover:bg-slate-50">
                    <td className="py-4 px-6">
                      <span className="border border-slate-100 px-3 py-0.5 rounded-lg bg-zinc-200 text-gray-600 font-medium">
                        Bid
                      </span>
                    </td>
                    <td className="py-4 px-6">$2700</td>
                    <td className="py-4 px-6">$11.00</td>
                    <td className="py-4 px-6">
                      <a href="#" className="text-rose-600">
                        deotc123..456
                      </a>
                    </td>
                    <td className="py-4 px-6">3h</td>
                  </tr> */}
                </tbody>
              </table>
            </div>
          </div>
          {/* <Toaster
            toastOptions={{
              // Define default options
              className: '',
              duration: 5000,
              style: {
                background: '#239023',
                color: '#fff'
              },
              // Default options for specific types
              success: {
                style: {
                  background: 'green',
                },
              },
              error: {
                style: {
                  background: 'red',
                },
              },
            }}            
            position="top-right"
            width="550px"
            reverseOrder={false}
          /> */}
        </div>
      </main>
    </>
  )
}

export default Bid
