import { useState } from "react";
import { useRouter } from "next/router";
import { useQuery } from "@apollo/client";
import { LayoutProvider, useLayoutDispatch } from "../../../contexts/layout";
import { Layout } from "../../../layout";
import { initializeApollo } from "../../../lib/apollo";
import { GET_ASSIGNMENT } from "../../../graphql/queries/user";
import Switch from "../../../components/Switch";
import { DatePickerCalendar, useDateInput } from 'react-nice-dates'
import { format } from 'date-fns'
import { enGB } from 'date-fns/locale'
import { SlideOver } from "../../../components/SlideOver"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function AssignmentCollectionTimeSettingSlideOverContent() {
  const dispatch = useLayoutDispatch();
  const [date, setDate] = useState()
  // const inputProps = useDateInput({
  //   date,
  //   format: 'yyyy-MM-dd',
  //   locale: enGB,
  // })

  return (
    <div className="h-full flex flex-col bg-cool-gray-50 shadow-xl overflow-y-scroll">
      <header className="space-y-1 py-6 px-4 bg-cse-600 sm:px-6">
        <div className="flex items-center justify-between space-x-3">
          <h2 className="text-lg leading-7 font-medium text-white">
            User Information
          </h2>
          <div className="h-7 flex items-center">
            <button
              onClick={() => dispatch({ type: 'closeSlideOver' })}
              aria-label="Close panel"
              className="text-indigo-200 hover:text-white transition ease-in-out duration-150 focus:outline-none">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
        <div>
          <p className="text-sm leading-5 text-indigo-300">
            Lorem, ipsum dolor sit amet consectetur adipisicing elit aliquam ad hic recusandae soluta.
          </p>
        </div>
      </header>
      <div className="relative flex-1 py-6 px-4 sm:px-6">
        <h3 className="mb-2 text-lg leading-6 font-medium text-gray-900">
          Courses
        </h3>
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <DatePickerCalendar date={date} locale={enGB} />
        </div>
      </div>
    </div>
  )
}

