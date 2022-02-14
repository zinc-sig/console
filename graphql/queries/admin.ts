import { gql } from "@apollo/client";

export const GET_USERS = gql`
  query getUsers($cursor: bigint_comparison_exp!) {
    users(limit: 15, where: { id: $cursor }) {
      id
      name
      itsc
      updatedAt
      courses {
        id
        permission
        course {
          code
          semester {
            name
          }
        }
        role
      }
    }
    users_aggregate {
      aggregate {
        count
      }
    }
  }
`

export const GET_ALL_SUBMISSIONS_FOR_ASSIGNMENT = `
  query getSubmissionsForAssignmentConfig($assignmentConfigId: bigint!) {
    assignmentConfig(id: $assignmentConfigId) {
      assignment {
        course {
          code
          semester {
            year
            term
          }
        }
      }
      submissions(
        distinct_on: [user_id]
        order_by: [
          { user_id: asc }
          { created_at: desc }
        ]
      ) {
        stored_name
        upload_name
        user {
          itsc
        }
      }
    }
  }
`

export const GET_ALL_SUBMISSIONS_FOR_STUDENT_ASSIGNMENT = gql`
  query getSubmissionsFromStudentForAssignmentConfig($assignmentConfigId: bigint!, $userId: bigint!) {
    assignmentConfig(id: $assignmentConfigId) {
      assignment {
        course {
          code
          semester {
            year
            term
          }
        }
      }
      submissions(
        where: {
          user_id: {
            _eq: $userId
          }
        }
      ) {
        stored_name
        upload_name
        user {
          itsc
        }
      }
    }
  }
`

export const GET_COURSES = gql`
  query getCourses {
    courses_aggregate {
      aggregate {
        count
      }
    }
    courses(limit: 15) {
      id
      name
      code
      semester {
        name
      }
      sections {
        name
      }
      students: users_aggregate(where: {
        permission: {
          _eq: 1
        }
      }){
        aggregate {
          count
        }
      }
      teachingStaff: users(where: {
        permission: {
          _gt: 1
        }
      }) {
        user {
          initials
          name
        }
      }
    }
  }
`

// export const GET_ASSIGNMENTS = gql`
//   query getAssignments {
//     assignments {
//       id
//       name
//     }
//   }
// `