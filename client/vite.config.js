import react from "@vitejs/plugin-react-swc";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
  server: {
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
