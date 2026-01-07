import { createRouter, createWebHistory, createWebHashHistory } from 'vue-router'
import Pinterest from '@/views/Pinterest.vue';
import ImageData from '@/views/ImageData.vue';
import PhoneNumber from '@/views/PhoneNumber.vue';
import HtmlToApk from '@/views/HtmlToApk.vue'
import QRMerge from '@/views/QRMerge.vue'
import HtmlToExe from '@/views/HtmlToExe.vue'
import HomeView from '@/views/HomeView.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
  },
  {
    path: '/pinterest',
    name: 'pinterest',
    component: Pinterest,
  },
  {
    path: '/image-data',
    name: 'image-data',
    component: ImageData,
  },
  {
    path: '/phone-number',
    name: 'phone-number',
    component: PhoneNumber,
  },
  {
    path: '/html-to-apk',
    name: 'html-to-apk',
    component: HtmlToApk
  },
  {
    path: '/qr-merge',
    name: 'qr-merge',
    component: QRMerge
  },
  {
    path: '/html-to-exe',
    name: 'html-to-exe',
    component: HtmlToExe
  }
]

// 如果存在 VITE_INCLUDE_ADMIN 环境变量，则添加 admin 路由
if (import.meta.env.VITE_INCLUDE_ADMIN) {
  routes.push({
    path: '/admin',
    name: 'admin',
    component: () => import('@/admin/HomeView.vue'),
    children: [
      {
        path: 'qd',
        name: 'admin-qd',
        component: () => import('@/admin/qd.vue')
      }
    ]
  });
}

if (CUSTOMPARAMS.singlefile) {
  // 在 singlefile 模式下，重定向到指定的单文件路径
  routes.push({
    path: '/',
    redirect: '/' + CUSTOMPARAMS.singlefile
  })
}

const router = createRouter({
  history: CUSTOMPARAMS.singlefile ? createWebHashHistory() : createWebHistory(import.meta.env.BASE_URL),
  routes: routes,
})
export default router