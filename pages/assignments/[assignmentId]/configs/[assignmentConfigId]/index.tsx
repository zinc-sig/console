import { useRouter } from "next/router";
import Link from "next/link";
import { useMutation, useQuery } from "@apollo/client";
import { ControlledEditor } from '@monaco-editor/react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { initializeApollo } from "../../../../../lib/apollo";
import { LayoutProvider, useLayoutDispatch, useLayoutState } from "../../../../../contexts/layout";
import { Layout } from "../../../../../layout";
import { Modal } from "../../../../../components/Modal";
import { ScheduleConfig } from "../../../../../components/Config/Schedule";
import { GET_PIPELINE_CONFIG_FOR_ASSIGNMENT } from "../../../../../graphql/queries/user";
import { UPDATE_PIPELINE_CONFIG } from "../../../../../graphql/mutations/user";
import { useZinc } from "../../../../../contexts/zinc";
import { ComplementaryFilesSlideOver, PolicyConfig } from "../../../../../components/Config/Policy";
import { AssignedUsers, AssignedUsersSlideOver } from "../../../../../components/Config/Users";
import { SlideOver } from "../../../../../components/SlideOver";
import { useState } from "react";
import AssignmentSupportingFilesUploader from "../../../../../components/AssignmentSupportingFilesUploader"
import { FilesProvider } from "../../../../../contexts/assignmentSupportingFiles";


function SlideOverContent() {
  const { configSlideOver } = useLayoutState();
  switch(configSlideOver) {
    case 'users':
      return <AssignedUsersSlideOver/>
    // case 'files':
    //   return <AssignmentSupportingFilesUploader/>
      // return 
    default:
      return <div></div>
  }
}

function ModalContent() {
  const {modalType} = useLayoutState();
  switch(modalType){
    case 'yaml':
      return (
        <Modal size="regular">
          <RegradingPrompt />
        </Modal>
      )
    case 'files':
      return (
        <Modal size="lg">
          <FilesProvider>
            <AssignmentSupportingFilesUploader/>
          </FilesProvider>
        </Modal>
      )
    default:
      return <div></div>
  }
}

function RegradingPrompt() {

  const dispatch = useLayoutDispatch();
  const { gradingPayload } = useLayoutState();
  const { triggerManualGrading } = useZinc();

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
          <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-green-100 sm:mx-0 sm:h-10 sm:w-10">
            <svg className="h-6 w-6 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
            <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-headline">
              YAML Config has been successfully saved.
            </h3>
            <div className="mt-2">
              <p className="text-sm leading-5 text-gray-500">
                To trigger regrading for currently assigned students for this updated config press Regrade, otherwise Ignore to continue.
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
            Regrade
          </button>
        </span>
        <span className="mt-3 flex w-full rounded-md shadow-sm sm:mt-0 sm:w-auto">
          <button
            onClick={() => dispatch({ type: 'closeModal' })}
            type="button"
            className="inline-flex justify-center w-full rounded-md border border-gray-300 px-4 py-2 bg-white text-base leading-6 font-medium text-gray-700 shadow-sm hover:text-gray-500 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue transition ease-in-out duration-150 sm:text-sm sm:leading-5">
            Ignore
          </button>
        </span>
      </div>
    </>
  )
}

