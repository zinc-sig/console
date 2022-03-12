import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { ControlledEditor } from '@monaco-editor/react';
import jsyaml from "js-yaml";
import DatePicker from "react-datepicker";
import { setHours, setMinutes, addDays} from "date-fns";
import { zonedTimeToUtc } from "date-fns-tz";
import { initializeApollo } from "../../../../lib/apollo";
import { LayoutProvider, useLayoutDispatch, useLayoutState } from "../../../../contexts/layout";
import { Layout } from "../../../../layout";
import { Modal } from "../../../../components/Modal";
import { GET_ASSIGNMENT,  GET_INSTRUCTORS } from "../../../../graphql/queries/user";
import { useMutation, useQuery } from "@apollo/client";
import { CREATE_ASSIGNMENT_CONFIG, UPDATE_ASSIGNMENTCONFIG_NOTI } from "../../../../graphql/mutations/user";
import { useZinc } from "../../../../contexts/zinc";
// import makeAnimated from 'react-select/animated';


interface AssignmentConfig {
  assignment_id: Number
  showAt?: Date|null
  startCollectionAt?: Date
  dueAt?: Date
  stopCollectionAt?: Date
  releaseGradeAt?: Date
  config_yaml: string
  attemptLimits?: Number|null
  gradeImmediately: boolean
  showImmediateScores: boolean
}


function AssignmentConfigCreateSuccessModalContent() {
  const router = useRouter();
  const dispatch = useLayoutDispatch();
  const assignmentId = parseInt(router.query.assignmentId as string, 10);
  const { assignmentConfigId } = useLayoutState();

  return (
    <>
      <div className="px-4 pt-5">
        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
          <svg className="h-6 w-6 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <div className="mt-3 text-center sm:mt-5">
          <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-headline">
            Assignment Config created successfully
          </h3>
          <div className="mt-2">
            <p className="text-sm leading-5 text-gray-500">
              You can now configure students that are going to be assign to this assignment
            </p>
          </div>
        </div>
      </div>
      <div className="px-4 pb-4 mt-5 sm:mt-6">
        <span className="flex w-full rounded-md shadow-sm">
          <button
            onClick={() => {
              dispatch({ type: 'closeModal' });
              router.push(`/assignments/${assignmentId}/configs/${assignmentConfigId}`);
            }}
            type="button"
            className="inline-flex justify-center w-full rounded-md border border-transparent px-4 py-2 bg-indigo-600 text-base leading-6 font-medium text-white shadow-sm hover:bg-indigo-500 focus:outline-none focus:border-indigo-700 focus:shadow-outline-indigo transition ease-in-out duration-150 sm:text-sm sm:leading-5">
            OK
          </button>
        </span>
      </div>
    </>
  )
}

