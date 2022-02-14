import { gql } from "@apollo/client";

export const CREATE_ASSIGNMENT = gql`
  mutation createAssignment($input: assignments_insert_input!) {
    createAssignment(
      object: $input
    ) {
      id
    }
  }
`

export const UPDATE_ASSIGNMENT = gql`
  mutation updateAssignment($id: bigint!, $update: assignments_set_input!) {
    updateAssignment(
      pk_columns: {
        id: $id
      }
      _set: $update
    ) {
      id
    }
  }
`

export const CREATE_ASSIGNMENT_CONFIG = gql`
  mutation createAssignmentConfig($input: assignment_configs_insert_input!) {
    createAssignmentConfig(
      object: $input
    ) {
      id
    }
  }
`

export const UPDATE_ASSIGNMENTCONFIG_NOTI = gql`
  mutation updateAssignmentNoti($userId: bigint!, $assignmentConfigId: jsonb, $assignmentConfigIdForCheck: bigint!){
    update_section_user(
      where:{
        user_id:{_eq: $userId},
        section:{
          course:{
            assignments:{
              configs:{
                id:{
                  _eq: $assignmentConfigIdForCheck
                }
              }
            }
          }
        }
      },
      _append: {assignment_config_ids: $assignmentConfigId}
    ){
      affected_rows
    }
  }
`

export const UPDATE_ASSIGNMENT_CONFIG = gql`
  mutation updateAssignmentConfig($id: bigint!, $update: assignment_configs_set_input!) {
    updateAssignmentConfig(
      pk_columns: {
        id: $id
      }
      _set: $update
    ) {
      id
    }
  }
`


export const UPDATE_PIPELINE_CONFIG = gql `
  mutation updatePipelineConfig($id: bigint!, $yaml: String!) {
    updateAssignmentConfig(
      pk_columns: {
        id: $id
      }
      _set: {
        config_yaml: $yaml
      }
    ) {
      id
    }
  }
`

export const ASSIGN_TASK_TO_STUDENT = gql `
  mutation assignTaskToStudent($userId: bigint!, $assignmentConfigId: bigint!) {
    assignTaskToUser(
      object: {
        user_id: $userId
        assignment_config_id: $assignmentConfigId
      }
    ) {
      id
    }
  }
`

export const REMOVE_TASK_FROM_STUDENT = gql `
  mutation removeTaskFromStudent($userId: bigint!, $assignmentConfigId: bigint!) {
    removeTaskAssignmentForUser(
      user_id: $userId
      assignment_config_id: $assignmentConfigId
    ) {
      id
    }
  }
`

export const BULK_ASSIGN_TASK_TO_STUDENTS = gql `
  mutation bulkAssignStudentsToTask($taskAssignments: [assignment_config_user_insert_input!]!) {
    assignTaskToUsers(
      objects: $taskAssignments
      on_conflict: {
        constraint: assignment_config_user_pkey
        update_columns: [
          updatedAt
        ]
      }
    ) {
      returning {
        id
      }
    }
  }
`

export const BULK_REMOVE_TASK_FROM_STUDENTS = gql `
  mutation bulkAssignStudentsToTask($userIds: [bigint!]!, $assignmentConfigId: bigint!) {
    removeTaskAssignmentForUsers(where: {
      _and: {
        user_id: {
          _in: $userIds
        }
        assignment_config_id: {
          _eq: $assignmentConfigId
        }
      }
    }) {
      returning {
        id
      }
    }
  }
`