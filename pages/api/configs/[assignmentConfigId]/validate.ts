import type { NextApiRequest, NextApiResponse } from "next";
import { withSentry } from "@sentry/nextjs";
import redis from "redis";
import { v4 as uuidv4 } from "uuid";

const port = parseInt(process.env.REDIS_PORT!, 10);
const topic = `configValidated`;
const subscriber = redis.createClient(port, process.env.REDIS_HOST!);
const publisher = redis.createClient(port, process.env.REDIS_HOST!);

subscriber.subscribe(topic);

async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method!.toLowerCase() === 'post') {
      const { yaml } = req.body;
      const id = uuidv4();
      publisher.publish(`validateConfig`, JSON.stringify({
        id,
        config_yaml: yaml
      }));
      subscriber.on(`message`, (channel, message) => {
        const payload = JSON.parse(message);
        if (channel===topic && payload.id===id) {
          return res.json(payload);
        }
      });
    } else {
      return res.status(400).send('bad request');
    }
  } catch (error) {
    return res.status(500).json(error)
  }
}

export default withSentry(handler);

export const config = {
  api: {
    externalResolver: true
  }
}