import { defineStore } from 'pinia';

interface AuthState {
  token: string | null;
  userId: string | null;
  userName: string | null;
  isAuthenticated: boolean;
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    token: localStorage.getItem('token'),
    userId: localStorage.getItem('userId'),
    userName: localStorage.getItem('userName'),
    isAuthenticated: !!localStorage.getItem('token'),
  }),

  actions: {
    login(token: string, userId: string, userName: string) {
      this.token = token;
      this.userId = userId;
      this.userName = userName;
      this.isAuthenticated = true;
      
      // 保存到本地存储
      localStorage.setItem('token', token);
      localStorage.setItem('userId', userId);
      localStorage.setItem('userName', userName);
    },

    logout() {
      this.token = null;
      this.userId = null;
      this.userName = null;
      this.isAuthenticated = false;
      
      // 清除本地存储
      localStorage.removeItem('token');
      localStorage.removeItem('userId');
      localStorage.removeItem('userName');
    },

    // 检查token是否仍然有效
    checkAuthStatus() {
      const token = localStorage.getItem('token');
      this.token = token;
      this.isAuthenticated = !!token;
      
      if (token) {
        this.userId = localStorage.getItem('userId');
        this.userName = localStorage.getItem('userName');
      } else {
        this.logout();
      }
    },
  },
});