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
                    <a href="#" class="px-6 py-2 hover:bg-slate-100 border border-gray-400 rounded-xl text-black/60 font-medium cursor-pointer">
                        <i class="fas fa-user text-sm mr-2" />
                        deotcabc...xyz
                    </a>
                </div>
            </div>
        </div>
    </nav>

    <div class="h-20"></div>

    <main class="px-4 md:px-24 mt-9 mb-9">
        <div class="flex">
            <h3 class="text-3xl font-medium text-black/90 font-['Alata']">
                My deals
            </h3>
        </div>

        <div class="grid grid-cols-4 gap-4 mt-5 mb-9 md:mb-14">
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
                    <div class="inline-flex items-center justify-center bg-green-600 text-white rounded text-xs px-2 py-0.5 mr-1.5">
                        <div class="relative flex items-center justify-center">
                            <div class="animate-ping absolute inline-flex h-3 w-3 rounded-full bg-green-400 opacity-75"></div>
                            <div class="relative inline-flex rounded-full h-2 w-2 bg-white"></div>
                        </div>
                        <span class="ml-2">
                            Live
                        </span>
                    </div>
                    <span class="bg-slate-400 text-white rounded text-xs px-3 py-0.5 mr-1.5">
                        bidding closes in 2 days
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
                    <div class="w-full bg-gray-200 rounded-full h-3">
                        <div class="bg-blue-500 h-3 rounded-full" style="width: 60%;"></div>
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
                            60%
                        </p>
                    </div>
                    <div class="w-full bg-gray-200 rounded-full h-3 mb-4">
                        <div class="bg-gray-500 h-3 rounded-full" style="width: 30%;"></div>
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

        <div class="flex">
            <h3 class="text-3xl font-medium text-black/90 font-['Alata']">
                My bids
            </h3>
        </div>
        <div class="overflow-x-auto border border-gray-300 rounded-lg mt-5 bg-white">
            <div class="min-w-full text-sm text-left text-gray-800 mb-4">
                <div class="text-xs text-gray-700 uppercase bg-gray-50 flex justify-between px-6 py-5 font-semibold">
                    <div class="w-1/5">Deal id</div>
                    <div class="w-1/5">Deal</div>
                    <div class="w-1/5">Amount</div>
                    <div class="w-1/5">Bid price</div>
                    <div class="w-1/5">Actions</div>
                </div>
                <div class="border-t border-gray-200">
                    <div class="bg-white flex justify-between items-center px-6 py-3">
                        <div class="w-1/5">123467</div>
                        <div class="w-1/5">1000 SOL for sale</div>
                        <div class="w-1/5">$1000</div>
                        <div class="w-1/5">$10.50</div>
                        <div class="w-1/5">
                            <button class="px-5 py-1 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-200 flex items-center">
                                <i class="fa-solid fa-xmark mr-2"></i>
                                Remove
                            </button>
                        </div>
                    </div>
                    <div class="flex px-6 pb-2">
                        <div class="text-gray-500 flex-grow">
                            <span>
                                <i class="fa-regular fa-clock text-xs mr-1"></i>
                                20 mins ago
                            </span>
                            <span class="ml-4 text-blue-600">
                                might not win due to high demand
                            </span>
                        </div>
                    </div>
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
