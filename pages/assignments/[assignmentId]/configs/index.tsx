import Link from "next/link";
import { useQuery } from "@apollo/client";
import { initializeApollo } from "../../../../lib/apollo";
import { LayoutProvider, useLayoutDispatch } from "../../../../contexts/layout";
import { Layout } from "../../../../layout";
import { GET_CONFIGS_FOR_ASSIGNMENT } from "../../../../graphql/queries/user";
import { useRouter } from "next/router";
import Collapse from "@kunukn/react-collapse";

function AssignmentConfigs({ configs }) {
  const router = useRouter();
  const assignmentId = parseInt(router.query.assignmentId as string, 10)
  const dispatch = useLayoutDispatch()
  return (
    <div className="mt-2 bg-white overflow-hidden sm:rounded-lg sm:shadow">
      <div className="bg-white px-4 py-5 border-b border-gray-200 sm:px-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900">
          Configurations
        </h3>
        <p className="mt-1 text-sm leading-5 text-gray-500">
          Configure various settings for the assignment
        </p>
      </div>
      <ul>
        {
          configs.map((config, index) => (
            <li key={config.id} className={`${index===0?'':'border-t border-gray-200'}`}>
              <Link href={`/assignments/${assignmentId}/configs/${config.id}`}>
                <a className="block hover:bg-gray-50 focus:outline-none focus:bg-gray-50 transition duration-150 ease-in-out">
                  <div className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <div className="text-sm leading-5 font-medium text-cse-600 truncate">
                        Configuration #{config.id}
                      </div>
                    </div>
                  </div>
                </a>
              </Link>
            </li>
          ))
        }
      </ul>
    </div>
  )
}

function AssignmentConfiguration() {
  const router = useRouter();
  const assignmentId = parseInt(router.query.assignmentId as string, 10)
  const { data, loading } = useQuery(GET_CONFIGS_FOR_ASSIGNMENT, {
    variables: {
      assignmentId
    }
  });

  return (
    <LayoutProvider>
      <Layout title="Assignment Configs">
        <div className="p-6 flex flex-col w-full">
          <div className="pb-5 border-b border-gray-200">
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
                    <a className="text-gray-500 hover:text-gray-700 transition duration-150 ease-in-out">{data.assignment.course.code}</a>
                  </Link>
                  <svg className="flex-shrink-0 mx-2 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                  <Link href="/">
                    <a className="text-gray-500 hover:text-gray-700 transition duration-150 ease-in-out">{data.assignment.name}</a>
                  </Link>
                </nav>
              </div>
              <div className="mt-2 md:flex md:items-center md:justify-between">
                <div className="flex-1 min-w-0">
                  <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:leading-9 sm:truncate">
                    {data.assignment.name}
                  </h2>
                </div>
                <div className="mt-4 flex-shrink-0 flex md:mt-0 md:ml-4">
                  <span className="shadow-sm rounded-md">
                    <Link href={`/assignments/${assignmentId}/details`}>
                      <a className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm leading-5 font-medium rounded-md text-gray-700 bg-white hover:text-gray-500 focus:outline-none focus:shadow-outline-blue focus:border-blue-300 active:text-gray-800 active:bg-gray-50 transition duration-150 ease-in-out">
                        Edit Details
                      </a>
                    </Link>
                  </span>
                  <span className="ml-3 shadow-sm rounded-md">
                    <Link href={`/assignments/${assignmentId}/configs/new`}>
                      <a className="inline-flex items-center px-4 py-2 border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-cse-600 hover:bg-cse-500 focus:outline-none focus:shadow-outline-cse focus:border-cse-700 active:bg-cse-700 transition duration-150 ease-in-out">
                        Add Config
                      </a>
                    </Link>
                  </span>
                </div>
              </div>
            </div>
            <div className="mt-4">
              <AssignmentConfigs configs={data.assignment.configs} />
            </div>
          </div>
        </div>
      </Layout>
    </LayoutProvider>
  )
}

export async function getServerSideProps(ctx) {
  const apolloClient = initializeApollo(ctx.req.headers.cookie);
  const { assignmentId } = ctx.query;
  await apolloClient.query({
    query: GET_CONFIGS_FOR_ASSIGNMENT,
    variables: {
      assignmentId: parseInt(assignmentId, 10)
    }
  });
  return {
    props: {
      initialApolloState: apolloClient.cache.extract(),
    },
  }
}

export default AssignmentConfiguration;
