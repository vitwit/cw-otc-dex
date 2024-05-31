import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import { useState ,useRef} from "react";
import { useAllDeals } from "./hooks/useAllDeals";
import icons from './assets/icons.json';
import moment from "moment";
import { useEffect } from "react";
import { getLatestBlockHeight } from "./utils/util";
const Deal = ({ dealId, dealDetails }) => {
  const { user, response, latestblockHeight } = useAllDeals();
  const [latestBlockHeight, setLatestBlockHeight] = useState(null)
  // const [setLatestBlockHeight] = useState(null);
  // const [getLatestBlockHeight]= useState(null);
  const intervalRef = useRef(null)
  const [expireTime, setExpireTime] = useState(null)
  const [expireDate, setExpireDate] = useState(null)
  const [upcomingDate,setUpcomingDate] = useState(null)
  const [isLive, setIsLive] = useState(false)
  const [progress, setProgress] = useState(null)
  const [upcomingTime, setUpcomingTime] = useState(null);
  const { start_block, end_block, deal_title, deal_creator, deal_token_denom, bid_token_denom, min_cap, total_bid } = dealDetails;
  // console.log("start block for status:",start_block);
  // console.log("current block height for status is:",latestBlockHeight);
  //  console.log("Component",dealId,dealDetails);
  useEffect(() => {
    const fetchLatestBlockHeight = async () => {
      try {
        const latestBlockHeight = await getLatestBlockHeight()
        setLatestBlockHeight(latestBlockHeight)

        if (latestBlockHeight >= dealDetails.end_block || latestBlockHeight <= dealDetails.start_block) {
          setIsLive(false)
        } else {
          setIsLive(true)
        }
        if (latestBlockHeight !== null && dealDetails.end_block !== null) {
          console.log("Upcoming Seconds:",dealDetails , latestBlockHeight,dealDetails.start_block - latestBlockHeight); 
          let remainingSeconds = (dealDetails.end_block - latestBlockHeight) * 5
          console.log("remaining seconds:",remainingSeconds);

          if (remainingSeconds <= 0) {
            // Deal has expired
            setExpireTime(0)
            const expirationDate = moment().add(remainingSeconds, 'seconds')
            setExpireDate(expirationDate.format('MMMM D, YYYY [at] h:mm A'))
            // setExpireDate(moment().format('MMMM D, YYYY [at] h:mm:ss A'));
            clearInterval(intervalRef.current)
          } else {
            const expirationDate = moment().add(remainingSeconds, 'seconds')
            setExpireDate(expirationDate.format('MMMM D, YYYY [at] h:mm A'))
            if(intervalRef.current){
              clearInterval(intervalRef.current);      
            }
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

              // Trim any trailing whitespace
              formattedTime = formattedTime.trim()

              // Set the remaining time
              setExpireTime(formattedTime)
              remainingSeconds -= 1
            }, 1000)
            return () => clearInterval(intervalRef.current)
          }
        }  

        // Calculate upcoming time
  if (latestBlockHeight !== null && dealDetails.start_block !== null) {
  let upcomingSeconds = (dealDetails.start_block - latestBlockHeight) * 5;

  if (upcomingSeconds > 0) {
    setUpcomingTime(0)
    const upcomingDate = moment().add(upcomingSeconds, 'seconds')
    setUpcomingDate(upcomingDate.format('MMMM D, YYYY [at] h:mm A'))
    clearInterval(intervalRef.current)
  } else {
    const expirationDate = moment().add(upcomingSeconds, 'seconds')
    setExpireDate(expirationDate.format('MMMM D, YYYY [at] h:mm A'))
    if(intervalRef.current){
      clearInterval(intervalRef.current);      
    }
    intervalRef.current = setInterval(() => {
      if (upcomingSeconds <= 0) {
        clearInterval(intervalRef.current);
        setUpcomingTime(null);
        return;
      }
      const duration = moment.duration(upcomingSeconds, 'seconds');
      const days = Math.floor(duration.asDays());
      const hours = duration.hours();
      const minutes = duration.minutes();
      const seconds = duration.seconds();

      let formattedTime = '';
      if (days > 0) {
        formattedTime += `${days} ${days === 1 ? 'day' : 'days'} `;
      }
      if (hours > 0) {
        formattedTime += `${hours} h `;
      }
      if (minutes > 0) {
        formattedTime += `${minutes} m `;
      }
      if (seconds > 0) {
        formattedTime += `${seconds} s`;
      }

      formattedTime = formattedTime.trim();
      console.log("Formatted Upcoming Time:", formattedTime);
      setUpcomingTime(formattedTime);
      upcomingSeconds -= 1;
    }, 1000)
    return () => clearInterval(intervalRef.current)
  }
}
      } catch (e) {
        console.error(e.message)
      }
    }
    if (dealDetails) {
      const progressbar = (dealDetails.total_bid / dealDetails.deal_token_amount) * 100
      const limitedProgress = Math.min(progressbar, 100);
      setProgress(limitedProgress)

      fetchLatestBlockHeight()
    }
  }, [dealDetails])

  let status = '';
  let statusClass = '';
  let dotClass = '';
  if (latestBlockHeight < start_block) {
    status = 'Upcoming';
    statusClass = 'text-yellow-500';
    dotClass = 'hidden';
  } else if (start_block <= latestBlockHeight && latestBlockHeight <= end_block) {
    status = 'Live';
    statusClass = 'text-green-600';
    dotClass = 'relative inline-flex rounded-full h-2 w-2 bg-green-500';
  } else {
    status = 'Completed';
    statusClass = 'text-blue-600';
    dotClass = 'hidden';
  }

  let dealMessage = '';
  if (status === 'Live') 
    {
    if (total_bid >= min_cap) {
      dealMessage = 'Deal will execute';
    } else {
      dealMessage = 'Deal will fail';
    }
    }
   else   console.log("hii2")
     {
    if (dealDetails.deal_status === 'Active') 
      {
      if (total_bid >= min_cap) {
        dealMessage = 'Deal will execute';
      }   else {
        dealMessage = 'Deal will fail';
      }
      }
     else
     { 
      if(dealId == 3)
      console.log("here------1", total_bid> min_cap)
      if (parseInt(total_bid) >= parseInt(min_cap)) {
      dealMessage = 'Deal will execute';
      console.log("hello", total_bid , min_cap)
      } else {
      dealMessage = 'Deal will fail';
      console.log("hello1")
       }
      }
    }

  return (
    <>
      <div className="col-span-1 bg-white w-full border border-gray-200 rounded-lg p-4 relative">
        <div className="flex flex-row mb-1 justify-start">
        <span className="border border-gray-300 rounded-lg text-sm px-3 py-0.5 mr-1.5 text-neutral-600 flex items-center">
          <div className="text-xs text-slate-500 mr-3">
            <img src={icons[deal_token_denom]} alt={deal_token_denom} className="inline-block w-4 h-4 mr-1" />
            {dealDetails.deal_token_denom}
          </div>
          </span>
          <span className="border border-gray-300 rounded-lg text-sm px-3 py-0.5 mr-1.5 text-neutral-600 flex items-center">
          <div className="text-xs text-slate-500 mr-3">
            <img src={icons[bid_token_denom]} alt={bid_token_denom} className="inline-block w-4 h-4 mr-1" />
            {dealDetails.bid_token_denom}
          </div>
          </span>
          <div className="inline-flex items-center justify-center text-white rounded text-xs mr-2.5">
            <div className={`relati
             ve flex items-center justify-center ${dotClass}`}>
              <div className="animate-ping absolute inline-flex h-3 w-3 rounded-full bg-green-400 opacity-75"></div>
              <div className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></div>
            </div>
            <span className={`ml-2.5 text-left ${statusClass}`}>
              {status}
             </span>
          </div>
        </div>
        <Link to={`/deal/${dealId}`} className="text-zinc-700 p-2 hover:text-black flex justify-start">
          <h4 className="text-xl font-medium truncate" title={dealDetails.deal_title}>
            {dealDetails.deal_title}
          </h4>
        </Link>
        <div className="flex space-x-1">
          <div className="text-xs text-black">Seller:</div>
          <a href="#" className="text-rose-600 hover:text-rose-700 text-xs flex justify-start truncate" title={dealDetails.deal_creator}>
            {dealDetails.deal_creator}
          </a>
        </div>
        <div className="mt-4 flex justify-start">
          {/* <div className="inline-flex items-center justify-center text-white rounded text-xs mr-2.5">
            <div className={`relati
             ve flex items-center justify-center ${dotClass}`}>
              <div className="animate-ping absolute inline-flex h-3 w-3 rounded-full bg-green-400 opacity-75"></div>
              <div className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></div>
            </div>
            <span className={`ml-2.5 text-left ${statusClass}`}>
              {status}
            </span>
          </div> */}
          <span className="border border-gray-300 rounded-lg text-sm px-3 py-0.5 mr-1.5 text-neutral-600 flex items-center">
            <i className="fa-regular fa-clock text-xs mr-1"></i>
            {status === 'Upcoming' && dealDetails && upcomingTime != 0
              ? <>bidding starts in {upcomingTime}</>
              : dealDetails && expireTime && expireTime != 0
              ? <>bidding closes in {expireTime}</>
              : <>bidding closed</>}
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
              Total bidded
            </p>
            <h4 className="text-gray-700 font-medium">
              {dealDetails.total_bid}
            </h4>
          </div>
        </div>
        <div className="mt-7 mb-1 flex justify-start">
          {dealMessage === 'Deal will execute' ? (
            <p className="text-green-600 text-sm">
              <i className="fa-solid fa-rocket mr-1"></i>
              <span className="font-medium">
                {dealMessage}
              </span>
            </p>
          ) : (
            <p className="text-red-600 text-sm">
              <i className="fa-solid fa-person-falling mr-1"></i>
              <span className="font-medium">
                {dealMessage}
              </span>
            </p>
          )}
        </div>
      </div>
    </>
  );
}

export default Deal;


