import react from "@vitejs/plugin-react-swc";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    host: "0.0.0.0",
    port: process.env.PORT || 3000,
    proxy: {
      "/api": {
        target: process.env.API_URL || "http://localhost:3000",
        secure: false,
      },
    },
    plugins: [react()],
  },
});
