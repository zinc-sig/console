import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Dropdown, useDropdown } from "../Dropdown";
import ActiveLink from "./ActiveLink";
import { useZinc } from "../../contexts/zinc";
import SelectMenu from "../SemesterSelectMenu";
import { createRef, Fragment, useState } from "react";
import { Dialog, Menu, Transition } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/solid'

export function User() {
  const { toggleDropdown, display } = useDropdown();
  const { useSidebar } = useZinc();
  const { loading, data } = useSidebar();

  if (loading) {
    return (
      <div className="w-full flex items-center">
        loading
      </div>
    )
  }
  return (
    <button
      onClick={() => toggleDropdown()}
      onBlur={() => { if (display) { toggleDropdown() } }}
      className="w-full flex items-center focus:outline-none">
      <div className="w-8 h-8 bg-gray-300 rounded-full flex-shrink-0 text-sm text-blue-800 flex justify-center items-center">{data && data.user.initials}</div>
      <span className="mr-2 text-sm font-medium text-white ml-4 truncate">{data && data.user.name}</span>
      <svg className="ml-auto h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd"></path>
      </svg>
    </button>
  )
}

export function UserDropdown() {
  const { useSidebar } = useZinc();
  const { loading, data } = useSidebar();
  return (
    <div className="hidden md:block w-64 flex-shrink-0 px-4 py-3 bg-cse-800">
      <Menu>
        <Menu.Button className="w-full flex items-center focus:outline-none">
          <div className="w-8 h-8 bg-gray-300 rounded-full flex-shrink-0 text-sm text-blue-800 flex justify-center items-center">{data && data.user.initials}</div>
          <span className="mr-2 text-sm font-medium text-white ml-4 truncate">{data && data.user.name}</span>
          <ChevronDownIcon className="ml-auto h-5 w-5 text-gray-400"></ChevronDownIcon>
        </Menu.Button>
        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Menu.Items className="z-10 absolute w-56 mt-2 origin-top-right bg-white divide-y divide-gray-100 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
            <div className="px-1 py-1 ">
              <Menu.Item>
                <a href="#" className="block px-4 py-2 text-sm leading-5 text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:bg-gray-100 focus:text-gray-900" role="menuitem">View profile</a>
              </Menu.Item>
              <Menu.Item>
                <a href="#" className="block px-4 py-2 text-sm leading-5 text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:bg-gray-100 focus:text-gray-900" role="menuitem">Settings</a>
              </Menu.Item>
              <Menu.Item>
                <a href="#" className="block px-4 py-2 text-sm leading-5 text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:bg-gray-100 focus:text-gray-900" role="menuitem">Notifications</a>
              </Menu.Item>
            </div>
            <div className="px-1 py-1">
              <Menu.Item>
                <a href="mailto:zinc@cse.ust.hk" className="block px-4 py-2 text-sm leading-5 text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:bg-gray-100 focus:text-gray-900" role="menuitem">Support</a>
              </Menu.Item>
            </div>
            <div className="px-1 py-1">
              <Menu.Item>
                <Link href="/logout">
                  <a className="block px-4 py-2 text-sm leading-5 text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:bg-gray-100 focus:text-gray-900" role="menuitem">Logout</a>
                </Link>
              </Menu.Item>
            </div>
          </Menu.Items>
        </Transition>
      </Menu>
    </div>
  )
}

function AdminNavigation() {
  return (
    <>
      <h2 className="mt-6 text-xs font-semibold text-gray-600 uppercase tracking-wider">
        Administration
      </h2>
      <div className="space-y-2 mt-4">
        <ActiveLink href="/admin/courses">
          <span className="w-8 mr-2 flex justify-center">
            <FontAwesomeIcon icon={["fad", 'books']} size="lg" />
          </span>
          Courses
        </ActiveLink>
        <ActiveLink href="/admin/users">
          <span className="w-8 mr-2 flex justify-center">
            <FontAwesomeIcon icon={["fad", 'users']} size="lg" />
          </span>
          Users
        </ActiveLink>
      </div>
    </>
  )
}

export function Navigation() {

  const { useSidebar, isAdmin } = useZinc();
  const { data, loading, error } = useSidebar();
  const [showCourses, setShowCourses] = useState(false);
  console.log(error)
  return (
    <div className="hidden md:block w-64 p-6 bg-gray-100 overflow-y-auto">
      <nav>
        {
          !loading && <SelectMenu semesters={data.semesters} />
        }
        <h2 className="mt-6 text-xs font-semibold text-gray-600 uppercase tracking-wider">
          Overview
        </h2>
        <div className="space-y-2 mt-4">
          <div>
            <ActiveLink href="/courses">
              <span className="w-8 mr-2 flex justify-center">
                <FontAwesomeIcon icon={["fad", 'books']} size="lg" />
              </span>
              Courses
            </ActiveLink>
            {
              showCourses && (
                <div className="mt-1 space-y-1">
                  {
                    !loading && (
                      data.user.courses.map(({ course }) => (
                        <a key={course.code} href="#" className="group select-none ml-1 w-full flex items-center pl-11 pr-2 py-2 text-sm leading-5 font-medium text-gray-600 rounded-md hover:text-gray-900 hover:bg-gray-50 focus:outline-none focus:text-gray-900 focus:bg-gray-50 transition ease-in-out duration-150">
                          {course.code}
                        </a>
                      ))
                    )
                  }
                </div>
              )
            }
          </div>
          <ActiveLink href="/assignments">
            <span className="w-8 mr-2 flex justify-center">
              <FontAwesomeIcon icon={["fad", 'laptop-code']} size="lg" />
            </span>
            Assignments
          </ActiveLink>
          {/* <ActiveLink href="/grades">
              <span className="w-8 mr-2 flex justify-center">
                <FontAwesomeIcon icon={["fad", 'analytics']} size="lg"/>
              </span>
              Grades
          </ActiveLink> */}
        </div>
        {
          isAdmin && <AdminNavigation />
        }
      </nav>
    </div>
  )
}


export function Toolbar() {
  return (
    <div className="hidden md:flex items-center">
      <div className="relative w-64">
        <span className="absolute inset-y-0 left-0 pl-2 flex items-center">
          <FontAwesomeIcon className="h-5 w-5 text-gray-500" icon={['fad', 'search']} size="lg"/>
        </span>
        <input
          className="block w-full bg-cse-900 rounded-lg text-sm placeholder-gray-400 text-white pl-10 pr-4 px-4 py-2 focus:bg-white focus:placeholder-gray-600 focus:text-gray-900 focus:outline-none transition ease-in-out duration-150"
          placeholder="Search"
        />
      </div>
      <button className="ml-4 p-2 border-2 h-8 w-8 flex items-center justify-center border-transparent rounded-full focus:bg-cse-600 focus:outline-none text-gray-400 hover:text-gray-200 transition ease-in-out duration-150" aria-label="Notifications" data-flow="down">
        <FontAwesomeIcon icon={['fad', 'bell']} />
      </button>
      <button className="ml-4 p-2 border-2 h-8 w-8 flex items-center justify-center border-transparent rounded-full focus:bg-cse-600 focus:outline-none text-gray-400 hover:text-gray-200 transition ease-in-out duration-150">
        <FontAwesomeIcon icon={['fad', 'question-circle']} />
      </button>
    </div>
  )
}