import type { NextApiRequest, NextApiResponse } from "next";
import { withSentry } from "@sentry/nextjs";
import { existsSync, readFileSync } from "fs";
import axios from "axios";
import AdmZip from "adm-zip";
import { GET_ALL_SUBMISSIONS_FOR_ASSIGNMENT } from "../../../../graphql/queries/admin";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { assignmentConfigId } = req.query;
    const { data: { data } } = await axios({
      method: 'post',
      headers: {
        cookie: req.headers.cookie
      },
      url: process.env.API_URL,
      data: {
        query: GET_ALL_SUBMISSIONS_FOR_ASSIGNMENT,
        variables: { 
          assignmentConfigId
        }
      },
    });
    const zip = new AdmZip();
    const { submissions, assignment } = data.assignmentConfig;
    for(const submission of submissions) {
      const targetEntry = `${process.env.SHARED_MOUNT_PATH}/${submission.stored_name}`;
      if (existsSync(targetEntry)) {
        zip.addFile(`${submission.user.itsc}/${submission.upload_name}`, readFileSync(targetEntry));
      }
    }
    const archive = zip.toBuffer();
    res.setHeader('Content-Type','application/octet-stream');
    res.setHeader('Content-Disposition',`attachment; filename=${`${assignment.course.code}_${assignment.course.semester.year}-${assignment.course.semester.term}`.toLowerCase()}_submissions_latest.zip`);
    res.send(archive);
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