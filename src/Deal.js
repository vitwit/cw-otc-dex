import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import { useState } from "react";
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
    const [expireTime, setExpireTime] = useState(null)
    const [expireDate, setExpireDate] = useState(null)
    const [progress, setProgress] = useState(null)
    const { start_block, end_block, deal_title, deal_creator, deal_token_denom, bid_token_denom, min_cap, total_bid } = dealDetails;
    // console.log("start block for status:",start_block);
    // console.log("current block height for status is:",latestBlockHeight);
     // console.log("Component",dealId,dealDetails);
//    const fetchData = async () => {
//     try {
//     //   const latestBlockHeight = await getLatestBlockHeight();
//     //   setLatestBlockHeight(latestBlockHeight);
//       if (latestBlockHeight !== null && dealDetails.end_block !== null) {

//         const remainingSeconds = (dealDetails.end_block - latestBlockHeight) * 5;
//         console.log("rem",remainingSeconds)
//         if (remainingSeconds <= 0) {
//           // Deal has expired
//           setExpireTime(0);
//           setExpireDate(moment().subtract(-remainingSeconds, 'seconds').format('MMMM D, YYYY [at] h:mm:ss A'));
//         } else {
//           const daysLeft = Math.floor(remainingSeconds / (3600 * 24));
//           const hoursLeft = Math.floor((remainingSeconds % (3600 * 24)) / 3600);
  
//           if (daysLeft > 0) {
//             setExpireTime(`${daysLeft} day${daysLeft > 1 ? 's' : ''}`);
//           } else if (hoursLeft === 1) {
//             // Start countdown timer
//             const interval = setInterval(() => {
//               setExpireTime(`${hoursLeft} hours`);
//               remainingSeconds -= 1;
//               if (remainingSeconds <= 0) {
//                 clearInterval(interval);
//                 setExpireTime('Expired');
//               }
//             }, 1000);
//           }
  
//           const expirationDate = moment().add(remainingSeconds, 'seconds');
//           setExpireDate(expirationDate.format('MMMM D, YYYY [at] h:mm:ss A'));
//         }
//       }
//     } catch (error) {
//         console.error('Error fetching data:', error);
//     }
// };
// // fetchData()

  useEffect(() => {
    const fetchLatestBlockHeight = async () => {
      try {
        const latestBlockHeight = await getLatestBlockHeight()
        setLatestBlockHeight(latestBlockHeight);
    
        if (latestBlockHeight !== null && dealDetails.end_block !== null) {

          const remainingSeconds = (dealDetails.end_block - latestBlockHeight) * 5;
    
          if (remainingSeconds <= 0) {
            // Deal has expired
            setExpireTime(0);
            setExpireDate(moment().subtract(-remainingSeconds, 'seconds').format('MMMM D, YYYY [at] h:mm:ss A'));
          } else {
            const daysLeft = Math.floor(remainingSeconds / (3600 * 24));
            const hoursLeft = Math.floor((remainingSeconds % (3600 * 24)) / 3600);
    
            if (daysLeft > 0) {
              setExpireTime(`${daysLeft} day${daysLeft > 1 ? 's' : ''}`);
            } else if (hoursLeft === 1) {
              const interval = setInterval(() => {
                setExpireTime(`${hoursLeft} hours`);
                remainingSeconds -= 1;
                if (remainingSeconds <= 0) {
                  clearInterval(interval);
                  setExpireTime('Expired');
                }
              }, 1000);
            }
    
            const expirationDate = moment().add(remainingSeconds, 'seconds');
            setExpireDate(expirationDate.format('MMMM D, YYYY [at] h:mm:ss A'));
          }
        }
        // setLatestBlockHeight(result)
        // const value = dealDetails.end_block - result > 0 ? dealDetails.end_block - result: 0
        // const secondsToAdd =  (dealDetails.end_block - result)*5
        // const {absoluteTime,relativeTime}= calculateExpiration(secondsToAdd);
        // const expiredate = addSecondsToCurrentTime(secondsToAdd)
        // if (expireDate==null) {
        //   setExpireDate(absoluteTime)
        // }
       
        // const durationInSeconds = value * 5;

        // let secondsElapsed = 0;
        // const intervalId = setInterval(() => {
        //     if (secondsElapsed >= durationInSeconds) {
        //         setExpireTime(0);
        //         clearInterval(intervalId);
        //     } else {
        //         const remainingSeconds = durationInSeconds - secondsElapsed;
        //         const formattedDuration = formatDuration(remainingSeconds);
        //         setExpireTime(formattedDuration);
        //         secondsElapsed++;
        //     }
        // }, 1000);

        // Clear interval when component unmounts
        // return () => clearInterval(intervalId);      
      } catch (e) {
        console.log(e.message)
      }
    }
    if (dealDetails) {
      const progressbar = (dealDetails.total_bid / dealDetails.deal_token_amount) * 100
    setProgress(progressbar)

      fetchLatestBlockHeight()
    }
  }, [dealDetails])

  let status = '';
  if (latestBlockHeight < start_block) {
    status = 'Upcoming';
  } else if (start_block <= latestBlockHeight && latestBlockHeight <= end_block) {
    status = 'Live';
  } else {
    status = 'Completed';
  }
    return ( 
<>
<div className="col-span-4 md:col-span-1 bg-white w-full border border-gray-200 rounded-lg p-4 relative ">
        <div className="flex flex-row mb-1 justify-start">
            <div className="text-xs text-slate-500 mr-3">
            <img src={icons[deal_token_denom]} alt={deal_token_denom} className="inline-block w-4 h-4 mr-1" />
                {dealDetails.deal_token_denom}
            </div>
            <div className="text-xs text-slate-500 mr-3">
            <img src={icons[bid_token_denom]} alt={bid_token_denom} className="inline-block w-4 h-4 mr-1" />
                {dealDetails.bid_token_denom}
            </div>
        </div>
        <Link to={`/bid/${dealId}`} className="text-zinc-700 hover:text-black flex justify-start">
            <h4 className="text-xl font-medium truncate" title="Selling 1,000,000 ATOMs in exchange for USDT">
               {dealDetails.deal_title}
            </h4>
        </Link>
        <a href="#" className="text-rose-600 hover:text-rose-700 text-xs flex justify-start">
            {dealDetails.deal_creator}
        </a>

        <div className="mt-2 flex justify-start">
            <div className="inline-flex items-center justify-center text-white rounded text-xs mr-2.5">
                <div className="relative flex items-center justify-center">
                    <div className="animate-ping absolute inline-flex h-3 w-3 rounded-full bg-green-400 opacity-75"></div>
                    <div className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></div>
                </div>
                <span className="text-green-600 ml-2.5 text-left">
                {status}
                </span>
            </div>
            <span className="border border-gray-300 rounded-lg text-sm px-3 py-0.5 mr-1.5 mb-2.5 text-neutral-600 flex items-center">
                  <i className="fa-regular fa-clock text-xs mr-1"></i>
                  {dealDetails&&expireTime&&expireTime !=0 ? <>bidding closes in {expireTime}</> : <>bidding closed</>}
                </span>
        </div>

        <div className="mt-6">
            <div className="flex flex-row">
                <p className="text-sm text-gray-700 mb-1">
                    Deal subscription 
                </p>
                <p className="ml-auto text-sm text-gray-500">
                    {progress>=100?<>100</>:progress}%
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
            <p className="text-green-600 text-sm">
                <i className="fa-solid fa-rocket mr-1"></i>
                <span className="font-medium">
                    Deal will execute
                </span>
            </p>
        </div>
    </div>
</>
     );
}
 
export default Deal;