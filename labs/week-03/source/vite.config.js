import { defineConfig } from "vite";

const repositoryName = "engse203-student-labs-6501234567-6";

export default defineConfig({
  base: `/${repositoryName}/labs/week-03/`,
  build: {
    outDir: "docs",
    emptyOutDir: true,
  },
});