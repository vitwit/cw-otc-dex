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

    <main class="px-4 md:px-24 mt-4 md:mt-9 mb-9">

        <div class="flex mb-7">
            <h3 class="text-3xl font-medium text-black/90 font-['Alata']">
                Create new deal
            </h3>
        </div>

        <div class="w-full border rounded-lg bg-white">
            <div class="px-6 py-4 mt-2 md:mt-5">
                <div class="mb-6 flex flex-col md:flex-row md:items-center">
                    <label class="text-sm font-medium text-gray-700 w-full md:w-1/6" for="experimentName">
                        Deal title
                        <small class="text-red-600">*</small>
                    </label>
                    <input type="text" 
                        placeholder="100k ATOM liquidation"
                        class="border border-gray-300 text-sm rounded-lg focus:ring-emerald-500 focus:border-emerald-500 block w-full md:w-2/3 p-2">
                </div>

                <div class="mb-6 flex flex-col md:flex-row md:items-center">
                    <label class="text-sm font-medium text-gray-700 w-full md:w-1/6" for="experimentName">
                        Deal description
                        <small class="text-gray-400 ml-2">Optional</small>
                    </label>
                    <textarea type="text" 
                        placeholder="Looking for ATOM buyers. Pirce range in between 10$ and 10.5$"
                        class="border border-gray-300 text-sm rounded-lg focus:ring-emerald-500 focus:border-emerald-500 block w-full md:w-2/3 p-2"></textarea>
                </div>

                <div class="mb-6 flex flex-col md:flex-row md:items-center">
                    <label class="text-sm font-medium text-gray-700 w-full md:w-1/6" for="experimentName">
                        Token
                        <small class="text-red-600">*</small>
                    </label>
                    <input type="text" 
                        placeholder="ATOM"
                        class="border border-gray-300 text-sm rounded-lg focus:ring-emerald-500 focus:border-emerald-500 block w-full md:w-2/3 p-2">
                </div>

                <div class="mb-6 flex flex-col md:flex-row md:items-center">
                    <label class="text-sm font-medium text-gray-700 w-full md:w-1/6" for="experimentName">
                        Amount
                        <small class="text-red-600">*</small>
                    </label>
                    <input type="text" 
                        placeholder="100,000 ATOMs"
                        class="border border-gray-300 text-sm rounded-lg focus:ring-emerald-500 focus:border-emerald-500 block w-full md:w-2/3 p-2">
                </div>

                <div class="mb-6 flex flex-col md:flex-row md:items-center">
                    <label class="text-sm font-medium text-gray-700 w-full md:w-1/6" for="experimentName">
                        Exchange token
                        <small class="text-red-600">*</small>
                    </label>
                    <input type="text" 
                        placeholder="USDT"
                        class="border border-gray-300 text-sm rounded-lg focus:ring-emerald-500 focus:border-emerald-500 block w-full md:w-2/3 p-2">
                </div>

                <div class="mb-6 flex flex-col md:flex-row md:items-center">
                    <div class="flex flex-col md:flex-row items-center w-full md:w-5/12">
                        <label class="text-sm font-medium text-gray-700 w-full md:w-2/3" for="experimentName">
                            Bid start date
                            <small class="text-red-600">*</small>
                        </label>
                        <input type="text" 
                            placeholder="YYYY-MM-DD"
                            class="border border-gray-300 text-sm rounded-lg focus:ring-emerald-500 focus:border-emerald-500 block w-full p-2">
                    </div>
                    <div class="flex flex-col md:flex-row items-center w-full md:w-5/12 mt-6 md:mt-0">
                        <label class="text-sm font-medium text-gray-700 w-full md:w-2/3 md:text-center" for="experimentName">
                            Bid end date
                            <small class="text-red-600">*</small>
                        </label>
                        <input type="text" 
                            placeholder="2024-04-09"
                            class="border border-gray-300 text-sm rounded-lg focus:ring-emerald-500 focus:border-emerald-500 block w-full p-2">
                    </div>
                </div>
            </div>

            <hr class="border border-gray-100 mt-1 md:mt-3" />

            <div class="p-5 flex">
                <div class="ml-auto">
                    <button class="px-6 py-1.5 rounded-xl border border-gray-200 hover:bg-slate-100 text-black/60 font-medium mr-3 transition-colors duration-200 ease-in-out">
                        Cancel
                    </button>
                    <button class="px-6 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-medium transition-colors duration-200 ease-in-out">
                        Create deal
                    </button>
                </div>
            </div>
        </div>
    </main>
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
