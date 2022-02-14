import { useQuery } from "@apollo/client";
import { useRouter } from "next/router";
import { useLayoutDispatch, useLayoutState } from "../../contexts/layout";

export function CourseStudentSlideOverContent() {
  const { userId } = useLayoutState();
  const dispatch = useLayoutDispatch();

  return (
    <div className="h-full divide-y divide-gray-200 flex flex-col bg-white shadow-xl">
      <div className="flex-1 h-0 overflow-y-auto">
        <header className="space-y-1 py-6 px-4 bg-gray-100 sm:px-6">
          <div className="flex items-center justify-between space-x-3">
            <h2 className="text-lg leading-7 font-medium text-gray-900">
              New Project
            </h2>
            <div className="h-7 flex items-center">
              <button
                onClick={() => dispatch({ type: 'closeSlideOver' })}
                aria-label="Close panel"
                className="text-gray-400 hover:text-gray-500 transition ease-in-out duration-150 outline-none">
                <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
          <div>
            <p className="text-sm leading-5 text-gray-500">
              Get started by filling in the information below to create your new project.
            </p>
          </div>
        </header>
        <div className="relative py-6 px-4 sm:px-6">
          <div className="flex flex-col">

          </div>
        </div>
      </div>
    </div>
  )
}