import type { NextApiRequest, NextApiResponse } from "next";
import { withSentry } from "@sentry/nextjs";
import axios from "axios";

async function handler (req:  NextApiRequest, res: NextApiResponse) { 
  try {
    await axios({
      method: 'post',
      url: `http://${process.env.WEBHOOK_ADDR}/trigger/manualGradingTask/${req.query.assignmentConfigId}`,
      data: req.body
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

export default withSentry(handler);

export const config = {
  api: {
    externalResolver: true
  }
}