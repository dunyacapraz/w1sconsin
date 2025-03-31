import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // Add JSON import support
  json: {
    namedExports: true,
    stringify: true
  }
})