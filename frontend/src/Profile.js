import { Link } from "react-router-dom";

const Profile = () => {
    return (  
            <>
                <nav className="fixed right-0 top-0 w-full flex p-2 bg-white/90 backdrop-blur-sm z-50 font-['Raleway'] shadow-sm">
<div className="w-full px-4 sm:px-6 lg:px-8">
    <div className="flex h-16 items-center justify-between">
        <a href="/" className="flex-shrink-0">
            <img className="min-w-32" src="/assets/img/otc-logo-1.svg" alt="Your Company" />
        </a>

        <div className="hidden md:block mx-auto flex items-baseline space-x-7">
            <a href="#" className="hover:text-rose-600 rounded-md px-3 py-2 text-md text-black font-medium">
                Explore
            </a>
            <a href="#" className="hover:text-rose-600 rounded-md px-3 py-2 text-md font-medium">
                Learn
            </a>
            <a href="#" className="hover:text-rose-600 rounded-md px-3 py-2 text-md font-medium">
                Marketplace
            </a>
            <a href="#" className="hover:text-rose-600 rounded-md px-3 py-2 text-md font-medium">
                Earn
            </a>
            <a href="#" className="hover:text-rose-600 rounded-md px-3 py-2 text-md font-medium">
                Brand
            </a>
        </div>

        <div className="ml-auto flex items-baseline space-x-4">
            <a href="#" className="px-6 py-2 hover:bg-slate-100 border border-gray-400 rounded-xl text-black/60 font-medium cursor-pointer">
                <i className="fas fa-user text-sm mr-2" />
                deotcabc...xyz
            </a>
        </div>
    </div>
</div>
</nav>

<div className="h-20"></div>

<main className="px-4 md:px-24 mt-9 mb-9">
<div className="flex">
    <h3 className="text-3xl font-medium text-black/90 font-['Alata']">
        My deals
    </h3>
</div>

<div className="grid grid-cols-4 gap-4 mt-5 mb-9 md:mb-14">
    <div className="col-span-4 md:col-span-1 bg-white w-full border border-gray-200 rounded-lg p-4 relative">
        <div className="flex flex-row mb-1">
            <div className="text-xs text-slate-500 mr-3">
                <i className="fa-solid fa-atom"></i>
                ATOM
            </div>
            <div className="text-xs text-slate-500 mr-3">
                <i className="fa-solid fa-dollar-sign"></i>
                USDT
            </div>
        </div>
        <Link to="/bid" className="text-zinc-700 hover:text-black">
            <h4 className="text-xl font-medium truncate" title="Selling 1,000,000 ATOMs in exchange for USDT">
                Selling 1,000,000 ATOMs in exchange for USDT
            </h4>
        </Link>
        <a href="#" className="text-rose-600 hover:text-rose-700 text-xs">
            by deotcabc...xyz
        </a>

        <div className="mt-2">
            <div className="inline-flex items-center justify-center bg-green-600 text-white rounded text-xs px-2 py-0.5 mr-1.5">
                <div className="relative flex items-center justify-center">
                    <div className="animate-ping absolute inline-flex h-3 w-3 rounded-full bg-green-400 opacity-75"></div>
                    <div className="relative inline-flex rounded-full h-2 w-2 bg-white"></div>
                </div>
                <span className="ml-2">
                    Live
                </span>
            </div>
            <span className="bg-slate-400 text-white rounded text-xs px-3 py-0.5 mr-1.5">
                bidding closes in 2 days
            </span>
        </div>

        <div className="mt-6">
            <div className="flex flex-row">
                <p className="text-sm text-gray-700 mb-1">
                    Deal subscription 
                </p>
                <p className="ml-auto text-sm text-gray-500">
                    60%
                </p>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
                <div className="bg-blue-500 h-3 rounded-full" style={{width: '60%'}}></div>
            </div>
        </div>
        
        <div className="mt-7 grid grid-cols-2">
            <div className="flex flex-col ">
                <p className="text-xs text-gray-500">
                    Min bid
                </p>
                <h4 className="text-gray-700 font-medium">
                    1,000 USDT
                </h4>
            </div>
            <div className="flex flex-col ">
                <p className="text-xs text-gray-500">
                    Total bidded
                </p>
                <h4 className="text-gray-700 font-medium">
                    700,000 USDT
                </h4>
            </div>
        </div>
        <div className="mt-7 mb-1">
            <p className="text-green-600 text-sm">
                <i className="fa-solid fa-rocket mr-1"></i>
                <span className="font-medium">
                    Deal will execute
                </span>
            </p>
        </div>
    </div>

    <div className="col-span-4 md:col-span-1 bg-white w-full border border-gray-200 rounded-lg p-4 relative">
        <div className="flex flex-row mb-1">
            <div className="text-xs text-slate-500 mr-3">
                <i className="fa-brands fa-skyatlas"></i>
                AKT
            </div>
            <div className="text-xs text-slate-500 mr-3">
                <i className="fa-brands fa-dailymotion"></i>
                DAI
            </div>
        </div>
        <Link to="/bid" className="text-gray-700 hover:text-black">
            <h4 className="text-xl font-medium truncate">
                500,000 AKT
            </h4>
        </Link>
        <a href="#" className="text-rose-600 hover:text-rose-700 text-xs">
            by deotcabc...xyz
        </a>
        <div className="mt-2">
            <div className="inline-flex items-center justify-center text-white rounded text-xs mr-2.5">
                <div className="relative flex items-center justify-center">
                    <div className="animate-ping absolute inline-flex h-3 w-3 rounded-full bg-green-400 opacity-75"></div>
                    <div className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></div>
                </div>
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
                    60%
                </p>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
                <div className="bg-gray-500 h-3 rounded-full" style={{width: '30%'}}></div>
            </div>
        </div>

        <div className="mt-7 grid grid-cols-2">
            <div className="flex flex-col ">
                <p className="text-xs text-gray-500">
                    Min bid
                </p>
                <h4 className="text-gray-700 font-medium">
                    1,000 DAI
                </h4>
            </div>
            <div className="flex flex-col ">
                <p className="text-xs text-gray-500">
                    Total bidded
                </p>
                <h4 className="text-gray-700 font-medium">
                    15,000 DAI
                </h4>
            </div>
        </div>
        <div className="mt-7 mb-1">
            <p className="text-green-600 text-sm">
                <i className="fa-solid fa-rocket mr-1"></i>
                <span className="font-medium">
                    Deal will execute
                </span>
            </p>
        </div>
    </div>
</div>

<div className="flex">
    <h3 className="text-3xl font-medium text-black/90 font-['Alata']">
        My bids
    </h3>
</div>
<div className="overflow-x-auto border border-gray-300 rounded-lg mt-5 bg-white">
    <div className="min-w-full text-sm text-left text-gray-800 mb-4">
        <div className="text-xs text-gray-700 uppercase bg-gray-50 flex justify-between px-6 py-5 font-semibold">
            <div className="w-1/5">Deal id</div>
            <div className="w-1/5">Deal</div>
            <div className="w-1/5">Amount</div>
            <div className="w-1/5">Bid price</div>
            <div className="w-1/5">Actions</div>
        </div>
        <div className="border-t border-gray-200">
            <div className="bg-white flex justify-between items-center px-6 py-3">
                <div className="w-1/5">123467</div>
                <div className="w-1/5">1000 SOL for sale</div>
                <div className="w-1/5">$1000</div>
                <div className="w-1/5">$10.50</div>
                <div className="w-1/5">
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
                    <span className="ml-4 text-blue-600">
                        might not win due to high demand
                    </span>
                </div>
            </div>
        </div>
    </div>
</div>
</main>


            </>
    );
}
 
export default Profile;