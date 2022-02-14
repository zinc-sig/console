import React, { useState } from "react";
import Link from "next/link"
import { useRouter } from "next/router";
import { useMutation, useQuery } from "@apollo/client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Layout } from "../../../layout";
import { initializeApollo } from "../../../lib/apollo";
import { LayoutProvider, useLayoutDispatch } from "../../../contexts/layout";
import AssignmentDescriptionEditor from "../../../components/Assignment/DescriptionEditor";
import { UPDATE_ASSIGNMENT } from "../../../graphql/mutations/user";
import { GET_ASSIGNMENT } from "../../../graphql/queries/user";

interface Assignment {
  id?: number
  name: string
  course_id?: number
  description: string
  description_html: string
  type: number
}

interface AssignmentFormProps {
  initialAssignmentState: Assignment
}

function AssignmentForm({ initialAssignmentState }: AssignmentFormProps) {
  
  const dispatch = useLayoutDispatch();
  
  const [updateAssignment, { loading: updating }] = useMutation(UPDATE_ASSIGNMENT);
  const [assignment, setAssignment] = useState<Assignment>({
    name: initialAssignmentState.name,
    description: initialAssignmentState.description,
    description_html: initialAssignmentState.description_html,
    type: initialAssignmentState.type
  });
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
          const { data } = await updateAssignment({
            variables: {
              id: initialAssignmentState.id,
              update: assignment
            }
          });
          dispatch({ type: 'showNotification', payload: { success: true, title: 'Assignment Details Updated', message: 'Your changes to the assignment details has been saved'}})
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
              value={assignment.type.toString()}
              className="mt-1 block form-select w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:shadow-outline-blue focus:border-blue-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5">
              {
                [
                  {title: 'Assignment', value: 1},
                  {title: 'Lab', value: 2},
                  {title: 'Group Project', value: 3}
                ].map(option => (
                  <option key={option.value} value={option.value.toString()}>{ option.title }</option>
                ))
              }
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
          { updating && <FontAwesomeIcon className="mr-2" icon={['far', 'circle-notch']} spin={updating}/>}
          Update
        </button>
      </div>
    </form>
  )
}

function AssignmentUpdateDetails() {
  const router = useRouter();
  const { assignmentId } = router.query;
  const { data, loading } = useQuery(GET_ASSIGNMENT, {
    variables: {
      assignmentId: parseInt((assignmentId! as string), 10)
    }
  });
  return (
    <LayoutProvider>
      <Layout title="Assignments">
        <div className="p-6 flex flex-col w-full overflow-y-scroll">
          <div className="pb-5 border-b border-gray-200">
            <div className="pb-5 border-b border-gray-200 space-y-3 sm:flex sm:items-center sm:justify-between sm:space-x-4 sm:space-y-0">
              <div className="-mt-2 flex flex-wrap items-baseline">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  { data.assignment.name }
                </h3>
                <p className="ml-2 mt-1 text-sm leading-5 text-gray-500 truncate">in {data.assignment.course.code}</p>
              </div>
              <div>
                <span className="shadow-sm rounded-md">
                  <Link href={`/assignments/${data.assignment.id}/configs`}>
                    <a className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm leading-5 font-medium rounded-md text-gray-700 bg-white hover:text-gray-500 focus:outline-none focus:shadow-outline-blue focus:border-blue-300 active:text-gray-800 active:bg-gray-50 transition duration-150 ease-in-out">
                      <FontAwesomeIcon className="mr-2" icon={['fad', 'cogs']}/>
                      Configs
                    </a>
                  </Link>
                </span>
              </div>
            </div>
            { !loading && <AssignmentForm initialAssignmentState={data.assignment}/>}
          </div>
        </div>
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

export default AssignmentUpdateDetails;