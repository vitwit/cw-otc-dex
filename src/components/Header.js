import { Link } from "react-router-dom";
import { getUser } from "../GetUser";
import { useState } from "react";
import { useEffect } from "react";
const Header = (props) => {
    const [username,setUsername]=useState(null);
    //
    useEffect(() => {

        window.addEventListener("keplr_keystorechange", async () => {
           // console.log("Key store in Keplr is changed. You may need to refetch the account info.")
           const user = await getUser();
           setUsername(user.currentAddress);
           localStorage.setItem("walletaddress",user.currentAddress);
        })
        const value=localStorage.getItem("walletaddress");
        console.log("hello",value);
        if(value){
            setUsername(value);       
        }
      }, []);

    const handleConnectWallet = async () => {
        // Simulating the user being fetched from a service
        try{
          console.log("hello man");
          const user = await getUser();
          setUsername(user.currentAddress);
          localStorage.setItem("walletaddress",user.currentAddress);
        }
        catch(e){
           console.log(e.message);
          // setUsername(e);
        } 
      };

      function shortenAddress(address) {
        if (address.length <= 8) return address; // No need to shorten if address is already short
        const prefix = address.substring(0, 4);
        const suffix = address.substring(address.length - 5);
        return prefix + '...' + suffix;
    }
    return <>
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

                    {
                        props.showLaunchButton ? < Link to="/deals" className="px-6 py-2 border border-rose-500 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-medium">
                            Launch app
                        </Link> :
username ? (
    <Link
      to="/profile"
      className="px-6 py-2 hover:bg-slate-100 border border-gray-400 rounded-xl text-black/60 font-medium cursor-pointer"
    >
      <i className="fas fa-user text-sm mr-2" />
      {shortenAddress(username)}
      {/* <svg class="h-8 w-8 text-red-500"  width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">  <path stroke="none" d="M0 0h24v24H0z"/>  <path d="M14 8v-2a2 2 0 0 0 -2 -2h-7a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h7a2 2 0 0 0 2 -2v-2" />  <path d="M7 12h14l-3 -3m0 6l3 -3" /></svg> */}
    </Link>
  ) : (
    <button
      onClick={handleConnectWallet}
      className="px-6 py-2 hover:bg-slate-100 border border-gray-400 rounded-xl text-black/60 font-medium cursor-pointer"
    >
      <i class="fa-solid fa-wallet m-2"></i>
      Connect Wallet
    </button>
  )

                            // <Link to="/profile" className="px-6 py-2 hover:bg-slate-100 border border-gray-400 rounded-xl text-black/60 font-medium cursor-pointer">
                            //     <i className="fas fa-user text-sm mr-2" />
                            //     Connect Wallet
                            // </Link>

                    }


                </div>
            </div>
        </nav>

        <div className="h-20"></div>
    </>
}

export default Header