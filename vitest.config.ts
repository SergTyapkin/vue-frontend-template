import { defineConfig } from 'vitest/config';
import vue from '@vitejs/plugin-vue';
export default defineConfig({
  plugins: [vue()],
  test: {
    environment: 'happy-dom',
    include: ['tests/unit/**/*.test.ts'],
    coverage: {
      provider: 'v8',
      include: [
        'shared/api/client/create-client.ts',
        'pwa/offline/download.ts',
        'features/auth/access.ts',
        'shared/validation/schema.ts',
      ],
    },
  },
});
