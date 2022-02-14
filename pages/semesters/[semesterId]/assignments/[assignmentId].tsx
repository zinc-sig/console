import Assignment from "../../../assignments/[assignmentId]";
import { initializeApollo } from "../../../../lib/apollo";

export async function getServerSideProps(ctx) {
  const apolloClient = initializeApollo(ctx.req.headers.cookie);
  return {
      props: {
      initialApolloState: apolloClient.cache.extract(),
      },
  }
}

export default Assignment;