import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

export default async function (req:  NextApiRequest, res: NextApiResponse) { 
    const {id} = req.query
    try {
        const {data:{data}} = await axios({
            method: 'post',
            headers: {
            'X-Hasura-Admin-Secret': process.env.HASURA_GRAPHQL_ADMIN_SECRET
            },
            url: `https://${process.env.API_URL}/v1/graphql`,
            data: {
            query: `
            query getUserData($id: bigint!) {
                users(where: {
                    id: {
                    _eq: $id
                    }
                }) {
                    notification
            }
            }`,
            variables: {id}
            },
        });
        res.json({
            status:"success",
            notification: data.users[0].notification
        })
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