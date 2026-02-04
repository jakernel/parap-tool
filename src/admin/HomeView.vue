<script setup lang="ts">
import BaseLayout from "@/components/BaseLayout.vue";
import { useRouter } from 'vue-router';

// const wvPort = window.wvPort
const showNav = !CUSTOMPARAMS.singlefile

const router = useRouter();

const handleLogout = () => {
  // 删除 localStorage 中的 token
  localStorage.removeItem('token');
  // 可以根据需要删除其他认证相关的数据
  // localStorage.removeItem('user');
  // 重定向到首页，避免登录页可能造成的无限重定向循环
  router.push('/'); // 登出后跳转到根路径
};
</script>

<template>
  <BaseLayout>
    <template #header>
      <div>
        <h1><router-link to="/">Para's Tool - Admin</router-link></h1>
      </div>
      <div class="right ct" v-if="showNav">
        <router-link to="/admin/qd">QD</router-link>
        <router-link to="/admin/dnshe">DNSHE</router-link>
        <router-link to="/admin/send-email">Send Email</router-link>
        <router-link to="/admin/send-sms">Send SMS</router-link>
        <router-link to="/admin/log">Log</router-link>
        <router-link to="/admin/wechat">WeChat</router-link>
        <button @click="handleLogout" class="logout-btn">Logout</button>
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
  display: flex;
  align-items: center;
  gap: 1rem;
}

h1 {
  user-select: none;
}

.logout-btn {
  background: none;
  border: 1px solid #ccc;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  color: var(--c-text-1);
  background-color: var(--c-bg-soft);
}

.logout-btn:hover {
  background-color: var(--c-brand-red);
  color: white;
  border-color: var(--c-brand-red);
}

@media (max-width: 767px) {
  h1 {
    display: none;
  }
}
</style>