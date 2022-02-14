import { Layout } from "../../layout";
import { initializeApollo } from '../../lib/apollo';
import { LayoutProvider } from '../../contexts/layout';
import { Assignments } from "../../components/Assignment";

function AllAssignments() {
  return (
    <LayoutProvider>
      <Layout title="Assignments">
        <div className="p-6 flex flex-col w-full overflow-y-auto">
          <div className="pb-5 border-b border-gray-200">
            <Assignments/>
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

export default AllAssignments