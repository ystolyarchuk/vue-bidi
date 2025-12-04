import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { resolve } from 'path';
import dts from 'vite-plugin-dts';

export default defineConfig({
  plugins: [
    vue(),
    dts({
      insertTypesEntry: false,
      include: ['projects/vue-bidi/src/**/*'],
      exclude: ['projects/vue-bidi/src/**/*.spec.ts', 'projects/vue-bidi/src/**/*.test.ts', 'projects/vue-bidi/src/test'],
      outDir: 'dist/vue-bidi',
      rollupTypes: true,
      entryRoot: 'projects/vue-bidi/src',
      copyDtsFiles: false,
    }),
  ],
  build: {
    lib: {
      entry: resolve(__dirname, 'projects/vue-bidi/src/index.ts'),
      name: 'VueBidi',
      formats: ['es'],
      fileName: () => 'vue-bidi.mjs',
    },
    outDir: 'dist/vue-bidi/fesm2022',
    rollupOptions: {
      external: ['vue'],
      output: {
        globals: {
          vue: 'Vue',
        },
        entryFileNames: 'vue-bidi.mjs',
      },
    },
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'projects/vue-bidi/src'),
    },
  },
});

