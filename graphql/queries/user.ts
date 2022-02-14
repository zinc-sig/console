import { gql } from "@apollo/client";

export interface User {
  id: number
  itsc: string
  name: string
}

export const SIDEBAR = gql`
  query getSidebarData($userId: bigint!, $semesterId: bigint!) {
    user(id: $userId) {
      id
      itsc
      name
      initials
      courses(where: {
        permission: { _gt: 1 }
        course: {
          semester_id: { _eq: $semesterId }
        }
      }) {
        course {
          id
          code
        }
      }
    }
    semesters {
      id
      name
    }
  }
`

export const GET_TEACHING_COURSES = gql`
  query getTeachingCourses($userId: bigint!, $semesterId: bigint!) {
    user(id: $userId) {
      courses(where: {
        permission: { _gt: 1 }
        course: {
          semester_id: { _eq: $semesterId }
        }
      }) {
        course {
          id
          name
          code
        }
      }
    }
  }
`

export const GET_TEACHING_COURSE = gql`
  query getTeachingCourse($courseId: bigint!) {
    assignmentConfigs(
      where: {
        assignment: {
          course_id: {
            _eq: $courseId
          }
        }
      }
      order_by: {
        assignment: {
          name: asc
        }
      }
    ) {
      id
      affected_users {
        user_id
      }
      assignment {
        id
        name
        workloadType {
          name
        }
      }
      submissionWindowPassed
      affected_users_aggregate {
        aggregate {
          count
        }
      }
      submissions_aggregate(
        distinct_on: [user_id]
      ) {
        aggregate {
          count
        }
      }
    }
    course(id: $courseId) {
      name
      code
      sections(
        order_by: {
          name: asc
        }
      ) {
        id
        name
        users {
          user_id
        }
        users_aggregate {
          aggregate {
            count
          }
        }
      }
      teachingStaffs: users(where: {
        permission: {
          _gt: 1
        }
      }) {
        user {
          id
        }
      }
      students: users(where: {
        permission: {
          _eq: 1
        }
      }) {
        student: user {
          id
          itsc
          name
          updatedAt
        }
      }
    }
  }
`

export const GET_NAME_BY_ASSIGNMENT_CONFIG_ID = gql`query getNameByAssignmentConfigId($id :bigint!){
  assignmentConfig(id:$id){
    assignment{
      name
    }
  }
}`

export const GET_SUBMISSIONS_FOR_ASSIGNMENT_CONFIG = gql`
  query getSubmissionsForAssignmentConfig($id: bigint!) {
    assignmentConfig(id: $id) {
      assignment {
        name
      }
      submissions(
        where: {
          extracted_path: {
            _is_null: false
          }
        }
        distinct_on: [user_id]
        order_by: [
          { user_id: asc }
          { created_at: desc }
        ]
      ) {
        id
        reports(
          order_by: {
            createdAt: desc
          }
          limit: 1
        ) {
          grade
        }
        user {
          id
          name
          itsc
        }
      }
    }
  }
`

export const GET_REPORT = gql`
  query getReport($id: bigint!) {
    report(id: $id) {
      id
      is_final
      sanitizedReports
      grade
      createdAt
      submission {
        upload_name
      }
    }
  }
`

export const GET_STUDENTS_FOR_CONFIG = gql`
  subscription getCourseStudentsForConfig($id: bigint!) {
    assignmentConfig(id: $id) {
      id
      affected_users {
        id
        user_id
      }
      assignment {
        course {
          code
          name
          sections {
            id
            name
            students: users {
              user {
                id
                name
                itsc
              }
            }
          }
        }
      }
    }
  }
`

// export const GET__STUDENTS_FOR_CONFIG = gql`
//   query getSectionStudentsForConfig($id: bigint!) {
//     assignmentConfig(id: $assignmentConfigId) {}
//   }
// `

export const GET_ASSIGNMENTS = gql`
  query getTeachingCourseAssignments($userId: bigint!, $semesterId: bigint!) {
    user(id: $userId) {
      courses(where: {
        permission: { _gt: 1 }
        course: {
          semester_id: { _eq: $semesterId }
        }
      }) {
        course {
          id
          name
          code
          assignments {
            id
            name
            description
            workloadType {
              name
            }
          }
        }
      }
    }
  }
`

export const GET_ASSIGNMENT = gql`
  query getAssignment($assignmentId: bigint!) {
    assignment(id: $assignmentId) {
      id
      name
      description
      description_html
      type
      course {
        code
      }
    }
  }
`

export const GET_CONFIGS_FOR_ASSIGNMENT = gql`
  query getConfigsForAssignment($assignmentId: bigint!) {
    assignment(id: $assignmentId) {
      id
      name
      workloadType {
        name
      }
      configs {
        id
        attemptLimits
        gradeImmediately
        showImmediateScores
        dueAt
        startCollectionAt
        stopCollectionAt
        releaseGradeAt
        updatedAt
      }
      course {
        code
      }
    }
  }
`

export const GET_PIPELINE_CONFIG_FOR_ASSIGNMENT = gql`
  query getPipelineConfigForAssignment($assignmentConfigId: bigint!) {
    assignmentConfig(id: $assignmentConfigId) {
      assignment {
        course {
          id
        }
      }
      attemptLimits
      gradeImmediately
      showImmediateScores
      config_yaml
      showAt
      startCollectionAt
      dueAt
      stopCollectionAt
      releaseGradeAt
    }
  }
`

export const SUBMISSION_DETAIL = gql`
  query submissionDetail($userId: bigint!, $assignmentConfigId: bigint!, $courseId: bigint!) {
    user(id: $userId) {
      name
      itsc
    }
    course(id: $courseId) {
      code
    }
    assignmentConfig(id: $assignmentConfigId) {
      assignment {
        name
      }
    }
  }
`

export const SUBMISSION_SUBSCRIPTION = gql`
  subscription submissionsForAssignment($userId: bigint!, $assignmentConfigId: bigint!) {
    submissions(
      order_by: [
        {
          created_at: desc
        }
      ]
      where: {
        user_id: { _eq: $userId }
        assignment_config_id: { _eq: $assignmentConfigId }
      }
    ) {
      id
      created_at
      upload_name
      extracted_path
      fail_reason
      reports(order_by: [
        {
          createdAt: desc
        }
      ]) {
        id
        is_final
        createdAt
      }
    }
  }
`

export const GET_COURSE = gql`
  query getCourse($course: bigint!) {
    course(id: $course) {
      code
      name
    }
  }
`

export const GET_INSTRUCTORS = gql`
  query getSectionInstructor($assignmentId:bigint!){
    assignments(where:{
      id:{_eq:$assignmentId}
    }){
      course{
        users(where:{permission:{_gt:1}}){
          user{
            id
            name
          }
        }
      }
    }
  }
`