import { fileURLToPath, URL } from 'node:url'
import { viteSingleFile } from "vite-plugin-singlefile"
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'


// 获取命令行参数
const args = process.argv.slice(2);

// 解析参数为对象
const CUSTOMPARAMS = args.reduce((acc, arg) => {
  const [key, value] = arg.split('=');
  if (key && value) {
    acc[key.replace(/^--/, '')] = value;
  }
  return acc;
}, {});


// https://vite.dev/config/
export default defineConfig({
  define: {
    CUSTOMPARAMS: JSON.stringify(CUSTOMPARAMS || {}),
  },
  plugins: [
    vue(),
    CUSTOMPARAMS.singlefile ? viteSingleFile() : null
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
  build: {
    // 设置输出目录
    // outDir: '/Users/parapeng/Desktop/apkEditor/app/html/dist',
    // emptyOutDir: true,
    rollupOptions: {
      output: {
        // 开启代码分割
        manualChunks(id) {
          if (id.includes('node_modules')) {
            return id.split('node_modules/')[1].split('/')[0].toString(); // 将 node_modules 按包名拆分
          }
        }
      }
    }

  },

  server: {
    port: 5173, // 指定端口
    proxy: {
      '/api/v1/': createProxyConfig(),
      '/tool/': createProxyConfig(),
    },
  }
})

// 创建代理配置的函数
function createProxyConfig() {
  return {
    target: 'http://localhost:80', // 后端API服务器地址
    changeOrigin: false, // 是否改变源地址
    configure: (proxy, options) => {
      proxy.on('error', (err, req, res) => {
        // 处理代理错误，返回404
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('404 Not Found, Palse open backend!');
      });
    }
  };
}