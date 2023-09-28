import { defineConfig, loadEnv } from "vite";
import pluginRewriteAll from "vite-plugin-rewrite-all";

// https://vitejs.dev/config/
// export default defineConfig({
//   plugins: [react()],
//   define: {
//     'process.env': process.env
//   }
// })

export default ({ mode }) => {
  // Load app-level env vars to node-level env vars.
  process.env = { ...process.env, ...loadEnv(mode, process.cwd()) };

  return defineConfig({
    // To access env vars here use process.env.TEST_VAR
    base: "./",
    server: {
      host: true
    },
    plugins: [pluginRewriteAll()]
  });
};
