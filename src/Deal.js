import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import { useState } from "react";
import { useAllDeals } from "./hooks/useAllDeals";
import icons from './assets/icons.json';


const Deal = ({ dealId, dealDetails }) => {
    const { user, response, latestBlockHeight } = useAllDeals();
    const [setLatestBlockHeight] = useState(null);
    const [getLatestBlockHeight]= useState(null);
    const { start_block, end_block, deal_title, deal_creator, deal_token_denom, bid_token_denom, min_cap, total_bid } = dealDetails;
    console.log("start block for status:",start_block);
    console.log("current block height for status is:",latestBlockHeight);
     // console.log("Component",dealId,dealDetails);
   const fetchData = async () => {
    try {
      const latestBlock = await getLatestBlockHeight();
      setLatestBlockHeight(latestBlock);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
   
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
            <span className="border border-gray-300 rounded-lg text-xs px-3 py-0.5 mr-1.5 text-neutral-600">
                bidding closes in 1hr
            </span>
        </div>

        <div className="mt-6">
            <div className="flex flex-row">
                <p className="text-sm text-gray-700 mb-1">
                    Deal subscription 
                </p>
                <p className="ml-auto text-sm text-gray-500">
                    0%
                </p>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full" style={{width: '0%'}}></div>
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