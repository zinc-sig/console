import { useQuery } from "@apollo/client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useLayoutDispatch, useLayoutState } from "../../contexts/layout";
import { GET_REPORT } from "../../graphql/queries/user";
import { Spinner } from "../Spinner";
import { CompileStageReportView } from "./CompileStageReport";
import { DiffWithSkeletonStageView } from "./DiffWithSkeletonStageReport";
import { FileStructureValidationStageReportView } from "./FileStructureValidationStageReport"
import { ScoringStageView } from "./ScoringStageReport";
import { StdioTestStageReportView } from "./StdioTestStageReport";
import { ValgrindStageView } from "./ValgrindStageReport";
import { MakeStageReportView } from "./MakeStageReport";
import { GTestStageReportView } from "./GTestStageReport";
import { JUnitStageReportView } from "./JUnitStageReport";

export function Report({ report, user }) {
  const dispatch = useLayoutDispatch();
  const reportGeneratedDate = new Date(report.createdAt);
  reportGeneratedDate.setTime(reportGeneratedDate.getTime()+8*60*60*1000);
  // const stageCount = Object.keys(report.pipeline_results.stageReports).length
  // const errorCount = Object.keys(report.pipeline_results).filter(entity => entity.includes('Error')&&report.pipeline_results[entity]).length
  const now = new Date()
  const date = reportGeneratedDate.toLocaleDateString('en-HK',{ month: 'short', day: 'numeric', ...(reportGeneratedDate.getFullYear()!==now.getFullYear()&&{ year: 'numeric' }) });
  return (
    <li>
      <div className="mx-12 h-12 border-l-2"></div>
      <div className="mx-8 flex justify-between">
        <div className="flex items-center">
          <div className="w-8 h-8 bg-cse-600 rounded-full flex justify-center items-center">
            <FontAwesomeIcon className="text-white" icon={['fad', 'clipboard-list-check']}/>
          </div>
          <div className="ml-2 flex flex-col">
            <p className="text-sm text-gray-600">
              Auto Grader graded { user.name }&apos;s submission on 
              <span
                className="ml-1">
                { `${date} at ${reportGeneratedDate.toLocaleTimeString().toLocaleLowerCase()}` }
                { report.is_final && (
                  <FontAwesomeIcon  className="ml-2 text-green-400" icon={['fad', 'badge-check']} size="lg"/>
                ) }
              </span>
            </p>
            {/* <p className="text-xs">Pipeline for your submission has {stageCount} stages, {errorCount} errors have been detected</p> */}
          </div>
        </div>
        <span className="inline-flex rounded-lg shadow-sm">
          <button onClick={() => dispatch({ type: 'viewReport', payload: report.id })} type="button" className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs leading-4 font-medium rounded-lg text-blue-700 bg-white hover:text-blue-500 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:text-blue-800 active:bg-gray-50 transition ease-in-out duration-150">
            View details
          </button>
        </span>
      </div>
    </li>
  )
}

