"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const crypto_1 = __importDefault(require("crypto"));
const redis_1 = __importDefault(require("redis"));
const axios_1 = __importDefault(require("axios"));
const express_openid_connect_1 = require("express-openid-connect");
const SESSION_VALID_FOR = 8 * 60 * 60 * 1000;
const client = redis_1.default.createClient(parseInt(process.env.REDIS_PORT, 10), process.env.REDIS_HOST);
const config = {
    issuerBaseURL: process.env.CAS_AUTH_BASE_URL,
    baseURL: `https://${process.env.CONSOLE_APP_HOSTNAME}`,
    clientID: process.env.CAS_AUTH_CONSOLE_CLIENT_ID,
    clientSecret: process.env.CAS_AUTH_CONSOLE_CLIENT_SECRET,
    secret: process.env.SESSION_SECRET,
    authorizationParams: {
        response_type: 'code',
        scope: 'openid profile email'
    },
    idpLogout: false,
    session: {
        genid: () => crypto_1.default.randomBytes(16).toString('hex'),
        store: {
            get: (sid, callback) => {
                const key = crypto_1.default.createHmac('sha1', process.env.SESSION_SECRET).update(sid).digest().toString('base64');
                client.get(key, (err, data) => {
                    if (err)
                        return callback(err);
                    if (!data)
                        return callback(null);
                    let result;
                    try {
                        result = JSON.parse(data);
                    }
                    catch (err) {
                        return callback(err);
                    }
                    return callback(null, result);
                });
            },
            set: (sid, data, callback) => {
                const key = crypto_1.default.createHmac('sha1', process.env.SESSION_SECRET).update(sid).digest().toString('base64');
                client.set(key, JSON.stringify(data), callback);
            },
            destroy: (sid, callback) => {
                const key = crypto_1.default.createHmac('sha1', process.env.SESSION_SECRET).update(sid).digest().toString('base64');
                client.del(key, callback);
            },
        },
        absoluteDuration: SESSION_VALID_FOR,
        cookie: {
            domain: process.env.HOSTNAME,
            secure: true,
        }
    },
    afterCallback: async (req, res, session) => {
        try {
            const additionalUserClaims = await (0, axios_1.default)(process.env.CAS_AUTH_BASE_URL + '/profile', {
                headers: {
                    Authorization: 'Bearer ' + session.access_token
                }
            });
            // @ts-ignore
            req.appSession.openidTokens = session.access_token;
            // @ts-ignore
            req.appSession.userIdentity = additionalUserClaims.data;
            const { sub, name } = additionalUserClaims.data;
            // const { userId, semesterId } = await getUserData(sub, name!);
            const userId = '20605387';
            const semesterId = 'testing2213';
            res.cookie('semester', semesterId, { maxAge: SESSION_VALID_FOR, httpOnly: false, domain: `.${process.env.HOSTNAME}` });
            res.cookie('user', userId, { maxAge: SESSION_VALID_FOR, httpOnly: false, domain: `.${process.env.HOSTNAME}` });
            res.cookie('client', process.env.CAS_AUTH_CONSOLE_CLIENT_ID, { maxAge: SESSION_VALID_FOR, httpOnly: true, domain: `.${process.env.HOSTNAME}` });
        }
        catch (error) {
            throw error;
        }
        return {
            ...session,
        };
    }
};
exports.default = (0, express_openid_connect_1.auth)(config);
