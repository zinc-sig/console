import { useLayoutDispatch, useLayoutState } from "../../contexts/layout";
import { useQuery } from "@apollo/client";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { GET_SUBMISSIONS_FOR_ASSIGNMENT_CONFIG } from "../../graphql/queries/user";
import { Transition } from "@headlessui/react";
import { useState } from "react";
import { useRouter } from "next/router";

function LoadingStudentSubmissionListItems() {
  return (
    <>
    {
      [1,2,3,4].map(i => (
        <li key={i} className="px-6 py-5 relative">
          <div className="animate-pulse flex space-x-4">
            <div className="rounded-full bg-gray-400 h-10 w-10"></div>
            <div className="flex-1 space-y-4 py-1">
              <div className="h-4 bg-gray-400 rounded w-2/4"></div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-400 rounded w-1/4"></div>
              </div>
            </div>
          </div>
        </li>
        )
      )
    }
    </>
  )
}

export function AssignmentSlideOverContent() {
  const dispatch = useLayoutDispatch();
  const { assignmentConfigId, viewingTaskAssignedGroups } = useLayoutState();
  const { data, loading } = useQuery(GET_SUBMISSIONS_FOR_ASSIGNMENT_CONFIG, {
    variables: {
      id: assignmentConfigId
    }
  })

  return (
    <div className="h-full flex flex-col bg-cool-gray-50 shadow-xl overflow-y-scroll">
      <header className="space-y-1 py-6 px-4 bg-cse-600 sm:px-6">
        <div className="flex items-center justify-between space-x-3">
          <h2 className="text-lg leading-7 font-medium text-white">
            Submission Summary
          </h2>
          <div className="h-7 flex items-center">
            <button
              onClick={() => dispatch({ type: 'closeSlideOver' })}
              aria-label="Close panel"
              className="text-cse-200 hover:text-white transition ease-in-out duration-150 focus:outline-none">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
        <div>
          <p className="text-sm leading-5 text-cse-300">
            { !loading && `${data.assignmentConfig.assignment.name} ${viewingTaskAssignedGroups??''}`  }
          </p>
        </div>
      </header>
      <div className="relative py-6 px-4 sm:px-6">
        <div className="flex flex-col">
          <h2 className="text-gray-500 text-xs font-medium uppercase tracking-wide mb-4">
            <FontAwesomeIcon className="mr-2" icon={['fad', 'file-export']}/>
            Data Export
          </h2>
          <span className="relative z-0 inline-flex shadow-sm">
            <Link href={`/api/download/submissions?assignmentConfigId=${assignmentConfigId}`}>
              <a className="flex-1 justify-center relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm leading-5 font-medium text-gray-500 hover:text-gray-400 focus:z-10 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:bg-gray-100 active:text-gray-500 transition ease-in-out duration-150">
                <FontAwesomeIcon className="mr-2" icon={['fad', 'download']}/>
                All Submissions
              </a>
            </Link>
            <button 
              onClick={() => {
                dispatch({ type: 'confirmRegrading', payload: { assignmentConfigId: config.id, submissions: data.assignmentConfig.submissions.filter(submssion => submssion.reports.length==0).map(submission => submission.id) }})
              }}
              className="-ml-px flex-1 justify-center relative inline-flex items-center px-2 py-2 bg-white text-sm leading-5 font-medium text-gray-500 hover:text-gray-400 focus:z-10 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:bg-gray-100 active:text-gray-500 transition ease-in-out duration-150"
            >
              Regrade Ungraded Submissions
            </button>
            <Link href={`/api/download/grades?assignmentConfigId=${assignmentConfigId}${viewingTaskAssignedGroups?`&viewingTaskAssignedGroups=${viewingTaskAssignedGroups}`:''}`}>
              <a className="-ml-px flex-1 justify-center relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm leading-5 font-medium text-gray-500 hover:text-gray-400 focus:z-10 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:bg-gray-100 active:text-gray-500 transition ease-in-out duration-150">
                <FontAwesomeIcon className="mr-2" icon={['fad', 'file-spreadsheet']}/>
                Grading Sheet
              </a>
            </Link>
          </span>
        </div>
      </div>
      <div className="relative flex-1">
        <div className="flex flex-col h-full">
            <div className="border-b border-gray-200">
              <div className="px-6">
                <nav className="-mb-px flex space-x-6">
                  <a className="whitespace-no-wrap pb-4 px-1 border-b-2 border-cse-500 font-medium text-sm leading-5 text-cse-600 focus:outline-none focus:text-cse-800 focus:border-cse-700" aria-current="page">Submissions</a>
                  <a className="whitespace-no-wrap pb-4 px-1 border-b-2 border-transparent font-medium text-sm leading-5 text-gray-500 hover:text-gray-700 hover:border-gray-300 focus:outline-none focus:text-gray-700 focus:border-gray-300">Appeal Cases (Not Available)</a>
                </nav>
              </div>
            </div>
            <ul className="divide-y divide-gray-200 overflow-y-auto">
              {
                !loading && data.assignmentConfig.submissions.sort((a,b) => (a.user.name>b.user.name)?1:-1).map(submission => (
                  <IndividualSubmissionRow key={submission.id} submission={submission} assignmentConfigId={assignmentConfigId}/>
                ))
              }
              {
                loading && <LoadingStudentSubmissionListItems/>
              }
            </ul>
          </div>
        </div>
    </div>
  )
}

