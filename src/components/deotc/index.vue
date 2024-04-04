<template>
    <nav class="fixed right-0 top-0 w-full flex p-2 bg-white/90 backdrop-blur-sm z-50 font-['Raleway']">
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
                    <a href="/deals" class="px-6 py-2 border border-rose-500 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-medium">
                        Launch app
                    </a>
                </div>
            </div>
        </div>
    </nav>

    <div class="h-20"></div>

    <div class="pt-2 md:pt-9 pb-5 md:pb-16 bg-white">
        <div class="h-96 w-full flex flex-col items-center justify-center bg-white" 
            style="background-image: url('assets/img/hero-bg-1.png'); background-position: center; background-repeat: no-repeat;">
            <h2 class="text-4xl md:text-5xl font-['Alata'] font-medium px-2 md:px-80 text-center text-pretty leading-10 md:leading-[3.24rem]">
                Best OTC deals, for large crypto orders.
                Better prices than exchanges. High volume.
            </h2>
            <p class="text-slate-500 mt-8 text-lg px-4 md:px-96 text-center text-pretty">
                On-chain OTC with huge seller base. OTC Desk is ideal for large crypto volumes worth $50,000 and above.
            </p>
        </div>
    </div>

    <div class="py-12 md:py-16 w-full flex flex-col md:flex-row items-center justify-center bg-sky-700">
        <div class="grid grid-cols-3 gap-9 md:gap-28 text-white">
            <div class="text-center col-span-3 md:col-span-1">
                <h3 class="text-4xl font-semibold">
                    $123 billion
                </h3>
                <p class="mt-1 md:mt-3">
                    24 hrs trading volume
                </p>
            </div>
            <div class="text-center col-span-3 md:col-span-1">
                <h3 class="text-4xl font-semibold">
                    100+
                </h3>
                <p class="mt-1 md:mt-3">
                    cryptocurrencies listed
                </p>
            </div>
            <div class="text-center col-span-3 md:col-span-1">
                <h3 class="text-4xl font-semibold">
                    1000+
                </h3>
                <p class="mt-1 md:mt-3">
                    deals closed
                </p>
            </div>
        </div>
    </div>

    <div class="mt-10 md:mt-24 w-full flex flex-col px-7 md:px-36">
        <div class="grid grid-cols-2 gap-2 md:gap-9">
            <div class="col-span-2 md:col-span-1">
                <h2 class="text-4xl font-['Alata'] font-medium text-pretty text-gray-800 text-left pr-4 md:pr-24 leading-[2.4rem] md:leading-[2.61rem]">
                    Try your first OTC deal for zero gas fee. Start a deal now.
                </h2>
                <p class="text-slate-500 mt-5 text-base text-left text-pretty">
                    On-chain OTC with huge seller base. OTC Desk is ideal for large crypto volumes worth $50,000 and above.
                </p>

                <div class="flex items-baseline space-x-4 mt-7">
                    <a href="#" class="px-6 py-2 border border-rose-500 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-medium">
                        Start a deal
                    </a>
                </div>
            </div>

            <div class="col-span-2 md:col-span-1 mt-12 md:mt-0 flex flex-col items-center justify-center">
                <img class="min-w-32" src="/assets/img/hero-image-1.svg" alt="Your Company" />
            </div>
        </div>
    </div>

    <div class="mt-24 w-full flex flex-col px-7 md:px-36">
        <h2 class="text-4xl font-['Alata'] font-medium text-pretty text-gray-800 text-left pr-24">
            Popular cryptocurrencies
        </h2>

        <div class="md:border rounded-lg mt-7 p-0.5">
            <table class="w-full table-fixed text-sm text-left text-black/80">
                <thead class="text-xs text-zinc-500 uppercase bg-gray-50 rounded-xl">
                    <tr>
                        <th scope="col" class="py-5 px-6">Name</th>
                        <th scope="col" class="py-5 px-6">Last Price</th>
                        <th scope="col" class="py-5 px-6">24hrs Change</th>
                        <th scope="col" class="py-5 px-6">Volume (24h)</th>
                        <th scope="col" class="py-5 px-6">Market Cap</th>
                    </tr>
                </thead>
                <tbody>
                    <tr class="bg-white hover:bg-slate-50">
                        <td class="py-4 px-6 text-black font-medium">
                            <span>
                                Bitcoin
                            </span>
                            <small class="text-zinc-500 ml-1.5">
                                BTC
                            </small>
                        </td>
                        <td class="py-4 px-6">$20,000</td>
                        <td class="py-4 px-6 text-red-500">-2.5%</td>
                        <td class="py-4 px-6">$10B</td>
                        <td class="py-4 px-6">$600B</td>
                    </tr>
                    <tr class="bg-white hover:bg-slate-50">
                        <td class="py-4 px-6 text-black font-medium">
                            <span>
                                Ethereum
                            </span>
                            <small class="text-zinc-500 ml-1.5">
                                ETH
                            </small>
                        </td>
                        <td class="py-4 px-6">$1,500</td>
                        <td class="py-4 px-6 text-green-500">+3.2%</td>
                        <td class="py-4 px-6">$8B</td>
                        <td class="py-4 px-6">$200B</td>
                    </tr>
                    <tr class="bg-white hover:bg-slate-50">
                        <td class="py-4 px-6 text-black font-medium">
                            <span>
                                Ripple
                            </span>
                            <small class="text-zinc-500 ml-1.5">
                                XRP
                            </small>
                        </td>
                        <td class="py-4 px-6">$0.5</td>
                        <td class="py-4 px-6 text-green-500">+1.1%</td>
                        <td class="py-4 px-6">$500M</td>
                        <td class="py-4 px-6">$50B</td>
                    </tr>
                    <tr class="bg-white hover:bg-slate-50">
                        <td class="py-4 px-6 text-black font-medium">
                            <span>
                                Litecoint
                            </span>
                            <small class="text-zinc-500 ml-1.5">
                                LTC
                            </small>
                        </td>
                        <td class="py-4 px-6">$60</td>
                        <td class="py-4 px-6 text-red-500">-1.8%</td>
                        <td class="py-4 px-6">$300M</td>
                        <td class="py-4 px-6">$4B</td>
                    </tr>
                    <tr class="bg-white hover:bg-slate-50">
                        <td class="py-4 px-6 text-black font-medium">
                            <span>
                                Cardano
                            </span>
                            <small class="text-zinc-500 ml-1.5">
                                ADA
                            </small>
                        </td>
                        <td class="py-4 px-6">$0.15</td>
                        <td class="py-4 px-6 text-green-500">+5.6%</td>
                        <td class="py-4 px-6">$200M</td>
                        <td class="py-4 px-6">$5B</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>

    <div class="mt-5 md:mt-28 px-7 md:px-36 py-12 w-full flex flex-col bg-blue-900">
        <div class="grid grid-cols-2 gap-4 md:gap-12 md:gap-28 text-white">
            <div class="col-span-2 md:col-span-1">
                <h2 class="text-4xl font-['Alata'] font-medium text-pretty text-white text-left md:pr-4 md:leading-[2.7rem]">
                    Are you looking for better OTC deals? Decentralized OTC needed?
                </h2>
                <p class="text-white/80 mt-5 text-base text-left text-pretty">
                    On-chain OTC with huge seller base. OTC Desk is ideal for large crypto volumes worth $50,000 and above.
                </p>
                <button class="mt-9 px-7 py-2 bg-white hover:bg-white/90 text-black/80 rounded-xl font-medium text-blue-800 hover:text-blue-900">
                    Try dOTC now
                </button>
            </div>
            <div class="flex justify-center text-center col-span-3 md:col-span-1 mt-12 md:mt-0">
                <img src="/assets/img/hero-image-2.png" class="h-full" />
            </div>
        </div>
    </div>


    <div class="bg-white px-8 md:px-36 py-24 pb-14">

        <div class="grid grid-cols-7 text-gray-600 text-sm mb-24">
            <div class="col-span-7 md:col-span-2">
                <img src="/assets/img/otc-logo-2.svg" class="h-12 mb-4" />
                <a href="#">
                    Privacy policy
                </a>
                <span>.</span>
                <a href="#">
                    Terms and conditions
                </a>
            </div>

            <div class="col-span-7 md:col-span-1 mt-4 md:mt-0">
                <p class="text-lg font-medium text-gray-700">
                    Products
                </p>
                <div class="mt-2">
                    <a href="#">
                        Contracts
                    </a>
                </div>
                <div class="mt-1.5">
                    <a href="#">
                        Analytics
                    </a>
                </div>
            </div>

            <div class="col-span-7 md:col-span-1 mt-4 md:mt-0">
                <p class="text-lg font-medium text-gray-700">
                    Resources
                </p>
                <div class="mt-2">
                    <a href="#">
                        Tutorials
                    </a>
                </div>
                <div class="mt-1.5">
                    <a href="#">
                        Documentation
                    </a>
                </div>
                <div class="mt-1.5">
                    <a href="#">
                        Playground
                    </a>
                </div>
            </div>

            <div class="col-span-7 md:col-span-1 mt-4 md:mt-0">
                <p class="text-lg font-medium text-gray-700">
                    Company
                </p>
                <div class="mt-2">
                    <a href="#">
                        About us
                    </a>
                </div>
                <div class="mt-1.5">
                    <a href="#">
                        Team
                    </a>
                </div>
                <div class="mt-1.5">
                    <a href="#">
                        Company values
                    </a>
                </div>
                <div class="mt-1.5">
                    <a href="#">
                        Privacy policy
                    </a>
                </div>
                <div class="mt-1.5">
                    <a href="#">
                        Terms
                    </a>
                </div>
            </div>

            <div  class="col-span-7 md:col-span-2 mt-4 md:mt-0">
                <p class="text-lg font-medium text-gray-700">
                    Follow us
                </p>
                <p>
                    We are active on the following social channels. Follow us for latest updates.
                </p>
                 <div class="mt-6 md:ml-auto">
                    <button class="h-9 w-9 bg-white border border-slate-100 shadow rounded-full hover:bg-sky-500 hover:text-white">
                        <i class="fa-brands fa-twitter"></i>
                    </button>
                    <button class="h-9 w-9 bg-white border border-slate-100 shadow rounded-full ml-4 hover:bg-blue-500 hover:text-white">
                        <i class="fa-brands fa-linkedin"></i>
                    </button>
                    <button class="h-9 w-9 bg-white border border-slate-100 shadow rounded-full ml-4 hover:bg-green-500 hover:text-white">
                        <i class="fa-brands fa-medium"></i>
                    </button>
                    <button class="h-9 w-9 bg-white border border-slate-100 shadow rounded-full ml-4 hover:bg-gray-500 hover:text-white">
                        <i class="fa-brands fa-github"></i>
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
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
