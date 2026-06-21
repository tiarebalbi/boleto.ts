/// <reference types="vitest" />
import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    lib: {
      entry: 'src/main.ts',
      name: 'Boleto',
      fileName: 'boleto',
      formats: ['es', 'cjs'],
    },
    copyPublicDir: false,
  },
  test: {
    environment: 'jsdom',
    include: ['src/**/*.test.ts'],
  },
});
