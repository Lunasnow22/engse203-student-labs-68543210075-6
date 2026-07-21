import { defineConfig } from "vite";

const repositoryName = "engse203-student-labs-68543210075-6";

export default defineConfig({
  base: `/${repositoryName}/labs/week-02/`,
  build: {
    outDir: "docs",
    emptyOutDir: true,
  },
});