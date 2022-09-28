import { Transition } from "@headlessui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useLayoutDispatch } from "../contexts/layout";
import { Toast } from "react-hot-toast";


interface NotificationProps {
  children: React.ReactNode
  trigger: Toast
}

export function Notification({ children, trigger }: NotificationProps) {
  return (
    <Transition
      show={trigger.visible}
      enter="transform ease-out duration-300 transition"
      enterFrom="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
      enterTo="translate-y-0 opacity-100 sm:translate-x-0"
      leave="transition ease-in duration-100"
      leaveFrom="opacity-100"
      leaveTo="opacity-0"
      className="max-w-md w-full bg-white shadow-lg rounded-xl pointer-events-auto"
    >
      <div className="rounded-xl shadow-xs overflow-hidden">
        <div className="p-4 w-full">
          { children }
        </div>
      </div>
    </Transition>
  )
}

export function NotificationBody({id, title, body, success}) {
  const dispatch = useLayoutDispatch();
  return (
    <div className="flex items-start">
      <div className="flex-shrink-0">
        {
          success?(
            <FontAwesomeIcon className="text-green-400" icon={['far', 'check']}/>
          ):(
            <FontAwesomeIcon className="text-red-400" icon={['far', 'times']}/>
          )
        }
      </div>
      <div className="ml-3 w-0 flex-1 pt-0.5">
        <p className="text-sm leading-5 font-medium text-gray-900">
          {title}
        </p>
        <p className="mt-1 text-sm leading-5 text-gray-500">
          {body}
        </p>
      </div>
      <div className="ml-4 flex-shrink-0 flex">
        <button
          onClick={() => {
            dispatch({ type: 'dismissNotification', payload: id });
          }}
          className="inline-flex text-gray-400 focus:outline-none focus:text-gray-500 transition ease-in-out duration-150">
          {/* Heroicon name: x */}
          <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
    </div>
  )
}