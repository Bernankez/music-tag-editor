import { createPinia } from "pinia";
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";
import { createApp } from "vue";
import App from "./App.vue";
import { router } from "./router";
import { i18n } from "./utils/i18n";
import "./styles/var.css";
import "./styles/global.css";
import "./styles/index.css";
// Style reset should before unocss
import "@unocss/reset/tailwind.css";
import "virtual:uno.css";

const app = createApp(App);

const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);

app.use(i18n);
app.use(router);
app.use(pinia);
app.mount("#app");
