import react from "@vitejs/plugin-react-swc";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    host: "0.0.0.0",
    port: process.env.PORT || 3000,
    proxy: {
      "/api": {
        target: "https://swswbs-survey.onrender.com",
        changeOrigin: true,
        secure: true
      }
    },
    plugins: [react()]
  }
});
