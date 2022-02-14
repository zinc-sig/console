import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useLayoutDispatch } from "../../contexts/layout";

export function Students({ students }) {

  const dispatch = useLayoutDispatch();

  return (
    <>
      <h2 className="text-gray-500 text-xs font-medium uppercase tracking-wide mb-4">Students</h2>
      <div className="align-middle min-w-full overflow-x-auto shadow overflow-hidden sm:rounded-lg">
        <table className="min-w-full max-h-9/12 divide-y divide-cool-gray-200">
          <thead>
            <tr>
              <th className="px-6 py-3 bg-cool-gray-50 text-left text-xs leading-4 font-medium text-cool-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 bg-cool-gray-50 text-right text-xs leading-4 font-medium text-cool-gray-500 uppercase tracking-wider">
                ITSC ID
              </th>
              <th className="px-6 py-3 bg-cool-gray-50 text-right text-xs leading-4 font-medium text-cool-gray-500 uppercase tracking-wider">
                Last Seen
              </th>
              <th className="px-6 py-3 bg-cool-gray-50"></th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-cool-gray-200">
            {
              students.length > 0 && students.map(({student}) => (
                <tr
                  className="bg-white cursor-pointer"
                  key={student.id}
                  >
                  <td className="max-w-0 w-full px-6 py-4 whitespace-no-wrap text-sm leading-5 text-cool-gray-900">
                    <div className="flex">
                      <p className="text-cool-gray-500 truncate group-hover:text-cool-gray-900 transition ease-in-out duration-150">
                          {student.name??'Never Logged In'}
                      </p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right whitespace-no-wrap text-sm leading-5 text-cool-gray-500">
                    <span className="text-cool-gray-900 font-medium">{student.itsc}</span>
                  </td>
                  <td className="px-6 py-4 text-right whitespace-no-wrap text-sm leading-5 text-cool-gray-500">
                    { (new Date(student.updatedAt)).toLocaleDateString('en-US',{ year: 'numeric', month: 'long', day: 'numeric'})}
                  </td>
                  <td className="px-6 py-4 text-right whitespace-no-wrap text-sm leading-5 text-cool-gray-500">
                    <FontAwesomeIcon icon={['fad', 'chevron-right']}/>
                  </td>
                </tr>
              ))
            }
            {
              students.length === 0 && (
                <tr className="bg-gray-100 w-full">
                  <td colSpan={4}>
                    <div className="py-6 flex flex-col items-center w-full space-y-1">
                      <FontAwesomeIcon className="block text-gray-400" icon={['fad', 'user-friends']} size="3x"/>
                      <h2 className="font-medium text-gray-600">No Students</h2>
                      <p className="text-sm text-gray-500">There are currently no students enrolled in this course.</p>
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
              <span className="font-medium mx-1">{students.length}</span>
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