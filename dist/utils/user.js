"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateNotification = exports.getUserData = exports.getUserRole = void 0;
const axios_1 = __importDefault(require("axios"));
async function getUserRole(id) {
    try {
        const { data } = await (0, axios_1.default)({
            method: 'post',
            headers: {
                'X-Hasura-Admin-Secret': process.env.HASURA_GRAPHQL_ADMIN_SECRET
            },
            url: `https://${process.env.API_URL}/v1/graphql`,
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
        return data.data.user;
    }
    catch (error) {
        throw error;
    }
}
exports.getUserRole = getUserRole;
async function createUser(itsc, name) {
    try {
        const { data } = await (0, axios_1.default)({
            method: 'post',
            headers: {
                'X-Hasura-Admin-Secret': process.env.HASURA_GRAPHQL_ADMIN_SECRET
            },
            url: `https://${process.env.API_URL}/v1/graphql`,
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
        console.log(`[!] Created new user for itsc id: ${itsc}`);
        console.log(data);
        const { data: { createUser } } = data;
        return createUser.id;
    }
    catch (error) {
        throw error;
    }
}
async function getUserData(itsc, name) {
    try {
        const { data: { data } } = await (0, axios_1.default)({
            method: 'post',
            headers: {
                'X-Hasura-Admin-Secret': process.env.HASURA_GRAPHQL_ADMIN_SECRET
            },
            url: `https://${process.env.API_URL}/v1/graphql`,
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
        console.log(data);
        let userId;
        let notification;
        if (data.users.length === 0) {
            userId = await createUser(itsc, name);
        }
        else {
            userId = data.users[0].id;
        }
        const [semester] = data.semesters;
        return {
            userId,
            semesterId: semester.id
        };
    }
    catch (error) {
        throw error;
    }
}
exports.getUserData = getUserData;
async function updateNotification(id, notification) {
    console.log('inside');
    try {
        const response = await (0, axios_1.default)({
            method: 'post',
            headers: {
                'X-Hasura-Admin-Secret': process.env.HASURA_GRAPHQL_ADMIN_SECRET
            },
            url: `https://${process.env.API_URL}/v1/graphql`,
            data: {
                query: `
          mutation updateUsers($notification: String!, $id: bigint!) {
            updateUser(_set: {notification: $notification}, pk_columns: {id: $id}) {
              notification
            }
          }`,
                variables: { notification, id }
            },
        });
        console.log(response);
    }
    catch (error) {
        throw error;
    }
}
exports.updateNotification = updateNotification;
