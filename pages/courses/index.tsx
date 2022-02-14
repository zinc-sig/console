import { Layout } from "../../layout";
import { Courses } from '../../components/Course';
import { initializeApollo } from '../../lib/apollo';
import { LayoutProvider } from '../../contexts/layout';

function Course() {
  return (
    <LayoutProvider>
      <Layout title="Home">
        <div className="p-6 flex flex-col">
          <div className="pb-5 border-b border-gray-200">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Courses
            </h3>
            <ul className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <Courses/>
            </ul>
          </div>
        </div>
      </Layout>
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

export default Course