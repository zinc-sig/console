import crypto from "crypto";
import redis from "redis";
import axios from "axios";
import { auth, ConfigParams } from "express-openid-connect";
import { getUserData } from "../utils/user";

const SESSION_VALID_FOR = 1 * 60 * 60 * 1000;
const client = redis.createClient(parseInt(process.env.REDIS_PORT!, 10),process.env.REDIS_HOST);

const config: ConfigParams = {
  issuerBaseURL: process.env.OIDC_BASE_URL,
  baseURL: `https://${process.env.HOSTNAME}`,
  clientID: process.env.OIDC_CLIENT_ID,
  clientSecret: process.env.OIDC_CLIENT_SECRET,
  secret: process.env.SESSION_SECRET,
  authorizationParams:{
    response_type: 'code',
    scope: 'openid profile email'
  },
  idpLogout: false,
  session:{
    genid: () => crypto.randomBytes(16).toString('hex'),
    store: {
      get: (sid, callback) => {
        const key = crypto.createHmac('sha1', process.env.SESSION_SECRET!).update(sid).digest().toString('base64');
        client.get(key, (err, data)=>{
          if(err) return callback(err)
          if(!data) return callback(null)

          let result
          try{
            result = JSON.parse(data);
          }catch(err){
            return callback(err)
          }
          return callback(null, result)
        });
      },
      set: (sid, data, callback) => {
        const key = crypto.createHmac('sha1', process.env.SESSION_SECRET!).update(sid).digest().toString('base64');
        client.set(key, JSON.stringify(data),'EX', 86400, callback)
      },
      destroy: (sid,callback) => {
        const key = crypto.createHmac('sha1', process.env.SESSION_SECRET!).update(sid).digest().toString('base64');
        client.del(key, callback)
      },
    },
    absoluteDuration: 60 * 60,
    cookie: {
      domain: process.env.HOSTNAME?.replace('console.', ''),
      secure: true,
    }
  },
  afterCallback: async (req, res, session) => {
    try {
      const additionalUserClaims = await axios('https://graph.microsoft.com/oidc/userinfo', {
        headers:{
          Authorization: 'Bearer ' + session.access_token
        }
      });
      // @ts-ignore
      req.appSession!.openidTokens = session.access_token;
      // @ts-ignore
      req.appSession!.userIdentity = additionalUserClaims.data;
      const { email, name } = additionalUserClaims.data;
      const [itsc, domain] = email.split('@');
      const firstName = name.substring(0, name.lastIndexOf(' '));
      const lastName = name.substring(name.lastIndexOf(' ')+1, name.length);
      const { userId, semesterId } = await getUserData(itsc, `${lastName}, ${firstName}`);
      res.cookie('semester', semesterId, { maxAge: SESSION_VALID_FOR, httpOnly: false, domain: `.${process.env.HOSTNAME?.replace('console.', '')}` });
      res.cookie('user', userId, { maxAge: SESSION_VALID_FOR, httpOnly: false, domain: `.${process.env.HOSTNAME?.replace('console.', '')}` });
      res.cookie('itsc', itsc, { maxAge: SESSION_VALID_FOR, httpOnly: false, domain: `.${process.env.HOSTNAME?.replace('console.', '')}` });
      res.cookie('domain', domain, { maxAge: SESSION_VALID_FOR, httpOnly: false, domain: `.${process.env.HOSTNAME?.replace('console.', '')}` });
      res.cookie(
        'client',
        process.env.OIDC_CLIENT_ID,
        { maxAge: SESSION_VALID_FOR, httpOnly: true, domain: `.${process.env.HOSTNAME?.replace('console.', '')}` });
    } catch (error) {
      throw error
    }
    return {
      ...session,
    };
  },
  // @ts-ignore
  routes: {
    postLogoutRedirect: process.env.POST_LOGOUT_REDIRECT_URI
  }
}

export default auth(config);
