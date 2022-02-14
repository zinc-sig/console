import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useMutation } from "@apollo/client";
import { useDropzone } from "react-dropzone";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useLayoutDispatch, useLayoutState } from "../../contexts/layout";
import { UPDATE_ASSIGNMENT_CONFIG } from "../../graphql/mutations/user";
import { useZinc } from "../../contexts/zinc";


export function PolicyConfig({ policy, onChange }) {
  const router = useRouter();
  const { assignmentConfigId } = router.query;
  const dispatch = useLayoutDispatch();
  const [updateConfig, { loading }] = useMutation(UPDATE_ASSIGNMENT_CONFIG);

  const updatePolicy = async (policy) => {
    try {
      await updateConfig({
        variables: {
          id: parseInt(assignmentConfigId as string, 10),
          update: policy
        }
      });
      dispatch({ type: 'showNotification', payload: { success: true, title: 'Assignment Config Updated', message: 'Changes to grading policy has been saved'}});
      onChange();
    } catch (error: any) {
      dispatch({ type: 'showNotification', payload: { success: false, title: 'Error', message: error.message}})
    }
  }

  return (
    <fieldset className="mt-6">
      <legend className="text-base leading-6 font-medium text-gray-900">Policy</legend>
      <div className="mt-4 flex justify-between items-center">
        <label htmlFor="attemptLimits" className="block text-sm font-medium leading-5 text-gray-700">Attempt Limits</label>
        <input
          id="attemptLimits"
          type="number"
          onChange={(e) => updatePolicy({ attemptLimits: e.target.value||null })}
          placeholder="Unlimited"
          value={policy.attemptLimits}
          className="mt-1 form-input block w-1/2 py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:shadow-outline-blue focus:border-blue-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5"/>
      </div>
      <div className="mt-4">
        <div className="flex items-start">
          <div className="flex items-center h-5">
            <input
              checked={policy.gradeImmediately}
              onChange={(e) => updatePolicy({ gradeImmediately: e.target.checked })}
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
                checked={policy.showImmediateScores}
                onChange={(e) => updatePolicy({ showImmediateScores: e.target.checked })}
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
        <div className="mt-4">
          <button
            onClick={() => dispatch({ type: 'assignmentSupportingFilesUploader' ,payload: assignmentConfigId })}
            type="button"
            className="inline-flex w-full justify-center items-center px-4 py-2 border border-transparent text-sm leading-5 font-medium rounded-md text-cse-700 bg-blue-100 hover:bg-blue-50 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:bg-blue-200 transition ease-in-out duration-150">
            <FontAwesomeIcon className="mr-2" icon={['fad', 'folder-open']}/>
            Complementary Files
          </button>
        </div>
      </div>
    </fieldset>
  )
}

