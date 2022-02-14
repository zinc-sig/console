import { ApolloProvider } from '@apollo/client'
import { parse } from "cookie";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fad } from "@fortawesome/pro-duotone-svg-icons";
import { far } from "@fortawesome/pro-regular-svg-icons";
import { useApollo } from "../lib/apollo";
import { ZincProvider } from "../contexts/zinc";
import "react-nice-dates/build/style.css"
import "react-datepicker/dist/react-datepicker.css";
import "react-gh-like-diff/dist/css/diff2html.min.css";
import "../styles/index.css"
import { getUserRole } from '../utils/user';
import Unauthorized from "../pages/401";

library.add(fad, far);

function ZincApp({ Component, pageProps, cookie, hasTeachingRole, isAdmin, user, itsc, semester }) {
  let initialApolloState = {};
  if(pageProps) {
    initialApolloState = pageProps.initialApolloState;
  }
  const client = useApollo(cookie, initialApolloState);
  if(!hasTeachingRole && !isAdmin) {
    return <Unauthorized/>
  }
  return (
    <ApolloProvider client={client}>
      <ZincProvider
        isAdmin={isAdmin}
        user={user}
        itsc={itsc}
        semester={semester}
      >
        <Component {...pageProps}/>
      </ZincProvider>
    </ApolloProvider>
  )
}

ZincApp.getInitialProps = async ({ctx}) => {
  const { user, semester, itsc } = parse(ctx.req.headers.cookie);
  const { hasTeachingRole, isAdmin } = await getUserRole(parseInt(user, 10));
  return {
    cookie: ctx.req.headers.cookie,
    hasTeachingRole,
    isAdmin,
    itsc,
    user: parseInt(user, 10),
    semester: parseInt(semester, 10)
  }
}

export default ZincApp
