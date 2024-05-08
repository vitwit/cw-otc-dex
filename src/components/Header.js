import { Link } from "react-router-dom";
const Header = (props) => {

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
                            <Link to="/profile" className="px-6 py-2 hover:bg-slate-100 border border-gray-400 rounded-xl text-black/60 font-medium cursor-pointer">
                                <i className="fas fa-user text-sm mr-2" />
                                deotcabc...xyz
                            </Link>

                    }


                </div>
            </div>
        </nav>

        <div className="h-20"></div>
    </>
}

export default Header