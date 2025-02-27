import type { AvailableLocales } from "@/utils/i18n";
import type { RouteRecordRaw } from "vue-router";
import { i18n, inferPreferredLocale, setLocale } from "@/utils/i18n";
import { createRouter, createWebHistory, RouterView } from "vue-router";

export const routes: RouteRecordRaw[] = [
  {
    path: "/:locale?",
    component: RouterView,
    beforeEnter: async (to, from, next) => {
      const lang = to.params.locale as AvailableLocales;
      if (!i18n.global.availableLocales.includes(lang)) {
        return next(inferPreferredLocale());
      }

      await setLocale(lang);

      return next();
    },
    children: [
      {
        path: "",
        name: "root",
        component: () => import("@/pages/home/index.vue"),
      },
    ],
  },
];

export const router = createRouter({
  history: createWebHistory(),
  routes,
});
