import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: "/",
  plugins: [react()],
  preview: {
    port: 3001,        // Set preview port to 3001
    strictPort: true,  // Ensure Vite uses port 3001 only
  },
  server: {
    port: 3001,        // Set development server port to 3001
    strictPort: true,  // Prevent fallback to another port
    host: true,        // Allows access from external IPs
    origin: "http://0.0.0.0:3001", // Public URL origin
  },
});
