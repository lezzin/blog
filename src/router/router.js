import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: "/",
            component: () => import("../views/Home.vue")
        },
        {
            path: "/admin",
            component: () => import("../views/Admin.vue")
        },
        {
            path: "/post/:id",
            component: () => import("../views/Post.vue")
        },
        {
            path: '/:catchAll(.*)',
            component: () => import("../views/NotFound.vue")
        }
    ]
})

export default router;