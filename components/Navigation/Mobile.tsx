import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Logo from "../Logo";
import { useLayoutDispatch, useLayoutState } from "../../contexts/layout";
import { Transition } from "@headlessui/react";

function Navigation({ items }) {

  const defaultClassNames = 'group flex items-center px-2 py-2 text-base leading-5 font-medium rounded-md  focus:outline-none transition ease-in-out duration-150'
  const activeClassNames = 'text-gray-900 bg-gray-100 hover:text-gray-900 hover:bg-gray-100 focus:bg-gray-200'
  const inactiveClassNames = 'text-gray-600 hover:text-gray-900 hover:bg-gray-50 focus:bg-gray-50'
  const router = useRouter();

  return (
    <div className="space-y-1">
      {
        items.map(item => (
          <Link href={item.href} key={item.title}>
            <a className={`${defaultClassNames} ${router.pathname===item.href?activeClassNames:inactiveClassNames}`}>
              <span className="w-12 flex justify-center">
                <FontAwesomeIcon icon={["fad", item.icon]} size="lg"/>
              </span>
              { item.title }
            </a>
          </Link>
        ))
      }
    </div>
  )
}

export function MobileMenuToggle () {

  const dispatch = useLayoutDispatch()

  return (
    <div className="md:hidden">
      <button type="button" onClick={() => dispatch({ type: 'toggleMobileMenu' })} className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 focus:text-gray-500 transition duration-150 ease-in-out">
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
    </div>
  )
}

export function Mobile() {

  const dispatch = useLayoutDispatch();
  const { showMobileMenu } = useLayoutState();

  return (
    <Transition
        show={showMobileMenu}
        enter="duration-200 ease-out"
        enterFrom="opacity-0 scale-95"
        enterTo="opacity-100 scale-100"
        leave="duration-100 ease-in"
        leaveFrom="opacity-100 scale-100"
        leaveTo="opacity-0 scale-95"
        className="absolute top-0 inset-x-0 p-2 transition transform origin-top-right md:hidden"
      >
      <div className="rounded-lg shadow-lg">
        <div className="rounded-lg shadow-xs bg-white divide-y-2 divide-gray-50">
          <div className="pt-5 pb-6 px-5 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <Logo/>
              </div>
              <div className="-mr-2">
                <button
                  onClick={() => dispatch({ type: 'toggleMobileMenu' })}
                  type="button"
                  className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 focus:text-gray-500 transition duration-150 ease-in-out">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            <div>
              <nav className="grid row-gap-8">
                <Link href="/assignments">
                  <a href="#" className="-m-3 p-3 flex items-center space-x-3 rounded-md hover:bg-gray-50 transition ease-in-out duration-150">
                    <span className="w-8 mr-2 flex justify-center">
                      <FontAwesomeIcon className="text-cse-600" icon={["fad", 'laptop-code']} size="lg"/>
                    </span>
                    <div className="text-base leading-6 font-medium text-gray-900">
                      Assignments
                    </div>
                  </a>
                </Link>
                <Link href="/archives">
                  <a className="-m-3 p-3 flex items-center space-x-3 rounded-md hover:bg-gray-50 transition ease-in-out duration-150">
                    <span className="w-8 mr-2 flex justify-center">
                      <FontAwesomeIcon className="text-cse-600" icon={["fad", 'archive']} size="lg"/>
                    </span>
                    <div className="text-base leading-6 font-medium text-gray-900">
                      Archives
                    </div>
                  </a>
                </Link>
                <Link href="/grades">
                  <a className="-m-3 p-3 flex items-center space-x-3 rounded-md hover:bg-gray-50 transition ease-in-out duration-150">
                    <span className="w-8 mr-2 flex justify-center">
                      <FontAwesomeIcon className="text-cse-600" icon={["fad", 'analytics']} size="lg"/>
                    </span>
                    <div className="text-base leading-6 font-medium text-gray-900">
                      Grades
                    </div>
                  </a>
                </Link>
              </nav>
            </div>
          </div>
          <div className="py-6 px-5 space-y-6">
            <div className="grid grid-cols-2 row-gap-4 col-gap-8">
              <a href="#" className="text-base leading-6 font-medium text-gray-900 hover:text-gray-700 transition ease-in-out duration-150">
                Pricing
              </a>
              <a href="#" className="text-base leading-6 font-medium text-gray-900 hover:text-gray-700 transition ease-in-out duration-150">
                Docs
              </a>
              <a href="#" className="text-base leading-6 font-medium text-gray-900 hover:text-gray-700 transition ease-in-out duration-150">
                Enterprise
              </a>
              <a href="#" className="text-base leading-6 font-medium text-gray-900 hover:text-gray-700 transition ease-in-out duration-150">
                Blog
              </a>
              <a href="#" className="text-base leading-6 font-medium text-gray-900 hover:text-gray-700 transition ease-in-out duration-150">
                Help Center
              </a>
              <a href="#" className="text-base leading-6 font-medium text-gray-900 hover:text-gray-700 transition ease-in-out duration-150">
                Guides
              </a>
              <a href="#" className="text-base leading-6 font-medium text-gray-900 hover:text-gray-700 transition ease-in-out duration-150">
                Security
              </a>
              <a href="#" className="text-base leading-6 font-medium text-gray-900 hover:text-gray-700 transition ease-in-out duration-150">
                Events
              </a>
            </div>
            <div className="space-y-6">
              <span className="w-full flex rounded-md shadow-sm">
                <a href="#" className="w-full flex items-center justify-center px-4 py-2 border border-transparent text-base leading-6 font-medium rounded-md text-white bg-cse-600 hover:bg-cse-500 focus:outline-none focus:border-cse-700 focus:shadow-outline-indigo active:bg-cse-700 transition ease-in-out duration-150">
                  Sign up
                </a>
              </span>
              <p className="text-center text-base leading-6 font-medium text-gray-500">
                Existing customer?
                <a href="#" className="text-cse-600 hover:text-cse-500 transition ease-in-out duration-150">
                  Sign in
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  )
}

export default Mobile;
