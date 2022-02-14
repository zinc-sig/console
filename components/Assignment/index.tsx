import Link from "next/link";
import { useQuery } from "@apollo/client";
import { useZinc } from "../../contexts/zinc";
import { GET_ASSIGNMENTS } from "../../graphql/queries/user";

export function Assignments() {
  const { activeSemester, user } = useZinc();
  const { data, loading } = useQuery(GET_ASSIGNMENTS, {
    variables: {
      userId: user,
      semesterId: activeSemester
    }
  });

  if(loading) {
    return <div>loading</div>;
  }
  return (
    data.user.courses.map(({ course }) => (
      <div key={course.id} className="bg-white overflow-hidden sm:rounded-lg sm:shadow mt-6 ">
        <div className="bg-white px-4 py-5 border-b border-gray-200 sm:px-6">
          <div className="-ml-4 -mt-4 flex justify-between items-center flex-wrap sm:flex-no-wrap">
            <div className="ml-4 mt-4">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                { course.code }
              </h3>
              <p className="mt-1 text-sm leading-5 text-gray-500">
                { course.name }
              </p>
            </div>
            <div className="ml-4 mt-4 flex-shrink-0">
              <Link href={{pathname: '/assignments/new', query: { course: course.id }}}>
                <span className="inline-flex rounded-md shadow-sm">
                  <a className="cursor-pointer relative inline-flex items-center px-4 py-2 border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-cse-600 hover:bg-cse-500 focus:outline-none focus:shadow-outline-indigo focus:border-cse-700 active:bg-cse-700">
                    Create new assignment
                  </a>
                </span>
              </Link>
            </div>
          </div>
        </div>
        <ul>
          {
            course.assignments.map(assignment => (
              <li key={assignment.name}>
                <div className="block hover:bg-gray-50 focus:outline-none focus:bg-gray-50 transition duration-150 ease-in-out">
                  <div className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <div className="text-sm leading-5 font-medium text-cse-600 truncate">
                        <span className={`inline-flex items-center px-2.5 py-0.5 w-12 justify-center mr-2 rounded-md text-sm font-medium leading-5 ${assignment.workloadType.name==='PA'?'bg-blue-100 text-blue-800':'bg-teal-100 text-teal-800'}`}>
                          { assignment.workloadType.name }
                        </span>
                        { assignment.name }
                      </div>
                      <span className="relative z-0 inline-flex shadow-sm">
                        <Link href={`/assignments/${assignment.id}/details`}>
                          <a 
                            className="relative inline-flex items-center px-3 py-2 rounded-l-md border border-gray-300 bg-white text-sm leading-5 font-medium text-gray-500 hover:text-gray-400 focus:z-10 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:bg-gray-100 active:text-gray-500 transition ease-in-out duration-150">
                            Details
                          </a>
                        </Link>
                        <Link href={`/assignments/${assignment.id}/configs`}>
                          <a className="-ml-px relative inline-flex items-center px-3 py-2 rounded-r-md border border-gray-300 bg-white text-sm leading-5 font-medium text-gray-500 hover:text-gray-400 focus:z-10 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:bg-gray-100 active:text-gray-500 transition ease-in-out duration-150">
                            Configs
                          </a>
                        </Link>
                      </span>
                    </div>
                  </div>
                </div>
              </li>
            ))
          }
        </ul>
      </div>
    ))
  )
}

export function AssignmentCard({ assignment }) {
  return (
    <li className="col-span-1 bg-white rounded-lg shadow">
      <div className="w-full flex items-center justify-between p-6 space-x-6">
        <div className="flex-1 truncate">
          <div className="flex items-center space-x-3">
            <h3 className="text-gray-900 text-base leading-5 font-medium">{assignment.name}</h3>
          </div>
          <p className="mt-1 text-gray-500 text-sm leading-5">{assignment.description}</p>
        </div>
      </div>
    </li>
  )
}