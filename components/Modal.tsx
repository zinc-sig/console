import { Transition } from "@headlessui/react";
import { useLayoutDispatch, useLayoutState } from "../contexts/layout";

interface ModalProps {
  children: React.ReactNode
}

interface ModalFooterProps {
  variant: string
  onConfirm(event: React.MouseEvent<HTMLButtonElement>): void
}

export function ModalFooter({ variant, onConfirm }: ModalFooterProps) {

  const dispatch = useLayoutDispatch();
  return (
    <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
      <span className="flex w-full rounded-md shadow-sm sm:ml-3 sm:w-auto">
        <button
          type="button"
          onClick={(e) => onConfirm(e)}
          className={`inline-flex justify-center w-full rounded-md border border-transparent px-4 py-2 bg-${variant}-600 text-base leading-6 font-medium text-white shadow-sm hover:bg-${variant}-500 focus:outline-none focus:border-${variant}-700 focus:shadow-outline-${variant} transition ease-in-out duration-150 sm:text-sm sm:leading-5`}>
          Confirm
        </button>
      </span>
      <span className="mt-3 flex w-full rounded-md shadow-sm sm:mt-0 sm:w-auto">
        <button onClick={() => dispatch({ type: 'closeModal' })} type="button" className="inline-flex justify-center w-full rounded-md border border-gray-300 px-4 py-2 bg-white text-base leading-6 font-medium text-gray-700 shadow-sm hover:text-gray-500 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue transition ease-in-out duration-150 sm:text-sm sm:leading-5">
          Cancel
        </button>
      </span>
    </div>
  )
}

export function Modal({ children, size='regular' }) {
  const { showModal } = useLayoutState();
  return ( 
    <Transition show={showModal}>
      <div className="fixed z-10 inset-0 overflow-y-auto pointer-events-none">
        <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <Transition.Child
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
            className="fixed inset-0 transition-opacity pointer-events-none"
          >
            <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
          </Transition.Child>
          <span className="hidden sm:inline-block sm:align-middle sm:h-screen"></span>&#8203;
          <Transition.Child
            enter="ease-out duration-300"
            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enterTo="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            className={`inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle ${size==='lg'?'sm:max-w-5xl':'sm:max-w-lg'} sm:w-full pointer-events-auto`}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-headline"
          >
            { children }
          </Transition.Child>
        </div>
      </div>
    </Transition>
  )
}

