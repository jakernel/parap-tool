import { useAuthStore } from '@/stores/auth';

// 判断是否为开发环境
export const isDev = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
// 获取主机名
export const getHostName = async (hfSpace: string): Promise<string> => {
    if (window.wvPort) {
        const port = await window.wvPort()
        console.log(port)
        return port
    }
    if (isDev) {
        return '/api/v1'
    } else {
        if (hfSpace === 'render') {
            return 'https://r.para.cc.cd/api/v1'
        } else {
            //https://parap-qdapi.hf.space/
            //https://parap-gzh.hf.space/
            return 'https://parap-' + hfSpace + '.hf.space/api/v1'
        }

    }
}

// 下载文件
export const downloadFile = (blob: Blob, filename: string) => {
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    window.URL.revokeObjectURL(url)
    document.body.removeChild(a)
}

// 带 token 的 fetch 请求
export const tokenfetch = async (path: string, options: RequestInit = {}) => {
    // 从auth store获取认证信息
    const authStore = useAuthStore();
    const token = authStore.token;
    const userName = authStore.userName;

    // 设置请求头
    const headers = {
        ...(token ? { 'Authorization': `${userName} ${token}` } : {}),
        ...options.headers,
    };

    // 发送请求
    return fetch(path, {
        ...options,
        headers,
    });
}
