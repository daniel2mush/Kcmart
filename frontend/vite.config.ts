import { defineConfig } from 'vite'
import { devtools } from '@tanstack/devtools-vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import viteReact from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  ssr: {
    noExternal: ['gsap', 'GSAP', '@gsap/react'],
  },

  resolve: {
    tsconfigPaths: true,
  },

  plugins: [
    devtools(),
    tanstackStart(),
    // netlify(),
    tailwindcss(),
    viteReact(),
  ],
})
