import { useAuthStore } from '@/stores/auth';

const msApi ='https://parall-para-api.ms.fun/api/v1'
// 判断是否为开发环境
export const isDev = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
// 获取主机名
export const getHostName = async (spaceName: string): Promise<string> => {
    if (window.wvPort) {
        const port = await window.wvPort()
        console.log(port)
        return port
    }
    if (isDev) {
        return '/api/v1'
    } else {
        if (spaceName === 'render') {
            return 'https://api.pzx.kdns.fr/api/v1'
        } else if (spaceName === 'vercel') {
            return 'https://vercel.pzx.cc.cd/api/v1'
        } else if (spaceName === 'ms') {
            return msApi
        } else if (spaceName === 'hf') {
            return 'https://p4zx-api.hf.space/api/v1'
        } else if (spaceName === 'railway') {
            return 'https://kratosrender-production.up.railway.app/api/v1'
        }else {
            return msApi
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

    const isMsApi = path.startsWith(msApi)

    // ModelScope API 不支持通过请求头传递 token，改为放入 URL 查询参数。
    if (isMsApi && token) {
        const url = new URL(path)
        url.searchParams.set('token', token)
        path = url.toString()
    }

    // 设置请求头
    const headers = {
        ...(!isMsApi && token ? { 'Authorization': `${userName} ${token}`} : {}),
        ...options.headers,
    };

    // 发送请求
    return fetch(path, {
        ...options,
        headers,
    });
}
