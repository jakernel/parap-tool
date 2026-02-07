<template>
  <div class="register-container">
    <div class="register-form">
      <h2>Create Account</h2>
      <form @submit.prevent="handleRegister">
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

        <button type="submit" :disabled="loading" class="register-btn">
          <span v-if="!loading">Register</span>
          <span v-else>Creating account...</span>
        </button>

        <div v-if="error" class="error">{{ error }}</div>
        <div v-if="success" class="success">{{ success }}</div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { getHostName } from '@/utils/dev';
import BaseLayout from '@/components/BaseLayout.vue';

interface UserReg {
  name: string;
  password?: string;
  email?: string;
}

interface UserID {
  id: string;
}

const name = ref('');
const email = ref('');
const password = ref('');
const loading = ref(false);
const error = ref('');
const success = ref('');
const router = useRouter();

const handleRegister = async () => {
  loading.value = true;
  error.value = '';
  success.value = '';

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
    const hostName = await getHostName("api");

    // 发送注册请求
    const response = await fetch(`${hostName}/user/createUser`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData)
    });

    if (!response.ok) {
      throw new Error(`Registration failed: ${response.statusText}`);
    }

    const result: UserID = await response.json();

    // 显示成功消息
    success.value = `User created successfully with ID: ${result.id}`;

    // 等待片刻后重定向到登录页面
    setTimeout(() => {
      router.push('/login');
    }, 2000);
  } catch (err: any) {
    console.error('Registration error:', err);
    error.value = err.message || 'An error occurred during registration';
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.register-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - var(--vt-p-header-height));
  background-color: var(--c-bg-soft);
  padding: 1rem;
  color: var(--c-text-1);
  position: relative;
  margin-top: var(--vt-p-header-height);
}

.register-form {
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

.register-btn {
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

.register-btn:hover:not(:disabled) {
  background-color: var(--c-green-light);
}

.register-btn:disabled {
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

.success {
  color: var(--c-green);
  margin-top: 1rem;
  text-align: center;
  padding: 0.5rem;
  background-color: rgba(66, 184, 131, 0.1);
  border-radius: 4px;
  border: 1px solid var(--c-green-light-1);
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

.right a {
  margin-left: 1rem;
}

h1 {
  user-select: none;
}
</style>