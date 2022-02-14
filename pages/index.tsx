import Head from 'next/head'
import { Layout } from "../layout";
import { Courses } from '../components/Course';
import { initializeApollo } from '../lib/apollo';
import { LayoutProvider } from '../contexts/layout';
import { Modal, ModalFooter } from '../components/Modal';

function Home() {
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
      <Modal>
        <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
          <div className="sm:flex sm:items-start">
            <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
              <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
              <h3 className="text-lg leading-6 font-medium text-gray-900 flex items-center" id="modal-headline">
                刪除
                <span className="inline-flex items-center ml-2 px-2.5 py-0.5 rounded-md text-sm font-medium leading-5 bg-red-100 text-red-800">
                  Testing
                </span>
              </h3>
              <div className="mt-2">
                <p className="text-sm leading-5 text-gray-500">
                  你確定要刪除此項目? 相關數據及紀錄將被永久移除。此動作執行後將不可恢復！
                </p>
              </div>
            </div>
          </div>
        </div>
        <ModalFooter onConfirm={() => {console.log('hi')}} variant="cse"/>
      </Modal>
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

export default Home