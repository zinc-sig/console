import Link from "next/link";
import { LayoutProvider, useLayoutDispatch, useLayoutState } from "../../contexts/layout";
import { Layout } from "../../layout";
import { initializeApollo } from "../../lib/apollo";
import { useQuery } from "@apollo/client";
import { GET_COURSES } from "../../graphql/queries/admin";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Collapse from "@kunukn/react-collapse";
import { SlideOver } from "../../components/SlideOver";
import { useState } from "react";
import Switch from "../../components/Switch";


function Courses() {
  const { data, loading } = useQuery(GET_COURSES);

  if(loading) {
    return (
      <tbody className="bg-white divide-y divide-cool-gray-200"></tbody>
    )
  }
  return (
    <>
      <table className="min-w-full max-h-9/12 divide-y divide-cool-gray-200">
        <thead>
          <tr>
            <th className="px-6 py-3 bg-cool-gray-50 text-left text-xs leading-4 font-medium text-cool-gray-500 uppercase tracking-wider">
              Course
            </th>
            <th className="px-6 py-3 bg-cool-gray-50 text-right text-xs leading-4 font-medium text-cool-gray-500 uppercase tracking-wider">
              Semester
            </th>
            <th className="px-6 py-3 bg-cool-gray-50 text-right text-xs leading-4 font-medium text-cool-gray-500 uppercase tracking-wider">
              Enrolled Students
            </th>
            <th className="px-6 py-3 bg-cool-gray-50 text-right text-xs leading-4 font-medium text-cool-gray-500 uppercase tracking-wider">
              Teaching Staffs
            </th>
            <th className="px-6 py-3 bg-cool-gray-50"></th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-cool-gray-200">
          {
          data.courses.map(course => (
            <tr className="bg-white hover:bg-gray-50" key={course.id}>
               <td className="px-6 py-4 whitespace-no-wrap">
                <div className="flex items-center">
                  <div className="ml-4">
                    <div className="text-sm leading-5 font-medium text-gray-900">
                      { course.code }
                    </div>
                    <div className="text-sm leading-5 text-gray-500">
                      { course.name }
                    </div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 text-right whitespace-no-wrap text-sm leading-5 text-cool-gray-500">
                <span className="text-cool-gray-900 font-medium">{course.semester.name}</span>
              </td>
              <td className="px-6 py-4 text-right whitespace-no-wrap text-sm leading-5 text-cool-gray-500">
                { course.students.aggregate.count } students
              </td>
              <td className="px-6 py-3 text-sm leading-5 text-gray-500 font-medium">
                <div className="flex items-center space-x-2">
                  <div className="flex flex-shrink-0 -space-x-1">
                    {
                      course.teachingStaff.map(staff => (
                        <div key={staff.user.name} className="max-w-none h-6 w-6 rounded-full bg-gray-600 text-xs text-white shadow-solid flex justify-center items-center">
                          { staff.user.initials }
                        </div>
                      ))
                    }
                  </div>

                  <span className="flex-shrink-0 text-xs leading-5 font-medium">+8</span>
                </div>
              </td>
              <td className="px-6 py-4 text-right whitespace-no-wrap text-sm leading-5 text-cool-gray-500">
                <FontAwesomeIcon icon={['fad', 'chevron-right']}/>
              </td>
            </tr>
          ))
          }
        </tbody>
      </table>
      <nav className="bg-white px-4 py-3 flex items-center justify-between border-t border-cool-gray-200 sm:px-6">
        <div className="hidden sm:block">
          <p className="text-sm leading-5 text-cool-gray-700">
            Showing
            <span className="font-medium mx-1">1</span>
            to
            <span className="font-medium mx-1">10</span>
            of
            <span className="font-medium mx-1">{data.courses_aggregate.aggregate.count}</span>
            results
          </p>
        </div>
        <div className="flex-1 flex justify-between sm:justify-end">
          <Link href="/">
            <a className="relative inline-flex items-center px-4 py-2 border border-cool-gray-300 text-sm leading-5 font-medium rounded-md text-cool-gray-700 bg-white hover:text-cool-gray-500 focus:outline-none focus:shadow-outline-blue focus:border-blue-300 active:bg-cool-gray-100 active:text-cool-gray-700 transition ease-in-out duration-150">
              Previous
            </a>
          </Link>
          <Link href="/">
            <a className="ml-3 relative inline-flex items-center px-4 py-2 border border-cool-gray-300 text-sm leading-5 font-medium rounded-md text-cool-gray-700 bg-white hover:text-cool-gray-500 focus:outline-none focus:shadow-outline-blue focus:border-blue-300 active:bg-cool-gray-100 active:text-cool-gray-700 transition ease-in-out duration-150">
              Next
            </a>
          </Link>
        </div>
      </nav>
    </>
  )
}

