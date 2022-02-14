import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

export default async function (req:  NextApiRequest, res: NextApiResponse) { 
  try {
    const { topic } = req.query;
    await axios({
      method: 'post',
      url: `http://${process.env.WEBHOOK_ADDR}/trigger/notifications/subscribe/${topic}`,
      data: JSON.parse(req.body)
    });
    res.json({
      status: 'success'
    });
  } catch (error: any) {
    return res.status(500).json({
      status: 'error',
      error: error.message
    });
  }
}

export const config = {
  api: {
    externalResolver: true
  }
}