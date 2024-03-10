import { defineConfig, PluginOption } from "vite";
import pugPlugin from "vite-plugin-pug";
import * as path from "path";
import * as prettier from "prettier";
import viteImagemin from "vite-plugin-imagemin";
import autoprefixer from "autoprefixer";

const formatHtmlPlugin = (): PluginOption => ({
    name: "beautify-html",
    transformIndexHtml: {
        order: "post",
        handler: async (html) =>
            html.replace(
                html,
                await prettier.format(html, {
                    parser: "html",
                    htmlWhitespaceSensitivity: "ignore",
                    tabWidth: 4,
                    printWidth: 100,
                }),
            ),
    },
});

export default defineConfig({
    root: "./src",
    plugins: [
        pugPlugin(),
        formatHtmlPlugin(),
        viteImagemin({
            gifsicle: {
                optimizationLevel: 7,
                interlaced: false,
            },
            optipng: {
                optimizationLevel: 7,
            },
            mozjpeg: {
                quality: 80,
            },
            pngquant: {
                quality: [0.65, 0.9],
                speed: 4,
            },
            svgo: {
                plugins: [
                    {
                        name: "removeViewBox",
                        active: false,
                    },
                    {
                        name: "removeEmptyAttrs",
                        active: false,
                    },
                ],
            },
        }),
    ],
    css: {
        postcss: {
            plugins: [autoprefixer()],
        },
    },
    publicDir: "../public",
    build: {
        minify: false,
        outDir: "../dist",
        emptyOutDir: true,
        rollupOptions: {
            input: {
                app: "./src/pages/index.html",
            },
        },
    },
    resolve: {
        alias: { "/src": path.resolve(process.cwd(), "src") },
    },
    server: {
        open: "./pages/index.html",
    },
});
