import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter } from "next/router";

export function AssignmentCreationSteps() {

  const router = useRouter();

  return (
    <div className="mb-6">
      <div className="mt-2 md:flex md:items-center md:justify-between">
        <div className="flex-1 min-w-0">
          <nav>
            <ul className="bg-white border border-gray-300 rounded-md divide-y divide-gray-300 md:flex md:divide-y-0">
              <li className="relative md:flex-1 md:flex">
                <a className="group flex items-center w-full">
                  <div className="px-6 py-4 flex items-center text-sm leading-5 font-medium space-x-4">
                    <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-cse-600 rounded-full group-hover:bg-cse-800 transition ease-in-out duration-150">
                      <FontAwesomeIcon className="text-white" icon={['fad', 'file-alt']} size="lg" />
                    </div>
                    <p className="text-sm leading-5 font-medium text-gray-900">Assignment details</p>
                  </div>
                </a>
          
                <div className="hidden md:block absolute top-0 right-0 h-full w-5">
                  <svg className="h-full w-full text-gray-300" viewBox="0 0 22 80" fill="none" preserveAspectRatio="none">
                    <path d="M0 -2L20 40L0 82" vectorEffect="non-scaling-stroke" stroke="currentcolor" strokeLinejoin="round" />
                  </svg>
                </div>
              </li>
          
              <li className="relative md:flex-1 md:flex">
                <div className="px-6 py-4 flex items-center text-sm leading-5 font-medium space-x-4">
                  <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center border-2 border-cse-600 rounded-full">
                    <FontAwesomeIcon className="text-cse-600" icon={['fad', 'calendar-edit']} size="1x" />
                  </div>
                  <p className="text-sm leading-5 font-medium text-cse-600">Schedule</p>
                </div>
          
                <div className="hidden md:block absolute top-0 right-0 h-full w-5">
                  <svg className="h-full w-full text-gray-300" viewBox="0 0 22 80" fill="none" preserveAspectRatio="none">
                    <path d="M0 -2L20 40L0 82" vectorEffect="non-scaling-stroke" stroke="currentcolor" strokeLinejoin="round" />
                  </svg>
                </div>
              </li>

              <li className="relative md:flex-1 md:flex">
                <div className="px-6 py-4 flex items-center text-sm leading-5 font-medium space-x-4">
                  <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center border-2 border-cse-600 rounded-full">
                    <FontAwesomeIcon className="text-cse-600" icon={['fad', 'cogs']} size="1x" />
                  </div>
                  <p className="text-sm leading-5 font-medium text-cse-600">Grading Configuration</p>
                </div>
          
                <div className="hidden md:block absolute top-0 right-0 h-full w-5">
                  <svg className="h-full w-full text-gray-300" viewBox="0 0 22 80" fill="none" preserveAspectRatio="none">
                    <path d="M0 -2L20 40L0 82" vectorEffect="non-scaling-stroke" stroke="currentcolor" strokeLinejoin="round" />
                  </svg>
                </div>
              </li>

              <li className="relative md:flex-1 md:flex">
                <div className="px-6 py-4 flex items-center text-sm leading-5 font-medium space-x-4">
                  <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center border-2 border-cse-600 rounded-full">
                    <FontAwesomeIcon className="text-cse-600" icon={['fad', 'code-branch']} size="1x" />
                  </div>
                  <p className="text-sm leading-5 font-medium text-cse-600">Pipeline Stages</p>
                </div>
          
                <div className="hidden md:block absolute top-0 right-0 h-full w-5">
                  <svg className="h-full w-full text-gray-300" viewBox="0 0 22 80" fill="none" preserveAspectRatio="none">
                    <path d="M0 -2L20 40L0 82" vectorEffect="non-scaling-stroke" stroke="currentcolor" strokeLinejoin="round" />
                  </svg>
                </div>
              </li>

              <li className="relative md:flex-1 md:flex">
                <Link href="/">
                  <a className="group flex items-center">
                    <div className="px-6 py-4 flex items-center text-sm leading-5 font-medium space-x-4">
                      <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center border-2 border-gray-300 rounded-full group-hover:border-gray-400 transition ease-in-out duration-150">
                        <FontAwesomeIcon className="text-gray-500" icon={['fad', 'bullhorn']} size="1x" />
                      </div>
                      <p className="text-sm leading-5 font-medium text-gray-500 group-hover:text-gray-900 transition ease-in-out duration-150">Publish</p>
                    </div>
                  </a>
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </div>
  )
}