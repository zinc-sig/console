import { useLayoutDispatch, useLayoutState } from "../contexts/layout"
import { useZinc } from "../contexts/zinc";
import { Dialog, Transition } from '@headlessui/react'


export function RegradingConfirmationDialog() {

  const dispatch = useLayoutDispatch()
  const { triggerManualGrading } = useZinc();
  const { gradingPayload } = useLayoutState();

  const triggerGrading = async () => {
    try {
      dispatch({ type: 'closeModal' });
      const { assignmentConfigId, submissions } = gradingPayload;
      const result = await triggerManualGrading(assignmentConfigId, submissions);
      dispatch({ type: 'showNotification', payload: { title: 'Regrading scheduled successfully', message: 'Your requested report for regrading should appear momentarily', success: true } });
    } catch (error: any) {
      dispatch({ type: 'showNotification', payload: { title: 'Regrading trigger failed', message: error.message, success: false } });
    }
  }

  return (
    <>
      <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
        <div className="sm:flex sm:items-start">
          <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-yellow-100 sm:mx-0 sm:h-10 sm:w-10">
            {/* Heroicon name: exclamation */}
            <svg className="h-6 w-6 text-yellow-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
            <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-headline">
              Confirm Regrading
            </h3>
            <div className="mt-2">
              <p className="text-sm leading-5 text-gray-500">
                All selected submissions will be regraded, and new copies of the report for the student&apos;s submission will also be generated.
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
        <span className="flex w-full rounded-md shadow-sm sm:ml-3 sm:w-auto">
          <button
            onClick={triggerGrading}
            type="button"
            className="inline-flex justify-center w-full rounded-md border border-transparent px-4 py-2 bg-cse-600 text-base leading-6 font-medium text-white shadow-sm hover:bg-cse-500 focus:outline-none focus:border-cse-700 focus:shadow-outline-blue transition ease-in-out duration-150 sm:text-sm sm:leading-5">
            Confirm
          </button>
        </span>
        <span className="mt-3 flex w-full rounded-md shadow-sm sm:mt-0 sm:w-auto">
          <button
            onClick={() => dispatch({ type: 'closeModal' })}
            type="button"
            className="inline-flex justify-center w-full rounded-md border border-gray-300 px-4 py-2 bg-white text-base leading-6 font-medium text-gray-700 shadow-sm hover:text-gray-500 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue transition ease-in-out duration-150 sm:text-sm sm:leading-5">
            Cancel
          </button>
        </span>
      </div>
    </>
  )
}