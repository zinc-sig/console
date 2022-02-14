import { useSubscription, useMutation } from "@apollo/client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter } from "next/router";
import { useLayoutDispatch } from "../../contexts/layout";
import { ASSIGN_TASK_TO_STUDENT, BULK_ASSIGN_TASK_TO_STUDENTS, REMOVE_TASK_FROM_STUDENT, BULK_REMOVE_TASK_FROM_STUDENTS } from "../../graphql/mutations/user";
import { GET_STUDENTS_FOR_CONFIG } from "../../graphql/queries/user";

export function AssignedUsers() {
  const dispatch = useLayoutDispatch();
  return (
    <fieldset className="mt-6">
      <legend className="text-base w-full leading-6 font-medium text-gray-900 flex items-center justify-between">
        <span>Assigned Students</span>
        <button
          onClick={() => dispatch({ type: 'manageAssignedUsers' })}
          type="button"
          className="inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm leading-5 font-medium rounded-md text-cse-700 bg-blue-100 hover:bg-blue-50 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:bg-blue-200 transition ease-in-out duration-150">
          <FontAwesomeIcon className="mr-2" icon={['fad', 'sitemap']}/>
          Manage
        </button>  
      </legend>
    </fieldset>
  )
}

function AssignedStudents({ assignmentConfigId, assignedUserIds, section, }) {

  const assignedStudents = section.students.filter(({ user }) => assignedUserIds.includes(user.id));
  const [removeTask, { loading: removing }] = useMutation(REMOVE_TASK_FROM_STUDENT);

  return (
    <div>
      <h3 className="px-3 text-xs leading-4 font-semibold text-gray-500 uppercase tracking-wider" id="teams-headline">
        assigned
      </h3>
      <ul className="bg-white rounded-lg m-3">
        {
          assignedStudents.map(({ user }) => (
            <li key={user.id} className="flex justify-between items-center px-2">
              <span className="text-xs font-medium">
                {user.name||'Never Logged In'}
              </span>
              <span className="inline-flex rounded-lg shadow-sm">
                <button
                  onClick={() => removeTask({
                    variables: {
                      userId: user.id,
                      assignmentConfigId
                    }
                  })}
                  type="button"
                  className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs leading-4 font-medium rounded-lg text-red-700 bg-white hover:text-red-500 focus:outline-none focus:border-red-300 focus:shadow-outline-red active:text-red-800 active:bg-gray-50 transition ease-in-out duration-150">
                  Remove
                </button>
              </span>
            </li>
          ))
        }
      </ul>
    </div>
  )
}

function UnassignedStudents({ section, assignedUserIds, assignmentConfigId }) {

  const [assignTask, { loading: assigning }] = useMutation(ASSIGN_TASK_TO_STUDENT);
  const [bulkAssignTask, { loading: bulkAssigning }] = useMutation(BULK_ASSIGN_TASK_TO_STUDENTS);
  const unassignedStudents = section.students.filter(({ user }) => !assignedUserIds.includes(user.id));

  return (
    <div>
      <div className="px-3 flex items-center justify-between">
        <h3 className="text-xs leading-4 font-semibold text-gray-500 uppercase tracking-wider" id="teams-headline">
          unassigned
        </h3>
        <span className="inline-flex rounded-lg shadow-sm">
          <button
            onClick={() => 
              bulkAssignTask({
                variables: {
                  taskAssignments: unassignedStudents.map(({ user }) => ({
                    user_id: user.id,
                    assignment_config_id: assignmentConfigId
                  }))
                }
              })
            }
            type="button"
            className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs leading-4 font-medium rounded-lg text-blue-700 bg-white hover:text-blue-500 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:text-blue-800 active:bg-gray-50 transition ease-in-out duration-150">
            Assign All
          </button>
        </span>
      </div>
      <ul className="bg-white rounded-lg m-3 py-3">
      {
        unassignedStudents.map(({ user }) => (
          <li key={user.id} className="flex justify-between items-center px-2">
            <span className="text-xs font-medium">
              {user.name||'Never Logged In'}
            </span>
            <span className="inline-flex rounded-lg shadow-sm">
              <button
                onClick={() => assignTask({
                  variables: {
                    userId: user.id,
                    assignmentConfigId
                  }
                })}
                type="button"
                className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs leading-4 font-medium rounded-lg text-blue-700 bg-white hover:text-blue-500 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:text-blue-800 active:bg-gray-50 transition ease-in-out duration-150">
                Assign
              </button>
            </span>
          </li>
        ))
      }
    </ul>
  </div>
  )
}