function AssignmentConfigCreation({ assignment }) {
  const router = useRouter();
  const { validateAssignmentConfig} = useZinc();
  const dispatch = useLayoutDispatch();
  const initialConfig: AssignmentConfig = {
    assignment_id: parseInt(router.query.assignmentId as string, 10),
    config_yaml: '',
    showAt: null,
    startCollectionAt: new Date(),
    dueAt: setHours(setMinutes(addDays(new Date(), 7), 59), 23),
    stopCollectionAt: setHours(setMinutes(addDays(new Date(), 7), 59), 23),
    releaseGradeAt: setHours(setMinutes(addDays(new Date(), 7), 59), 23),
    gradeImmediately: false,
    showImmediateScores: false
  };
  const [assignmentConfig, setAssignmentConfig] = useState(initialConfig);
  // store all userID of instructors that would be receive the notification
  // const [notificationList, setNotificationList] = useState([]);
  const [createAssignmentConfig, { loading }] = useMutation(CREATE_ASSIGNMENT_CONFIG);
  // const [updateAssignmentNoti] = useMutation(UPDATE_ASSIGNMENTCONFIG_NOTI);
  // const animatedComponents = makeAnimated();
  async function handleAssignmentConfigCreation() {
    try {
      // const yaml = jsyaml.load(assignmentConfig.config_yaml);
      // setAssignmentConfig({...assignmentConfig, config_yaml: jsyaml.dump(yaml)});
      const { configError } = await validateAssignmentConfig(assignmentConfig.config_yaml, 'draft');
      // const validResponse = await fetch(`/api/validateConfig`,{
      //   method: 'POST',
      //   body: JSON.stringify({
      //     id: assignmentConfig.assignment_id,
      //     config_yaml: assignmentConfig.config_yaml
      //   })
      // });
      // const {configError} = await validResponse.json()
      // console.log(configError)
      if(!configError) {
        const {data} = await createAssignmentConfig({
          variables: {
            input: {
              ...assignmentConfig,
              showAt: assignmentConfig.showAt===null?null:zonedTimeToUtc(assignmentConfig.showAt!, 'Asia/Hong_Kong'),
              startCollectionAt: assignmentConfig.startCollectionAt===null?null:zonedTimeToUtc(assignmentConfig.startCollectionAt!, 'Asia/Hong_Kong'),
              dueAt: zonedTimeToUtc(assignmentConfig.dueAt!, 'Asia/Hong_Kong'),
              stopCollectionAt: zonedTimeToUtc(assignmentConfig.stopCollectionAt!, 'Asia/Hong_Kong'),
              releaseGradeAt: zonedTimeToUtc(assignmentConfig.releaseGradeAt!, 'Asia/Hong_Kong'),
              configValidated: true
            }
          }
        });
        dispatch({ type: 'createAssignmentConfigSuccess', payload: data.createAssignmentConfig.id });

        // // TODO: update user record of the Assignment Config id
        // notificationList.forEach(async (id: string) => {
        //   // update DB content
        //   console.log(data.createAssignmentConfig.id)
        //   const notiConfigUpdateResult = await updateAssignmentNoti({
        //     variables: {
        //       userId:id,
        //       assignmentConfigId: data.createAssignmentConfig.id,
        //       assignmentConfigIdForCheck: data.createAssignmentConfig.id
        //     }
        //   });
        //   console.log(notiConfigUpdateResult)

        //   // get registrationToken of all recevier
        //   const notiRes = await fetch(`/api/notification/getNotification?&id=${id}`,{
        //     method: 'GET'
        //   });
        //   const noti = await notiRes.json()
        //   const token = noti.notification
        //   console.log(token)

        //   // subsribe them to topic
        //   const response = await fetch(`/api/notification/subscription/${'i'+id+'-'+data.createAssignmentConfig.id}`,{
        //     method: 'POST',
        //     body: JSON.stringify({
        //       registrationToken: token,
        //       userId: id
        //     })
        //   });
        //   console.log(response)
        // })
        // success
        // dispatch({ type: 'createAssignmentConfigSuccess', payload: data.createAssignmentConfig.id });
      } else {
        dispatch({ type: 'showNotification', payload: { success: false, title: 'Config Error', message: JSON.stringify(configError)}});
      }
    } catch (error: any) {
      // console.log(error)
      dispatch({ type: 'showNotification', payload: { success: false, title: 'Error', message: error.message}});
    }
  }
  // console.log(notificationList)
  return (
    <div className="p-6 flex flex-col w-full">
      <div className="pb-5 border-b border-gray-200 overflow-auto">
        <div>
          <div>
            <nav className="sm:hidden">
              <Link href="/">
                <a className="flex items-center text-sm leading-5 font-medium text-gray-500 hover:text-gray-700 transition duration-150 ease-in-out">
                  <svg className="flex-shrink-0 -ml-1 mr-1 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Back
                </a>
              </Link>
            </nav>
            <nav className="hidden sm:flex items-center text-sm leading-5 font-medium">
              <Link href="/">
                <a className="text-gray-500 hover:text-gray-700 transition duration-150 ease-in-out">Assignments</a>
              </Link>
              <svg className="flex-shrink-0 mx-2 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
              <Link href="/">
                <a className="text-gray-500 hover:text-gray-700 transition duration-150 ease-in-out">{assignment.course.code}</a>
              </Link>
              <svg className="flex-shrink-0 mx-2 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
              <Link href="/">
                <a className="text-gray-500 hover:text-gray-700 transition duration-150 ease-in-out">{assignment.name}</a>
              </Link>
            </nav>
          </div>
          <div className="mt-2 md:flex md:items-center md:justify-between">
            <div className="flex-1 min-w-0">
              <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:leading-9 sm:truncate">
                New Assignment Config
              </h2>
            </div>
            <div className="mt-4 flex-shrink-0 flex md:mt-0 md:ml-4">
              <span className="ml-3 shadow-sm rounded-md">
                <button onClick={handleAssignmentConfigCreation} type="button" className="inline-flex items-center px-4 py-2 border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-cse-600 hover:bg-cse-500 focus:outline-none focus:shadow-outline-cse focus:border-cse-700 active:bg-cse-700 transition duration-150 ease-in-out">
                  Create
                </button>
              </span>
            </div>
          </div>
        </div>
        <div className="mt-4 flex">
          <div className="bg-white overflow-hidden shadow rounded-lg flex-grow w-7/12">
            <div className="border-b border-gray-200 px-4 py-4 sm:px-6 flex items-center justify-between flex-wrap sm:flex-no-wrap">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Config YAML
              </h3>
            </div>
            <div className="px-2 py-5 sm:py-4 h-5/6">
              <ControlledEditor
                onChange={(_ev, val) => setAssignmentConfig({...assignmentConfig, config_yaml: val!})}
                options={{
                  fontSize: 14
                }}
                language="yaml"
                theme="light"
                value={assignmentConfig.config_yaml}
              />
            </div>
          </div>
          <div className="w-5/12">
            <div className="shadow sm:rounded-md mx-4">
              <div className="px-4 py-5 bg-white sm:rounded-md sm:p-6">
                <fieldset>
                  <legend className="text-base leading-6 font-medium text-gray-900">Policy</legend>
                  <div className="mt-4 flex justify-between items-center">
                    <label htmlFor="attemptLimits" className="block text-sm font-medium leading-5 text-gray-700">Attempt Limits</label>
                    <input
                      id="attemptLimits"
                      type="number"
                      onChange={(e) => setAssignmentConfig({...assignmentConfig, attemptLimits: parseInt(e.target.value, 10)||null })}
                      placeholder="Unlimited"
                      className="mt-1 form-input block w-1/2 py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:shadow-outline-blue focus:border-blue-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5"/>
                  </div>
                  <div className="mt-4">
                    <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <input
                          checked={assignmentConfig.gradeImmediately}
                          onChange={(e) => setAssignmentConfig({...assignmentConfig, gradeImmediately: e.target.checked})}
                          id="gradeImmediately"
                          type="checkbox"
                          className="form-checkbox h-4 w-4 text-cse-600 transition duration-150 ease-in-out"/>
                      </div>
                      <div className="ml-3 text-sm leading-5">
                        <label htmlFor="gradeImmediately" className="font-medium text-gray-700">Grade Immediately</label>
                        <p className="text-gray-500">Trigger grading based on submission event</p>
                      </div>
                    </div>
                    <div className="mt-4">
                      <div className="flex items-start">
                        <div className="flex items-center h-5">
                          <input
                            checked={assignmentConfig.showImmediateScores}
                            onChange={(e) => setAssignmentConfig({...assignmentConfig, showImmediateScores: e.target.checked})}
                            id="showImmediateScores"
                            type="checkbox"
                            className="form-checkbox h-4 w-4 text-cse-600 transition duration-150 ease-in-out"/>
                        </div>
                        <div className="ml-3 text-sm leading-5">
                          <label htmlFor="showImmediateScores" className="font-medium text-gray-700">Reveal Grading Details</label>
                          <p className="text-gray-500">Disclose all available grading information instantaneously</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </fieldset>
                <fieldset className="mt-6">
                  <legend className="text-base leading-6 font-medium text-gray-900">Scheduling</legend>
                  <p className="text-sm leading-5 text-gray-500">Date and Time settings for assignment.</p>
                  <div className="mt-4">
                    <div className="flex flex-col space-y-2">
                      <label htmlFor="showAt" className="block text-sm font-medium leading-5 text-gray-900">
                        Announce
                      </label>
                      <div className="relative rounded-md shadow-sm">
                        <DatePicker
                          id="showAt"
                          showTimeSelect
                          selected={assignmentConfig.showAt}
                          onChange={date => setAssignmentConfig({...assignmentConfig, showAt: date})}
                          injectTimes={[
                            setHours(setMinutes(new Date(), 59), 23)
                          ]}
                          placeholderText="Assignment Announcement Date"
                          className="form-input block w-full sm:text-sm sm:leading-5 transition ease-in-out duration-150"
                          dateFormat="MMMM d, yyyy h:mm aa"
                          />
                      </div>
                    </div>
                    <div className="mt-4 flex flex-col space-y-2">
                      <label htmlFor="startCollectionAt" className="block text-sm font-medium leading-5 text-gray-900">
                        Start Collection
                      </label>
                      <div className="relative rounded-md shadow-sm">
                        <DatePicker
                          id="startCollectionAt"
                          showTimeSelect
                          selected={assignmentConfig.startCollectionAt}
                          onChange={date => setAssignmentConfig({...assignmentConfig, startCollectionAt: date})}
                          injectTimes={[
                            setHours(setMinutes(new Date(), 59), 23)
                          ]}
                          maxDate={assignmentConfig.dueAt}
                          placeholderText="Assignment Collection Start Date"
                          className="form-input block w-full sm:text-sm sm:leading-5 transition ease-in-out duration-150"
                          dateFormat="MMMM d, yyyy h:mm aa"
                          />
                      </div>
                    </div>
                    <div className="mt-4 flex flex-col space-y-2">
                      <label htmlFor="dueAt" className="block text-sm font-medium leading-5 text-gray-900">
                        Due
                      </label>
                      <div className="relative rounded-md shadow-sm">
                        <DatePicker
                          id="dueAt"
                          showTimeSelect
                          selected={assignmentConfig.dueAt}
                          onChange={date => {
                            if(date > assignmentConfig.stopCollectionAt!) {
                              setAssignmentConfig({...assignmentConfig, dueAt:date, stopCollectionAt: date});
                            } else {
                              setAssignmentConfig({...assignmentConfig, dueAt:date });
                            }
                          }}
                          injectTimes={[
                            setHours(setMinutes(new Date(), 59), 23)
                          ]}
                          minDate={assignmentConfig.startCollectionAt}
                          placeholderText="Assignment Grades Release Date"
                          className="form-input block w-full sm:text-sm sm:leading-5 transition ease-in-out duration-150"
                          dateFormat="MMMM d, yyyy h:mm aa"
                          />
                      </div>
                    </div>
                    <div className="mt-4 flex flex-col space-y-2">
                      <label htmlFor="stopCollectionAt" className="block text-sm font-medium leading-5 text-gray-900">
                        Stop Collection
                      </label>
                      <div className="relative rounded-md shadow-sm">
                        <DatePicker
                          id="stopCollectionAt"
                          showTimeSelect
                          selected={assignmentConfig.stopCollectionAt}
                          onChange={date => setAssignmentConfig({...assignmentConfig, stopCollectionAt: date})}
                          injectTimes={[
                            setHours(setMinutes(new Date(), 59), 23)
                          ]}
                          minDate={assignmentConfig.dueAt}
                          placeholderText="Assignment Collection Closing Date"
                          className="form-input block w-full sm:text-sm sm:leading-5 transition ease-in-out duration-150"
                          dateFormat="MMMM d, yyyy h:mm aa"
                          />
                      </div>
                    </div>
                    {
                      !assignmentConfig.showImmediateScores && (
                        <div className="mt-4 flex flex-col space-y-2">
                          <label htmlFor="releaseGradeAt" className="block text-sm font-medium leading-5 text-gray-900">
                            Release Grade
                          </label>
                          <div className="relative rounded-md shadow-sm">
                            <DatePicker
                              id="releaseGradeAt"
                              showTimeSelect
                              selected={assignmentConfig.releaseGradeAt}
                              onChange={date => setAssignmentConfig({...assignmentConfig, releaseGradeAt: date})}
                              injectTimes={[
                                setHours(setMinutes(new Date(), 59), 23)
                              ]}
                              placeholderText="Assignment Grades Release Date"
                              className="form-input block w-full sm:text-sm sm:leading-5 transition ease-in-out duration-150"
                              dateFormat="MMMM d, yyyy h:mm aa"
                              />
                          </div>
                        </div>
                      )
                    }
                  </div>
                  {/* <legend className="mt-4 text-base leading-6 font-medium text-gray-900">Notification</legend>
                  <p className="text-sm leading-5 text-gray-500">Select the instructors to receive notification.</p>
                  <div className="mt-2">
                      <div className="relative rounded-md shadow-sm">
                      <Select
                        closeMenuOnSelect={false}
                        components={animatedComponents}
                        defaultValue={[]}
                        isMulti
                        options={instructors}
                        className="text-sm"
                        onChange={(list)=>{
                          setNotificationList(list.map(element=>{
                            return(element.value)
                          }))
                        }}
                      />
                      </div>
                  </div> */}
                </fieldset>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function AssignmentConfiguration() {
  const router = useRouter();
  const { assignmentId } = router.query;
  const {data, loading} = useQuery(GET_ASSIGNMENT, {
    variables: {
      assignmentId: parseInt((assignmentId! as string), 10)
    }
  });
  var instructorsList = useQuery(GET_INSTRUCTORS, {
    variables: {
      assignmentId: parseInt((assignmentId! as string), 10)
    }
  });
  if(loading || instructorsList.loading){
    return(<div>Loading</div>)
  }
  instructorsList = instructorsList.data.assignments[0].course.users.map(({user})=>{
    return{
      label: user.name,
      value: user.id
    }
  })
  console.log(instructorsList)

  
  
  // console.log(instructorsList)
  return (
    <LayoutProvider>
      <Layout title="Assignment Configs">
        <AssignmentConfigCreation assignment={data.assignment}/>
        <Modal size="regular">
          <AssignmentConfigCreateSuccessModalContent/>
        </Modal>
      </Layout>
    </LayoutProvider>
  )
}

export async function getServerSideProps(ctx) {
  const apolloClient = initializeApollo(ctx.req.headers.cookie);
  await apolloClient.query({
    query: GET_ASSIGNMENT,
    variables: {
      assignmentId: parseInt(ctx.query.assignmentId, 10)
    },
  });
  return {
    props: {
      initialApolloState: apolloClient.cache.extract(),
    },
  }
}

export default AssignmentConfiguration;