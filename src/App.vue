<template>

  <div class="font-['Inter']">
    <section>
      <router-view>
      </router-view>
    </section>
  </div>
  
</template>

<script setup>
import { useRoute } from 'vue-router';

const route = useRoute();
</script>