function CourseWideAssignStudents({ sections, assignmentConfigId }) {

  const [bulkRemoveTask, { loading: bulkRemoving }] = useMutation(BULK_REMOVE_TASK_FROM_STUDENTS);
  const [bulkAssignTask, { loading: bulkAssigning }] = useMutation(BULK_ASSIGN_TASK_TO_STUDENTS);
  const userIds = sections.map(section => {
    return section.students.map(({ user }) => user.id)
  }).flat();

  return (
    <div className="relative py-6 px-4 sm:px-6">
      <div className="flex flex-col">
        <h2 className="text-gray-500 text-xs font-medium uppercase tracking-wide mb-4">
          <FontAwesomeIcon className="mr-2" icon={['fad', 'sitemap']}/>
          Bulk Actions
        </h2>
        <span className="relative z-0 inline-flex shadow-sm">
          <button
            onClick={() => bulkAssignTask({
              variables: {
                taskAssignments: userIds.map(userId => ({
                  user_id: userId,
                  assignment_config_id: assignmentConfigId
                }))
              }
            })}
            className="flex-1 justify-center relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm leading-5 font-medium text-gray-500 hover:text-gray-400 focus:z-10 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:bg-gray-100 active:text-gray-500 transition ease-in-out duration-150">
            <FontAwesomeIcon className="mr-2" icon={['fad', 'user-plus']}/>
            Assign All Sections 
          </button>
          <button
            onClick={() => bulkRemoveTask({
              variables: {
                userIds,
                assignmentConfigId
              }
            })}
            className="-ml-px flex-1 justify-center relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm leading-5 font-medium text-gray-500 hover:text-gray-400 focus:z-10 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:bg-gray-100 active:text-gray-500 transition ease-in-out duration-150">
            <FontAwesomeIcon className="mr-2" icon={['fad', 'user-minus']}/>
            Unassign All Sections
          </button>
        </span>
      </div>
    </div>
  )
}

export function AssignedUsersSlideOver() {
  const router = useRouter();
  const assignmentConfigId = parseInt(router.query.assignmentConfigId as string, 10);
  const { data, loading } = useSubscription(GET_STUDENTS_FOR_CONFIG, {
    variables: {
      id: assignmentConfigId
    }
  });
  const dispatch = useLayoutDispatch();

  return (
    <div className="h-full flex flex-col bg-cool-gray-50 shadow-xl overflow-y-scroll">
      <header className="space-y-1 py-6 px-4 bg-cse-600 sm:px-6">
        <div className="flex items-center justify-between space-x-3">
          <h2 className="text-lg leading-7 font-medium text-white">
            Assigned Students
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
            Configure submission start date and deadline
          </p>
        </div>
      </header>
      {
        !loading && (
          <CourseWideAssignStudents 
            assignmentConfigId={assignmentConfigId}
            sections={data.assignmentConfig.assignment.course.sections}
          />
        )
      }
      <div className="flex-1 flex flex-col justify-between">
        <div className="px-4 divide-y divide-gray-200 sm:px-6">
          <div className="space-y-6 pb-5">
            <h2 className="text-gray-500 text-xs font-medium uppercase tracking-wide mb-4">
              <FontAwesomeIcon className="mr-2" icon={['fad', 'users-class']}/>
              Course Sections
            </h2>
            <ul>
              {
                !loading && data.assignmentConfig.assignment.course.sections.map(section => (
                  <li key={section.id} className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="px-4 py-4 sm:px-6">
                      <h2 className="font-medium text-sm text-gray-500 tracking-wider">{ section.name }</h2>
                    </div>
                    <div className="bg-gray-50 px-4 py-4 sm:p-3">
                      <AssignedStudents 
                        assignmentConfigId={assignmentConfigId}
                        assignedUserIds={data.assignmentConfig.affected_users.map(({ user_id }) => user_id)}
                        section={section}
                      />
                      <UnassignedStudents
                        assignmentConfigId={assignmentConfigId}
                        section={section}
                        assignedUserIds={data.assignmentConfig.affected_users.map(({ user_id }) => user_id)}
                      />
                    </div>
                  </li>
                ))
              }
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}