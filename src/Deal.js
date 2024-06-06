import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import { useState, useRef } from "react";
import { useAllDeals } from "./hooks/useAllDeals";
import icons from './assets/icons.json';
import moment from "moment";
import { useEffect } from "react";
import { getUser } from './GetUser';
import { getLatestBlockHeight } from "./utils/util";
import { fetchTokenDenom } from './utils/getDecimalByDenom';

const Deal = ({ dealId, dealDetails }) => {
  const { user, response, latestblockHeight } = useAllDeals();
  const [latestBlockHeight, setLatestBlockHeight] = useState(null)
  // const [setLatestBlockHeight] = useState(null);
  // const [getLatestBlockHeight]= useState(null);
  const [status,setStatus] =useState({
    statusText:'',
    statusClass:'',
    dotClass:''
  })
  const intervalRef = useRef(null)
  const [expireTime, setExpireTime] = useState(null)
  const [expireDate, setExpireDate] = useState(null)
  const [upcomingDate, setUpcomingDate] = useState(null)
  const [isLive, setIsLive] = useState(false)
  const [progress, setProgress] = useState(null)
  const [upcomingTime, setUpcomingTime] = useState(null);
  const [waiting, setWaiting] = useState(false);
  const [dealTokenDenom, setDealTokenDenom] = useState(null);
  const [bidTokenDenom, setBidTokenDenom] = useState(null);
  const [dealDecimal,setDealDecimal] = useState(1);

  const { start_block, end_block, deal_title, deal_creator, deal_token_denom, bid_token_denom, min_cap, total_bid } = dealDetails;
  //  console.log("Component",dealId,dealDetails);
  useEffect(() => {
    const fetchTokenData = async () => {
      const dealDenom = await fetchTokenDenom(deal_token_denom);
      const bidDenom = await fetchTokenDenom(bid_token_denom);
      setDealTokenDenom(dealDenom);
      setBidTokenDenom(bidDenom);
      setDealDecimal(dealDenom.decimal || 1);
    };

    if (dealDetails) {
      fetchTokenData();

      const progressbar = (dealDetails.total_bid / dealDetails.deal_token_amount) * 100
      const limitedProgress = Math.min(progressbar, 100);
      setProgress(limitedProgress)
      
      fetchLatestBlockHeight()
    }
  }, [dealDetails])

  const fetchLatestBlockHeight = async () => {
    try {
      const latestBlockHeight = await getLatestBlockHeight()
      setLatestBlockHeight(latestBlockHeight)
      updateTimers(latestBlockHeight);
      setTimeout(() => {
        setWaiting(false);
      }, 1000);
    } catch (e) {
      console.error(e.message);
    }
  };


  const updateTimers = (latestBlockHeight) => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    
    if (latestBlockHeight < start_block) {
      calculateUpcomingTime(latestBlockHeight);
    } else if (latestBlockHeight >= start_block && latestBlockHeight <= end_block) {
      calculateExpireTime(latestBlockHeight);
    }
    console.log("here>>...",status)
  };


  const calculateExpireTime = (latestBlockHeight) => {
    let remainingSeconds = (dealDetails.end_block - latestBlockHeight) * 5;

      intervalRef.current = setInterval(() => {
        if (remainingSeconds <= 0) {
          clearInterval(intervalRef.current);
          setExpireTime(0);
          return;
        }

      const duration = moment.duration(remainingSeconds, 'seconds');
      const days = Math.floor(duration.asDays());
      const hours = duration.hours();
      const minutes = duration.minutes();
      const seconds = duration.seconds();

      let formattedTime = '';
      if (days > 0) formattedTime += `${days} ${days === 1 ? 'day' : 'days'} `;
      if (hours > 0) formattedTime += `${hours} h `;
      if (minutes > 0) formattedTime += `${minutes} m `;
      if (seconds > 0) formattedTime += `${seconds} s`;

      setExpireTime(formattedTime.trim());
      remainingSeconds -= 1;
    }, 1000);
   
  };

  const calculateUpcomingTime = (latestBlockHeight) => {
    let upcomingSeconds = (dealDetails.start_block - latestBlockHeight) * 5;

      intervalRef.current = setInterval(() => {
        if (upcomingSeconds <= 0) {
          clearInterval(intervalRef.current);
          setUpcomingTime(null);
          setWaiting(true);
          
          fetchLatestBlockHeight();
        
          return;
        }

      const duration = moment.duration(upcomingSeconds, 'seconds');
      const days = Math.floor(duration.asDays());
      const hours = duration.hours();
      const minutes = duration.minutes();
      const seconds = duration.seconds();

      let formattedTime = '';
      if (days > 0) formattedTime += `${days} ${days === 1 ? 'day' : 'days'} `;
      if (hours > 0) formattedTime += `${hours} h `;
      if (minutes > 0) formattedTime += `${minutes} m `;
      if (seconds > 0) formattedTime += `${seconds} s`;

      setUpcomingTime(formattedTime.trim());
      upcomingSeconds -= 1;
    }, 1000);
  };

  useEffect(()=>{
    let statusClass = 'text-yellow-500';
    let dotClass = 'hidden';
    let localStatus = ''
    if (latestBlockHeight < start_block) {
     
      localStatus= 'Upcoming'
      statusClass = 'text-yellow-500';
      dotClass = 'hidden';
    } else if (start_block <= latestBlockHeight && latestBlockHeight <= end_block) {
      localStatus= 'Live'
      statusClass = 'text-green-600';
      dotClass = 'relative inline-flex rounded-full h-2 w-2 bg-green-500';
    } else {
      localStatus= 'Completed';
      statusClass = 'text-blue-600';
      dotClass = 'hidden';
    }
    setStatus({
      statusText:localStatus,
      statusClass,
      dotClass
    })
   
  },[latestBlockHeight, start_block,end_block])

  let dealMessage = '';
  if (status.statusText === 'Live') 
    {
    if (parseInt(total_bid) >= parseInt(min_cap)) {
      dealMessage = 'Deal will execute';
    } else {
      dealMessage = 'Deal will fail';
    }
  }
  else if(status.statusText === 'Completed')
  {
      if (parseInt(total_bid) >= parseInt(min_cap)) 
        {
        dealMessage = 'Deal executed';
       } else {
        dealMessage = 'Deal failed';
       }
  }



  const totalBidConverted = (parseInt(total_bid) / (10 ** dealDecimal)).toFixed(dealDecimal);
  const formattedTotalBid = totalBidConverted.toLocaleString('en-US', { maximumFractionDigits: 20 }).replace(/\.?0+$/, '');


  return (
    <>
      <div className="col-span-1 bg-white w-full border border-gray-200 rounded-lg p-4 relative">
        <div className="flex  mb-1 justify-between">
          <div className="flex ">

            <span className="border border-gray-300 rounded-lg text-sm px-3 py-0.5 mr-1.5 text-neutral-600 flex items-center">
              <div className="text-xs text-slate-500 mr-3">
                {dealTokenDenom ? (
                  <>
                    <img src={icons[deal_token_denom]} alt={deal_token_denom} className="inline-block w-4 h-4 mr-1" />
                    {dealTokenDenom.denom}
                  </>
                ) : 'Loading...'}
              </div>
            </span>
            <span className="border border-gray-300 rounded-lg text-sm px-3 py-0.5 mr-1.5 text-neutral-600 flex items-center">
              <div className="text-xs text-slate-500 mr-3">
                {bidTokenDenom ? (
                  <>
                    <img src={icons[bid_token_denom]} alt={bid_token_denom} className="inline-block w-4 h-4 mr-1" />
                    {bidTokenDenom.denom}
                  </>
                ) : 'Loading...'}
              </div>
            </span>

          </div>
          <div className="inline-flex items-center justify-center text-white rounded text-xs items-end space-x-2">
            <div className={`relati
             ve flex items-center justify-center  ${status.dotClass}`}>
              <div className="animate-ping absolute inline-flex h-3 w-3 rounded-full bg-green-400 opacity-75"></div>
              <div className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></div>
            </div>
            <span className={`text-base text-left ${status.statusClass}`}>
              {status.statusText}
            </span>
          </div>


        </div>
        <Link to={`/deal/${dealId}`} className="text-gray-700 py-4 hover:text-black flex justify-start">
          <h4 className="text-xl font-medium truncate" title={dealDetails.deal_title}>
            {dealDetails.deal_title}
          </h4>
        </Link>
        <div className="flex space-x-1">
          <div className="text-xs text-black">Seller:</div>
          <a href="#" className="text-rose-600 hover:text-rose-700 text-xs flex justify-start truncate" title={dealDetails.deal_creator}>
            {dealDetails.deal_creator.substring(0, 20)}...{dealDetails.deal_creator.substring(dealDetails.deal_creator.length - 4)}
          </a>
        </div>

        <div className="mt-4 flex justify-start">
          <span className="border border-gray-300 rounded-lg text-sm px-3 py-0.5 mr-1.5 flex items-center">
            <i className="fa-regular fa-clock text-xs mr-1"></i>
            {status.statusText === 'Upcoming' && dealDetails && upcomingTime
              ? <p className="text-lg text-zinc-500 text-center font-medium animate-pulse">bidding starts in {upcomingTime}</p>
              : status.statusText === 'Live' && dealDetails && expireTime
                ? <span className="text-neutral-600 ">bidding closes in {expireTime}</span>
                : <span className="text-neutral-600 ">{waiting? "Please wait...":"bidding closed"}</span>}
          </span>
        </div>

        <div className="mt-6">
          <div className="flex flex-row">
            <p className="text-sm text-gray-700 mb-1">
              Deal subscription
            </p>
            <p className="ml-auto text-sm text-gray-500">
              {progress}%
            </p>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${progress}%` }}></div>
          </div>
        </div>

        <div className="mt-7 grid grid-cols-2 ">
          <div className="flex flex-col ">
            <p className="text-xs text-gray-500">
              Min cap
            </p>
            <h4 className="text-gray-700 font-medium">
              {dealDetails.min_cap}
            </h4>
          </div>
          <div className="flex flex-col ">
            <p className="text-xs text-gray-500">
              Total bids
            </p>
            <h4 className="text-gray-700 font-medium">
              {formattedTotalBid}
            </h4>
          </div>
        </div>
        <div className="mt-7 mb-1 flex justify-start">
          {dealMessage === 'Deal executed'? (
            <p className="text-green-600 text-sm">
              <i className="fa-solid fa-rocket mr-1"></i>
              <span className="font-medium">
                {dealMessage}
              </span>
            </p>
          ) : dealMessage === 'Deal failed'? (
          <p className="text-red-600 text-sm">
          <i className="fa-solid fa-person-falling mr-1"></i>
          <span className="font-medium">
            {dealMessage}
          </span>
        </p> 
        ) : dealMessage === 'Deal will execute'? (
          <p className="text-green-600 text-sm">
          <i className="fa-solid fa-rocket mr-1"></i>
          <span className="font-medium">
            {dealMessage}
          </span>
        </p> 
        ): dealMessage === 'Deal will fail'?(
            <p className="text-red-600 text-sm">
              <i className="fa-solid fa-person-falling mr-1"></i>
              <span className="font-medium">
                {dealMessage}
              </span>
            </p>
          ):
          null
          }
        </div>
      </div>
    </>
  );
}
export default Deal;