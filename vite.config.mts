import { defineConfig } from 'vite';
import pluginVue from '@vitejs/plugin-vue';
import pluginBasicSsl from '@vitejs/plugin-basic-ssl';
import path from 'path';
import pluginStylelint from 'vite-plugin-stylelint';
import { VitePWA } from 'vite-plugin-pwa';
import { viteStaticCopy } from 'vite-plugin-static-copy';

export default defineConfig({
  plugins: [
    pluginVue({
      include: [/\.vue$/],
    }),
    pluginBasicSsl(),
    {
      name: 'prettier',
    },
    pluginStylelint(),
    viteStaticCopy({
      targets: [
        { src: 'static/favicon.ico', dest: 'static' },
        { src: 'robots.txt', dest: '.' },
      ],
    }),
    VitePWA({
      registerType: 'prompt',
      manifest: {
        short_name: 'Frontend Template',
        name: 'Frontend template with all best-practice instruments',
        description: 'Some description of our service',
        icons: [
          {
            src: '/static/favicon.ico',
            sizes: '32x32',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
        theme_color: '#181818',
        background_color: '#181818',
        display: 'standalone',
        id: '/?source=pwa',
        start_url: '/?source=pwa',
        scope: '/',
        prefer_related_applications: false,
        shortcuts: [
          {
            name: 'Home',
            short_name: 'Home',
            description: 'Our base page',
            url: '/?source=pwa',
          },
        ],
      },
    }),
  ],
  define: {
    BUILD_TIMESTAMP: Date.now(),
    VERSION: JSON.stringify(import('./package.json').version),
  },
  server: {
    https: true,
    proxy: {
      // '/ws': {
      //   target: `ws://127.0.0.1:9000`,
      //   secure: true,
      //   ws: true,
      //   changeOrigin: true,
      // },
      '/api': {
        target: `http://127.0.0.1:9000`,
        secure: false,
        changeOrigin: false,
        rewrite: path => path.replace(/^\/api/, ''),
      },
    },
  },
  resolve: {
    alias: [
      {
        find: '~', // to use ~ as project root like: "import Some from '../../components/Some.vue'"
        replacement: path.resolve(__dirname, 'src'),
      },
      {
        find: '@~', // to use @~ as node_modules root like: "import Some from '@../../Some'"
        replacement: path.resolve(__dirname, 'node_modules'),
      },
    ],
  },
  build: {
    // chunkSizeWarningLimit: 600,
    cssCodeSplit: false,
  },
});
