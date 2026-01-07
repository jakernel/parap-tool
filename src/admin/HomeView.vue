<script setup lang="ts">
import BaseLayout from "@/components/BaseLayout.vue";
// const wvPort = window.wvPort
const showNav = !CUSTOMPARAMS.singlefile
</script>
<template>
  <BaseLayout>
    <template #header>
      <div>
        <h1><router-link to="/">Para's Tool - Admin</router-link></h1>
      </div>
      <div class="right ct" v-if="showNav">
        <router-link to="/admin/qd">QD</router-link>
      </div>
    </template>
    <div>
      <router-view></router-view>
    </div>
  </BaseLayout>
</template>

<style scoped>
.right {
  margin-left: auto;
}

h1 {
  user-select: none;
}

@media (max-width: 767px) {
  h1 {
    display: none;
  }
}
</style>