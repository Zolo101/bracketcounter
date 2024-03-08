import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig, type PluginOption } from 'vite';

const fullReloadAlways: PluginOption = {
    name: 'full-reload-always',
    handleHotUpdate({ server }) {
        server.hot.send({ type: "full-reload" })
        return []
    },
} as PluginOption

export default defineConfig({
    server: {
        hmr: {

            overlay: false,
        }
    },
	plugins: [sveltekit(), fullReloadAlways],
});