function UserCoursePermissionCollapsible ({ course, role, permission }) {

  const [showCollapsedContent, setCollapsed] = useState(false)

  return (
    <li>
      <a className="flex flex-col hover:bg-gray-50 focus:outline-none focus:bg-gray-50 transition duration-150 ease-in-out">
        <div className="px-4 py-4 flex items-center sm:px-6">
          <div className="min-w-0 flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <div className="text-sm leading-5 font-medium text-cse-600 truncate">
                { role }
                <span className="ml-1 font-normal text-gray-500">
                  in { course.code }
                </span>
              </div>
              <div className="mt-2 flex">
                <div className="flex items-center text-sm leading-5 text-gray-500">
                  <svg className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                  </svg>
                  <span>
                    { course.semester.name }
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="ml-5 flex-shrink-0">
            <button onClick={() => setCollapsed(!showCollapsedContent)}>
              <svg className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
        <Collapse isOpen={showCollapsedContent}>
          <div className="space-y-2 px-6 my-2">
            <div className="flex justify-between">
              <span className="text-sm font-medium">Read Course Information</span>
              <Switch variant="cse" value={[1,3,5,7,9,11,13,15].includes(permission)}/>
            </div>
            <div className="flex justify-between">
              <span className="text-sm font-medium">Update Course and Assignment</span>
              <Switch variant="cse" value={[4,5,6,7,12,13,14,15].includes(permission)}/>
            </div>
            <div className="flex justify-between">
              <span className="text-sm font-medium">Add New Assignment</span>
              <Switch variant="cse" value={[2,3,6,7,10,11,14,15].includes(permission)}/>
            </div>
          </div>
        </Collapse>
      </a>
    </li>
  )
}

function UserSlideOverContent() {
  const dispatch = useLayoutDispatch();
  const { cache } = useLayoutState();
  const { courses } = cache;

  return (
    <div className="h-full flex flex-col bg-cool-gray-50 shadow-xl overflow-y-scroll">
      <header className="space-y-1 py-6 px-4 bg-cse-600 sm:px-6">
        <div className="flex items-center justify-between space-x-3">
          <h2 className="text-lg leading-7 font-medium text-white">
            User Information
          </h2>
          <div className="h-7 flex items-center">
            <button
              onClick={() => dispatch({ type: 'closeSlideOver' })}
              aria-label="Close panel"
              className="text-indigo-200 hover:text-white transition ease-in-out duration-150 focus:outline-none">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
        <div>
          <p className="text-sm leading-5 text-indigo-300">
            Lorem, ipsum dolor sit amet consectetur adipisicing elit aliquam ad hic recusandae soluta.
          </p>
        </div>
      </header>
      <div className="relative flex-1 py-6 px-4 sm:px-6">
        <h3 className="mb-2 text-lg leading-6 font-medium text-gray-900">
          Courses
        </h3>
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul>
            {
              courses.map(({role, course, id, permission}) => (
                <UserCoursePermissionCollapsible
                  course={course}
                  permission={permission}
                  role={role}
                  key={id}
                />
              ))
            }
          </ul>
        </div>
      </div>
    </div>
  )
}

function AdminCourses() {

  return (
    <LayoutProvider>
      <Layout title="Manage Courses">
        <div className="mt-8 w-full">
          <div className="shadow sm:hidden">
            <ul className="mt-2 divide-y divide-cool-gray-200 overflow-hidden shadow sm:hidden">
              <li>
                <Link href="/">
                  <a className="block px-4 py-4 bg-white hover:bg-cool-gray-50">
                    <div className="flex items-center space-x-4">
                      <div className="flex-1 flex space-x-2 truncate">
                        <svg className="flex-shrink-0 h-5 w-5 text-cool-gray-400" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                        </svg>
                        <div className="text-cool-gray-500 text-sm truncate">
                          <p className="truncate">Payment to Molly Sanders</p>
                          <p><span className="text-cool-gray-900 font-medium">$20,000</span> USD</p>
                          <p>July 11, 2020</p>
                        </div>
                      </div>
                      <div>
                        <svg className="flex-shrink-0 h-5 w-5 text-cool-gray-400" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>
                  </a>
                </Link>
              </li>
            </ul>
              <nav className="bg-white px-4 py-3 flex items-center justify-between border-t border-cool-gray-200">
                <div className="flex-1 flex justify-between">
                  <Link href="/">
                    <a className="relative inline-flex items-center px-4 py-2 border border-cool-gray-300 text-sm leading-5 font-medium rounded-md text-cool-gray-700 bg-white hover:text-cool-gray-500 focus:outline-none focus:shadow-outline-blue focus:border-blue-300 active:bg-cool-gray-100 active:text-cool-gray-700 transition ease-in-out duration-150">
                      Previous
                    </a>
                  </Link>
                  <Link href="/">
                    <a className="ml-3 relative inline-flex items-center px-4 py-2 border border-cool-gray-300 text-sm leading-5 font-medium rounded-md text-cool-gray-700 bg-white hover:text-cool-gray-500 focus:outline-none focus:shadow-outline-blue focus:border-blue-300 active:bg-cool-gray-100 active:text-cool-gray-700 transition ease-in-out duration-150">
                      Next
                    </a>
                  </Link>
                </div>
              </nav>
            </div>
            <div className="hidden sm:block">
              <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col mt-2">
                  <div className="align-middle min-w-full overflow-x-auto shadow overflow-hidden sm:rounded-lg">
                    <Courses/>
                  </div>
                </div>
              </div>
            </div>
        </div>
      </Layout>
      <SlideOver>
        <UserSlideOverContent/>
      </SlideOver>
    </LayoutProvider>
  )
}

export async function getServerSideProps(ctx) {
  const apolloClient = initializeApollo(ctx.req.headers.cookie);
  return {
    props: {
      initialApolloState: apolloClient.cache.extract(),
    },
  }
}


export default AdminCourses;