function YAMLConfigEditor({ yamlString }) {
  const router = useRouter();
  const [configYaml, setConfigYaml] = useState<string>(yamlString);
  const { validateAssignmentConfig } = useZinc();
  const { assignmentConfigId } = router.query;
  const dispatch = useLayoutDispatch();
  const [ updatePipelineConfig, { loading: updatingYaml} ] = useMutation(UPDATE_PIPELINE_CONFIG);

  async function updateYaml() {
    try {
      // const yaml = jsyaml.load(configYaml);
      const { configError } = await validateAssignmentConfig(configYaml, assignmentConfigId);
      if(!configError) {
        await updatePipelineConfig({
          variables: {
            id: parseInt(assignmentConfigId as string, 10),
            yaml: configYaml
          }
        });
        dispatch({ type: 'configYAMLUpdate', payload: { assignmentConfigId: parseInt(assignmentConfigId as string, 10) } });
      } else {
        dispatch({ type: 'showNotification', payload: { success: false, title: 'Config Error', message: JSON.stringify(configError)}});
      }
    } catch (error: any) {
      dispatch({ type: 'showNotification', payload: { success: false, title: 'Error', message: error.message}});
    }
  }
  return (
    <div className="bg-white overflow-hidden shadow rounded-lg flex-grow w-7/12">
      <div className="border-b border-gray-200 px-4 py-4 sm:px-6 flex items-center justify-between flex-wrap sm:flex-no-wrap">
        <h3 className="text-lg leading-6 font-medium text-gray-900">
          Config YAML
        </h3>
        {
          yamlString!==configYaml && (
            <span className="inline-flex rounded-md shadow-sm">
              <button
                onClick={updateYaml}
                type="button"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-cse-600 hover:bg-cse-500 focus:outline-none focus:border-cse-700 focus:shadow-outline-blue active:bg-cse-700 transition ease-in-out duration-150">
                <FontAwesomeIcon className="mr-2" icon={['fad', 'save']}/>
                Save
              </button>
            </span>
           )
         }
      </div>
      <div className="px-2 py-5 sm:py-4 h-5/6">
        <ControlledEditor
          options={{
            fontSize: 14
          }}
          language="yaml"
          theme="light"
          onChange={(_ev, val) => setConfigYaml(val??'')}
          value={configYaml}
        />
      </div>
    </div>
  )
}

function AssignmentConfiguration() {
  const router = useRouter();
  const { user } = useZinc();
  const assignmentConfigId = parseInt(router.query.assignmentConfigId as string, 10)
  const { data, loading, refetch } = useQuery(GET_PIPELINE_CONFIG_FOR_ASSIGNMENT, {
    variables: {
      assignmentConfigId
    }
  });
  
  const {modalType} = useLayoutState();

  return (
    <LayoutProvider>
      <Layout title="Assignment Configs">
        <div className="p-6 w-full flex overflow-y-auto">
          <YAMLConfigEditor yamlString={data.assignmentConfig.config_yaml??''}/>
          <div className="w-5/12">
            <div className="shadow sm:rounded-md mx-4">
            <div className="px-4 py-5 bg-white sm:rounded-md sm:p-6">
              <fieldset className="mt-6">
                  <Link href={`/courses/${data.assignmentConfig.assignment.course.id}/assignments/${assignmentConfigId}/submissions?userId=${user}`}>
                    <a
                      type="button"
                      className="inline-flex w-full justify-center items-center px-4 py-2 border border-transparent text-sm leading-5 font-medium rounded-md text-cse-700 bg-blue-100 hover:bg-blue-50 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:bg-blue-200 transition ease-in-out duration-150">
                      <FontAwesomeIcon className="mr-2" icon={['fad', 'flask']}/>
                      Test My Submission
                    </a>
                  </Link>
                </fieldset>
                <PolicyConfig
                  onChange={() => refetch({
                    assignmentConfigId
                  })}
                  policy={{
                    attemptLimits: data.assignmentConfig.attemptLimits,
                    gradeImmediately: data.assignmentConfig.gradeImmediately,
                    showImmediateScores: data.assignmentConfig.showImmediateScores
                  }}
                />
                <ScheduleConfig
                  onChange={() => refetch({
                    assignmentConfigId
                  })}
                  schedules={{
                    showAt: data.assignmentConfig.showAt,
                    startCollectionAt: data.assignmentConfig.startCollectionAt,
                    dueAt: data.assignmentConfig.dueAt,
                    stopCollectionAt: data.assignmentConfig.stopCollectionAt,
                    releaseGradeAt: data.assignmentConfig.releaseGradeAt,
                    showImmediateScores: data.assignmentConfig.showImmediateScores
                  }}
                />
                <AssignedUsers/>
                Notificaion
              </div>
            </div>
          </div>
        </div>
        <ModalContent />
        <SlideOver>
          <SlideOverContent/>
        </SlideOver>
      </Layout>
    </LayoutProvider>
  )
}

export async function getServerSideProps(ctx) {
  const apolloClient = initializeApollo(ctx.req.headers.cookie);
  await apolloClient.query({
    query: GET_PIPELINE_CONFIG_FOR_ASSIGNMENT,
    variables: {
      assignmentConfigId: parseInt(ctx.query.assignmentConfigId, 10)
    },
  });
  return {
    props: {
      initialApolloState: apolloClient.cache.extract(),
    },
  }
}

export default AssignmentConfiguration;