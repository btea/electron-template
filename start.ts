const { createServer } = require('vite');
const vue = require('@vitejs/plugin-vue');
const { exec } = require('child_process');
const port = 2233;

(async () => {
    const server = await createServer({
        // 任何合法的用户配置选项，加上 `mode` 和 `configFile`
        configFile: false,
        root: __dirname,
        server: {
            port
        },
        plugins: [vue()]
    });
    await server.listen();
    exec('pnpm run start');
})();

module.exports = {
    port
};
