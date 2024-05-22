import { useParams } from 'react-router-dom'
import Header from './components/Header'
import { getDeal } from './contractcalls/getdeal'
import { useState } from 'react'
import { useEffect } from 'react'
import BidForm from './BidForm'
import toast, { Toaster } from 'react-hot-toast'
import { getLatestBlockHeight } from './utils/util'
import { executeDeal } from './contractcalls/executeDeal'
import { getBidStore } from './contractcalls/getBidStore'
import BidItem from './ BidItem'
import ActivityItem from './ActivityItem'
const Bid = () => {
  const { id } = useParams()
  const [dealData, setDealData] = useState(null)
  const [showBidForm, setShowBidForm] = useState(false)
  const [bidStoreData, setBidStoreData] = useState([])
  const [latestBlockHeight, setLatestBlockHeight] = useState(null)
  const [dealExecuted, setDealExecuted] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activityLoading, setActivityLoading] = useState(true)
  const [myBids, setMyBids] = useState([])

  useEffect(() => {
    const fetchDeal = async () => {
      try {
        const result = await getDeal(id)
        setDealData(result.deal)
        setLoading(false)
      } catch (e) {
        console.log(e.message)
      }
    }
    fetchDeal()
  }, [id])

  useEffect(() => {
    const fetchLatestBlockHeight = async () => {
      try {
        const result = await getLatestBlockHeight()
        setLatestBlockHeight(result)
      } catch (e) {
        console.log(e.message)
      }
    }

    if (dealData) {
      if (dealData.deal_status === 'Completed') {
        setDealExecuted('Completed')
      } else {
        fetchLatestBlockHeight()
      }
    }
  }, [dealData])

  useEffect(() => {
    const fetchBidStore = async () => {
      try {
        const {bids: bidsResponse, error} = await getBidStore(id)
        console.log("len",bidsResponse.length);
        if(bidsResponse.length>0){
          setBidStoreData(bidsResponse)
          setActivityLoading(false)
        }
      } catch (e) {
        console.log(e.message)
      }
    }
    fetchBidStore()
  }, [id])

  useEffect(() => {
    const fetchMyBids = async () => {
      const address = localStorage.getItem('walletaddress')
      if (address) {
        try {
          const {bids: bidsResponse, error} = await getBidStore(id)
          if(bidsResponse.length>0){
           const myBids = bidsResponse.filter((bid) => bid[1].bidder === address)
           setMyBids(myBids)
          }
        } catch (error) {
          console.error('Error fetching my bids: ', error)
        }
      }
    }
    fetchMyBids()
  }, [dealData])
  const toggleBidForm = () => {
    setShowBidForm(!showBidForm)
  }

  const handlePlaceBid = async () => {
    setShowBidForm(false)
  }
  const handleCancel = () => {
    console.log('Bid canceled!')
    // Hide bid form after canceling bid
    setShowBidForm(false)
  }
  const handleBidRemoved = (bidId) => {
    setMyBids(myBids.filter((bid) => bid.id !== bidId))
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

              <div className="mt-2 flex flex-wrap">
                <div className="inline-flex items-center justify-center text-green-600 rounded text-sm mr-2.5 mb-2.5">
                  <div className="relative flex items-center justify-center">
                    <div className="animate-ping absolute inline-flex h-3 w-3 rounded-full bg-green-400 opacity-75"></div>
                    <div className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></div>
                  </div>
                  <span className="font-medium ml-2">Live</span>
                </div>
                <span className="border border-gray-300 rounded-lg text-sm px-3 py-0.5 mr-1.5 mb-2.5 text-neutral-700 flex items-center">
                  <i className="fa-solid fa-dollar-sign text-xs mr-1"></i>
                  {/* min 1,000 USDT */}
                  min {dealData && dealData.min_price}
                </span>
                <span className="border border-gray-300 rounded-lg text-sm px-3 py-0.5 mr-1.5 mb-2.5 text-neutral-600 flex items-center">
                  <i className="fa-regular fa-clock text-xs mr-1"></i>
                  bidding closes in 28d 22h
                </span>
              </div>

              <p className="mt-6 text-gray-700 text-base text-pretty">
                {/* Dive into a unique opportunity to acquire 1,000,000 ATOM tokens, a cornerstone asset in the rapidly evolving cosmos of digital currencies. This exclusive offer allows you to exchange your USDT for ATOMs, providing a seamless gateway to engage with a network designed for interoperability and scalability. Leverage this chance to enhance your portfolio with ATOMs, known for their pioneering role in connecting diverse blockchains. Take advantage of the stability and liquidity of USDT while securing a position in the groundbreaking ecosystem of ATOM, setting the stage for potential growth and innovation in your investments. */}
                {dealData && dealData.deal_description}
              </p>

              <div className="w-full mt-9 flex items-center">
                <p className="w-1/2 md:w-1/3 font-['Raleway']">Expected result</p>
                <div className="text-green-600  rounded-lg font-medium">
                  <i className="fas fa-check-circle mr-1" />
                  will be executed
                </div>
              </div>
              <div className="w-full mt-5 flex items-center">
                <p className="w-1/2 md:w-1/3 font-['Raleway']">Turnout/mincap</p>
                <div className="text-gray-600 font-medium">
                  {/* 78%/60% */}
                  {dealData && dealData.min_cap}
                </div>
              </div>
              <div className="w-full mt-5 flex items-center">
                <p className="w-1/2 md:w-1/3 font-['Raleway']">Progress</p>
                <div className="text-gray-600 px-2 md:px-14 w-full font-medium">
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div className="bg-green-500 h-3 rounded-full" style={{ width: '60%' }}></div>
                  </div>
                  <span className="text-xs text-gray-600">
                    Expires in 28d 22h | April 18, 2024 at 4:30 PM
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-5 bg-white px-5 py-3 border border-gray-200 rounded-lg">
              <div className="grid grid-cols-2 gap-4">
                <div className="">
                  <h4 className="text-lg">Bids overview</h4>

                  <div className="mt-4 bg-emerald-50 h-44"></div>
                </div>
                <div className="">
                  <h4 className="text-lg">Bid settlement</h4>

                  <div className="mt-4 bg-cyan-50 h-44"></div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-span-2 md:col-span-1 py-5 md:px-7">
            <div className="px-2 md:px-0">
              <h4 className="text-xl font-medium text-black/80">
                Average price: 1 ATOM = 11.00 USDT
              </h4>
              <p className="text-gray-600">20% lower than market price</p>

              {loading ? (
                <button
                  className="mt-4 w-full md:w-2/3 border py-1.5 rounded-xl border border-rose-500 text-rose-600"
                  disabled
                >
                  Loading...
                </button>
              ) : dealData && dealExecuted ? (
                <button className="mt-4 w-full md:w-2/3 border py-1.5 rounded-xl border border-rose-500 hover:bg-rose-500 text-rose-600 hover:text-white">
                  Deal Executed
                </button>
              ) : dealData && latestBlockHeight && latestBlockHeight >= dealData.end_block ? (
                <button
                  onClick={handleDealExecution}
                  className="mt-4 w-full md:w-2/3 border py-1.5 rounded-xl border border-rose-500 hover:bg-rose-500 text-rose-600 hover:text-white"
                >
                  Execute Deal
                </button>
              ) : (
                <button
                  onClick={toggleBidForm}
                  className="mt-4 w-full md:w-2/3 border py-1.5 rounded-xl border border-rose-500 hover:bg-rose-500 text-rose-600 hover:text-white"
                >
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
                <div className="text-xs text-gray-700 uppercase bg-gray-50 flex justify-between px-6 py-3 font-semibold">
                  <div className="w-1/3">Amount</div>
                  <div className="w-1/3">Bid price</div>
                  <div className="w-1/3">Actions</div>
                </div>
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
                  <div class="mx-auto text-center">
                    <b>No bids placed yet.</b>
                  </div>
                ) : (
                  myBids.map((bid) => (
                    <BidItem
                      key={bid[0]}
                      bid={bid[1]}
                      bidId={bid[0]}
                      dealId={id}
                      onBidRemoved={handleBidRemoved}
                    />
                  ))
                )}
              </div>
            </div>

            <div className="overflow-x-auto border border-gray-300 rounded-lg mt-5 bg-white">
              <h4 className="text-lg font-medium text-black/80 p-5 text-left">
                <i className="fa-solid fa-check-double mr-1"></i>
                Activity
              </h4>
              <table className="min-w-full table-auto text-sm text-left text-gray-800">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                  <tr>
                    <th scope="col" className="py-3 px-6">
                      Type
                    </th>
                    <th scope="col" className="py-3 px-6">
                      Amount
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
                      console.log('----')
                      console.log(bid[1])
                      return <ActivityItem key={index} bid={bid[1]} />
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
          <Toaster />
        </div>
      </main>
    </>
  )
}

export default Bid
