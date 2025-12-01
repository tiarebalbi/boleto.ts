import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'

export default defineConfig({
  plugins: [
    dts({
      include: ['src'],
      rollupTypes: true
    })
  ],
  build: {
    lib: {
      entry: 'src/main.ts',
      name: 'Boleto',
      fileName: 'boleto',
      formats: ['es', 'cjs']
    },
    copyPublicDir: false
  }
})