function IndividualSubmissionRow({ submission, assignmentConfigId }) {

  const router = useRouter();
  const { courseId } = router.query;
  const [showDropdown, setDropdownState] = useState(false);
  const [report] = submission.reports;

  return (
    <li className="px-6 py-5 relative">
      <div className="group flex justify-between items-center space-x-2">
        <a className="-m-1 p-1 block">
          <span className="absolute inset-0 group-hover:bg-gray-50"></span>
          <div className="flex-1 flex items-center min-w-0 relative">
            <span className="flex-shrink-0 inline-block relative">
              <div className="h-10 w-10 rounded-full bg-cse-300 text-white flex items-center justify-center text-sm">
                { report!==undefined && report.grade!==null && report.grade.score }
                { report===undefined && (<span>N/A</span>)}
              </div>
            </span>
            <div className="ml-4 truncate">
              <div className="text-sm leading-5 font-medium text-gray-900 truncate">{submission.user.name}</div>
              <div className="text-sm leading-5 text-gray-500 truncate">@{submission.user.itsc}</div>
            </div>
          </div>
        </a>
        <div className="relative inline-block text-left">
          <button
            onClick={() => setDropdownState(!showDropdown)}
            className="group relative w-8 h-8 inline-flex items-center justify-center focus:outline-none" id="options-menu-0" aria-haspopup="true" aria-expanded="false">
            <span className="flex items-center justify-center h-full w-full rounded-full group-focus:bg-gray-200 transition ease-in-out duration-150">
              <svg className="w-5 h-5 text-gray-400 group-hover:text-gray-500 group-focus:text-gray-500 transition ease-in-out duration-150" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
              </svg>
            </span>
          </button>
          <Transition
            show={showDropdown}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
            className="origin-top-right absolute z-10 top-0 right-9 w-48 rounded-md shadow-lg"
          >
            <div className="rounded-md bg-white shadow-xs">
              <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu-0">
                <Link href={`/api/download/submissions/${submission.id}`}>
                  <a className="block px-4 py-2 text-sm leading-5 text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:bg-gray-100 focus:text-gray-900" role="menuitem">Download</a>
                </Link>
                <Link href={`/courses/${courseId}/assignments/${assignmentConfigId}/submissions?userId=${submission.user.id}`}>
                  <a className="block px-4 py-2 text-sm leading-5 text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:bg-gray-100 focus:text-gray-900" role="menuitem">Submission History</a>
                </Link>
              </div>
            </div>
          </Transition>
        </div>
      </div>
    </li>
  )
}
