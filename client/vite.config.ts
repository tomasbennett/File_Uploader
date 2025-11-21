import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(
      // {
      //   babel: {
      //     plugins: [['babel-plugin-react-compiler']],
      //   },
      // }
    ),
  ],
  build: {
    // rollupOptions: {
    //   input: {
    //     app1: path.resolve(__dirname, "./src/pages/home/index.html"),
    //     app2: path.resolve(__dirname, "./src/pages/extra/extra.html"),
    //   },
    // },
    outDir: "./dist",
  },
})
