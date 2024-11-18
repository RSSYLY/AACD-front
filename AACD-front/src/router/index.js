import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      children:[
        {
          path: '/conference-list',
          name: 'conference-list',
          // route level code-splitting
          // this generates a separate chunk (About.[hash].js) for this route
          // which is lazy-loaded when the route is visited.
          component: () => import('../views/HomeViewPages/ConferenceListView.vue')
        },
        {
          path: '/news-list',
            name: 'news-list',
            component: () => import('../views/HomeViewPages/NewsListView.vue')
        },
        {
          path:'/search',
          name:'search',
          component:()=>import('../views/HomeViewPages/SearchView.vue'),
        }
      ]
    },

  ]
})

export default router


// 路由拦截器
router.beforeEach((to, from, next) => {
  if (to.path === '/') {
    next('/conference-list');
  } else {
    next();
  }
});


