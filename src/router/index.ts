import { createRouter, createWebHistory, createWebHashHistory } from 'vue-router'
import Pinterest from '@/views/Pinterest.vue';
import ImageData from '@/views/ImageData.vue';
import PhoneNumber from '@/views/PhoneNumber.vue';
import HtmlToApk from '@/views/HtmlToApk.vue'
import QRMerge from '@/views/QRMerge.vue'
import HtmlToExe from '@/views/HtmlToExe.vue'
import HomeView from '@/views/HomeView.vue'
import Login from '@/views/Login.vue'
import Register from '@/views/Register.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
    children: [
      {
        path: 'pinterest',
        name: 'pinterest',
        component: Pinterest,
      },
      {
        path: 'image-data',
        name: 'image-data',
        component: ImageData,
      },
      {
        path: 'phone-number',
        name: 'phone-number',
        component: PhoneNumber,
      },
      {
        path: 'html-to-apk',
        name: 'html-to-apk',
        component: HtmlToApk
      },
      {
        path: 'qr-merge',
        name: 'qr-merge',
        component: QRMerge
      },
      {
        path: 'html-to-exe',
        name: 'html-to-exe',
        component: HtmlToExe
      },
    ]
  },
  {
    path: '/login',
    name: 'login',
    component: Login,
    meta: { requiresAuth: false } // 标记为不需要认证的页面
  },
  {
    path: '/register',
    name: 'register',
    component: Register,
    meta: { requiresAuth: false } // 标记为不需要认证的页面
  }

]

// 如果存在 VITE_INCLUDE_ADMIN 环境变量，则添加 admin 路由
// if (import.meta.env.VITE_INCLUDE_ADMIN) {
if (true) {
  routes.push({
    path: '/admin',
    name: 'admin',
    component: () => import('@/admin/HomeView.vue'),
    meta: { requiresAuth: true }, // 需要认证
    children: [
      {
        path: 'qd',
        name: 'admin-qd',
        component: () => import('@/admin/qd.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: 'dnshe',
        name: 'admin-dnshe',
        component: () => import('@/admin/dnshe.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: 'send-email',
        name: 'send-email',
        component: () => import('@/admin/SendEmail.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: 'send-sms',
        name: 'send-sms',
        component: () => import('@/admin/SendSMS.vue'),
        meta: { requiresAuth: true }
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

// 全局导航守卫
router.beforeEach((to, from, next) => {
  // 检查路由是否需要认证
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth === true);

  // 如果路由需要认证但用户未登录，则重定向到登录页面
  if (requiresAuth) {
    const token = localStorage.getItem('token');
    if (!token) {
      next('/login');
    } else {
      next();
    }
  } else {
    next();
  }
});

export default router