import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

export default async function (req:  NextApiRequest, res: NextApiResponse) { 
    console.log('inside API')
    const body = JSON.parse(req.body)
    console.log(req.body)
    const token = body.registrationToken
    const id = body.userId
    const currentSemester = body.currentSemester
    try {
        // Seach for old subscription
        const {data:{data}} = await axios({
            method: 'post',
            headers: {
            'X-Hasura-Admin-Secret': process.env.HASURA_GRAPHQL_ADMIN_SECRET
            },
            url: `https://${process.env.API_URL}/v1/graphql`,
            data: {
            query: 
            `query getUserData($id: bigint!, $semesterId: bigint!) {
                section_user(where: {
                    user_id: {_eq: $id},
                      section: {
                      course:{
                        semester_id:{_eq:$semesterId}
                      }
                    }
                }) {
                    assignment_config_ids
                }
            }`,
            variables: {id, semesterId:currentSemester}
            },
        });

        for(let j=0;j<data.section_user.length;j++){
            for(let i=0;i<data.section_user[j].assignment_config_ids.length;i++){
                const topic = "i" + id.toString() + "-" + data.section_user[j].assignment_config_ids[i].toString()
                await axios({
                    method: 'post',
                    url: `http://${process.env.WEBHOOK_ADDR}/trigger/notifications/subscribe/${topic}`,
                    data: {
                        registrationToken: token,
                        userId: id
                    }
                });
            }
        }
        
        
        // update the notification on DB
        const result = await axios({
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
            variables: {notification:token, id}
            },
        });
        console.log(result.data)
        res.json({status:"success"})
        
        console.log(data)
    } catch (error: any) {
        return res.status(500).json({
            status: 'error',
            error: error.message
        });
    }
}

export const config = {
  api: {
    externalResolver: true
  }
}