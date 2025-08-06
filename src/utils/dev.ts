// 判断是否为开发环境
export const isDev = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
// 获取主机名
export const getHostName = async (hfSpace: string): Promise<string> => {
    if (window.wvPort) {
        const port = await window.wvPort()
        console.log(port)
        return port
    }
    //https://parap-qdapi.hf.space/
    return isDev ? '' : 'https://parap-' + hfSpace + '.hf.space'
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
