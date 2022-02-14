import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { SubmissionWindowStatus } from "../SubmissionWindowStatus";
import { useLayoutDispatch } from "../../contexts/layout";
import { useState } from "react";
import { Menu, Transition } from '@headlessui/react'
import { DotsVerticalIcon } from '@heroicons/react/solid'

export function Assignments({ assignmentConfigs, sections }) {
  return (
    <>
      <h2 className="text-gray-500 text-xs font-medium uppercase tracking-wide mb-4">Assignments / Labs / Projects</h2>
        <div className="align-middle min-w-full overflow-x-auto shadow overflow-hidden sm:rounded-lg">
          <table className="min-w-full max-h-9/12 divide-y divide-cool-gray-200">
            <thead>
              <tr>
                <th className="px-6 py-3 bg-cool-gray-50 text-left text-xs leading-4 font-medium text-cool-gray-500 uppercase tracking-wider">
                  <div className="cursor-pointer">
                    Name
                    <FontAwesomeIcon className="ml-2" icon={['fad', 'sort']}/>
                  </div>
                </th>
                <th className="px-6 py-3 bg-cool-gray-50 text-right text-xs leading-4 font-medium text-cool-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 bg-cool-gray-50 text-right text-xs leading-4 font-medium text-cool-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 bg-cool-gray-50 text-right text-xs leading-4 font-medium text-cool-gray-500 uppercase tracking-wider">
                  No. of Submission
                </th>
                <th className="pr-6 py-3 border-b border-gray-200 bg-gray-50 text-right text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider"></th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-cool-gray-200">
              {
                assignmentConfigs.length > 0 && assignmentConfigs.map(assignmentConfig => (
                  <AssignmentRow key={assignmentConfig.id} config={assignmentConfig} sections={sections}/>
                ))
              }
              {
                assignmentConfigs.length === 0 && (
                  <tr className="bg-gray-100 w-full">
                    <td colSpan={5}>
                      <div className="py-6 flex flex-col items-center w-full space-y-1">
                        <FontAwesomeIcon className="block text-gray-400" icon={['fad', 'laptop-code']} size="3x"/>
                        <h2 className="font-medium text-gray-600">No Assigned Tasks</h2>
                        <p className="text-sm text-gray-500">There are currently no assigned tasks in this course.</p>
                      </div>
                    </td>
                  </tr>
                )
              }
            </tbody>
          </table>
          <nav className="bg-white px-4 py-3 flex items-center justify-between border-t border-cool-gray-200 sm:px-6">
            <div className="hidden sm:block">
              <p className="text-sm leading-5 text-cool-gray-700">
                Showing
                <span className="font-medium mx-1">1</span>
                to
                <span className="font-medium mx-1">15</span>
                of
                <span className="font-medium mx-1">{assignmentConfigs.length}</span>
                results
              </p>
            </div>
            <div className="flex-1 flex justify-between sm:justify-end">
              <button
                className="relative inline-flex items-center px-4 py-2 border border-cool-gray-300 text-sm leading-5 font-medium rounded-md text-cool-gray-700 bg-white hover:text-cool-gray-500 focus:outline-none focus:shadow-outline-blue focus:border-blue-300 active:bg-cool-gray-100 active:text-cool-gray-700 transition ease-in-out duration-150">
                Previous
              </button>
              <button
                className="ml-3 relative inline-flex items-center px-4 py-2 border border-cool-gray-300 text-sm leading-5 font-medium rounded-md text-cool-gray-700 bg-white hover:text-cool-gray-500 focus:outline-none focus:shadow-outline-blue focus:border-blue-300 active:bg-cool-gray-100 active:text-cool-gray-700 transition ease-in-out duration-150">
                Next
              </button>
            </div>
          </nav>
        </div>
    </>
  )
}

