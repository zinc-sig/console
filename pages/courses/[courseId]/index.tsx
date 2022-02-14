import { Layout } from "../../../layout";
import { initializeApollo } from '../../../lib/apollo';
import { LayoutProvider, useLayoutState } from '../../../contexts/layout';
import { Assignments } from "../../../components/Assignment/Card";
import { useQuery } from "@apollo/client";
import { GET_TEACHING_COURSE } from "../../../graphql/queries/user";
import { useRouter } from "next/router";
import { Sections } from "../../../components/Section/Card";
import { Students } from "../../../components/Students/Table";
import { SlideOver } from "../../../components/SlideOver";
import { AssignmentSlideOverContent } from "../../../components/Assignment/AssignmentSlideOverContent";
import { Modal } from "../../../components/Modal";
import { RegradingConfirmationDialog } from "../../../components/RegradingConfirmationDialog";
import { CourseStudentSlideOverContent } from "../../../components/Students/CourseStudentSlideOverContent";

function CourseSlideOver() {
  const { coursePageSlideOver } = useLayoutState();
  switch(coursePageSlideOver) {
    case 'submissions':
      return <AssignmentSlideOverContent/>
    case 'student':
      return <CourseStudentSlideOverContent/>
    default:
      return <div></div>
  }
}

function Course() {
  const router = useRouter();
  const courseId = router.query.courseId as string
  const { data, loading } = useQuery(GET_TEACHING_COURSE, {
    variables: {
      courseId: parseInt(courseId, 10)
    }
  })

  return (
    <LayoutProvider>
      <Layout title="Home">
        <div className="p-6 flex flex-col overflow-y-scroll w-full">
          <div className="pb-5 border-b border-gray-200">
            <h3 className="text-lg leading-6 mb-6 font-medium text-gray-900">
                {data.course.code} - { data.course.name }
            </h3>
            <div>
              <Assignments assignmentConfigs={data.assignmentConfigs} sections={data.course.sections}/>
            </div>
            <div className="mt-6">
              <Sections sections={data.course.sections}/>
            </div>
            <div className="mt-6">
              <Students students={data.course.students}/>
            </div>
          </div>
        </div>
      </Layout>
      <SlideOver>
        <CourseSlideOver/>
      </SlideOver>
      <Modal size="regular">
        <RegradingConfirmationDialog/>
      </Modal>
    </LayoutProvider>
  )
}

export async function getServerSideProps(ctx) {
  const apolloClient = initializeApollo(ctx.req.headers.cookie);
  const { courseId } = ctx.query;
  await apolloClient.query({
    query: GET_TEACHING_COURSE,
    variables: {
      courseId: parseInt(courseId, 10)
    }
  });

  return {
    props: {
      initialApolloState: apolloClient.cache.extract(),
    },
  }
}

export default Course