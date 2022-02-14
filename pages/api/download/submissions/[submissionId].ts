import type { NextApiRequest, NextApiResponse } from "next";
import { withSentry } from "@sentry/nextjs";
import axios from "axios";
import { readFileSync } from "fs";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { submissionId } = req.query;
    const { data: { data } } = await axios({
      method: 'post',
      headers: {
        cookie: req.headers.cookie
      },
      url: process.env.API_URL,
      data: {
        query: `
          query getSubmission($id: bigint!) {
            submission(
              id: $id
            ){
              stored_name
              upload_name
              created_at
            }
          }
        `,
        variables: { id: submissionId }
      },
    });
    const { stored_name, upload_name, created_at } = data.submission;
    const buffer = readFileSync(`${process.env.SHARED_MOUNT_PATH}/`+stored_name);
    res.setHeader('Content-Type','application/octet-stream');
    res.setHeader('Content-Disposition',`attachment; filename=${(new Date(created_at)).getTime()}_${upload_name}`);
    res.send(buffer);
  } catch (error: any) {
    return res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
}

export default withSentry(handler);

export const config = {
  api: {
    externalResolver: true
  }
}