export function ReportSlideOver() {
  const dispatch = useLayoutDispatch();
  const { reportId } = useLayoutState();
  const { data, loading } = useQuery(GET_REPORT, {
    variables: {
      id: reportId
    }
  })
  const now = new Date()

  return (
    <div className="h-full divide-y divide-gray-200 flex flex-col bg-gray-100 shadow-xl">
      <div className="flex-1 h-0 overflow-y-auto">
        <header className="space-y-1 py-6 px-4 bg-cse-700 sm:px-6">
          <div className="flex items-center justify-between space-x-3">
            <h2 className="text-lg leading-7 font-medium text-white">
              {
                !loading && data.report.is_final && (
                  <FontAwesomeIcon className={`mr-2 text-green-400`} icon={['fad', 'badge-check']} size="lg" data-flow="up" aria-label="This assessment report reflects your final score"/>
                )
              }
              Submission Report #{reportId}
            </h2>
            <div className="h-7 flex items-center">
              <button onClick={() => dispatch({ type: 'closeSlideOver'} )} aria-label="Close panel" className="text-indigo-200 hover:text-white focus:outline-none transition ease-in-out duration-150">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
          <div>
            <p className="text-sm leading-5 text-indigo-300 flex">
              Generated on {
                loading?(
                <span className="ml-2">
                  <Spinner />
                </span>):(
                  (new Date(data.report.createdAt)).toLocaleDateString('en-US',{ month: 'short', day: 'numeric', year: 'numeric' })
                )
              }
            </p>
          </div>
        </header>
        <div className="mt-6 border-b border-gray-200">
          <div className="px-6">
            <nav className="-mb-px flex space-x-6">
              <a className="whitespace-no-wrap pb-4 px-1 border-b-2 border-cse-500 font-medium text-sm leading-5 text-cse-600 focus:outline-none focus:text-cse-800 focus:border-cse-700" aria-current="page">Grading Report</a>
              {/* <a href="/" className="whitespace-no-wrap pb-4 px-1 border-b-2 border-transparent font-medium text-sm leading-5 text-gray-500 hover:text-gray-700 hover:border-gray-300 focus:outline-none focus:text-gray-700 focus:border-gray-300">Appeal</a> */}
            </nav>
          </div>
        </div>
        <div className="flex-1 flex flex-col justify-between">
          <div className="px-4 sm:px-6">
            <div className="space-y-6 pt-6 pb-5">
              <div className="space-y-1">
                <div className="relative bg-gray-700 rounded-lg shadow-md px-4 py-3">
                  <h3 className="text-sm text-white font-medium">Pipeline stage execution</h3>
                  <span className="text-xs text-gray-100">
                    on
                    <pre className="ml-1 font-mono inline-block">submissions/{!loading && data.report.submission.upload_name}</pre>
                  </span>
                  <div className="absolute left-1/2 bg-gray-700 w-6 h-6 rounded-full flex justify-center items-center">
                    <span className="bg-gray-400 w-3 h-3 rounded-full"></span>
                  </div>
                </div>
              </div>
              {
                loading ? (
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ): (
                  <div className="space-y-4">
                    <div className="space-y-1">
                      { data.report.sanitizedReports!==null && Object.keys(data.report.sanitizedReports).includes('diffWithSkeleton') && <DiffWithSkeletonStageView reports={data.report.sanitizedReports.diffWithSkeleton}/>}
                    </div>
                    <div className="space-y-1">
                      { data.report.sanitizedReports!==null && Object.keys(data.report.sanitizedReports).includes('fileStructureValidation') && <FileStructureValidationStageReportView reports={data.report.sanitizedReports.fileStructureValidation}/> }
                    </div>
                    <div className="space-y-1">
                      { data.report.sanitizedReports!==null && Object.keys(data.report.sanitizedReports).includes('compile') && <CompileStageReportView reports={data.report.sanitizedReports.compile}/> }
                    </div>
                    <div className="space-y-1">
                      { data.report.sanitizedReports!==null && Object.keys(data.report.sanitizedReports).includes('make') && <MakeStageReportView reports={data.report.sanitizedReports.make}/> }
                    </div>
                    <div className="space-y-2">
                      { data.report.sanitizedReports!==null && Object.keys(data.report.sanitizedReports).includes('gTest') && <GTestStageReportView reports={data.report.sanitizedReports.gTest}/> }
                    </div>
                    <div className="space-y-2">
                      { data.report.sanitizedReports!==null && Object.keys(data.report.sanitizedReports).includes('jUnit') && <JUnitStageReportView reports={data.report.sanitizedReports.jUnit}/> }
                    </div>
                    <div className="space-y-2">
                      { data.report.sanitizedReports!==null && Object.keys(data.report.sanitizedReports).includes('stdioTest') && <StdioTestStageReportView reports={data.report.sanitizedReports.stdioTest}/> }
                    </div>
                    <div className="space-y-2">
                      { data.report.sanitizedReports!==null && Object.keys(data.report.sanitizedReports).includes('valgrind') && <ValgrindStageView reports={data.report.sanitizedReports.valgrind}/> }
                    </div>
                    <div className="space-y-2">
                    { data.report.grade!==null && <ScoringStageView report={data.report.grade}/> }
                    </div>
                  </div>
                )
              }
            </div>
          </div>
        </div>
      </div>
      <div className="flex-shrink-0 px-4 py-4 space-x-4 flex justify-end">
        <span className="inline-flex rounded-md shadow-sm">
          <button onClick={() => dispatch({ type: 'closeSlideOver'} )} type="submit" className="inline-flex justify-center py-2 px-4 border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-cse-600 hover:bg-cse-500 focus:outline-none focus:border-cse-700 focus:shadow-outline-indigo active:bg-cse-700 transition duration-150 ease-in-out">
            Done
          </button>
        </span>
      </div>
    </div>
  )
}