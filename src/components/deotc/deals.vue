<template>
    <nav class="fixed right-0 top-0 w-full flex p-2 bg-white/90 backdrop-blur-sm z-50 font-['Raleway'] shadow-sm">
        <div class="w-full px-4 sm:px-6 lg:px-8">
            <div class="flex h-16 items-center justify-between">
                <a href="/" class="flex-shrink-0">
                    <img class="min-w-32" src="/assets/img/otc-logo-1.svg" alt="Your Company" />
                </a>

                <div class="hidden md:block mx-auto flex items-baseline space-x-7">
                    <a href="#" class="hover:text-rose-600 rounded-md px-3 py-2 text-md text-black font-medium">
                        Explore
                    </a>
                    <a href="#" class="hover:text-rose-600 rounded-md px-3 py-2 text-md font-medium">
                        Learn
                    </a>
                    <a href="#" class="hover:text-rose-600 rounded-md px-3 py-2 text-md font-medium">
                        Marketplace
                    </a>
                    <a href="#" class="hover:text-rose-600 rounded-md px-3 py-2 text-md font-medium">
                        Earn
                    </a>
                    <a href="#" class="hover:text-rose-600 rounded-md px-3 py-2 text-md font-medium">
                        Brand
                    </a>
                </div>

                <div class="ml-auto flex items-baseline space-x-4">
                    <a href="/profile" class="px-6 py-2 hover:bg-slate-100 border border-gray-400 rounded-xl text-black/60 font-medium cursor-pointer">
                        <i class="fas fa-user text-sm mr-2" />
                        deotcabc...xyz
                    </a>
                </div>
            </div>
        </div>
    </nav>

    <div class="h-20"></div>

    <main class="px-4 md:px-24 mt-9 mb-9">
        <div class="flex mb-9">
            <h3 class="text-3xl font-medium text-black/90 font-['Alata']">
                Deals
            </h3>
            <div class="ml-auto">
                <a href="/create-deal" class="px-6 py-2 rounded-xl border border-rose-500 hover:border-rose-600 text-rose-500 hover:text-rose-600 hover:bg-rose-50 font-medium transition-colors duration-200 ease-in-out">
                    <i class="fas fa-plus mr-1" />
                    Create new deal
                </a>
            </div>
        </div>

        <div class="flex items-center overflow-x-auto space-x-2 whitespace-nowrap scrollbar-hide w-full">
            <span class="font-medium text-gray-600 mr-3">
                Filters: 
            </span>
            <button class="px-5 py-1.5 text-sm font-semibold bg-blue-500 hover:bg-blue-600 border border-blue-500 hover:border-blue-600 text-white rounded-md transition-colors duration-200 ease-in-out">
                All
            </button>
            <button class="px-5 py-1.5 text-sm font-medium text-gray-700 hover:text-blue-700 border border-gray-500 hover:border-blue-600 hover:bg-blue-100 rounded-md transition-colors duration-200 ease-in-out">
                Live
            </button>
            <button class="px-5 py-1.5 text-sm font-medium text-gray-700 hover:text-blue-700 border border-gray-500 hover:border-blue-600 hover:bg-blue-100 rounded-md transition-colors duration-200 ease-in-out">
                Upcoming
            </button>
            <button class="px-5 py-1.5 text-sm font-medium text-gray-700 hover:text-blue-700 border border-gray-500 hover:border-blue-600 hover:bg-blue-100 rounded-md transition-colors duration-200 ease-in-out">
                Completed
            </button>
            <!-- Add more buttons as needed -->
        </div>

        <div class="grid grid-cols-4 gap-4 mt-12 mb-36">
            <div class="col-span-4 md:col-span-1 bg-white w-full border border-gray-200 rounded-lg p-4 relative">
                <div class="flex flex-row mb-1">
                    <div class="text-xs text-slate-500 mr-3">
                        <i class="fa-solid fa-atom"></i>
                        ATOM
                    </div>
                    <div class="text-xs text-slate-500 mr-3">
                        <i class="fa-solid fa-dollar-sign"></i>
                        USDT
                    </div>
                </div>
                <a href="/bid" class="text-zinc-700 hover:text-black">
                    <h4 class="text-xl font-medium truncate" title="Selling 1,000,000 ATOMs in exchange for USDT">
                        Selling 1,000,000 ATOMs in exchange for USDT
                    </h4>
                </a>
                <a href="#" class="text-rose-600 hover:text-rose-700 text-xs">
                    by deotcabc...xyz
                </a>

                <div class="mt-2">
                    <div class="inline-flex items-center justify-center text-white rounded text-xs mr-2.5">
                        <div class="relative flex items-center justify-center">
                            <div class="animate-ping absolute inline-flex h-3 w-3 rounded-full bg-green-400 opacity-75"></div>
                            <div class="relative inline-flex rounded-full h-2 w-2 bg-green-500"></div>
                        </div>
                        <span class="text-green-600 ml-2.5">
                        Live
                        </span>
                    </div>
                    <span class="border border-gray-300 rounded-lg text-xs px-3 py-0.5 mr-1.5 text-neutral-600">
                        bidding closes in 1hr
                    </span>
                </div>

                <div class="mt-6">
                    <div class="flex flex-row">
                        <p class="text-sm text-gray-700 mb-1">
                            Deal subscription 
                        </p>
                        <p class="ml-auto text-sm text-gray-500">
                            60%
                        </p>
                    </div>
                    <div class="w-full bg-gray-200 rounded-full h-2">
                        <div class="bg-blue-500 h-2 rounded-full" style="width: 60%;"></div>
                    </div>
                </div>
                
                <div class="mt-7 grid grid-cols-2">
                    <div class="flex flex-col ">
                        <p class="text-xs text-gray-500">
                            Min bid
                        </p>
                        <h4 class="text-gray-700 font-medium">
                            1,000 USDT
                        </h4>
                    </div>
                    <div class="flex flex-col ">
                        <p class="text-xs text-gray-500">
                            Total bidded
                        </p>
                        <h4 class="text-gray-700 font-medium">
                            700,000 USDT
                        </h4>
                    </div>
                </div>
                <div class="mt-7 mb-1">
                    <p class="text-green-600 text-sm">
                        <i class="fa-solid fa-rocket mr-1"></i>
                        <span class="font-medium">
                            Deal will execute
                        </span>
                    </p>
                </div>
            </div>

            <div class="col-span-4 md:col-span-1 bg-white w-full border border-gray-200 rounded-lg p-4 relative">
                <div class="flex flex-row mb-1">
                    <div class="text-xs text-slate-500 mr-3">
                        <i class="fa-solid fa-litecoin-sign"></i>
                        WOSMO
                    </div>
                    <div class="text-xs text-slate-500 mr-3">
                        <i class="fa-solid fa-dollar-sign"></i>
                        USDC
                    </div>
                </div>
                <a href="/bid" class="text-zinc-700 hover:text-black">
                    <h4 class="text-xl font-medium truncate">
                        1,000,000 WOSMOs
                    </h4>
                </a>
                <a href="#" class="text-rose-600 hover:text-rose-700 text-xs">
                    by deotcabc...xyz
                </a>
                <div class="mt-2">
                    <div class="inline-flex items-center justify-center text-white rounded text-xs mr-2.5">
                        <div class="relative flex items-center justify-center">
                            <div class="animate-ping absolute inline-flex h-3 w-3 rounded-full bg-green-400 opacity-75"></div>
                            <div class="relative inline-flex rounded-full h-2 w-2 bg-green-500"></div>
                        </div>
                    </div>
                    <span class="border border-gray-300 rounded-lg text-xs px-3 py-0.5 mr-1.5 text-neutral-600">
                        bidding closes in 1hr
                    </span>
                </div>

                <div class="mt-6">
                    <div class="flex flex-row">
                        <p class="text-sm text-gray-700 mb-1">
                            Deal subscription 
                        </p>
                        <p class="ml-auto text-sm text-gray-500">
                            30%
                        </p>
                    </div>
                    <div class="w-full bg-gray-200 rounded-full h-2">
                        <div class="bg-gray-500 h-2 rounded-full" style="width: 30%;"></div>
                    </div>
                </div>

                <div class="mt-7 grid grid-cols-2">
                    <div class="flex flex-col ">
                        <p class="text-xs text-gray-500">
                            Min bid
                        </p>
                        <h4 class="text-gray-700 font-medium">
                            1,000 USDC
                        </h4>
                    </div>
                    <div class="flex flex-col ">
                        <p class="text-xs text-gray-500">
                            Total bidded
                        </p>
                        <h4 class="text-gray-700 font-medium">
                            100,000 USDC
                        </h4>
                    </div>
                </div>
                <div class="mt-7 mb-1">
                    <p class="text-amber-600 text-sm">
                        <i class="fa-solid fa-person-falling mr-1"></i>
                        <span class="font-medium">
                            Deal will fail
                        </span>
                    </p>
                </div>
            </div>

            <div class="col-span-4 md:col-span-1 bg-white w-full border border-gray-200 rounded-lg p-4 relative">
                <div class="flex flex-row mb-1">
                    <div class="text-xs text-slate-500 mr-3">
                        <i class="fa-solid fa-crown"></i>
                        TIA
                    </div>
                    <div class="text-xs text-slate-500 mr-3">
                        <i class="fa-solid fa-atom"></i>
                        ATOM
                    </div>
                </div>
                <a href="/bid" class="text-gray-700 hover:text-black">
                    <h4 class="text-xl font-medium truncate">
                        75,000 TIAs for sale
                    </h4>
                </a>
                <a href="#" class="text-rose-600 hover:text-rose-700 text-xs">
                    by deotcabc...xyz
                </a>
                <div class="mt-2">
                    <div class="inline-flex items-center justify-center text-white rounded text-xs mr-2.5">
                        <div class="relative flex items-center justify-center">
                            <div class="animate-ping absolute inline-flex h-3 w-3 rounded-full bg-green-400 opacity-75"></div>
                            <div class="relative inline-flex rounded-full h-2 w-2 bg-green-500"></div>
                        </div>
                    </div>
                    <span class="border border-gray-300 rounded-lg text-xs px-3 py-0.5 mr-1.5 text-neutral-600">
                        bidding closes in 1hr
                    </span>
                </div>

                <div class="mt-6">
                    <div class="flex flex-row">
                        <p class="text-sm text-gray-700 mb-1">
                            Deal subscription 
                        </p>
                        <p class="ml-auto text-sm text-gray-500">
                            90%
                        </p>
                    </div>
                    <div class="w-full bg-gray-200 rounded-full h-2 mb-4">
                        <div class="bg-green-500 h-2 rounded-full" style="width: 90%;"></div>
                    </div>
                </div>

                <div class="mt-7 grid grid-cols-2">
                    <div class="flex flex-col ">
                        <p class="text-xs text-gray-500">
                            Min bid
                        </p>
                        <h4 class="text-gray-700 font-medium">
                            100 ATOM
                        </h4>
                    </div>
                    <div class="flex flex-col ">
                        <p class="text-xs text-gray-500">
                            Total bidded
                        </p>
                        <h4 class="text-gray-700 font-medium">
                            45,000 ATOM
                        </h4>
                    </div>
                </div>
                <div class="mt-7 mb-1">
                    <p class="text-green-600 text-sm">
                        <i class="fa-solid fa-rocket mr-1"></i>
                        <span class="font-medium">
                            Deal will execute
                        </span>
                    </p>
                </div>
            </div>

            <div class="col-span-4 md:col-span-1 bg-white w-full border border-gray-200 rounded-lg p-4 relative">
                <div class="flex flex-row mb-1">
                    <div class="text-xs text-slate-500 mr-3">
                        <i class="fa-solid fa-microchip"></i>
                        DYM
                    </div>
                    <div class="text-xs text-slate-500 mr-3">
                        <i class="fa-solid fa-bitcoin-sign"></i>
                        BTC
                    </div>
                </div>
                <a href="/bid" class="text-zinc-700 hover:text-black">
                    <h4 class="text-xl font-medium truncate" title="Selling 1,000,000 ATOMs in exchange for USDT">
                        Safe sell of 1Mn DYM at fixed price
                    </h4>
                </a>
                <a href="#" class="text-rose-600 hover:text-rose-700 text-xs">
                    by deotcabc...xyz
                </a>

                <div class="mt-2">
                    <p class="text-lg text-zinc-700 text-center font-medium animate-pulse">
                        Bidding starts in 1hr 30mins
                    </p>
                </div>
                
                <div class="mt-7 grid grid-cols-2">
                    <div class="flex flex-col ">
                        <p class="text-xs text-gray-500">
                            Min bid
                        </p>
                        <h4 class="text-gray-700 font-medium">
                            1 BTC
                        </h4>
                    </div>
                    <div class="flex flex-col ">
                        <p class="text-xs text-gray-500">
                            Total subscribed
                        </p>
                        <h4 class="text-gray-700 font-medium">
                            27,000 accounts
                        </h4>
                    </div>
                </div>
                <div class="mt-7 mb-1 w-full md:absolute md:bottom-4 md:right-0 md:px-4">
                    <button class="w-full border py-1.5 rounded-xl border border-rose-500 hover:bg-rose-600 text-rose-600 hover:text-white">
                        Subscribe
                    </button>
                </div>
            </div>

            <div class="col-span-4 md:col-span-1 bg-white w-full border border-gray-200 rounded-lg p-4 relative">
                <div class="flex flex-row mb-1">
                    <div class="text-xs text-slate-500 mr-3">
                        <i class="fa-regular fa-star"></i>
                        STAR
                    </div>
                    <div class="text-xs text-slate-500 mr-3">
                        <i class="fa-solid fa-dollar"></i>
                        USDT
                    </div>
                </div>
                <a href="/bid" class="text-gray-700 hover:text-black">
                    <h4 class="text-xl font-medium truncate">
                        STAR <-> USDT ::: 1Mn stars
                    </h4>
                </a>
                <a href="#" class="text-rose-600 hover:text-rose-700 text-xs">
                    by deotcabc...xyz
                </a>
                <div class="mt-2">
                    <div class="inline-flex items-center justify-center text-white rounded text-xs mr-2.5">
                        <div class="relative flex items-center justify-center">
                            <div class="animate-ping absolute inline-flex h-3 w-3 rounded-full bg-green-400 opacity-75"></div>
                            <div class="relative inline-flex rounded-full h-2 w-2 bg-green-500"></div>
                        </div>
                    </div>
                    <span class="border border-gray-300 rounded-lg text-xs px-3 py-0.5 mr-1.5 text-neutral-600">
                        bidding closes in 1hr
                    </span>
                </div>

                <div class="mt-6">
                    <div class="flex flex-row">
                        <p class="text-sm text-gray-700 mb-1">
                            Deal subscription 
                        </p>
                        <p class="ml-auto text-sm text-gray-500">
                            27%
                        </p>
                    </div>
                    <div class="w-full bg-gray-200 rounded-full h-2 mb-4">
                        <div class="bg-gray-500 h-2 rounded-full" style="width: 27%;"></div>
                    </div>
                </div>

                <div class="mt-7 grid grid-cols-2">
                    <div class="flex flex-col ">
                        <p class="text-xs text-gray-500">
                            Min bid
                        </p>
                        <h4 class="text-gray-700 font-medium">
                            100 USDT
                        </h4>
                    </div>
                    <div class="flex flex-col ">
                        <p class="text-xs text-gray-500">
                            Total bidded
                        </p>
                        <h4 class="text-gray-700 font-medium">
                            15,000 USDT
                        </h4>
                    </div>
                </div>
                <div class="mt-7 mb-1">
                    <p class="text-amber-600 text-sm">
                        <i class="fa-solid fa-person-falling mr-1"></i>
                        <span class="font-medium">
                            Deal will fail
                        </span>
                    </p>
                </div>
            </div>

            <div class="col-span-4 md:col-span-1 bg-white w-full border border-gray-200 rounded-lg p-4 relative">
                <div class="flex flex-row mb-1">
                    <div class="text-xs text-slate-500 mr-3">
                        <i class="fa-solid fa-bitcoin-sign"></i>
                        BTC
                    </div>
                    <div class="text-xs text-slate-500 mr-3">
                        <i class="fa-brands fa-ethereum"></i>
                        ETH
                    </div>
                </div>
                <a href="/bid" class="text-zinc-700 hover:text-black">
                    <h4 class="text-xl font-medium truncate" title="Selling 1,000,000 ATOMs in exchange for USDT">
                        100 BTC to ETH
                    </h4>
                </a>
                <a href="#" class="text-rose-600 hover:text-rose-700 text-xs">
                    by deotcabc...xyz
                </a>

                <div class="mt-2">
                    <p class="text-lg text-zinc-700 text-center font-medium animate-pulse">
                        Bidding starts in 1day 2hrs 03mins
                    </p>
                </div>
                
                <div class="mt-7 grid grid-cols-2">
                    <div class="flex flex-col ">
                        <p class="text-xs text-gray-500">
                            Min bid
                        </p>
                        <h4 class="text-gray-700 font-medium">
                            1 ETH
                        </h4>
                    </div>
                    <div class="flex flex-col ">
                        <p class="text-xs text-gray-500">
                            Total subscribed
                        </p>
                        <h4 class="text-gray-700 font-medium">
                            18,000 accounts
                        </h4>
                    </div>
                </div>
                <div class="mt-7 mb-1 w-full md:absolute md:bottom-4 md:right-0 md:px-4">
                    <button class="w-full border py-1.5 rounded-xl border border-rose-500 hover:bg-rose-600 text-rose-600 hover:text-white">
                        Subscribe
                    </button>
                </div>
            </div>

            <div class="col-span-4 md:col-span-1 bg-white w-full border border-gray-200 rounded-lg p-4 relative">
                <div class="flex flex-row mb-1">
                    <div class="text-xs text-slate-500 mr-3">
                        <i class="fa-regular fa-sun"></i>
                        SOL
                    </div>
                    <div class="text-xs text-slate-500 mr-3">
                        <i class="fa-solid fa-draw-polygon"></i>
                        MATIC
                    </div>
                </div>
                <a href="/bid" class="text-zinc-700 hover:text-black">
                    <h4 class="text-xl font-medium truncate" title="Selling 1,000,000 ATOMs in exchange for USDT">
                        1000 SOL for sale
                    </h4>
                </a>
                <a href="#" class="text-rose-600 hover:text-rose-700 text-xs">
                    by deotcabc...xyz
                </a>

                <div class="mt-2">
                    <p class="text-lg text-zinc-700 text-center font-medium animate-pulse">
                        Bidding starts in 23 hrs 03 mins 02 seconds
                    </p>
                </div>
                
                <div class="mt-7 grid grid-cols-2">
                    <div class="flex flex-col ">
                        <p class="text-xs text-gray-500">
                            Min bid
                        </p>
                        <h4 class="text-gray-700 font-medium">
                            5 SOL
                        </h4>
                    </div>
                    <div class="flex flex-col ">
                        <p class="text-xs text-gray-500">
                            Total subscribed
                        </p>
                        <h4 class="text-gray-700 font-medium">
                            9,000 accounts
                        </h4>
                    </div>
                </div>
                <div class="mt-7 mb-1 w-full md:absolute md:bottom-4 md:right-0 md:px-4">
                    <button class="w-full border py-1.5 rounded-xl border border-rose-500 hover:bg-rose-600 text-rose-600 hover:text-white">
                        Subscribe
                    </button>
                </div>
            </div>

            <div class="col-span-4 md:col-span-1 bg-white w-full border border-gray-200 rounded-lg p-4 relative">
                <div class="flex flex-row mb-1">
                    <div class="text-xs text-slate-500 mr-3">
                        <i class="fa-brands fa-skyatlas"></i>
                        AKT
                    </div>
                    <div class="text-xs text-slate-500 mr-3">
                        <i class="fa-brands fa-dailymotion"></i>
                        DAI
                    </div>
                </div>
                <a href="/bid" class="text-gray-700 hover:text-black">
                    <h4 class="text-xl font-medium truncate">
                        500,000 AKT
                    </h4>
                </a>
                <a href="#" class="text-rose-600 hover:text-rose-700 text-xs">
                    by deotcabc...xyz
                </a>
                <div class="mt-2">
                    <div class="inline-flex items-center justify-center text-white rounded text-xs mr-2.5">
                        <div class="relative flex items-center justify-center">
                            <div class="animate-ping absolute inline-flex h-3 w-3 rounded-full bg-green-400 opacity-75"></div>
                            <div class="relative inline-flex rounded-full h-2 w-2 bg-green-500"></div>
                        </div>
                    </div>
                    <span class="border border-gray-300 rounded-lg text-xs px-3 py-0.5 mr-1.5 text-neutral-600">
                        bidding closes in 1hr
                    </span>
                </div>

                <div class="mt-6">
                    <div class="flex flex-row">
                        <p class="text-sm text-gray-700 mb-1">
                            Deal subscription 
                        </p>
                        <p class="ml-auto text-sm text-gray-500">
                            45%
                        </p>
                    </div>
                    <div class="w-full bg-gray-200 rounded-full h-2 mb-4">
                        <div class="bg-gray-500 h-2 rounded-full" style="width: 45%;"></div>
                    </div>
                </div>

                <div class="mt-7 grid grid-cols-2">
                    <div class="flex flex-col ">
                        <p class="text-xs text-gray-500">
                            Min bid
                        </p>
                        <h4 class="text-gray-700 font-medium">
                            1,000 DAI
                        </h4>
                    </div>
                    <div class="flex flex-col ">
                        <p class="text-xs text-gray-500">
                            Total bidded
                        </p>
                        <h4 class="text-gray-700 font-medium">
                            15,000 DAI
                        </h4>
                    </div>
                </div>
                <div class="mt-7 mb-1">
                    <p class="text-green-600 text-sm">
                        <i class="fa-solid fa-rocket mr-1"></i>
                        <span class="font-medium">
                            Deal will execute
                        </span>
                    </p>
                </div>
            </div>
        </div>
    </main>
</template>

<style scoped>
.truncate-2-lines {
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}
</style>

<script scoped>

export default {
    components: {
    },
    setup() {
    },
    computed: {
    },
    mounted() {
    },
    methods: {
        addLike() {
            this.$refs.ragHeartBtn.classList.add('hidden');
            this.$refs.ragLikedBtnClone.classList.remove('hidden');
            this.$refs.ragLikedBtnClone.classList.add('like-effect');
            this.$refs.ragLikedBtnOriginal.classList.remove('hidden');

        }
    }
}
</script>
