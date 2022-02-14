import axios from "axios";

interface UserRoleFragment {
  hasTeachingRole: boolean
  isAdmin: boolean
}

export async function getUserRole(id: number): Promise<UserRoleFragment> {
  try {
    const { data } = await axios({
      method: 'post',
      headers: {
        'X-Hasura-Admin-Secret': process.env.HASURA_GRAPHQL_ADMIN_SECRET
      },
      url: process.env.API_URL,
      data: {
        query: `
            query getUserRole($id: bigint!) {
              user(id: $id) {
                hasTeachingRole
                isAdmin
              }
            }`,
        variables: { id }
      },
    });
    return data.data.user as UserRoleFragment;
  } catch (error) {
    throw error
  }
}

async function createUser(itsc: string, name: string): Promise<any> {
  try {
    const { data } = await axios({
      method: 'post',
      headers: {
        'X-Hasura-Admin-Secret': process.env.HASURA_GRAPHQL_ADMIN_SECRET
      },
      url: process.env.API_URL,
      data: {
        query: `
          mutation createUserIfNotExist($itsc:String!, $name:String!) {
            createUser(
              object:{
                itsc: $itsc
                name: $name
              }
            ){ id }
          }`,
        variables: { itsc, name }
      },
    });
    console.log(`[!] Created new user for itsc id: ${itsc}`)
    console.log(data)
    const { data: { createUser }} = data;
    return createUser.id;
  } catch (error) {
    throw error;
  }
}

export async function getUserData(itsc: string, name: string): Promise<any> {
  try {
    const {data:{data}} = await axios({
      method: 'post',
      headers: {
        'X-Hasura-Admin-Secret': process.env.HASURA_GRAPHQL_ADMIN_SECRET
      },
      url: process.env.API_URL,
      data: {
        query: `
            query getUserData($itsc: String!) {
              users(where: {
                itsc: {
                  _eq: $itsc
                }
              }) {
                id
                hasTeachingRole
              }
              semesters(
                limit: 1
                order_by: {
                  createdAt: desc
                }
              ) {
                id
              }
            }`,
        variables: { itsc }
      },
    });
    console.log(data)
    let userId;
    let notification
    if(data.users.length===0) {
      userId = await createUser(itsc, name);
    } else {
      userId = data.users[0].id;
    }
    const [semester] = data.semesters;
    return {
      userId,
      semesterId: semester.id
    };
  } catch (error) {
    throw error;
  }
}

export async function updateNotification(id: number, notification: string): Promise<any> {
  console.log('inside')
  try {
    const response = await axios({
      method: 'post',
      headers: {
        'X-Hasura-Admin-Secret': process.env.HASURA_GRAPHQL_ADMIN_SECRET
      },
      url: process.env.API_URL,
      data: {
        query: `
          mutation updateUsers($notification: String!, $id: bigint!) {
            updateUser(_set: {notification: $notification}, pk_columns: {id: $id}) {
              notification
            }
          }`,
        variables: {notification, id}
      },
    });
    console.log(response)
  } catch (error) {
    throw error;
  }
}