import type { NextApiRequest, NextApiResponse } from "next";
import { withSentry } from "@sentry/nextjs";
import axios from "axios";
import { Workbook } from "exceljs";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { assignmentConfigId, viewingTaskAssignedGroups } = req.query;
    const { data: { data } } = await axios({
      method: 'post',
      headers: {
        cookie: req.headers.cookie
      },
      url: process.env.API_URL,
      data: {
        query: `
          query getSubmissionsForAssignmentConfig($id: bigint!) {
            assignmentConfig(id: $id) {
              dueAt
              assignment {
                name
              }
              submissions(
                distinct_on: [user_id]
                order_by: [
                  { user_id: asc }
                  { created_at: desc }
                ]
              ) {
                id
                isLate
                created_at
                reports(
                  limit: 1
                  order_by: {
                    createdAt: desc
                  }
                ) {
                  grade
                }
                user {
                  itsc
                  name
                }
              }
            }
          }
        `,
        variables: { id: assignmentConfigId }
      },
    });
    const { assignment, submissions, dueAt } = data.assignmentConfig;
    const workbook = new Workbook();
    workbook.creator = 'Zinc by HKUST CSE Department';
    workbook.created = new Date();
    const sheet = workbook.addWorksheet(`grades ${viewingTaskAssignedGroups??''}`);
    const defaultColumns = [
      { header: 'ITSC', key: 'itsc', width: 16 },
      { header: 'Name', key: 'name', width: 32 },
      { header: 'Score', key: 'score', width: 16 },
      { header: 'Late Submission', key: 'late', width: 16 }
    ];
    // @ts-ignore
    sheet.columns = defaultColumns;
    for (const submission of submissions) {
      const { name, itsc } = submission.user;
      const dueDate = new Date(dueAt);
      const submittedDate = new Date(submission.created_at);
      if (submission.reports.length > 0) {
        const [report] = submission.reports;
        if(report.grade!==null && report.grade.hasOwnProperty('details')) {
          let subgradeColumns: any = [];
          for(const subGradeReport of report.grade.details.reports) {
            if (sheet.columns.map(column => column.key).indexOf(subGradeReport['stageReportPath'])===-1) {
              subgradeColumns.push({ header: subGradeReport['displayName'], key: subGradeReport['hash'], width: 32});
            }
          }
          // @ts-ignore
          sheet.columns = [...defaultColumns, ...subgradeColumns];
          const subgradeReports = report.grade.details.reports.reduce((a,c) => { a[c.hash] = c.score; return a }, {})
          sheet.addRow({
            itsc,
            name,
            score: report.grade.details.accScore,
            late: submission.isLate?`${((submittedDate.getTime() - dueDate.getTime())/1000/60).toFixed(2)} mins`:'',
            ...subgradeReports
          });
        }
        else {
          sheet.addRow({
            itsc,
            name,
            score: report.grade===null?'N/A':`${report.grade.score}`,
            late: submission.isLate?`${((submittedDate.getTime() - dueDate.getTime())/1000/60).toFixed(2)} mins`:''
          });
        }
      } else {
        sheet.addRow({
          itsc,
          name,
          score: 'N/A'
        });
      }
    }
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader("Content-Disposition", "attachment; filename=" + "Report.xlsx");
    await workbook.xlsx.write(res);
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