export function ComplementaryFilesSlideOver() {
  const [fileTree, setFileTree] = useState<any>(null);
  const [selectedFolder, selectFolder] = useState('provided');
  const dispatch = useLayoutDispatch();
  const { uploadGradingPackage } = useZinc();
  const { assignmentConfigId } = useLayoutState();
  const onDrop = useCallback(async acceptedFiles => {
    try {
      await uploadGradingPackage(acceptedFiles, assignmentConfigId);
      dispatch({ type: 'showNotification', payload: { success: true, title: 'Uploaded successfully', message: 'Grading package has been uploaded successfully'}});
    } catch (error: any) {
      dispatch({ type: 'showNotification', payload: { success: false, title: 'Error', message: error.message }});
    }
  }, [assignmentConfigId]);
  const { acceptedFiles, getRootProps, getInputProps } = useDropzone({
    onDrop,
    multiple: false,
  });
  useEffect(() => {
    const getFileTree = async () => {
      const response = await fetch(`/api/configs/${assignmentConfigId}/helpers`,{
        method: 'GET'
      });
      const content: any = await response.json();
      if (Object.keys(content).length!==0) {
        const folder = content.children.find(node => node.name===selectedFolder);
        setFileTree(folder);
      }
    }
    getFileTree();
  }, [selectedFolder, acceptedFiles]);

  return (
    <div className="h-full flex flex-col bg-cool-gray-50 shadow-xl overflow-y-scroll">
      <header className="space-y-1 py-6 px-4 bg-cse-600 sm:px-6">
        <div className="flex items-center justify-between space-x-3">
          <h2 className="text-lg leading-7 font-medium text-white">
            Complementary Files
          </h2>
          <div className="h-7 flex items-center">
            <button
              onClick={() => dispatch({ type: 'closeSlideOver' })}
              aria-label="Close panel"
              className="text-cse-200 hover:text-white transition ease-in-out duration-150 focus:outline-none">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
        <div>
          <p className="text-sm leading-5 text-cse-300">
            Manages assignment&apos;s grading required package / skeleton files 
          </p>
        </div>
      </header>
      <div className="bg-white overflow-hidden shadow rounded-lg m-4">
        <ul className="px-4 py-5 sm:p-6">
          <li className="flex">
            <FontAwesomeIcon className="text-blue-400 mr-2 mt-2" icon={['fad', 'exclamation-circle']}/>
            <p className="text-sm">
              <strong>Provided: </strong>
              The files that you (the TAs) need in order for the grading to succeed. This may include parts of the skeleton, and additional files for e.g. custom test cases and testing frameworks.
            </p>
          </li>
          <li className="flex">
            <FontAwesomeIcon className="text-blue-400 mr-2 mt-2" icon={['fad', 'exclamation-circle']}/>
            <p className="text-sm">
              <strong>Skeleton: </strong>
              The files that are provided to the students when they start working on the lab/assignment.
            </p>
          </li>
          <li className="flex">
            <FontAwesomeIcon className="text-blue-400 mr-2 mt-2" icon={['fad', 'exclamation-circle']}/>
            <p className="text-sm">
              <strong>Template: </strong>
              The files that the students are required to submit for the lab/assignment.
            </p>
          </li>
          <li className="flex">
            <FontAwesomeIcon className="text-yellow-400 mr-2 mt-2" icon={['fad', 'exclamation-triangle']}/>
            <p className="text-sm font-medium">
              Please upload a single file archive containing all the necessary folders in a zip format
            </p>
          </li>
        </ul>
      </div>
      <div className="mt-6 border-b border-gray-200">
        <div className="px-6">
          <nav className="-mb-px flex space-x-6">
            {
              ['Provided', 'Skeleton', 'Template'].map(folder => (
                <a
                  key={folder}
                  onClick={() => selectFolder(folder.toLowerCase())}
                  className={`cursor-pointer whitespace-no-wrap pb-4 px-1 border-b-2 ${selectedFolder===folder.toLowerCase()?'border-cse-500 font-medium text-sm leading-5 text-cse-600 focus:outline-none focus:text-cse-800 focus:border-cse-700': 'border-transparent font-medium text-sm leading-5 text-gray-500 hover:text-gray-700 hover:border-gray-300 focus:outline-none focus:text-gray-700 focus:border-gray-300'}`}
                >
                  { folder }
                </a>
              ))
            }
          </nav>
        </div>
      </div>
      <div className="flex-1 flex flex-col justify-between">
        <div>
          {
            fileTree!==null && (
              <ul className="border border-gray-200 rounded-md m-4">
                {
                  fileTree.children.map(node => (
                    <li key={node.name} className="pl-3 pr-4 py-3 flex items-center justify-between text-sm leading-5">
                      <div className="w-0 flex-1 flex items-center">
                        <FontAwesomeIcon className="flex-shrink-0 h-5 w-5 text-gray-500" icon={['fad', node.type==='directory'?'folder':'file' ]}/>
                        <span className="ml-2 flex-1 w-0 truncate">
                          { node.name }
                        </span>
                      </div>
                    </li>
                  ))
                }
              </ul>
            )
          }
          {
            fileTree===null && (
              <div className="bg-gray-200 rounded-md p-12 m-8 flex flex-col justify-center items-center">
                <FontAwesomeIcon className="text-gray-400" icon={['fad', 'file-import']} size="2x"/>
                <h4 className="font-medium mt-2 text-sm">No grading package uploaded</h4>
                <p className="text-xs mt-1 text-gray-500 text-center">You can import the required grading package files via uploading from below</p>
              </div>
            )
          }
        </div>
        <div className="px-4 divide-y divide-gray-200 sm:px-6">
          <div className="space-y-6 pt-6 pb-5">
            <div className="relative flex items-start">
              <div className="mt-2 w-full" {...getRootProps()}>
                  <div className="max-w-lg flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md outline-none">
                    <div className="text-center">
                      <FontAwesomeIcon  className="mx-auto h-12 w-12 text-gray-400" icon={['fad', 'copy']} size="2x"/>
                      <p className="mt-1 text-sm text-gray-600">
                        <input {...getInputProps()}/>
                        <button type="button" className="mr-1 font-medium text-cse-600 hover:text-cse-500 focus:outline-none focus:underline transition duration-150 ease-in-out">
                          Upload a file
                        </button>
                        or drag and drop
                      </p>
                      <p className="mt-1 text-xs text-gray-500">
                        zipped source files and folders up to 10MB
                      </p>
                    </div>
                  </div>
                </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}