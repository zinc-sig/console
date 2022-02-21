"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const next_1 = __importDefault(require("next"));
const oauth_1 = __importDefault(require("./oauth"));
const dev = process.env.NODE_ENV !== "production";
const app = (0, next_1.default)({ dev });
const handle = app.getRequestHandler();
const port = process.env.PORT || 3000;
(async () => {
    try {
        await app.prepare();
        const server = (0, express_1.default)();
        server.enable('trust proxy');
        server.use((0, cors_1.default)());
        server.use(oauth_1.default);
        server.get('/logout', (req, res) => {
            // @ts-ignore
            req.appSession.destroy((err) => {
                if (err) {
                    console.error(err);
                }
                res.oidc.logout({ returnTo: process.env.POST_LOGOUT_REDIRECT_URI });
            });
            res.oidc.logout({ returnTo: process.env.POST_LOGOUT_REDIRECT_URI });
        });
        server.get('/service-worker.js', (req, res) => {
            app.serveStatic(req, res, './.next/service-worker.js');
        });
        const serviceWorkers = [
            {
                filename: 'service-worker.js',
                path: './.next/service-worker.js',
            },
            {
                filename: 'firebase-messaging-sw.js',
                path: './public/fcm-sw.js',
            },
        ];
        serviceWorkers.forEach(({ filename, path }) => {
            server.get(`/${filename}`, (req, res) => {
                app.serveStatic(req, res, path);
            });
        });
        server.all('*', (req, res) => handle(req, res));
        server.listen(port, (err) => {
            if (err)
                throw err;
            console.log(`> Ready on localhost:${port} - env ${process.env.NODE_ENV}`);
        });
    }
    catch (e) {
        console.error(e);
        process.exit(1);
    }
})();
