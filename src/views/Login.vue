<template>
  <div class="login-container">
    <div class="login-form">
      <h2>Login</h2>
      <form @submit.prevent="handleLogin">
        <div class="form-group">
          <label for="name">Username:</label>
          <input type="text" id="name" v-model="name" required placeholder="Enter your username" class="form-input" />
        </div>

        <div class="form-group">
          <label for="email">Email (optional):</label>
          <input type="email" id="email" v-model="email" placeholder="Enter your email (optional)" class="form-input" />
        </div>

        <div class="form-group">
          <label for="password">Password (optional):</label>
          <input type="password" id="password" v-model="password" placeholder="Enter your password (optional)"
            class="form-input" />
        </div>

        <button type="submit" :disabled="loading" class="login-btn">
          <span v-if="!loading">Login</span>
          <span v-else>Logging in...</span>
        </button>

        <div v-if="error" class="error">{{ error }}</div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { getHostName } from '@/utils/dev';
import BaseLayout from '@/components/BaseLayout.vue';

interface UserReg {
  name: string;
  password?: string;
  email?: string;
}

interface UserLoginReply {
  name: string;
  id: string;
  token: string;
}

const name = ref('');
const email = ref('');
const password = ref('');
const loading = ref(false);
const error = ref('');
const router = useRouter();
const authStore = useAuthStore();

const handleLogin = async () => {
  loading.value = true;
  error.value = '';

  try {
    const userData: UserReg = {
      name: name.value,
    };

    // 只有当用户输入了email或password时才添加它们
    if (email.value) {
      userData.email = email.value;
    }

    if (password.value) {
      userData.password = password.value;
    }

    // 获取hostname
    const hostName = await getHostName("parap");

    // 发送带hostname的登录请求
    const response = await fetch(`${hostName}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData)
    });

    if (!response.ok) {
      throw new Error(`Login failed: ${response.statusText}`);
    }

    const result: UserLoginReply = await response.json();

    // 保存用户信息和token
    authStore.login(result.token, result.id, result.name);

    // 重定向到首页或其他页面
    router.push('/admin');
  } catch (err: any) {
    console.error('Login error:', err);
    error.value = err.message || 'An error occurred during login';
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - var(--vt-p-header-height));
  padding: 1rem;
  color: var(--c-text-1);
  position: relative;
  margin: 0;
}

.login-form {
  background: var(--c-bg);
  padding: 2rem;
  border-radius: 8px;
  box-shadow: var(--vt-shadow-2);
  width: 100%;
  max-width: 400px;
  border: 1px solid var(--c-divider-light);
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: bold;
  color: var(--c-text-1);
}

.form-input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid var(--c-divider);
  border-radius: 4px;
  font-size: 1rem;
  background-color: var(--c-bg-soft);
  color: var(--c-text-1);
  box-sizing: border-box;
}

.form-input:focus {
  outline: none;
  border-color: var(--c-green);
  box-shadow: 0 0 0 3px rgba(66, 184, 131, 0.2);
}

.login-btn {
  width: 100%;
  padding: 0.75rem;
  background-color: var(--c-green);
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.25s;
}

.login-btn:hover:not(:disabled) {
  background-color: var(--c-green-light);
}

.login-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  background-color: var(--c-gray-3);
}

.error {
  color: var(--c-red);
  margin-top: 1rem;
  text-align: center;
  padding: 0.5rem;
  background-color: rgba(237, 60, 80, 0.1);
  border-radius: 4px;
  border: 1px solid var(--c-red-light-1);
}

h2 {
  margin-top: 0;
  margin-bottom: 1.5rem;
  text-align: center;
  color: var(--c-text-1);
  font-weight: 600;
}

.right {
  margin-left: auto;
}

h1 {
  user-select: none;
}
</style>