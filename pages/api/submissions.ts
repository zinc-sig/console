import { withSentry } from "@sentry/nextjs";
import type { NextApiRequest, NextApiResponse } from "next"
import { copyFile } from "fs";
import formidable from "formidable-serverless";
import axios from "axios";


interface Submission {
  stored_name: string
  upload_name: string
  extracted_path?: string
  checksum: string
  fail_reason?: string
  remarks?: string[]
  size: number,
  assignment_config_id: number
  user_id: number
}

async function submit(cookie: string, submission: Submission) {
  try {
    const { data: { data } } = await axios({
      method: 'post',
      headers: {
        cookie
      },
      url: `https://${process.env.API_URL}/v1/graphql`,
      data: {
        query: `
          mutation addSubmissionEntry($submission: submissions_insert_input!) {
            createSubmission(
              object: $submission
            ){ id }
          }
        `,
        variables: { submission }
      },
    });
    return data.createSubmission;
  } catch (error) {
    throw error;
  }
}

async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const form = new formidable.IncomingForm({
      multiples: true,
      hash: 'sha256',
      keepExtensions: true,
      encoding: 'utf-8'
    });
    form.parse(req, async (err, fields, { files }) => {
      if(err) {
        throw err;
      } else {
        const assignmentConfigId = parseInt(fields.assignmentConfigId, 10);
        const userId = parseInt(fields.userId, 10);
        if(files.hash!==fields[`checksum;${files.name}`]) {
          return res.status(500).json({
            status: 'error',
            error: 'Checksum mismatched, potential transmission corruption detected'
          });
        }
        const destinationFilename = `submitted/${files.lastModifiedDate.getTime()}_${userId}_${files.path.replace(`/tmp/`, '')}`
        const submission: Submission = {
          stored_name: destinationFilename,
          upload_name: files.name,
          assignment_config_id: assignmentConfigId,
          size: files.size,
          checksum: files.hash,
          user_id: userId
        }
        try {
          copyFile(files.path, `${process.env.NEXT_PUBLIC_UPLOAD_DIR}/${destinationFilename}`, async (err) => {
            if(!err) {
              await submit(req.headers.cookie!, submission);
              return res.json({
                status: 'success'
              });
            }
          });
        } catch (error: any) {
          if (error.message.includes(`Cannot read property 'createSubmission' of undefined`)) {
            return res.status(403).json({
              status: 'error',
              error: 'Timeline misalignment for requested submission'
            })
          }
          else {
            return res.status(500).json({
              status: 'error',
              error: error.message
            });
          }
        }
      }
    });
  } catch (error: any) {
    return res.status(500).json({
      status: 'error',
      error: error.message
    })
  }
}

export default withSentry(handler);

export const config = {
  api: {
    externalResolver: true,
    bodyParser: false
  }
}