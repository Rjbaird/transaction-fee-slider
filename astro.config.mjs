import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import solidJs from "@astrojs/solid-js";
import netlify from "@astrojs/netlify/edge-functions";
export default defineConfig({
    integrations: [tailwind(), solidJs()],
    output: "server",
    adapter: netlify(),
});
