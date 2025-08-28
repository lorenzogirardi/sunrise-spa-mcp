import { createApp, provide, h } from 'vue';
import { DefaultApolloClient } from '@vue/apollo-composable';
import App from './App.vue';
import { apolloClient } from './apollo';
import router from './router';
import VueGoogleMaps from '@fawmi/vue-google-maps';
import i18n from './i18n';
import aiIntegrationPlugin from './plugins/aiIntegration.js';
import 'presentation/assets/scss/main.scss';

const app = createApp({
  setup() {
    provide(DefaultApolloClient, apolloClient);
  },

  render: () => h(App),
})
  .use(VueGoogleMaps, {
    load: {
      key: process.env.VUE_APP_GOOGLE_MAPS_API_KEY,
      libraries: 'places',
    },
  })
  .use(i18n)
  .use(router)
  .use(aiIntegrationPlugin, {
    enableMCP: true,
    enableStructuredData: true,
    enableSEO: true,
    debug: process.env.NODE_ENV === 'development'
  });

app.mount('#app');
