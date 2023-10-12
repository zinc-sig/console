import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Report } from "./Report/index";
import { useLayoutDispatch } from "../contexts/layout";
import { useRouter } from "next/router";

export function Submission({ submission }) {
  const now = new Date();
  const router = useRouter();
  const dispatch = useLayoutDispatch();

  const regrade = async () => {
    const { assignmentConfigId } = router.query;
    dispatch({ type: 'confirmRegrading', payload: { assignmentConfigId, submissions: [submission.id] } });
  }

  const submittedDate = new Date(`${submission.created_at}Z`);
  return (
    <li>
      <ul>
        {
          submission.reports.map(report => (
            <Report key={report.id} report={report} user={submission.user}/>
          ))
        }
      </ul>
      {
        (submission.fail_reason || submission.extracted_path === null) && (
          <>
            <div className="mx-12 h-12 border-l-2"></div>
            <div className="mx-8 flex justify-between">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-red-500 rounded-full flex justify-center items-center">
                  <FontAwesomeIcon className="text-white" icon={['fad', 'file-archive']}/>
                </div>
                <p className="ml-2 text-sm text-gray-600 flex flex-col">
                  Error occurred during decompression for the submitted archive
                  <span className="text-xs font-medium">Reason: {
                    submission.fail_reason??'Possible data corruption detected, decompressor failed to process the archive'
                  }</span>
                </p>
              </div>
            </div>
          </>
        )
      }
      <div className="mx-12 h-12 border-l-2"></div>
      <div className="mx-8 flex justify-between">
        <div className="flex items-center">
          <div className="w-8 h-8 bg-gray-300 rounded-full flex justify-center items-center" data-flow="up" aria-label={`#${submission.id}`}>
            <FontAwesomeIcon icon={['fad', 'folder-upload']}/>
          </div>
          <p className="ml-2 text-sm text-gray-600">
            {submission.user.name} submitted on 
            <span className="ml-1">
              { `${submittedDate.toLocaleDateString('en-HK',{ month: 'short', day: 'numeric', ...(submittedDate.getFullYear()!==now.getFullYear()&&{ year: 'numeric' }) })} at ${submittedDate.toLocaleTimeString("en-US", { hour12: false, timeZone: "Asia/Hong_Kong" })}` }
            </span>
          </p>
        </div>
        <span className="relative z-0 inline-flex shadow-sm rounded-lg">
          <button
            onClick={regrade}
            type="button"
            disabled={submission.extracted_path===null}
            className={`${submission.extracted_path===null?'opacity-25 cursor-not-allowed ':''}relative inline-flex items-center px-3 py-1.5 rounded-l-lg border border-gray-300 bg-white text-xs leading-5 font-medium text-blue-700 hover:text-blue-500 focus:z-10 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:bg-gray-100 active:text-blue-800 transition ease-in-out duration-150`}>
            Regrade
          </button>
          <Link href={`/api/download/submissions/${submission.id}`}>
            <a className="-ml-px relative inline-flex items-center px-3 py-1.5 rounded-r-lg border border-gray-300 bg-white text-xs leading-5 font-medium text-blue-700 hover:text-blue-500 focus:z-10 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:bg-gray-100 active:text-blue-500 transition ease-in-out duration-150">
              Download
            </a>
          </Link>
        </span>
      </div>
    </li>
  )
}
