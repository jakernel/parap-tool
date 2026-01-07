import { useAuthStore } from '@/stores/auth';

interface RequestOptions extends RequestInit {
  skipAuth?: boolean;
}

/**
 * 通用请求方法，自动添加认证头部
 */
export async function request<T>(url: string, options: RequestOptions = {}): Promise<T> {
  const { skipAuth = false, headers, ...restOptions } = options;
  
  // 如果不是跳过认证且有token，则添加Authorization头部
  const authHeaders: HeadersInit = { ...headers };
  const authStore = useAuthStore();
  
  if (!skipAuth && authStore.token) {
    authHeaders.Authorization = `Bearer ${authStore.token}`;
  }
  
  const response = await fetch(url, {
    ...restOptions,
    headers: authHeaders,
  });
  
  if (!response.ok) {
    // 如果是401错误，可能是token失效，跳转到登录页
    if (response.status === 401) {
      authStore.logout();
      window.location.href = '/login';
      return Promise.reject(new Error('Authentication required'));
    }
    
    throw new Error(`Request failed: ${response.status} ${response.statusText}`);
  }
  
  // 尝试解析JSON响应
  try {
    return await response.json();
  } catch (e) {
    // 如果不是JSON响应，返回文本
    return response.text() as unknown as T;
  }
}

/**
 * GET请求
 */
export async function get<T>(url: string, options?: RequestOptions): Promise<T> {
  return request<T>(url, {
    ...options,
    method: 'GET',
  });
}

/**
 * POST请求
 */
export async function post<T>(url: string, data?: any, options?: RequestOptions): Promise<T> {
  return request<T>(url, {
    ...options,
    method: 'POST',
    body: data ? JSON.stringify(data) : undefined,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });
}

/**
 * PUT请求
 */
export async function put<T>(url: string, data?: any, options?: RequestOptions): Promise<T> {
  return request<T>(url, {
    ...options,
    method: 'PUT',
    body: data ? JSON.stringify(data) : undefined,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });
}

/**
 * DELETE请求
 */
export async function del<T>(url: string, options?: RequestOptions): Promise<T> {
  return request<T>(url, {
    ...options,
    method: 'DELETE',
  });
}