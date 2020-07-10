const proxy = require("http-proxy-middleware");

module.exports = (app) => {
    app.use(
        "/api",
        proxy({
            target: "https://ni.fe.up.pt/tts",
            changeOrigin: true,
        })
    );

    app.use(
        "/api-sigarra",
        proxy({
            target: "https://sigarra.up.pt/",
            changeOrigin: true,
        })
    );
};
