import { createRouter, createWebHistory } from 'vue-router'
import Home from "@/views/Home"
import Setting from "@/views/Setting"
import Register from "@/views/Register"
import Login from "@/views/Login"
import UserStore from '@/state/User'

const routes = [
  {
    path: "/register",
    name: "register",
    component: Register
  },
  {
    path: "/login",
    name: "login",
    component: Login
  },
  {
    path: "/",
    name: "home",
    meta: {
      requiresAuth: true
    },
    component: Home
  },
  {
    path: "/setting",
    name: "setting",
    meta: {
      requiresAuth: true
    },
    component: Setting
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

router.beforeEach((to, from, next) => {
  const user = UserStore();
  if (to.meta.requiresAuth && !user.authenticated) {
    next({name: "login"});
    return;
  }

  next();
})

export default router
