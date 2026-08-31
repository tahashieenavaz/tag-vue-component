import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

export default defineConfig({
  plugins: [vue()],
  // Relative assets work both locally and on a GitHub project page.
  base: "./",
});