function AssignmentCollectionConstraint() {

  const dispatch = useLayoutDispatch();
  return (
    <div className="mt-10 sm:mt-0">
      <div className="md:grid md:grid-cols-3 md:gap-6">
        <div className="md:col-span-1">
          <div className="px-4 sm:px-0">
            <h3 className="text-lg font-medium leading-6 text-gray-900">Collection Constraints</h3>
            <p className="mt-1 text-sm leading-5 text-gray-600">
              Specify the date and time for collection of assignments
            </p>
          </div>
        </div>
        <div className="mt-5 md:mt-0 md:col-span-2">
          <form action="#" method="POST">
            <div className="shadow overflow-hidden sm:rounded-md">
              <div className="px-4 py-5 bg-white sm:p-6">
              <fieldset>
                  <legend className="text-base leading-6 font-medium text-gray-900">Attempts Limit</legend>
                  <div className="mt-4">
                    <div className="mt-4">
                      <label htmlFor="account_number" className="block text-sm font-medium leading-5 text-gray-700">Maximum number of submssion allowed</label>
                      <div className="mt-1 relative rounded-md shadow-sm w-1/2">
                        <input
                          id="account_number"
                          type="number"
                          min="1"
                          className="form-input block w-full sm:text-sm sm:leading-5"
                          placeholder="1"/>
                      </div>
                    </div>
                  </div>
                </fieldset>
                <fieldset className="mt-6">
                  <div className="flex justify-between">
                    <legend className="text-base leading-6 font-medium text-gray-900">Date and Time</legend>
                  </div>
                  <div className="mt-4">
                  <ul className="border border-gray-200 rounded-md">
                    <li className="pl-3 pr-4 py-3 flex items-center justify-between text-sm leading-5">
                      <div className="w-0 flex-1 flex items-center">
                        <span className="w-6 text-center">
                          <FontAwesomeIcon icon={['fad', 'eye-slash']} size="lg"/>
                        </span>
                        <span className="ml-2 flex-1 w-0 truncate">
                          Release Assignment on
                        </span>
                      </div>
                      <div className="ml-4 flex-shrink-0">
                        <button onClick={() => dispatch({ type: 'toggleSlideOver', payload: {}})} type="button" className="font-medium text-cse-600 hover:text-cse-500 transition duration-150 ease-in-out">
                          Change
                        </button>
                      </div>
                    </li>
                    <li className="border-t border-gray-200 pl-3 pr-4 py-3 flex items-center justify-between text-sm leading-5">
                      <div className="w-0 flex-1 flex items-center">
                        <span className="w-6 text-center">
                          <FontAwesomeIcon icon={['fad', 'box-open']} size="lg"/>
                        </span>
                        <span className="ml-2 flex-1 w-0 truncate">
                          Start Collecting on
                        </span>
                      </div>
                      <div className="ml-4 flex-shrink-0">
                        <button onClick={() => dispatch({ type: 'toggleSlideOver', payload: {}})} type="button" className="font-medium text-cse-600 hover:text-cse-500 transition duration-150 ease-in-out">
                          Change
                        </button>
                      </div>
                    </li>
                    <li className="border-t border-gray-200 pl-3 pr-4 py-3 flex items-center justify-between text-sm leading-5">
                      <div className="w-0 flex-1 flex items-center">
                        <span className="w-6 text-center">
                          <FontAwesomeIcon icon={['fad', 'alarm-exclamation']} size="lg"/>
                        </span>
                        <span className="ml-2 flex-1 w-0 truncate">
                          Assignment Due on
                        </span>
                      </div>
                      <div className="ml-4 flex-shrink-0">
                        <button onClick={() => dispatch({ type: 'toggleSlideOver', payload: {}})} type="button" className="font-medium text-cse-600 hover:text-cse-500 transition duration-150 ease-in-out">
                          Change
                        </button>
                      </div>
                    </li>
                    <li className="border-t border-gray-200 pl-3 pr-4 py-3 flex items-center justify-between text-sm leading-5">
                      <div className="w-0 flex-1 flex items-center">
                        <span className="w-6 text-center">
                          <FontAwesomeIcon icon={['fad', 'box-check']} size="lg"/>
                        </span>
                        <span className="ml-2 flex-1 w-0 truncate">
                          Stop Collecting on
                        </span>
                      </div>
                      <div className="ml-4 flex-shrink-0">
                        <button onClick={() => dispatch({ type: 'toggleSlideOver', payload: {}})} type="button" className="font-medium text-cse-600 hover:text-cse-500 transition duration-150 ease-in-out">
                          Change
                        </button>
                      </div>
                    </li>
                  </ul>
                  </div>
                </fieldset>
                <fieldset className="mt-6">
                  <legend className="text-base leading-6 font-medium text-gray-900">Notifications</legend>
                  <p className="text-sm leading-5 text-gray-500">These are delivered via Email to students ITSC mailbox.</p>
                  <div className="mt-4">
                    <div className="flex items-center">
                      <input id="push_everything" name="push_notifications" type="radio" className="form-radio h-4 w-4 text-cse-600 transition duration-150 ease-in-out"/>
                      <label htmlFor="push_everything" className="ml-3">
                        <span className="block text-sm leading-5 font-medium text-gray-700">Only for grade releases</span>
                      </label>
                    </div>
                    <div className="mt-4 flex items-center">
                      <input id="push_email" name="push_notifications" type="radio" className="form-radio h-4 w-4 text-cse-600 transition duration-150 ease-in-out"/>
                      <label htmlFor="push_email" className="ml-3">
                        <span className="block text-sm leading-5 font-medium text-gray-700">For failed grading and grade releases</span>
                      </label>
                    </div>
                    <div className="mt-4 flex items-center">
                      <input id="push_nothing" name="push_notifications" type="radio" className="form-radio h-4 w-4 text-cse-600 transition duration-150 ease-in-out"/>
                      <label htmlFor="push_nothing" className="ml-3">
                        <span className="block text-sm leading-5 font-medium text-gray-700">No notifications</span>
                      </label>
                    </div>
                  </div>
                </fieldset>
              </div>
              <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
                <button className="py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-cse-600 shadow-sm hover:bg-cse-500 focus:outline-none focus:shadow-outline-blue focus:bg-cse-500 active:bg-cse-600 transition duration-150 ease-in-out">
                  Save
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

function Assignment() {
  const router = useRouter();
  const { assignmentId } = router.query
  const { data, loading } = useQuery(GET_ASSIGNMENT, {
    variables: {
      assignmentId
    }
  });

  return (
    <LayoutProvider>
      <Layout title="Assignments">
        <div className="p-6 flex flex-col w-full overflow-y-scroll">
          <div className="pb-5 border-b border-gray-200">
          <div>
            <div className="md:grid md:grid-cols-3 md:gap-6">
              <div className="md:col-span-1">
                <div className="px-4 sm:px-0">
                  <h3 className="text-lg font-medium leading-6 text-gray-900">Assignment Detail</h3>
                  <p className="mt-1 text-sm leading-5 text-gray-600">
                    This information will be displayed publicly so be careful what you share.
                  </p>
                </div>
              </div>
              <div className="mt-5 md:mt-0 md:col-span-2">
                <form action="#" method="POST">
                  <div className="shadow sm:rounded-md sm:overflow-hidden">
                    <div className="px-4 py-5 bg-white sm:p-6">
                      <div className="grid grid-cols-3 gap-6">
                        <div className="col-span-3 sm:col-span-2">
                          <label htmlFor="company_website" className="block text-sm font-medium leading-5 text-gray-700">
                            Name
                          </label>
                          <div className="mt-1 flex rounded-md shadow-sm">
                            <input
                              id="company_website"
                              className="form-input flex-1 block w-full rounded-md transition duration-150 ease-in-out sm:text-sm sm:leading-5"
                              placeholder="PA1 / LAB1"
                              value={loading?'':data.assignment.name}
                            />
                          </div>
                        </div>
                      </div>
          
                      <div className="mt-6">
                        <label htmlFor="about" className="block text-sm leading-5 font-medium text-gray-700">
                          Description
                        </label>
                        <div className="rounded-md shadow-sm">
                          <textarea
                            id="about"
                            rows={3}
                            value={loading?'':data.assignment.description}
                            className="form-textarea mt-1 block w-full transition duration-150 ease-in-out sm:text-sm sm:leading-5" placeholder="Assignment Description"></textarea>
                        </div>
                        <p className="mt-2 text-sm text-gray-500">
                          Brief description for the assignment.
                        </p>
                      </div>
                    </div>
                    <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
                      <span className="inline-flex rounded-md shadow-sm">
                        <button type="submit" className="inline-flex justify-center py-2 px-4 border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-cse-600 hover:bg-cse-500 focus:outline-none focus:border-cse-700 focus:shadow-outline-cse active:bg-cse-700 transition duration-150 ease-in-out">
                          Save
                        </button>
                      </span>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
          
          <div className="hidden sm:block">
            <div className="py-5">
              <div className="border-t border-gray-200"></div>
            </div>
          </div>
          
          <AssignmentCollectionConstraint/>
          </div>
        </div>
      </Layout>
      <SlideOver>
        <AssignmentCollectionTimeSettingSlideOverContent/>
      </SlideOver>
    </LayoutProvider>
  )
}

export async function getServerSideProps(ctx) {
  const apolloClient = initializeApollo(ctx.req.headers.cookie);
  return {
    props: {
      initialApolloState: apolloClient.cache.extract(),
    },
  }
}

export default Assignment;