export function AssignmentRow({ config, sections }) {
  const dispatch = useLayoutDispatch();
  const [showDropdown, setDropdown] = useState(false);
  const sectionsString = sections.filter(
    section => config.affected_users.map(
      ({ user_id }) => user_id).filter(
        id => section.users.map(user => user.user_id).includes(id)
        ).length>0
    ).map(section => section.name).join(', ');

  return (
    <tr 
      className="bg-white">
      <td className="max-w-0 w-1/2 px-6 py-4 whitespace-no-wrap text-sm leading-5 text-cool-gray-900">
        <div className="flex">
          <p className="text-cool-gray-500 truncate group-hover:text-cool-gray-900 transition ease-in-out duration-150">
            { config.assignment.name } { config.affected_users_aggregate.aggregate.count > 0 && `(${sectionsString})`}
          </p>
        </div>
      </td>
      <td className="px-6 py-4 text-right whitespace-no-wrap text-sm leading-5 text-cool-gray-500">
        <span className="text-cool-gray-900 font-medium">{config.assignment.workloadType.name}</span>
      </td>
      <td className="px-6 py-4 text-right whitespace-no-wrap text-sm leading-5 text-cool-gray-500">
        <SubmissionWindowStatus closed={config.submissionWindowPassed}/>
      </td>
      <td className="px-6 py-4 text-right whitespace-no-wrap text-sm leading-5 text-cool-gray-500">
        {config.submissions_aggregate.aggregate.count}/{config.affected_users_aggregate.aggregate.count}
      </td>
      <td className="pr-6">
        <div className="relative flex justify-end items-center">
          {/* <button onClick={() => setDropdown(!showDropdown)} id="assignment-viewing-options" aria-haspopup={true} type="button" className="w-8 h-8 inline-flex items-center justify-center text-gray-400 rounded-full bg-transparent hover:text-gray-500 focus:outline-none focus:text-gray-500 focus:bg-gray-100 transition ease-in-out duration-150">
            <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
            </svg>
          </button>
          <Transition
            show={showDropdown}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
            className="mx-3 origin-top-right absolute right-7 top-0 w-48 mt-1 rounded-md shadow-lg z-20"
          >
          <div className="z-10 rounded-md bg-white shadow-xs" role="menu" aria-orientation="vertical" aria-labelledby="assignment-viewing-options">
            <div className="py-1">
              <Link href={`/assignments/${config.assignment.id}/configs/${config.id}`}>
                <a
                  className="group flex items-center w-full px-4 py-2 text-sm leading-5 text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:bg-gray-100 focus:text-gray-900" role="menuitem">
                  <span className="w-5 h-5 mr-3 flex items-center">
                    <FontAwesomeIcon icon={['fad', 'cog']} size="lg"/>
                  </span>
                  Reconfigure
                </a>
              </Link>
              <button
                onClick={() => {
                  setDropdown(false)
                  dispatch({ type: 'viewAssignmentSubmissions', payload: { configId: config.id, sections: sectionsString } })
                }}
                className="group flex items-center w-full px-4 py-2 text-sm leading-5 text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:bg-gray-100 focus:text-gray-900" role="menuitem">
                <span className="w-5 h-5 mr-3 flex items-center">
                  <FontAwesomeIcon icon={['fad', 'archive']} size="lg"/>
                </span>
                Submissions
              </button>
              <button
                onClick={() => {
                  setDropdown(false)
                  dispatch({ type: 'confirmRegrading', payload: { assignmentConfigId: config.id }})
                }}
                className="group flex items-center w-full px-4 py-2 text-sm leading-5 text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:bg-gray-100 focus:text-gray-900" role="menuitem">
                <span className="w-5 h-5 mr-3 flex items-center">
                  <FontAwesomeIcon icon={['fad', 'redo-alt']} size="lg"/>
                </span>
                Regrade
              </button>
            </div>
            </div>
          </Transition> */}
          <Menu>
            <Menu.Button className="w-8 h-8 inline-flex items-center justify-center text-gray-400 rounded-full bg-transparent hover:text-gray-500 focus:outline-none focus:text-gray-500 focus:bg-gray-100 transition ease-in-out duration-150">
              <DotsVerticalIcon className="w-5 h-5" ></DotsVerticalIcon>
            </Menu.Button>
            <Transition
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
              className="mx-3 origin-top-right absolute right-7 top-0 w-48 mt-1 rounded-md shadow-lg z-20"
            >
              <Menu.Items className="z-10 rounded-md bg-white shadow-xs" >
                <Menu.Item>
                  <Link href={`/assignments/${config.assignment.id}/configs/${config.id}`}>
                    <a
                      className="group flex items-center w-full px-4 py-2 text-sm leading-5 text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:bg-gray-100 focus:text-gray-900" role="menuitem">
                      <span className="w-5 h-5 mr-3 flex items-center">
                        <FontAwesomeIcon icon={['fad', 'cog']} size="lg"/>
                      </span>
                      Reconfigure
                    </a>
                  </Link>
                </Menu.Item>
                <Menu.Item>
                  <button
                    onClick={() => {
                      dispatch({ type: 'viewAssignmentSubmissions', payload: { configId: config.id, sections: sectionsString } })
                    }}
                    className="group flex items-center w-full px-4 py-2 text-sm leading-5 text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:bg-gray-100 focus:text-gray-900" role="menuitem">
                    <span className="w-5 h-5 mr-3 flex items-center">
                      <FontAwesomeIcon icon={['fad', 'archive']} size="lg"/>
                    </span>
                    Submissions
                  </button>
                </Menu.Item>
                <Menu.Item>
                  <button
                    onClick={() => {
                      dispatch({ type: 'confirmRegrading', payload: { assignmentConfigId: config.id }})
                    }}
                    className="group flex items-center w-full px-4 py-2 text-sm leading-5 text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:bg-gray-100 focus:text-gray-900" role="menuitem">
                    <span className="w-5 h-5 mr-3 flex items-center">
                      <FontAwesomeIcon icon={['fad', 'redo-alt']} size="lg"/>
                    </span>
                    Regrade
                  </button>
                </Menu.Item>
                <Menu.Item>
                  <Link href={`/api/download/grades?assignmentConfigId=${config.id}`}>
                    <a className="group flex items-center w-full px-4 py-2 text-sm leading-5 text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:bg-gray-100 focus:text-gray-900" role="menuitem">
                      <span className="w-5 h-5 mr-3 flex items-center">
                        <FontAwesomeIcon icon={['fad', 'file-spreadsheet']} size="lg"/>
                      </span>
                      Gradesheet
                    </a>
                  </Link>
                </Menu.Item>
              </Menu.Items>
            </Transition>
          </Menu>
        </div>
      </td>
    </tr>
  )
}
