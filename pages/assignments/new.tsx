import { useState } from "react";
import { useRouter } from "next/router";
import { useMutation } from "@apollo/client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Layout } from "../../layout";
import { initializeApollo } from '../../lib/apollo';
import { LayoutProvider, useLayoutDispatch, useLayoutState } from '../../contexts/layout';
import { CREATE_ASSIGNMENT } from "../../graphql/mutations/user";
import { Modal } from "../../components/Modal";
import { AssignmentCreationSteps } from "../../components/Assignment/AssignmentCreationSteps";
import AssignmentDescriptionEditor from "../../components/Assignment/DescriptionEditor";

interface Assignment {
  name: string
  course_id: number
  description: string
  description_html: string
  type: number
}

function AssignmentForm() {
  const router = useRouter();
  const { course } = router.query;
  const dispatch = useLayoutDispatch();
  const initialAssignmentState: Assignment = {
    name: '',
    course_id: parseInt((course as string), 10),
    description: '',
    description_html: '',
    type: 1
  }
  const [assignment, setAssignment] = useState<Assignment>(initialAssignmentState);
  const [createAssignment, { loading }] = useMutation(CREATE_ASSIGNMENT);

  const validateInputs = () => {
    if (assignment.name.length>0 && assignment.description_html.length >0) {
      return true;
    } else {
      dispatch({ type: 'showNotification', payload: { success: false, title: 'Missing Input fields detected', message: 'Please make sure all the necessary information is present before submitting'}})
      return false;
    }
  }

  return (
    <form
      onSubmit={ async e => {
        e.preventDefault();
        if (validateInputs()) {
          const { data } = await createAssignment({
            variables: {
              input: assignment
            }
          });
          dispatch({ type: 'assignmentCreated', payload: data.createAssignment.id })
        }
      }}
      className="shadow overflow-hidden sm:rounded-md">
      <div className="px-4 py-5 bg-white sm:p-6">
        <div className="grid grid-cols-6 gap-6">
          <div className="col-span-6 sm:col-span-3">
            <label htmlFor="assignmentName" className="block text-sm font-medium leading-5 text-gray-700">Name</label>
            <input
              id="assignmentName"
              onChange={(e) => setAssignment({...assignment, name: e.target.value})}
              value={assignment.name}
              className="mt-1 form-input block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:shadow-outline-blue focus:border-blue-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5"/>
          </div>

          <div className="col-span-6 sm:col-span-3">
            <label htmlFor="assignmentType" className="block text-sm font-medium leading-5 text-gray-700">Type</label>
            <select
              onChange={(e) => setAssignment({...assignment, type: parseInt(e.target.value, 10)})}
              id="assignmentType"
              className="mt-1 block form-select w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:shadow-outline-blue focus:border-blue-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5">
              <option value="1">Assignment</option>
              <option value="2">Lab</option>
              <option value="3">Group Project</option>
            </select>
          </div>

          <div className="col-span-6 sm:col-span-6 h-full">
            <label htmlFor="about" className="block text-sm font-medium leading-5 text-gray-700">
              Description
            </label>
            <AssignmentDescriptionEditor
              modules={
                {
                  toolbar: [
                    [{ 'header': '1' }, { 'header': '2' }, { 'font': [] }],
                    [{ size: [] }],
                    ['bold', 'italic', 'underline', 'strike', 'blockquote'],
                    [{ 'list': 'ordered' }, { 'list': 'bullet' },
                      { 'indent': '-1' }, { 'indent': '+1' }],
                    ['link', 'image', 'video'],
                    ['clean']
                  ],
                  clipboard: {
                    // toggle to add extra line breaks when pasting HTML:
                    matchVisual: false
                  }
                }
              }
              value={assignment.description_html}
              onChange={description => setAssignment({...assignment, description_html: description, description})}
            />
          </div>
        </div>
      </div>
      <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
        <button
          type="submit"
          className="py-2 px-4 border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-cse-600 shadow-sm hover:bg-cse-500 focus:outline-none focus:shadow-outline-blue active:bg-cse-600 transition duration-150 ease-in-out">
          { loading && <FontAwesomeIcon className="mr-2" icon={['far', 'circle-notch']} spin={loading}/>}
          Create
        </button>
      </div>
    </form>
  )
}
function CreateAssigmentCompletionModal() {

  const router = useRouter();
  const { assignmentId } = useLayoutState();
  const dispatch = useLayoutDispatch();

  return (
    <Modal>
      <div className="px-4 pt-5">
        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
          {/* Heroicon name: check */}
          <svg className="h-6 w-6 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <div className="mt-3 text-center sm:mt-5">
          <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-headline">
            Assignment created successfully
          </h3>
          <div className="mt-2">
            <p className="text-sm leading-5 text-gray-500">
              To schedule submission due date and grading scheme with test cases and various settings, please select configure assignment 
            </p>
          </div>
        </div>
      </div>
      <div className="px-4 pb-4 mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
        <span className="flex w-full rounded-md shadow-sm sm:col-start-2">
          <button
            onClick={() => {
              dispatch({ type: 'closeModal' });
              router.push(`/assignments/${assignmentId}/configs`);
            }}
            type="button"
            className="inline-flex justify-center w-full rounded-md border border-transparent px-4 py-2 bg-cse-600 text-base leading-6 font-medium text-white shadow-sm hover:bg-cse-500 focus:outline-none focus:border-cse-700 focus:shadow-outline-cse transition ease-in-out duration-150 sm:text-sm sm:leading-5">
            Configure Assignment
          </button>
        </span>
        <span className="mt-3 flex w-full rounded-md shadow-sm sm:mt-0 sm:col-start-1">
          <button
            onClick={() => {
              dispatch({ type: 'closeModal' });
              router.replace(`/assignments`);
            }}
            type="button"
            className="inline-flex justify-center w-full rounded-md border border-gray-300 px-4 py-2 bg-white text-base leading-6 font-medium text-gray-700 shadow-sm hover:text-gray-500 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue transition ease-in-out duration-150 sm:text-sm sm:leading-5">
            Back to Assignments
          </button>
        </span>
      </div>
    </Modal>
  )
}

function CreateAssignment() {
  
  return (
    <LayoutProvider>
      <Layout title="Assignments">
        <div className="p-6 flex flex-col w-full overflow-y-scroll">
          <div className="pb-5 border-b border-gray-200">
            <AssignmentCreationSteps/>
            <AssignmentForm/>
          </div>
        </div>
      </Layout>
      <CreateAssigmentCompletionModal/>
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

export default CreateAssignment;