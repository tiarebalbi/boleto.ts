import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'

export default defineConfig({
  plugins: [
    dts({
      include: ['src'],
      rollupTypes: true,
      fileName: 'boleto.d.ts'
    })
  ],
  build: {
    lib: {
      entry: 'src/main.ts',
      name: 'BoletoTS',
      fileName: 'boleto',
      formats: ['es', 'cjs']
    },
    copyPublicDir: false
  }
})
